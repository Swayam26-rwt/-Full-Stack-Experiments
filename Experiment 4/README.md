# Experiment 4 — Interactive Calendar with React Optimization & Testing

> **Course:** Full Stack Development - II (24CSP-337) · Chandigarh University  
> **Student:** Swayam Rawat · CSE (AIML), 5th Semester

## Live Demo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://fsd-exp4-calendar.vercel.app)

**🚀 [View Live Application](https://fsd-exp4-calendar.vercel.app)**

---

## Overview

A fully interactive monthly calendar application built with React, demonstrating advanced performance optimisation techniques and modern frontend testing practices. The project implements a mock REST API using MSW (Mock Service Worker), measures rendering performance with React DevTools Profiler, and covers the application with a comprehensive Vitest + React Testing Library test suite.

---

## Objectives

- Apply `React.memo`, `useMemo`, and `useCallback` to eliminate unnecessary renders
- Implement efficient data indexing with `Map` for O(1) event lookup by date
- Mock a REST API using MSW without any real backend
- Write unit and integration tests with Vitest and React Testing Library
- Profile and analyse component render behaviour with React DevTools
- Build a drag-and-drop event rescheduling system with state synchronisation

---

## Features

- 📅 **Monthly Calendar View** — Navigate between months with Previous / Next / Today controls
- ➕ **Add Events** — Via modal form or by double-clicking any day cell
- 🖱️ **Drag & Drop Rescheduling** — Drag event cards to new dates; sends `PUT /api/events/:id` via MSW
- 🗑️ **Delete Events** — One-click `×` button per event card
- ⚡ **Performance Optimisation** — `React.memo` on all calendar sub-components; `useMemo` for day generation and event indexing; `useCallback` for all event handlers
- 🔌 **MSW Mock API** — Full CRUD REST endpoints: `GET`, `POST`, `PUT`, `DELETE /api/events`
- 🧪 **Test Suite** — Unit tests for utilities + integration tests for components and hooks
- 📊 **DevTools Profiling** — Console render logs on `EventCard` for real-time render tracing

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, JSX |
| Build Tool | Vite 7 |
| API Mocking | MSW (Mock Service Worker) 2 |
| Testing Framework | Vitest 3 |
| Testing Library | React Testing Library 16 |
| DOM Testing | jsdom |
| Coverage | @vitest/coverage-v8 |
| Language | JavaScript (ES Modules) |

---

## Project Structure

```text
Experiment-4/
├── public/
│   └── mockServiceWorker.js    # MSW browser service worker (run: npx msw init public)
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   │   ├── Calendar.jsx        # Main calendar, React.memo
│   │   │   ├── CalendarDay.jsx     # Day cell with drag-drop + events, React.memo
│   │   │   ├── CalendarGrid.jsx    # Grid layout, React.memo
│   │   │   ├── CalendarHeader.jsx  # Month/year + nav, React.memo
│   │   │   └── EventCard.jsx       # Draggable event card, React.memo
│   │   ├── EventForm/
│   │   │   └── EventForm.jsx       # Add-event modal
│   │   └── UI/
│   │       └── Loading.jsx         # Loading spinner
│   ├── hooks/
│   │   └── useEvents.js            # CRUD logic + API calls + state management
│   ├── mocks/
│   │   ├── browser.js              # MSW browser worker setup
│   │   ├── handlers.js             # REST route handlers (CRUD)
│   │   └── server.js               # MSW server for tests
│   ├── services/
│   │   └── eventService.js         # Axios/fetch wrappers for event API
│   ├── tests/
│   │   ├── Calendar.test.jsx       # Calendar integration tests
│   │   ├── EventCard.test.jsx      # EventCard unit tests
│   │   ├── EventForm.test.jsx      # Form validation tests
│   │   ├── calendarUtils.test.js   # Pure utility function tests
│   │   └── useEvents.test.js       # Custom hook tests
│   ├── utils/
│   │   └── calendarUtils.js        # Day generation, date arithmetic
│   ├── App.jsx                     # App root
│   ├── App.css                     # Application styles
│   ├── main.jsx                    # Entry point + MSW init
│   └── setupTests.js               # Vitest global setup
├── index.html
├── package.json
└── vite.config.js
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Swayam26-rwt/-Full-Stack-Experiments.git

# Navigate to Experiment 4
cd "-Full-Stack-Experiments/Experiment 4"

# Install dependencies
npm install
```

---

## Environment Variables

This project does **not** require any environment variables. The REST API is fully mocked with MSW using in-memory data.

---

## Running Locally

```bash
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

> **Note:** The app works without the MSW Service Worker. If you want to enable the actual browser Service Worker for MSW, run once:
> ```bash
> npx msw init public --save
> ```

---

## Testing

```bash
# Run all tests once
npm run test:run

# Watch mode (re-runs on file change)
npm test

# Generate coverage report
npm run test:coverage
```

---

## Deployment

The application is deployed as a static site on **Vercel**. MSW uses in-memory data — refreshing the browser resets the event dataset (expected behaviour for the demo).

**Live URL:** [https://fsd-exp4-calendar.vercel.app](https://fsd-exp4-calendar.vercel.app)

---

## Performance Optimisation Details

### `React.memo`
Applied to: `CalendarHeader`, `CalendarGrid`, `CalendarDay`, `EventCard`  
Effect: Components only re-render when their props change, preventing cascade re-renders from parent state updates.

### `useMemo`
- **Calendar days array** — Recalculated only when the current month/year changes
- **Events-by-date index** — Built as a `Map<string, Event[]>` recalculated only when the events array changes; provides O(1) lookup per day cell

### `useCallback`
Applied to all event handlers: navigation callbacks, drag-and-drop handlers, add/delete handlers  
Effect: Stable function references prevent `React.memo` child re-renders caused by recreated callbacks.

---

## API Mock (MSW)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | Fetch all events |
| `POST` | `/api/events` | Create new event |
| `PUT` | `/api/events/:id` | Update event (used for drag-and-drop) |
| `DELETE` | `/api/events/:id` | Delete event |

---

## React DevTools Profiling

1. Install **React Developer Tools** browser extension
2. Open DevTools → **Profiler** tab
3. Click **Record**, interact with the calendar, click **Stop**
4. Inspect the flame graph — optimised components show reduced render frequency

`EventCard` also logs to the browser console:
```
EventCard rendered: <event title>
```
This makes render behaviour immediately observable without the Profiler.

---

## Experiment Learning Map

```
Interactive Calendar
      ↓
Event-Driven UI (click, double-click, drag)
      ↓
State Synchronisation (useEvents hook)
      ↓
React.memo / useMemo / useCallback
      ↓
Map-based O(1) date indexing
      ↓
MSW REST API Mocking
      ↓
React DevTools Profiler analysis
      ↓
Vitest + React Testing Library
```

---

## Author

**Swayam Rawat**  
Computer Science Engineering (AIML) · Chandigarh University  
[GitHub](https://github.com/Swayam26-rwt)
