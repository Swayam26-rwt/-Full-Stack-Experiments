# Experiment 2 — Redux Content Manager

> **Course:** Full Stack Development - II (24CSP-337) · Chandigarh University  
> **Student:** Swayam Rawat · CSE (AIML), 5th Semester

## Live Demo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://fsd-exp2-redux-content-manager.vercel.app)

**🚀 [View Live Application](https://fsd-exp2-redux-content-manager.vercel.app)**

---

## Overview

A fully functional **Social Media Content Management System** built with React and Redux Toolkit. The application allows users to manage posts across multiple social platforms with real-time analytics. It demonstrates advanced state management patterns including async thunks, memoized selectors with Reselect, and performance-optimised components with `React.memo`.

---

## Objectives

- Implement a centralised Redux store with Redux Toolkit's `createSlice`
- Demonstrate async state management using `createAsyncThunk`
- Apply memoised selectors with the Reselect library to prevent redundant recomputation
- Optimise component rendering with `React.memo`
- Build a fully reactive CRUD interface without any backend dependency

---

## Features

- ➕ **Add Posts** — Create posts with title, platform, and like count
- 🗑️ **Delete Posts** — Remove posts via memoised action handlers
- 📊 **Live Analytics** — Total posts, total likes, popular posts count, short posts count, and active platforms — all computed via memoised selectors
- 🔄 **Async Data Fetch** — Simulated API fetch via `createAsyncThunk`
- ⚡ **Optimised Rendering** — `PostCard` wrapped in `React.memo` to prevent unnecessary re-renders

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, JSX |
| Build Tool | Vite 8 |
| State Management | Redux Toolkit 2, React-Redux 9 |
| Memoised Selectors | Reselect 5 |
| Linting | ESLint 10 |
| Language | JavaScript (ES Modules) |

---

## Project Structure

```text
redux-content-manager/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/         # Static images
│   ├── App.jsx         # Root component — UI + dispatch calls
│   ├── redux.js        # Redux slice, async thunk, Reselect selectors, store
│   ├── App.css         # Application styles
│   ├── index.css       # Global reset and base styles
│   └── main.jsx        # React root + Redux Provider mount
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Swayam26-rwt/-Full-Stack-Experiments.git

# Navigate to Experiment 2
cd "-Full-Stack-Experiments/Experiment 2"

# Install dependencies
npm install
```

---

## Environment Variables

This project does **not** require any environment variables. All data is managed in-memory using Redux state.

---

## Running Locally

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

---

## Deployment

The application is deployed as a static site on **Vercel**. Since there is no backend dependency, the build output (`dist/`) is served directly via Vercel's CDN.

**Live URL:** [https://fsd-exp2-redux-content-manager.vercel.app](https://fsd-exp2-redux-content-manager.vercel.app)

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

---

## Experiment Details

This experiment demonstrates:

1. **Redux Toolkit `createSlice`** — Defining reducers and actions in a single call with Immer-powered immutable updates
2. **`createAsyncThunk`** — Handling async operations (simulated fetch) with `pending`, `fulfilled`, and `rejected` lifecycle states
3. **Reselect `createSelector`** — Computing derived data (popular posts, short posts, platform list, aggregate counts) without redundant recalculation
4. **`React.memo`** — Wrapping the `PostCard` component to prevent re-renders when unrelated state changes
5. **`useSelector` / `useDispatch`** — Connecting React components to the Redux store without prop drilling

---

## Author

**Swayam Rawat**  
Computer Science Engineering (AIML) · Chandigarh University  
[GitHub](https://github.com/Swayam26-rwt)
