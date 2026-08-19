# Experiment 4 — Interactive Calendar Optimization & Testing

A complete React + Vite implementation for:

- Interactive calendar UI
- Dynamic event rendering
- Drag-and-drop rescheduling
- Event creation and deletion
- React.memo optimization
- useMemo optimization
- useCallback optimization
- Event indexing with Map
- MSW mock REST API
- Vitest testing
- React Testing Library
- Performance/render analysis

## Requirements

- Node.js 18+ recommended
- npm

## Run the project

```bash
npm install
npm run dev
```

The browser app does **not** depend on a real backend. It also does not block rendering if the MSW browser worker is missing. In that case it automatically uses the built-in in-memory API fallback.

To enable the actual MSW browser Service Worker as well, run once:

```bash
npx msw init public --save
```

Open the local URL printed by Vite.

## Test

```bash
npm run test:run
```

Watch mode:

```bash
npm test
```

## Coverage

```bash
npm run test:coverage
```

## Features

### 1. Calendar navigation

Use:

- Previous month
- Next month
- Today

### 2. Add event

Click `+ Add Event`.

You can also double-click any calendar day.

### 3. Drag and drop

Drag an event card and drop it on another date.

The application sends:

```text
PUT /api/events/:id
```

through MSW and updates React state.

### 4. Delete event

Use the `×` button on an event.

### 5. Performance optimization

`React.memo` is used on:

- CalendarHeader
- CalendarGrid
- CalendarDay
- EventCard

`useMemo` is used for:

- Calendar day calculation
- Date-to-events indexing

`useCallback` is used for:

- Calendar navigation
- Drag-and-drop handlers
- Event handlers

### 6. API mocking

MSW provides:

```text
GET    /api/events
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

No backend server is required.

## React DevTools profiling

Install React Developer Tools in your browser.

Open:

```text
React DevTools → Profiler
```

Then interact with the calendar and compare renders.

The `EventCard` component also contains:

```js
console.log(`EventCard rendered: ${event.title}`);
```

This makes render behavior easy to observe in the browser console.

## Experiment mapping

```text
Interactive Calendar
        ↓
Event-driven UI
        ↓
Drag & Drop
        ↓
State Synchronization
        ↓
React.memo / useMemo / useCallback
        ↓
React DevTools Profiler
        ↓
MSW API Mocking
        ↓
Vitest + React Testing Library
```

## Important note

MSW uses in-memory data for the demo. Refreshing the browser resets the mock dataset.
