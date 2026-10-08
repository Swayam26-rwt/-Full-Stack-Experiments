

# 🚀 Full Stack Development – II (FSD-II)

> **Chandigarh University**  
> **Course:** Full Stack Development – II (24CSP-337)  
> **Semester:** 5th Semester  
> **Student:** **Swayam Rawat**  
> **Department:** Computer Science Engineering (AIML)  
> **GitHub:** [github.com/Swayam26-rwt](https://github.com/Swayam26-rwt)



---

## 📖 About

This repository contains all laboratory experiments, assignments, and practical implementations completed as part of the **Full Stack Development-II** course.

The course emphasizes modern full-stack application development by integrating frontend, backend, APIs, databases, security, performance optimization, and software engineering best practices.

Each experiment is maintained in its own folder for better organization and version control.

---

## 🎯 Course Objectives

* Learn modern Full Stack Development
* Build scalable web applications
* Develop REST APIs with clean layered architectures
* Understand frontend and backend integration
* Implement authentication & authorization
* Apply clean coding practices & data validation
* Improve software architecture skills & API testing
* Gain industry-oriented development experience

---

## 🛠️ Technologies Used

### Frontend
* React.js (v19)
* HTML5, CSS3, Modern Glassmorphism & Dark Themes
* JavaScript (ES2022+) & JSX
* Vite (high-performance build tool)

### State Management & Tooling
* Redux Toolkit + Reselect
* React Router DOM v7
* Axios & Interceptors
* MSW (Mock Service Worker)

### Testing & API Quality
* Postman (Comprehensive API Test Collections)
* Vitest & React Testing Library
* Spring Boot Test Suite

### Backend & Server Runtimes
* Java 17+ & Spring Boot 3 (v3.5.5)
* Layered Architecture (`Controller → Service → Repository`)
* Jakarta Bean Validation API
* Centralized Global Exception Handling (`@RestControllerAdvice`)
* Logging Filters (`OncePerRequestFilter`) & Latency Tracing
* SLF4J MDC Distributed Tracing (`X-Correlation-ID`)
* Node.js & Express.js (v5)

### Other Tools
* Git & GitHub
* Vercel (Cloud Deployment)
* VS Code & Apache Maven

---

# 📂 Repository Structure

```text
-Full-Stack-Experiments/
│
├── Experiment 1/    — Post Composer & Draft Manager (React + Vite)
├── Experiment 2/    — Redux Content Manager (React + Redux Toolkit + Reselect)
├── Experiment 3/    — RBAC & JWT Route Protection (React + React Router v7)
├── Experiment 4/    — Interactive Calendar with Optimization & Testing
├── Experiment 5/    — Spring Boot REST API Design & Exception Handling (Spring Boot + React Vite)
│   ├── backend/     — Spring Boot Layered REST API (Controller, Service, Repository, DTOs, Exception Handlers)
│   ├── frontend/    — React + Vite Banking Management System UI
│   ├── postman/     — Postman Collection (12 Verified Endpoints)
│   └── screenshots/ — Complete visual verification evidence (Postman + Terminal + UI)
├── Experiment 6/    — Scalable Read APIs & Query Optimization (Express.js + SQLite + JMeter)
│   ├── data/        — SQLite database storage with auto-seeding
│   ├── jmeter/      — Apache JMeter load testing test plans (.jmx)
│   ├── public/      — Web client / API overview interface
│   └── src/         — Express API implementation (Pagination, Sorting, Cache, JOINs, Native SQL)
│
└── README.md
```

---

# 📚 Experiments Summary

| Experiment | Topic | Description | Live Demo | Status |
| --- | --- | --- | --- | --- |
| Experiment 1 | React Fundamentals | Post Composer & Draft Manager built with React + Vite | [🚀 Live Demo](https://post-composer-draft-manager-swayam.vercel.app) | ✅ |
| Experiment 2 | State Management — Redux | Social media content manager with Redux Toolkit, async thunks, and memoised selectors | [🚀 Live Demo](https://fsd-exp2-redux-content-manager.vercel.app) | ✅ |
| Experiment 3 | Authentication & RBAC | Role-based access control with JWT, Axios interceptors, and protected React Router routes | [🚀 Live Demo](https://fsd-exp3-rbac-jwt.vercel.app) | ✅ |
| Experiment 4 | React Optimization & Testing | Interactive calendar with React.memo/useMemo/useCallback, MSW mock API, and Vitest test suite | [🚀 Live Demo](https://fsd-exp4-calendar.vercel.app) | ✅ |
| Experiment 5 | Spring Boot REST API & Exception Handling | Enterprise Banking REST API with Spring Boot layered architecture (Controller-Service-Repository), Jakarta Bean Validation, centralized `@RestControllerAdvice`, `OncePerRequestFilter` logging, `X-Correlation-ID` tracing, Postman test suite, and React + Vite frontend | [🚀 Live Demo](https://fsd-exp5-rest-api.vercel.app) | ✅ |
| Experiment 6 | Scalable Read APIs & Optimization | High-performance read APIs with pagination, multi-field sorting, in-memory caching (TTL), N+1 query elimination (JOINs), native SQL, and JMeter benchmarking | — | ✅ |
| Experiment 7 | REST APIs | — | — | ⏳ |
| Experiment 8 | Authentication & Security | — | — | ⏳ |
| Experiment 9 | Performance Optimization | — | — | ⏳ |
| Experiment 10 | Final Integrated Project | — | — | ⏳ |

---

## 🌐 Live Deployments & Demonstrations

All completed laboratory experiments are deployed and accessible via cloud hosting for live interactive demonstrations:

* **Experiment 1 (Post Composer):** [https://post-composer-draft-manager-swayam.vercel.app](https://post-composer-draft-manager-swayam.vercel.app)
* **Experiment 2 (Redux Content Manager):** [https://fsd-exp2-redux-content-manager.vercel.app](https://fsd-exp2-redux-content-manager.vercel.app)
* **Experiment 3 (RBAC & Protected Routes):** [https://fsd-exp3-rbac-jwt.vercel.app](https://fsd-exp3-rbac-jwt.vercel.app)
* **Experiment 4 (Optimized Calendar):** [https://fsd-exp4-calendar.vercel.app](https://fsd-exp4-calendar.vercel.app)
* **Experiment 5 (Spring Boot Banking REST API + React Vite):** [https://fsd-exp5-rest-api.vercel.app](https://fsd-exp5-rest-api.vercel.app)

---

## 📌 Learning Outcomes

By completing this course, I will be able to:

* Design and structure enterprise Full Stack Applications
* Develop Responsive User Interfaces using React and Vite
* Build RESTful APIs adhering to clean layered architecture principles
* Enforce server-side data integrity using Jakarta Bean Validation
* Implement centralized exception handling without leaking stack traces
* Track distributed requests across tiers using correlation IDs (`X-Correlation-ID`)
* Monitor API latency and HTTP status codes using request filters
* Thoroughly test and document REST APIs using Postman suites
* Integrate Frontend clients seamlessly with backend services
* Follow industry-standard coding conventions and version control best practices

---

## 💻 How to Run Any Experiment

### Clone Repository

```bash
git clone https://github.com/Swayam26-rwt/-Full-Stack-Experiments.git
```

### Running Experiment 5 (Spring Boot + React)

#### 1. Backend (Spring Boot)
```bash
cd "-Full-Stack-Experiments/Experiment 5/backend"
mvn spring-boot:run
```
Runs on: `http://localhost:8080`

#### 2. Frontend (React + Vite)
```bash
cd "-Full-Stack-Experiments/Experiment 5/frontend"
npm install
npm run dev
```
Runs on: `http://localhost:5173`

#### 3. Postman Test Collection
Import `Experiment 5/postman/collections/Experiment_5_Banking_API.postman_collection.json` into Postman to execute all 12 verified test requests.

### Running Experiment 6 (Scalable Read APIs & JMeter)

#### 1. Backend Server (Express + SQLite)
```bash
cd "-Full-Stack-Experiments/Experiment 6"
npm install
npm run dev
```
Runs on: `http://localhost:3000`

#### 2. Apache JMeter Benchmarking
Open `Experiment 6/jmeter/experiment-6.jmx` in Apache JMeter to execute concurrent thread load tests measuring latency and throughput.

---

## 📖 Course Information

**University:** Chandigarh University  
**Course Code:** 24CSP-337  
**Course Name:** Full Stack Development - II  
**Semester:** 5th Semester  

---

## 👨‍🎓 Student Information

**Name:** Swayam Rawat  
**Department:** Computer Science Engineering  
**Specialization:** Artificial Intelligence & Machine Learning (AIML)  
**GitHub:** [github.com/Swayam26-rwt](https://github.com/Swayam26-rwt)  

---

## 📌 Repository Guidelines

* Each experiment is stored in a separate folder.
* Maintain clean and readable code with layered architecture.
* Follow proper naming conventions.
* Add meaningful commit messages.
* Keep documentation updated with visual verification evidence.
* Push changes after completing each experiment.

---

## 📄 License

This repository is maintained for **educational and academic purposes** as part of the **Full Stack Development-II** course at **Chandigarh University**.

---

# ⭐ Thank You

If you find this repository useful, feel free to ⭐ star it and explore the experiments.
