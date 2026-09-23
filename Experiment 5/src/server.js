const express = require("express");
const cors = require("cors");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Correlation-ID"]
}));

// Correlation ID middleware
app.use((req, res, next) => {
  const correlationId = req.headers["x-correlation-id"] || randomUUID();
  req.correlationId = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);
  next();
});

// Logging middleware / filter equivalent
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    console.log(
      `[${req.correlationId}] ${req.method} ${req.originalUrl}` +
      ` | Status: ${res.statusCode} | Took: ${Date.now() - start} ms`
    );
  });

  next();
});

// Serve frontend static files for local execution
app.use(express.static(path.join(__dirname, "..", "public")));

const posts = new Map();
let nextId = 1;

// Seed initial sample posts so users see content immediately upon deployment
const initialPosts = [
  "Welcome to Experiment 5! REST API design with Express.js.",
  "Features: CRUD operations, input validation, correlation IDs, and scheduled tasks."
];
for (const content of initialPosts) {
  const now = new Date().toISOString();
  posts.set(nextId, {
    id: nextId++,
    content,
    createdAt: now,
    updatedAt: now
  });
}

function success(res, code, message, data = null) {
  return res.status(code).json({
    status: "success",
    message,
    data
  });
}

function failure(res, code, message, data = null) {
  return res.status(code).json({
    status: "error",
    message,
    data
  });
}

function validatePost(req, res, next) {
  const { content } = req.body || {};
  const errors = {};

  if (typeof content !== "string" || content.trim() === "") {
    errors.content = "Content must not be empty";
  } else if (content.length > 280) {
    errors.content = "Content exceeds 280 characters";
  }

  if (Object.keys(errors).length) {
    return failure(res, 400, "Validation failed", errors);
  }

  next();
}

const router = express.Router();

// CREATE
router.post("/posts", validatePost, (req, res) => {
  const now = new Date().toISOString();

  const post = {
    id: nextId++,
    content: req.body.content.trim(),
    createdAt: now,
    updatedAt: now
  };

  posts.set(post.id, post);
  return success(res, 201, "Post created", post);
});

// READ ALL
router.get("/posts", (req, res) => {
  return success(res, 200, "Posts retrieved", [...posts.values()]);
});

// READ ONE
router.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.get(id);

  if (!post) {
    return failure(res, 404, `Post not found with id: ${id}`);
  }

  return success(res, 200, "Post retrieved", post);
});

// UPDATE
router.put("/posts/:id", validatePost, (req, res) => {
  const id = Number(req.params.id);
  const post = posts.get(id);

  if (!post) {
    return failure(res, 404, `Post not found with id: ${id}`);
  }

  post.content = req.body.content.trim();
  post.updatedAt = new Date().toISOString();
  posts.set(id, post);

  return success(res, 200, "Post updated", post);
});

// DELETE
router.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!posts.has(id)) {
    return failure(res, 404, `Post not found with id: ${id}`);
  }

  posts.delete(id);
  return success(res, 200, "Post deleted", null);
});

// SCHEDULING ENDPOINT
router.post("/schedule", (req, res) => {
  const { task, delaySeconds } = req.body || {};
  const errors = {};

  if (typeof task !== "string" || task.trim() === "") {
    errors.task = "Task must not be empty";
  } else if (task.length > 280) {
    errors.task = "Task exceeds 280 characters";
  }

  if (!Number.isInteger(delaySeconds) || delaySeconds < 1) {
    errors.delaySeconds = "Delay must be at least 1 second";
  }

  if (Object.keys(errors).length) {
    return failure(res, 400, "Validation failed", errors);
  }

  const scheduleId = randomUUID();
  const scheduledFor = new Date(
    Date.now() + delaySeconds * 1000
  ).toISOString();

  setTimeout(() => {
    console.log(
      `[${req.correlationId}] [SCHEDULED TASK ${scheduleId}] ${task}`
    );
  }, delaySeconds * 1000);

  return success(res, 202, "Task scheduled", {
    scheduleId,
    task: task.trim(),
    scheduledFor
  });
});

// API health endpoint
router.get("/health", (req, res) => {
  return success(res, 200, "API is running", {
    server: "Node.js + Express",
    port: PORT
  });
});

// Support both /api prefixed routes and direct routes
app.use("/api", router);
app.use(router);

// API 404
app.use("/api", (req, res) => {
  return failure(res, 404, "Endpoint not found");
});

// Global exception handler
app.use((err, req, res, next) => {
  console.error(`[${req.correlationId || "unknown"}]`, err);
  return failure(res, 500, "Internal Server Error");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Experiment 5 running at http://localhost:${PORT}`);
  });
}

module.exports = app;
