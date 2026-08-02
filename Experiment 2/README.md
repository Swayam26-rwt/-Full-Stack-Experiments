# Experiment 2 — Redux Content Manager

A React + Vite application demonstrating state management using **Redux Toolkit** and **Reselect**.

## 📌 Objective

Build a content management interface that uses Redux for centralized state, showcasing:
- Store setup with `@reduxjs/toolkit`
- Slice-based reducers and actions
- Memoized selectors with `reselect`
- React-Redux integration via `useSelector` and `useDispatch`

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI Library |
| Vite | Build Tool & Dev Server |
| Redux Toolkit | State Management |
| React-Redux | React bindings for Redux |
| Reselect | Memoized Selectors |

## 📁 Project Structure

```
Experiment 2/
├── public/              # Static assets
├── src/
│   ├── App.jsx          # Root component
│   ├── App.css          # Component styles
│   ├── redux.js         # Redux store, slices & selectors
│   ├── main.jsx         # Entry point with Redux Provider
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

```bash
# Navigate into the project
cd "Experiment 2"

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🔑 Key Concepts

- **Redux Store** — Single source of truth for application state
- **Slices** — Modular state with co-located reducers and actions
- **Selectors** — Efficiently derive data from state with memoization
- **Provider** — Makes the store available to the entire React tree
