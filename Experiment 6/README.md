# Experiment 6 — Scalable Read APIs & Query Optimization

> **Course:** Full Stack Development - II (24CSP-337) · Chandigarh University  
> **Student:** Swayam Rawat · CSE (AIML), 5th Semester  
> **GitHub:** [github.com/Swayam26-rwt](https://github.com/Swayam26-rwt)

---

## 📖 Overview

Experiment 6 focuses on building **high-performance, scalable read APIs** for database-driven applications. When database volume and concurrent requests grow, naive querying approaches lead to severe bottlenecks such as full table scans, high response times, and the notorious **N+1 query problem**.

This experiment implements and demonstrates key optimization strategies in Node.js & Express with SQLite (`better-sqlite3`):
1. **Pagination & Dynamic Sorting:** Fetching slice-based data using `LIMIT` and `OFFSET` with SQL index acceleration.
2. **In-Memory Caching:** Drastically reducing database load using `node-cache` with configurable Time-To-Live (TTL).
3. **N+1 Query Elimination:** Replacing multiple relational queries with a single, optimized SQL `LEFT JOIN`.
4. **Native SQL Queries:** Leveraging raw SQL queries for high-speed aggregated retrieval.
5. **JMeter Load Testing:** Benchmarking throughput, response latency, and error rates under concurrent load.

---

## 🎯 Objectives

- Implement limit/offset pagination and parameterized multi-field sorting.
- Apply database indexing (`idx_posts_likes`, `idx_comments_post`) to speed up query execution.
- Prevent relational N+1 query bottlenecks using SQL joins.
- Integrate in-memory caching with eviction mechanisms.
- Measure performance gains and execute stress/load tests using Apache JMeter.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Framework:** Node.js & Express.js
- **Database:** SQLite with `better-sqlite3` (synchronous, blazing-fast C++ bindings)
- **Caching Layer:** `node-cache` (in-memory key-value store with TTL)
- **Benchmarking Tool:** Apache JMeter (`.jmx` test plan)

---

## 📂 Project Structure

```text
Experiment 6/
├── data/
│   ├── .gitkeep
│   └── experiment6.db        # SQLite database file (auto-seeded on startup)
├── jmeter/
│   └── experiment-6.jmx      # Apache JMeter load testing test plan
├── public/
│   └── index.html            # API overview & reference documentation
├── src/
│   └── server.js             # Express API server with SQLite & caching logic
├── package.json
└── README.md
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
# Production mode
npm start

# Development mode (with nodemon hot-reload)
npm run dev
```

The server will start listening at:
```text
http://localhost:3000
```

---

## 📡 API Endpoints & Verification

### 1. Pagination & Sorting API
Fetches paginated results sorted by a specific column in ascending or descending order.

- **Endpoint:** `GET /api/posts`
- **Query Params:**
  - `page`: Page index (zero-based, default `0`)
  - `size`: Items per page (default `5`, max `5`)
  - `sort`: Field to sort by (`id`, `title`, `likes`)
  - `order`: Sort direction (`asc`, `desc`)

```bash
curl "http://localhost:3000/api/posts?page=0&size=5&sort=likes&order=desc"
```

**Response Example:**
```json
{
  "page": 0,
  "size": 5,
  "total": 5,
  "posts": [
    { "id": 1, "title": "Node.js Basics", "author": "Swayam", "likes": 50, "content": "Introduction to Node.js" },
    { "id": 2, "title": "REST API", "author": "Rahul", "likes": 40, "content": "Building REST APIs with Express" },
    { "id": 3, "title": "Database", "author": "Ankit", "likes": 30, "content": "Working with SQLite" },
    { "id": 4, "title": "Caching", "author": "Priya", "likes": 20, "content": "Improving API performance with caching" },
    { "id": 5, "title": "JMeter", "author": "Neha", "likes": 10, "content": "Testing API performance" }
  ]
}
```

---

### 2. In-Memory Cached API
Caches the top posts query in memory for 300 seconds to serve sub-millisecond responses.

- **Endpoint:** `GET /api/posts/cached`

Run twice to test cache hit:
```bash
# Request 1 (Cache Miss — fetches from SQLite):
curl "http://localhost:3000/api/posts/cached"
# Response: { "source": "database", "posts": [...] }

# Request 2 (Cache Hit — served directly from memory):
curl "http://localhost:3000/api/posts/cached"
# Response: { "source": "cache", "posts": [...] }
```

---

### 3. Optimized JOIN (Eliminating N+1 Queries)
Fetches posts together with their comments in a single database round-trip via a `LEFT JOIN`, rather than issuing 1 query for posts + N queries for comments.

- **Endpoint:** `GET /api/posts/with-comments`

```bash
curl "http://localhost:3000/api/posts/with-comments"
```

---

### 4. Native SQL Query
Runs an optimized query using direct SQL filtering and sorting.

- **Endpoint:** `GET /api/posts/top`

```bash
curl "http://localhost:3000/api/posts/top"
```

---

### 5. Cache Eviction / Invalidation
Clears the in-memory cache so subsequent reads refresh from the database.

- **Endpoint:** `DELETE /api/cache`

```bash
curl -X DELETE "http://localhost:3000/api/cache"
```

---

## 📊 Apache JMeter Benchmarking

A pre-configured JMeter test plan is provided at:
```text
jmeter/experiment-6.jmx
```

### Test Plan Specifications
- **Number of Threads (Concurrent Users):** `5`
- **Ramp-Up Period:** `2` seconds
- **Loop Count:** `5` iterations
- **Endpoints Tested:**
  - `Pagination API` (`/api/posts?page=0&size=5&sort=likes&order=desc`)
  - `Cached API` (`/api/posts/cached`)

### Metrics Measured
- **Response Time / Latency (ms):** Cached queries yield significantly reduced latency compared to unindexed database scans.
- **Throughput (Requests/sec):** Maximum handled requests without dropping connections.
- **Error Rate (%):** Verifying 0% error rate under concurrent multi-user load.

---

## 📌 Summary of Optimizations

| Optimization | Technique | Benefit |
|---|---|---|
| **Pagination** | `LIMIT ? OFFSET ?` | Prevents loading massive datasets into server memory |
| **Indexing** | `CREATE INDEX idx_posts_likes` | Transforms $O(N)$ table scans into $O(\log N)$ B-tree lookups |
| **JOIN Optimization** | Single `LEFT JOIN` query | Eliminates network and database roundtrip overhead (N+1 problem) |
| **Caching** | `node-cache` (TTL: 300s) | Eliminates DB query completely for repeated read requests |
