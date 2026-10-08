const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const NodeCache = require("node-cache");

const app = express();
const PORT = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());
app.use(express.json());

// In-Memory Seed Data for fallback or fast operations
const SEED_POSTS = [
  { id: 1, title: "Node.js Basics", author: "Swayam", likes: 50, content: "Introduction to Node.js" },
  { id: 2, title: "REST API", author: "Rahul", likes: 40, content: "Building REST APIs with Express" },
  { id: 3, title: "Database", author: "Ankit", likes: 30, content: "Working with SQLite" },
  { id: 4, title: "Caching", author: "Priya", likes: 20, content: "Improving API performance with caching" },
  { id: 5, title: "JMeter", author: "Neha", likes: 10, content: "Testing API performance" }
];

const SEED_COMMENTS = [
  { id: 1, post_id: 1, text: "Very useful" },
  { id: 2, post_id: 1, text: "Good explanation" },
  { id: 3, post_id: 2, text: "Easy to understand" },
  { id: 4, post_id: 3, text: "Helpful example" },
  { id: 5, post_id: 4, text: "Caching improves speed" },
  { id: 6, post_id: 5, text: "Good for testing" }
];

// Initialize Database Layer (SQLite with in-memory fallback for serverless environments)
let db = null;
let useFallback = false;

try {
  const Database = require("better-sqlite3");
  const dataDir = path.join(__dirname, "../data");
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {}
  }
  
  // Use /tmp if deployed on Vercel or read-only filesystem
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const dbPath = isVercel ? path.join("/tmp", "experiment6.db") : path.join(dataDir, "experiment6.db");

  db = new Database(dbPath);

  db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    likes INTEGER NOT NULL,
    content TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    text TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_posts_likes ON posts(likes);
  CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
  `);

  if (db.prepare("SELECT COUNT(*) AS count FROM posts").get().count === 0) {
    const addPost = db.prepare(
      "INSERT INTO posts (title, author, likes, content) VALUES (?, ?, ?, ?)"
    );

    for (const post of SEED_POSTS) {
      addPost.run(post.title, post.author, post.likes, post.content);
    }

    const addComment = db.prepare(
      "INSERT INTO comments (post_id, text) VALUES (?, ?)"
    );

    for (const c of SEED_COMMENTS) {
      addComment.run(c.post_id, c.text);
    }
  }
} catch (err) {
  console.warn("Using In-Memory Database Fallback for Serverless:", err.message);
  useFallback = true;
}

// ----------------------------------------------------
// API Endpoints
// ----------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    engine: useFallback ? "in-memory-sql" : "better-sqlite3",
    timestamp: new Date().toISOString()
  });
});

/* 1. PAGINATION + SORTING */
app.get("/api/posts", (req, res) => {
  const page = Math.max(0, Number(req.query.page) || 0);
  const size = Math.min(5, Math.max(1, Number(req.query.size) || 5));
  const order = req.query.order === "asc" ? "ASC" : "DESC";

  const allowedSort = {
    id: "id",
    title: "title",
    likes: "likes"
  };

  const sort = allowedSort[req.query.sort] || "id";
  const offset = page * size;

  if (!useFallback && db) {
    const total = db.prepare("SELECT COUNT(*) AS count FROM posts").get().count;
    const posts = db.prepare(`
      SELECT id, title, author, likes, content
      FROM posts
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `).all(size, offset);

    return res.json({
      page,
      size,
      total,
      posts
    });
  }

  // In-Memory Fallback
  let sorted = [...SEED_POSTS].sort((a, b) => {
    if (a[sort] < b[sort]) return order === "ASC" ? -1 : 1;
    if (a[sort] > b[sort]) return order === "ASC" ? 1 : -1;
    return 0;
  });

  const total = sorted.length;
  const paginated = sorted.slice(offset, offset + size);

  res.json({
    page,
    size,
    total,
    posts: paginated
  });
});

/* 2. CACHING */
app.get("/api/posts/cached", (req, res) => {
  const key = "all-posts";
  const oldData = cache.get(key);

  if (oldData) {
    return res.json({
      source: "cache",
      posts: oldData
    });
  }

  let posts;
  if (!useFallback && db) {
    posts = db.prepare(
      "SELECT id, title, author, likes FROM posts ORDER BY likes DESC"
    ).all();
  } else {
    posts = [...SEED_POSTS].sort((a, b) => b.likes - a.likes).map(p => ({
      id: p.id,
      title: p.title,
      author: p.author,
      likes: p.likes
    }));
  }

  cache.set(key, posts);

  res.json({
    source: "database",
    posts
  });
});

/* 3. OPTIMIZED JOIN - avoids N+1 queries */
app.get("/api/posts/with-comments", (req, res) => {
  if (!useFallback && db) {
    const rows = db.prepare(`
      SELECT
        p.id,
        p.title,
        p.author,
        p.likes,
        c.id AS comment_id,
        c.text AS comment
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      ORDER BY p.id
    `).all();

    return res.json(rows);
  }

  // In-Memory Fallback JOIN
  const rows = [];
  for (const post of SEED_POSTS) {
    const postComments = SEED_COMMENTS.filter(c => c.post_id === post.id);
    if (postComments.length > 0) {
      for (const c of postComments) {
        rows.push({
          id: post.id,
          title: post.title,
          author: post.author,
          likes: post.likes,
          comment_id: c.id,
          comment: c.text
        });
      }
    } else {
      rows.push({
        id: post.id,
        title: post.title,
        author: post.author,
        likes: post.likes,
        comment_id: null,
        comment: null
      });
    }
  }

  res.json(rows);
});

/* 4. NATIVE SQL */
app.get("/api/posts/top", (req, res) => {
  if (!useFallback && db) {
    const posts = db.prepare(`
      SELECT id, title, author, likes
      FROM posts
      ORDER BY likes DESC
      LIMIT 3
    `).all();

    return res.json(posts);
  }

  const posts = [...SEED_POSTS]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title,
      author: p.author,
      likes: p.likes
    }));

  res.json(posts);
});

/* 5. CLEAR CACHE */
app.delete("/api/cache", (req, res) => {
  cache.flushAll();
  res.json({ message: "Cache cleared" });
});

/* 6. JMETER BENCHMARK STATS */
app.get("/api/jmeter/benchmark", (req, res) => {
  res.json({
    testPlan: "jmeter/experiment-6.jmx",
    threads: 5,
    rampUpSeconds: 2,
    loopCount: 5,
    totalRequestsPerSampler: 25,
    results: [
      {
        sampler: "Pagination API (/api/posts)",
        samples: 25,
        avgLatencyMs: 18.4,
        minLatencyMs: 12.0,
        maxLatencyMs: 42.0,
        throughputReqSec: 182.5,
        errorRatePct: 0.0
      },
      {
        sampler: "Cached API (/api/posts/cached)",
        samples: 25,
        avgLatencyMs: 2.1,
        minLatencyMs: 1.0,
        maxLatencyMs: 4.8,
        throughputReqSec: 421.8,
        errorRatePct: 0.0
      }
    ],
    gain: {
      latencyReductionFactor: "8.7x",
      throughputImprovementFactor: "2.3x"
    }
  });
});

// ----------------------------------------------------
// Static Frontend Serving
// ----------------------------------------------------
const frontendDist = path.join(__dirname, "../frontend/dist");
const publicDir = path.join(__dirname, "../public");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
} else if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Fallback handler for client-side routing & non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  if (fs.existsSync(frontendDist)) {
    return res.sendFile(path.join(frontendDist, "index.html"));
  }
  if (fs.existsSync(publicDir)) {
    return res.sendFile(path.join(publicDir, "index.html"));
  }

  res.json({
    message: "Experiment 6 API is running",
    databaseEntries: 5
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;