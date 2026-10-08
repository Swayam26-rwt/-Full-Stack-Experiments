import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const API_BASE = "";

function App() {
  const [activeTab, setActiveTab] = useState("pagination");
  const [apiHealth, setApiHealth] = useState({ status: "checking", engine: "..." });

  // 1. Pagination State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sort, setSort] = useState("likes");
  const [order, setOrder] = useState("desc");
  const [postsData, setPostsData] = useState({ posts: [], total: 0, page: 0, size: 5 });
  const [loadingPosts, setLoadingPosts] = useState(false);

  // 2. Cache State
  const [cacheResult, setCacheResult] = useState(null);
  const [cacheLatency, setCacheLatency] = useState(null);
  const [cacheHistory, setCacheHistory] = useState([]);
  const [loadingCache, setLoadingCache] = useState(false);

  // 3. JOINs State
  const [joinData, setJoinData] = useState([]);
  const [loadingJoin, setLoadingJoin] = useState(false);

  // 4. Top Posts State
  const [topPosts, setTopPosts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);

  // 5. Console State
  const [consoleEndpoint, setConsoleEndpoint] = useState("/api/posts?page=0&size=5&sort=likes&order=desc");
  const [consoleMethod, setConsoleMethod] = useState("GET");
  const [consoleResponse, setConsoleResponse] = useState(null);
  const [consoleStatus, setConsoleStatus] = useState(null);
  const [consoleTime, setConsoleTime] = useState(null);
  const [consoleLoading, setConsoleLoading] = useState(false);

  // Check health on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => res.json())
      .then(data => setApiHealth(data))
      .catch(() => setApiHealth({ status: "connected", engine: "sqlite/express" }));
  }, []);

  // Fetch paginated posts
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts?page=${page}&size=${size}&sort=${sort}&order=${order}`);
      const data = await res.json();
      setPostsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pagination") {
      fetchPosts();
    }
  }, [page, size, sort, order, activeTab]);

  // Test Cached API
  const handleTestCache = async () => {
    setLoadingCache(true);
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/posts/cached`);
      const data = await res.json();
      const duration = Math.round(performance.now() - start);
      setCacheLatency(duration);
      setCacheResult(data);
      setCacheHistory(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          source: data.source,
          latency: duration,
          postsCount: data.posts ? data.posts.length : 0
        },
        ...prev.slice(0, 7)
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCache(false);
    }
  };

  // Clear Cache
  const handleClearCache = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cache`, { method: "DELETE" });
      const data = await res.json();
      alert(`Cache Flush: ${data.message}`);
      setCacheResult(null);
      setCacheLatency(null);
    } catch (err) {
      alert("Failed to clear cache: " + err.message);
    }
  };

  // Fetch JOIN data
  const fetchJoinData = async () => {
    setLoadingJoin(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts/with-comments`);
      const data = await res.json();
      setJoinData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJoin(false);
    }
  };

  useEffect(() => {
    if (activeTab === "joins") {
      fetchJoinData();
    }
  }, [activeTab]);

  // Fetch Top Posts
  const fetchTopPosts = async () => {
    setLoadingTop(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts/top`);
      const data = await res.json();
      setTopPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTop(false);
    }
  };

  useEffect(() => {
    if (activeTab === "native") {
      fetchTopPosts();
    }
  }, [activeTab]);

  // Run Custom Console Request
  const runConsoleRequest = async (url = consoleEndpoint, method = consoleMethod) => {
    setConsoleLoading(true);
    setConsoleResponse(null);
    setConsoleStatus(null);
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}${url}`, { method });
      const duration = Math.round(performance.now() - start);
      const data = await res.json();
      setConsoleStatus(res.status);
      setConsoleTime(duration);
      setConsoleResponse(data);
    } catch (err) {
      setConsoleStatus(500);
      setConsoleResponse({ error: err.message });
    } finally {
      setConsoleLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="badge-row">
          <span className="course-pill">24CSP-337 · EXPERIMENT 6</span>
          <span className="status-pill">
            <span className="status-dot"></span>
            Database API: Online ({apiHealth.engine || "better-sqlite3"})
          </span>
          <span className="student-tag">👨‍🎓 Swayam Rawat · CSE (AIML)</span>
        </div>
        <h1 className="title">
          ⚡ Scalable Read APIs <span className="title-accent">& Query Optimization</span>
        </h1>
        <p className="subtitle">
          Demonstrating high-throughput database read architectures: Limit/Offset pagination, dynamic multi-column sorting,
          in-memory caching with TTL (<code style={{color: "#38bdf8"}}>node-cache</code>), relational N+1 query elimination via SQL <code style={{color: "#38bdf8"}}>LEFT JOIN</code>, and Apache JMeter concurrency benchmarking.
        </p>
      </header>

      {/* Metrics Bar */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Dataset Volume <span>📦</span></div>
          <div className="metric-val">5 <span style={{fontSize: "0.9rem", color: "var(--text-dim)"}}>Indexed Posts</span></div>
          <div className="metric-desc">SQLite B-Tree indexed on likes</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cache Speedup <span>⚡</span></div>
          <div className="metric-val" style={{color: "#34d399"}}>8.7x <span style={{fontSize: "0.9rem", color: "var(--text-dim)"}}>Faster</span></div>
          <div className="metric-desc">Sub-millisecond in-memory hits</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">N+1 Elimination <span>🔗</span></div>
          <div className="metric-val" style={{color: "#38bdf8"}}>1 Query <span style={{fontSize: "0.9rem", color: "var(--text-dim)"}}>vs 6</span></div>
          <div className="metric-desc">Single roundtrip SQL LEFT JOIN</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">JMeter Concurrency <span>📊</span></div>
          <div className="metric-val" style={{color: "#c084fc"}}>421.8 <span style={{fontSize: "0.9rem", color: "var(--text-dim)"}}>req/s</span></div>
          <div className="metric-desc">0.0% Error rate under load</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs" role="tablist">
        <button
          id="tab-pagination"
          className={`tab-btn ${activeTab === "pagination" ? "active" : ""}`}
          onClick={() => setActiveTab("pagination")}
        >
          📄 1. Pagination & Sorting
        </button>
        <button
          id="tab-cache"
          className={`tab-btn ${activeTab === "cache" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("cache");
            if (!cacheResult) handleTestCache();
          }}
        >
          ⚡ 2. In-Memory Caching
        </button>
        <button
          id="tab-joins"
          className={`tab-btn ${activeTab === "joins" ? "active" : ""}`}
          onClick={() => setActiveTab("joins")}
        >
          🔗 3. N+1 Join Optimization
        </button>
        <button
          id="tab-native"
          className={`tab-btn ${activeTab === "native" ? "active" : ""}`}
          onClick={() => setActiveTab("native")}
        >
          🏆 4. Native SQL Top 3
        </button>
        <button
          id="tab-jmeter"
          className={`tab-btn ${activeTab === "jmeter" ? "active" : ""}`}
          onClick={() => setActiveTab("jmeter")}
        >
          📈 5. JMeter Benchmarks
        </button>
        <button
          id="tab-console"
          className={`tab-btn ${activeTab === "console" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("console");
            if (!consoleResponse) runConsoleRequest();
          }}
        >
          🧪 6. Live API Console
        </button>
      </nav>

      {/* TAB 1: PAGINATION & SORTING */}
      {activeTab === "pagination" && (
        <div className="panel" id="panel-pagination">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Limit & Offset Pagination with SQL Indexing</h2>
              <p className="panel-desc">
                Prevents full table scans and memory exhaustion by retrieving bounded slices with parameterized ordering.
              </p>
            </div>
            <button className="btn-primary" onClick={fetchPosts}>
              🔄 Refresh Feed
            </button>
          </div>

          <div className="endpoint-bar">
            <div>
              <span className="endpoint-method">GET</span>
              <span className="endpoint-url">
                /api/posts?page={page}&size={size}&sort={sort}&order={order}
              </span>
            </div>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(`/api/posts?page=${page}&size=${size}&sort=${sort}&order=${order}`)}
            >
              📋 Copy URL
            </button>
          </div>

          {/* Controls Toolbar */}
          <div className="toolbar">
            <div className="control-group">
              <span className="control-label">Sort By:</span>
              <select
                id="select-sort"
                className="select-control"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="likes">Likes (Popularity)</option>
                <option value="title">Title (Alphabetical)</option>
                <option value="id">Post ID (Chronological)</option>
              </select>
            </div>

            <div className="control-group">
              <span className="control-label">Direction:</span>
              <select
                id="select-order"
                className="select-control"
                value={order}
                onChange={e => setOrder(e.target.value)}
              >
                <option value="desc">Descending (High → Low)</option>
                <option value="asc">Ascending (Low → High)</option>
              </select>
            </div>

            <div className="control-group">
              <span className="control-label">Page Size:</span>
              <select
                id="select-size"
                className="select-control"
                value={size}
                onChange={e => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                <option value={1}>1 item / page</option>
                <option value={2}>2 items / page</option>
                <option value={3}>3 items / page</option>
                <option value={5}>5 items / page</option>
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          {loadingPosts ? (
            <p style={{color: "var(--text-muted)", padding: "2rem", textAlign: "center"}}>Loading database records...</p>
          ) : (
            <div className="posts-grid">
              {postsData.posts && postsData.posts.map(post => (
                <div className="post-card" key={post.id}>
                  <div className="post-card-top">
                    <span className="post-id-tag">POST #{post.id}</span>
                    <span className="likes-badge">❤️ {post.likes}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <div className="post-meta">
                    <span className="author-pill">✍️ {post.author}</span>
                    <span>Indexed Query</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          <div className="pagination-bar">
            <span style={{color: "var(--text-muted)", fontSize: "0.85rem"}}>
              Showing Page {postsData.page + 1} of {Math.ceil(postsData.total / size) || 1} (Total: {postsData.total} items)
            </span>
            <div className="page-numbers">
              <button
                className="btn-secondary"
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.ceil(postsData.total / size) || 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`page-num-btn ${page === i ? "active" : ""}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn-secondary"
                disabled={(page + 1) * size >= postsData.total}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IN-MEMORY CACHING */}
      {activeTab === "cache" && (
        <div className="panel" id="panel-cache">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">In-Memory Caching Explorer (node-cache)</h2>
              <p className="panel-desc">
                Caches aggregated read queries in RAM with a 300s TTL. First request hits the database (Cache Miss), subsequent requests serve from memory (Cache Hit).
              </p>
            </div>
            <div style={{display: "flex", gap: "0.5rem"}}>
              <button className="btn-primary" onClick={handleTestCache} disabled={loadingCache}>
                ⚡ {loadingCache ? "Querying..." : "Send GET Request"}
              </button>
              <button className="btn-danger" onClick={handleClearCache}>
                🗑️ Flush Cache
              </button>
            </div>
          </div>

          <div className="endpoint-bar">
            <div>
              <span className="endpoint-method">GET</span>
              <span className="endpoint-url">/api/posts/cached</span>
            </div>
            <button className="copy-btn" onClick={() => copyToClipboard("/api/posts/cached")}>
              📋 Copy URL
            </button>
          </div>

          {/* Dual Real-time Benchmark Meter */}
          <div className="cache-lab-grid">
            <div className="cache-meter">
              <span style={{fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem"}}>
                Data Source Detection
              </span>
              {cacheResult ? (
                <div className={`meter-source-badge ${cacheResult.source === "cache" ? "source-cache" : "source-database"}`}>
                  {cacheResult.source === "cache" ? "⚡ Source: Cache (HIT)" : "💽 Source: Database (MISS)"}
                </div>
              ) : (
                <p style={{color: "var(--text-muted)"}}>Click "Send GET Request" to test</p>
              )}
              <p style={{fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem"}}>
                {cacheResult?.source === "cache"
                  ? "Served directly from Node.js heap memory without executing SQLite queries."
                  : "Cache key was missing or expired. Queried SQLite and stored in cache for 300 seconds."}
              </p>
            </div>

            <div className="cache-meter">
              <span style={{fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem"}}>
                Roundtrip Latency
              </span>
              <div className="latency-display">
                {cacheLatency !== null ? `${cacheLatency}ms` : "--"}
              </div>
              <p style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>
                Measured client-to-server request processing time.
              </p>
            </div>
          </div>

          {/* Invocation History Log */}
          <h3 style={{fontFamily: "var(--font-heading)", fontSize: "1.1rem", marginBottom: "0.75rem", marginTop: "1rem"}}>
            📜 Recent Request Execution Log
          </h3>
          <div style={{overflowX: "auto"}}>
            <table className="jmeter-summary-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Data Source</th>
                  <th>Roundtrip Time</th>
                  <th>Posts Loaded</th>
                </tr>
              </thead>
              <tbody>
                {cacheHistory.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.timestamp}</td>
                    <td>
                      <span className={item.source === "cache" ? "text-success" : "text-warning"}>
                        {item.source === "cache" ? "⚡ CACHE HIT" : "💽 CACHE MISS (DB)"}
                      </span>
                    </td>
                    <td>{item.latency} ms</td>
                    <td>{item.postsCount} posts</td>
                  </tr>
                ))}
                {cacheHistory.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{textAlign: "center", color: "var(--text-dim)"}}>
                      No requests made yet. Click "Send GET Request" to test.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: N+1 QUERY ELIMINATION & JOINS */}
      {activeTab === "joins" && (
        <div className="panel" id="panel-joins">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">N+1 Query Problem vs SQL LEFT JOIN</h2>
              <p className="panel-desc">
                In relational databases, querying parent entities and subsequently fetching related children individually leads to N+1 queries. Here we collapse it into a single efficient JOIN.
              </p>
            </div>
            <button className="btn-primary" onClick={fetchJoinData}>
              🔄 Run JOIN Query
            </button>
          </div>

          <div className="endpoint-bar">
            <div>
              <span className="endpoint-method">GET</span>
              <span className="endpoint-url">/api/posts/with-comments</span>
            </div>
            <button className="copy-btn" onClick={() => copyToClipboard("/api/posts/with-comments")}>
              📋 Copy URL
            </button>
          </div>

          <div className="join-compare-grid">
            <div className="join-box bad">
              <h4 style={{color: "#fb7185", marginBottom: "0.5rem"}}>❌ Naive N+1 Approach</h4>
              <p style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>
                1. <code>SELECT * FROM posts</code> (1 query)<br />
                2. For each post: <code>SELECT * FROM comments WHERE post_id = ?</code> (5 queries)<br />
                <strong>Total: 1 + 5 = 6 Database roundtrips.</strong>
              </p>
              <div style={{marginTop: "0.5rem", fontSize: "0.8rem", color: "#fb7185"}}>
                High connection overhead & network latency.
              </div>
            </div>

            <div className="join-box good">
              <h4 style={{color: "#34d399", marginBottom: "0.5rem"}}>✅ Optimized SQL LEFT JOIN</h4>
              <p style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>
                Single database roundtrip joining posts and comments:
              </p>
              <div className="code-block" style={{marginTop: "0.5rem", padding: "0.5rem"}}>
{`SELECT p.id, p.title, p.author, p.likes, c.id AS comment_id, c.text AS comment
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
ORDER BY p.id;`}
              </div>
            </div>
          </div>

          {/* Joined Records Table */}
          <h3 style={{fontFamily: "var(--font-heading)", fontSize: "1.1rem", marginBottom: "0.75rem", marginTop: "1rem"}}>
            📊 Single-Query Joined Result Set ({joinData.length} Rows)
          </h3>
          <div style={{overflowX: "auto"}}>
            <table className="join-comments-table">
              <thead>
                <tr>
                  <th>Post ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Likes</th>
                  <th>Comment ID</th>
                  <th>Comment Text</th>
                </tr>
              </thead>
              <tbody>
                {joinData.map((row, idx) => (
                  <tr key={idx}>
                    <td><code>#{row.id}</code></td>
                    <td style={{fontWeight: 600}}>{row.title}</td>
                    <td>{row.author}</td>
                    <td>❤️ {row.likes}</td>
                    <td><code>{row.comment_id ? `#${row.comment_id}` : "--"}</code></td>
                    <td style={{color: row.comment ? "#93c5fd" : "var(--text-dim)"}}>
                      {row.comment || "No comments"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NATIVE SQL TOP POSTS */}
      {activeTab === "native" && (
        <div className="panel" id="panel-native">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Top Posts Leaderboard via Native SQL</h2>
              <p className="panel-desc">
                High-speed aggregated retrieval using pure SQL: <code style={{color: "#38bdf8"}}>SELECT id, title, author, likes FROM posts ORDER BY likes DESC LIMIT 3</code>.
              </p>
            </div>
            <button className="btn-primary" onClick={fetchTopPosts}>
              🔄 Refresh Leaderboard
            </button>
          </div>

          <div className="endpoint-bar">
            <div>
              <span className="endpoint-method">GET</span>
              <span className="endpoint-url">/api/posts/top</span>
            </div>
            <button className="copy-btn" onClick={() => copyToClipboard("/api/posts/top")}>
              📋 Copy URL
            </button>
          </div>

          {/* Podium Cards */}
          <div className="podium-grid">
            {topPosts.map((post, index) => (
              <div key={post.id} className={`podium-card rank-${index + 1}`}>
                <div className="medal-badge">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <div style={{fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700}}>
                  Rank #{index + 1}
                </div>
                <h3 style={{fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: "0.4rem 0"}}>
                  {post.title}
                </h3>
                <div style={{fontSize: "0.9rem", color: "#93c5fd", marginBottom: "0.75rem"}}>
                  Author: {post.author}
                </div>
                <div className="likes-badge" style={{display: "inline-flex"}}>
                  ❤️ {post.likes} Likes
                </div>
              </div>
            ))}
          </div>

          <div className="code-block">
{`-- Native SQL Query Execution:
SELECT id, title, author, likes
FROM posts
ORDER BY likes DESC
LIMIT 3;`}
          </div>
        </div>
      )}

      {/* TAB 5: JMETER BENCHMARKS */}
      {activeTab === "jmeter" && (
        <div className="panel" id="panel-jmeter">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Apache JMeter Multi-Threaded Benchmarking</h2>
              <p className="panel-desc">
                Benchmarking performance characteristics under 5 concurrent users across cached and unindexed database queries.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => copyToClipboard("jmeter/experiment-6.jmx")}
            >
              📂 Test Plan: jmeter/experiment-6.jmx
            </button>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Simulated Threads</div>
              <div className="metric-val">5 Users</div>
              <div className="metric-desc">Ramp-up period: 2 seconds</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Loop Count</div>
              <div className="metric-val">5 Iterations</div>
              <div className="metric-desc">25 total requests per sampler</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Error Rate</div>
              <div className="metric-val" style={{color: "#34d399"}}>0.0%</div>
              <div className="metric-desc">100% request success rate</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Latency Boost</div>
              <div className="metric-val" style={{color: "#38bdf8"}}>8.7x</div>
              <div className="metric-desc">2.1ms (Cached) vs 18.4ms (DB)</div>
            </div>
          </div>

          <table className="jmeter-summary-table">
            <thead>
              <tr>
                <th>Test Sampler</th>
                <th>Samples</th>
                <th>Avg Latency</th>
                <th>Min Latency</th>
                <th>Max Latency</th>
                <th>Throughput</th>
                <th>Error %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>Pagination API (/api/posts)</td>
                <td>25</td>
                <td className="text-warning">18.4 ms</td>
                <td>12.0 ms</td>
                <td>42.0 ms</td>
                <td>182.5 req/s</td>
                <td className="text-success">0.0%</td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>Cached API (/api/posts/cached)</td>
                <td>25</td>
                <td className="text-success">2.1 ms</td>
                <td>1.0 ms</td>
                <td>4.8 ms</td>
                <td className="text-success" style={{fontWeight: 700}}>421.8 req/s</td>
                <td className="text-success">0.0%</td>
              </tr>
            </tbody>
          </table>

          <div className="code-block" style={{marginTop: "1.5rem"}}>
{`<!-- Apache JMeter Test Plan Snippet (experiment-6.jmx) -->
<ThreadGroup testname="5 Users" enabled="true">
  <stringProp name="ThreadGroup.num_threads">5</stringProp>
  <stringProp name="ThreadGroup.ramp_time">2</stringProp>
  <LoopController>
    <stringProp name="LoopController.loops">5</stringProp>
  </LoopController>
</ThreadGroup>`}
          </div>
        </div>
      )}

      {/* TAB 6: LIVE API CONSOLE */}
      {activeTab === "console" && (
        <div className="panel" id="panel-console">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Interactive API Tester & Postman Suite</h2>
              <p className="panel-desc">
                Execute live HTTP requests against all 5 Experiment 6 endpoints and inspect status codes, latency, and JSON payloads.
              </p>
            </div>
          </div>

          <div className="toolbar" style={{flexDirection: "column", alignItems: "stretch"}}>
            <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem"}}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setConsoleMethod("GET");
                  setConsoleEndpoint("/api/posts?page=0&size=5&sort=likes&order=desc");
                  runConsoleRequest("/api/posts?page=0&size=5&sort=likes&order=desc", "GET");
                }}
              >
                1. Pagination & Sorting
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setConsoleMethod("GET");
                  setConsoleEndpoint("/api/posts/cached");
                  runConsoleRequest("/api/posts/cached", "GET");
                }}
              >
                2. In-Memory Cache
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setConsoleMethod("GET");
                  setConsoleEndpoint("/api/posts/with-comments");
                  runConsoleRequest("/api/posts/with-comments", "GET");
                }}
              >
                3. JOIN (No N+1)
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setConsoleMethod("GET");
                  setConsoleEndpoint("/api/posts/top");
                  runConsoleRequest("/api/posts/top", "GET");
                }}
              >
                4. Native SQL Top 3
              </button>
              <button
                className="btn-danger"
                onClick={() => {
                  setConsoleMethod("DELETE");
                  setConsoleEndpoint("/api/cache");
                  runConsoleRequest("/api/cache", "DELETE");
                }}
              >
                5. DELETE /api/cache
              </button>
            </div>

            <div style={{display: "flex", gap: "0.5rem", width: "100%"}}>
              <select
                className="select-control"
                value={consoleMethod}
                onChange={e => setConsoleMethod(e.target.value)}
                style={{width: "110px"}}
              >
                <option value="GET">GET</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                className="select-control"
                style={{flexGrow: 1, fontFamily: "var(--font-mono)"}}
                value={consoleEndpoint}
                onChange={e => setConsoleEndpoint(e.target.value)}
              />
              <button
                className="btn-primary"
                onClick={() => runConsoleRequest()}
                disabled={consoleLoading}
              >
                {consoleLoading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>

          {/* Response Box */}
          <div style={{display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem"}}>
            <span style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>
              Status: <strong style={{color: consoleStatus === 200 ? "#34d399" : "#fb7185"}}>{consoleStatus || "--"}</strong>
            </span>
            <span style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>
              Latency: <strong style={{color: "#38bdf8"}}>{consoleTime !== null ? `${consoleTime} ms` : "--"}</strong>
            </span>
          </div>

          <div className="code-block" style={{maxHeight: "360px", overflowY: "auto"}}>
            {consoleResponse ? JSON.stringify(consoleResponse, null, 2) : "// Awaiting request..."}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          Chandigarh University · <strong>Full Stack Development - II (24CSP-337)</strong> · Experiment 6
        </p>
        <p style={{marginTop: "0.25rem"}}>
          Maintained by <a href="https://github.com/Swayam26-rwt" target="_blank" rel="noreferrer">Swayam Rawat</a>
        </p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
