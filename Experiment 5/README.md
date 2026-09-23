# Experiment 5 — REST API Design & Exception Handling

> **Course:** Full Stack Development - II (24CSP-337) · Chandigarh University  
> **Student:** Swayam Rawat · CSE (AIML), 5th Semester

## Live Demo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://fsd-exp5-rest-api.vercel.app)

**🚀 [View Live Application](https://fsd-exp5-rest-api.vercel.app)**

---

## Overview

A full-stack Node.js and Express application demonstrating production-grade RESTful API design principles, robust request validation, centralized error handling, and end-to-end request tracing. The backend serves both REST endpoints and an interactive client frontend, featuring standardized JSON response envelopes, correlation IDs (`X-Correlation-ID`) for observability, CORS configuration, and asynchronous task scheduling with simulated background execution.

The project is deployed and live on **Vercel** as a serverless full-stack deployment, offering complete real-time interactivity for managing posts and scheduling asynchronous jobs.

---

## Objectives

- Design and implement a standard **RESTful CRUD API** adhering to HTTP conventions and status codes (`GET`, `POST`, `PUT`, `DELETE`).
- Implement a **standardized API response envelope** (`status`, `message`, `data`) for predictable client consumption across all endpoints.
- Build server-side input **validation middleware** enforcing payload constraints (non-empty content, length boundaries).
- Implement **request correlation tracking** (`X-Correlation-ID`) across middleware and execution traces for distributed observability.
- Create **HTTP request logging middleware** that measures execution time and records request-response lifecycles.
- Implement a **centralized global exception handler** for uncaught runtime errors (HTTP 500) that prevents leaking stack traces.
- Support asynchronous **task scheduling** with delayed background execution simulation (`setTimeout`).
- Build an interactive single-page frontend interface featuring real-time CRUD, live character counting, and scheduled task notifications.

---

## Features

### 1. 🔄 RESTful CRUD Operations
- **Create Post (`POST /api/posts`):** Accepts `{ content }`, validates input, stores in memory with timestamps, and returns HTTP 201 Created.
- **Read All Posts (`GET /api/posts`):** Retrieves all active posts formatted in the standardized envelope with HTTP 200 OK.
- **Read Single Post (`GET /api/posts/:id`):** Retrieves a post by its numeric ID or returns a structured HTTP 404 Not Found error.
- **Update Post (`PUT /api/posts/:id`):** Validates new content, updates post in-place, refreshes `updatedAt`, and returns HTTP 200 OK.
- **Delete Post (`DELETE /api/posts/:id`):** Removes the post from memory by ID or returns HTTP 404 if not found.

### 2. 🛡️ Request Validation Middleware
- Checks presence and type of required fields (`content`, `task`, `delaySeconds`).
- Enforces character length limits (maximum 280 characters).
- Rejects malformed requests with a structured HTTP `400 Bad Request` containing specific field-level error messages.

### 3. 🔍 Correlation ID & Request Tracing
- Inspects incoming requests for an `X-Correlation-ID` header; if missing, generates a cryptographically secure UUID (`crypto.randomUUID()`).
- Attaches the ID to `req.correlationId` and echoes it back in the response headers.
- Emits formatted log entries tagged with the correlation ID, including HTTP method, URL, status code, and latency in milliseconds.

### 4. 📦 Standardized Response Envelope
Every response adheres to a strict, predictable JSON format:
```json
{
  "status": "success" | "error",
  "message": "Human-readable status description",
  "data": { ... } | null
}
```

### 5. ⚠️ Centralized Exception Handling & 404 Catch-All
- Global Express error handling middleware intercepts uncaught exceptions, logs the error with the associated correlation ID, and returns an HTTP 500 Internal Server Error without exposing sensitive stack traces.
- Dedicated catch-all handler for undefined `/api/*` endpoints returning structured 404 responses.

### 6. ⏱️ Asynchronous Task Scheduling
- `POST /api/schedule` accepts a task description and a delay in seconds.
- Immediately responds with HTTP `202 Accepted`, providing a unique `scheduleId` and estimated execution timestamp.
- Executes the task asynchronously using Node.js timers, logging the completion alongside the original request's correlation ID.

### 7. 💻 Interactive SPA Frontend
- **Real-Time Character Counter:** Visual feedback highlighting characters remaining (max 280).
- **Live Status Indicator:** Real-time health check badge indicating whether the API is online or offline.
- **Dynamic Post List:** Automatic refresh upon create, update, or delete operations with responsive controls.
- **In-App Toast Notifications:** Instant feedback for user actions and validation errors.

---

## Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Runtime** | Node.js (v18+) | JavaScript server-side execution environment |
| **Framework** | Express.js (v5) | Minimalist web application framework for routing & middleware |
| **Middleware** | `cors`, `express.json` | Cross-origin resource sharing & JSON request body parser |
| **Identifiers** | Node.js `crypto` | Native cryptographically secure UUID generator for correlation IDs |
| **Frontend** | HTML5, CSS3, JavaScript | Modern, dependency-free responsive client interface |
| **Cloud Platform** | Vercel | Production deployment with serverless Node.js functions |

---

## Project Structure

```text
Experiment 5/
├── api/
│   └── index.js         # Vercel serverless function entry point
├── public/
│   ├── index.html       # Client interface with forms, post feed, and scheduler
│   ├── style.css        # Clean, modern responsive stylesheet
│   └── app.js           # Client-side API caller and DOM controller
├── src/
│   └── server.js        # Express server, REST endpoints, middleware & error handling
├── vercel.json          # Vercel routing and rewrite configuration
├── package.json         # Project metadata and dependencies (express, cors)
├── package-lock.json    # Dependency lockfile
├── .gitignore           # Ignored files (node_modules, logs, .vercel)
└── README.md            # Experiment documentation
```

---

## API Specification

| Method | Endpoint | Description | Success Code | Error Codes |
|---|---|---|---|---|
| `GET` | `/api/health` | Health check and server status | `200 OK` | — |
| `GET` | `/api/posts` | Retrieve all posts | `200 OK` | `500 Internal Server Error` |
| `GET` | `/api/posts/:id` | Retrieve single post by ID | `200 OK` | `404 Not Found`, `500` |
| `POST` | `/api/posts` | Create a new post | `201 Created` | `400 Bad Request`, `500` |
| `PUT` | `/api/posts/:id` | Update an existing post by ID | `200 OK` | `400 Bad Request`, `404 Not Found`, `500` |
| `DELETE` | `/api/posts/:id` | Delete a post by ID | `200 OK` | `404 Not Found`, `500` |
| `POST` | `/api/schedule` | Schedule an asynchronous task | `202 Accepted` | `400 Bad Request`, `500` |

---

## Architecture & Middleware Pipeline

```text
Incoming Request
      │
      ▼
┌────────────────────────┐
│   express.json()       │  ──> Parses JSON request body
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│       cors()           │  ──> Configures CORS headers and allowed methods
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Correlation Middleware │  ──> Injects or generates X-Correlation-ID
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│   Logging Middleware   │  ──> Measures request latency & logs on response finish
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Validation Middleware  │  ──> Enforces payload rules (returns 400 on error)
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│    Route Controllers   │  ──> Processes CRUD operations & returns envelope
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Global Error Handler   │  ──> Intercepts exceptions & returns standardized 500
└────────────────────────┘
```

---

## Running Locally

### 1. Clone & Navigate

```bash
git clone https://github.com/Swayam26-rwt/-Full-Stack-Experiments.git
cd "-Full-Stack-Experiments/Experiment 5"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
# Production mode
npm start

# Development mode (auto-reload on save)
npm run dev
```

### 4. Open Application

Visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## Deployment to Vercel

The application is deployed to **Vercel** as a serverless application:
- Static assets located in `public/` are served globally via Vercel's Edge CDN.
- API endpoints configured in `vercel.json` rewrite `/api/(.*)` requests to `api/index.js`, executing the Express backend inside a serverless runtime.

Deploy anytime using the Vercel CLI:
```bash
vercel deploy --prod
```

---

## Author

**Swayam Rawat**  
Department of Computer Science Engineering (AIML)  
Chandigarh University  
GitHub: [@Swayam26-rwt](https://github.com/Swayam26-rwt)
