# Experiment 3 — Role-Based Authentication & Route Protection

> **Course:** Full Stack Development - II (24CSP-337) · Chandigarh University  
> **Student:** Swayam Rawat · CSE (AIML), 5th Semester

## Live Demo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://fsd-exp3-rbac-jwt.vercel.app)

**🚀 [View Live Application](https://fsd-exp3-rbac-jwt.vercel.app)**

---

## Overview

A frontend-only Role-Based Access Control (RBAC) system demonstrating authentication, authorisation, and protected routing. The application simulates JWT-based authentication entirely in the browser (without a backend) to illustrate how production security patterns work — including token issuance, decoding, Axios interceptors, and multi-role route protection.

> ⚠️ **Academic Note:** The demo generates an unsigned JWT (`alg: none`) to run without a backend. This is intentionally insecure to illustrate the concepts. In production, the backend must sign and validate JWTs.

---

## Objectives

- Distinguish between **authentication** (who you are) and **authorisation** (what you can access)
- Understand the structure and claims of a JSON Web Token (JWT)
- Implement token storage and management in the browser
- Configure Axios request and response interceptors for token injection and error handling
- Build a multi-role RBAC system with hierarchical permissions
- Create React protected routes that redirect based on authentication and role
- Handle unauthorised access with a dedicated 403 page

---

## Demo Accounts

| Role | Username | Password | Access Level |
|---|---|---|---|
| Admin | `admin` | `admin123` | All routes |
| Editor | `editor` | `editor123` | Dashboard, Editor, Viewer |
| Viewer | `viewer` | `viewer123` | Dashboard, Viewer |

---

## Features

- 🔐 **JWT Authentication** — Token generation, storage, and decoding with `atob`
- 🛡️ **Protected Routes** — `<ProtectedRoute>` component blocks unauthenticated access
- 👥 **Role-Based Routes** — `<RoleRoute>` enforces minimum role requirements
- 🚫 **Unauthorised Page** — 403 screen when authenticated but lacking permission
- 🔄 **Axios Interceptors** — Request interceptor attaches `Authorization` header; response interceptor handles 401 errors
- 🧭 **React Router v7** — Full SPA routing with declarative route protection
- 🔒 **Permission Gate** — `<PermissionGate>` component for conditional UI rendering based on role
- 🚪 **Login / Logout** — Auth context manages session state

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, JSX |
| Build Tool | Vite 7 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Auth Context | React Context API |
| Language | JavaScript (ES Modules) |

---

## Project Structure

```text
Experiment-3/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Navigation shell
│   │   ├── PermissionGate.jsx  # Conditional render by role
│   │   ├── ProtectedRoute.jsx  # Auth guard for routes
│   │   └── RoleRoute.jsx       # Role-based route guard
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state + login/logout
│   ├── pages/
│   │   ├── Login.jsx           # Credential entry and token issue
│   │   ├── Dashboard.jsx       # All authenticated users
│   │   ├── Admin.jsx           # Admin only
│   │   ├── Editor.jsx          # Admin + Editor
│   │   ├── Viewer.jsx          # All authenticated users
│   │   ├── Unauthorized.jsx    # 403 page
│   │   └── NotFound.jsx        # 404 page
│   ├── services/
│   │   └── api.js              # Axios instance with interceptors
│   ├── utils/
│   │   ├── jwt.js              # JWT encode/decode utilities
│   │   └── rbac.js             # Role hierarchy and permission checks
│   ├── App.jsx                 # Route configuration
│   ├── main.jsx                # App entry with AuthProvider
│   └── styles.css              # Application styles
├── index.html
├── package.json
└── vite.config.js
```

---

## Route Map

| Path | Access | Component |
|---|---|---|
| `/login` | Public | Login.jsx |
| `/dashboard` | Authenticated | Dashboard.jsx |
| `/admin` | Admin only | Admin.jsx |
| `/editor` | Admin, Editor | Editor.jsx |
| `/viewer` | Authenticated | Viewer.jsx |
| `/unauthorized` | Public | Unauthorized.jsx |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Swayam26-rwt/-Full-Stack-Experiments.git

# Navigate to Experiment 3
cd "-Full-Stack-Experiments/Experiment 3"

# Install dependencies
npm install
```

---

## Environment Variables

This project does **not** require any environment variables. Authentication is fully simulated in the browser for academic demonstration purposes.

---

## Running Locally

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).  
Navigate to `/login` and sign in using any demo account from the table above.

---

## Deployment

The application is deployed as a static SPA on **Vercel**. React Router's client-side routing requires all paths to serve `index.html`.

**Live URL:** [https://fsd-exp3-rbac-jwt.vercel.app](https://fsd-exp3-rbac-jwt.vercel.app)

---

## Experiment Concepts Demonstrated

1. **Authentication vs. Authorisation** — Clear separation of concerns
2. **JWT Structure** — Header, payload, signature; base64url encoding
3. **Token Storage** — In-memory (auth context) vs. localStorage tradeoffs
4. **Axios Request Interceptor** — Auto-attach `Authorization: Bearer <token>` to all requests
5. **Axios Response Interceptor** — Catch 401 errors and trigger logout
6. **RBAC Permissions** — Role hierarchy (`admin > editor > viewer`) with `rbac.js` utility
7. **Protected Routes** — Redirect to `/login` if unauthenticated
8. **Role-Based Conditional Rendering** — `<PermissionGate>` shows/hides UI by role
9. **403 Handling** — Redirect to `/unauthorized` when role is insufficient
10. **Centralised Security Architecture** — Auth state in context, guards as reusable components

---

## Important Security Note

In a production system:
- The **backend** validates credentials and signs the JWT with a secret key
- The **backend** validates the JWT signature on every protected API request
- Use **HttpOnly, Secure, SameSite** cookies for the refresh token
- Do **not** treat frontend route protection as a substitute for backend authorisation

---

## Author

**Swayam Rawat**  
Computer Science Engineering (AIML) · Chandigarh University  
[GitHub](https://github.com/Swayam26-rwt)
