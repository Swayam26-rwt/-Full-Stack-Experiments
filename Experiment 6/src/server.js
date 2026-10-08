const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const NodeCache = require("node-cache");

const app = express();
const PORT = 3000;
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());
app.use(express.json());

const db = new Database("./data/experiment6.db");

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

  const posts = [
    ["Node.js Basics", "Swayam", 50, "Introduction to Node.js"],
    ["REST API", "Rahul", 40, "Building REST APIs with Express"],
    ["Database", "Ankit", 30, "Working with SQLite"],
    ["Caching", "Priya", 20, "Improving API performance with caching"],
    ["JMeter", "Neha", 10, "Testing API performance"]
  ];

  for (const post of posts) {
    addPost.run(...post);
  }

  const addComment = db.prepare(
    "INSERT INTO comments (post_id, text) VALUES (?, ?)"
  );

  addComment.run(1, "Very useful");
  addComment.run(1, "Good explanation");
  addComment.run(2, "Easy to understand");
  addComment.run(3, "Helpful example");
  addComment.run(4, "Caching improves speed");
  addComment.run(5, "Good for testing");
}

app.get("/", (req, res) => {
  res.json({
    message: "Experiment 6 API is running",
    databaseEntries: 5
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

  const total = db.prepare("SELECT COUNT(*) AS count FROM posts").get().count;

  const posts = db.prepare(`
    SELECT id, title, author, likes, content
    FROM posts
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `).all(size, offset);

  res.json({
    page,
    size,
    total,
    posts
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

  const posts = db.prepare(
    "SELECT id, title, author, likes FROM posts ORDER BY likes DESC"
  ).all();

  cache.set(key, posts);

  res.json({
    source: "database",
    posts
  });
});

/* 3. OPTIMIZED JOIN - avoids N+1 queries */
app.get("/api/posts/with-comments", (req, res) => {
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

  res.json(rows);
});

/* 4. NATIVE SQL */
app.get("/api/posts/top", (req, res) => {
  const posts = db.prepare(`
    SELECT id, title, author, likes
    FROM posts
    ORDER BY likes DESC
    LIMIT 3
  `).all();

  res.json(posts);
});

/* 5. CLEAR CACHE */
app.delete("/api/cache", (req, res) => {
  cache.flushAll();
  res.json({ message: "Cache cleared" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});