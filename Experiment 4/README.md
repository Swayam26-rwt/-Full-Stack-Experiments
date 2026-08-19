# 📅 Interactive Calendar Optimization & Testing

A full-stack-ready **React Interactive Calendar** designed to demonstrate modern frontend development concepts including **event-driven UI, drag-and-drop scheduling, state synchronization, rendering optimization, API mocking, and automated testing**.

This project was developed as **Experiment 4 — Interactive Calendar Optimization & Testing** and focuses on building a responsive and scalable calendar interface using React and modern performance optimization techniques.

---

## 🚀 Features

* 📅 Interactive monthly calendar
* ➕ Create and schedule events
* 🖱️ Drag-and-drop events between dates
* 🗑️ Delete scheduled events
* 🔄 Previous month / next month navigation
* 📍 Jump to today's date
* ⚡ Optimized rendering using `React.memo`
* 🧠 Computation optimization using `useMemo`
* 🔗 Stable callbacks using `useCallback`
* 🗂️ Efficient event indexing using JavaScript `Map`
* 🌐 REST API abstraction
* 🧪 Mock API using Mock Service Worker (MSW)
* ✅ Automated testing with Vitest
* 🧩 React Testing Library
* 📊 React DevTools Profiler support
* 📱 Responsive UI
* ⏳ Loading and error states

---

## 🎯 Experiment Objective

The objective of this experiment is to develop and optimize an interactive calendar application capable of efficiently handling dynamic scheduled posts/events while minimizing unnecessary React re-renders.

The project demonstrates:

1. Interactive calendar UI
2. Event-driven user interactions
3. Drag-and-drop scheduling
4. React state synchronization
5. Component-level memoization
6. Expensive computation optimization
7. Callback optimization
8. API mocking
9. Automated testing
10. Performance profiling

---

## 🛠️ Tech Stack

| Technology                  | Purpose                       |
| --------------------------- | ----------------------------- |
| **React**                   | Frontend UI                   |
| **Vite**                    | Development/build tool        |
| **JavaScript (ES6+)**       | Application logic             |
| **CSS3**                    | Styling and responsive design |
| **MSW**                     | Mock REST API                 |
| **Vitest**                  | Test runner                   |
| **React Testing Library**   | Component testing             |
| **React DevTools Profiler** | Performance analysis          |
| **Git/GitHub**              | Version control               |

---

## 📂 Project Structure

```text
interactive-calendar/
│
├── public/
│   └── mockServiceWorker.js
│
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   │   ├── Calendar.jsx
│   │   │   ├── CalendarHeader.jsx
│   │   │   ├── CalendarGrid.jsx
│   │   │   ├── CalendarDay.jsx
│   │   │   └── EventCard.jsx
│   │   │
│   │   ├── EventForm/
│   │   │   └── EventForm.jsx
│   │   │
│   │   └── UI/
│   │       └── Loading.jsx
│   │
│   ├── hooks/
│   │   └── useEvents.js
│   │
│   ├── services/
│   │   └── eventService.js
│   │
│   ├── utils/
│   │   └── calendarUtils.js
│   │
│   ├── mocks/
│   │   ├── browser.js
│   │   ├── handlers.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── Calendar.test.jsx
│   │   ├── EventCard.test.jsx
│   │   ├── EventForm.test.jsx
│   │   ├── calendarUtils.test.js
│   │   └── useEvents.test.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── setupTests.js
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

Check your versions:

```bash
node --version
npm --version
git --version
```

---

## ▶️ Run Locally

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/interactive-calendar.git
```

Move into the project directory:

```bash
cd interactive-calendar
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

---

## 🧪 Run Tests

Run the test suite:

```bash
npm run test:run
```

For interactive/watch mode:

```bash
npm test
```

Generate test coverage:

```bash
npm run test:coverage
```

---

## 📊 Performance Optimization

Performance optimization is one of the main objectives of this project.

### 1. React.memo

Components such as `EventCard`, `CalendarDay`, `CalendarGrid`, and `CalendarHeader` use:

```jsx
React.memo()
```

This prevents a component from re-rendering when its props have not changed.

For example:

```jsx
const EventCard = React.memo(function EventCard({
  event,
  onDelete
}) {
  return (
    <div>
      {event.title}
    </div>
  );
});
```

This is particularly useful when a calendar contains a large number of events.

---

### 2. useMemo

The application uses `useMemo()` for expensive or repeatedly required calculations.

Example:

```jsx
const days = useMemo(
  () => getMonthDays(year, month),
  [year, month]
);
```

It is also used to create an event index:

```jsx
const eventsByDate = useMemo(() => {
  const map = new Map();

  for (const event of events) {
    if (!map.has(event.date)) {
      map.set(event.date, []);
    }

    map.get(event.date).push(event);
  }

  return map;
}, [events]);
```

Instead of repeatedly searching the complete event array for every calendar cell, events are indexed by date.

---

### 3. useCallback

Event handlers use `useCallback()` to maintain stable function references.

Example:

```jsx
const handleDelete = useCallback(() => {
  onDelete(event.id);
}, [event.id, onDelete]);
```

This works particularly well with `React.memo()`.

---

## 🧠 Algorithmic Optimization

A naïve implementation might search all events for every calendar day:

```text
42 calendar cells × 10,000 events
= 420,000 comparisons
```

This project instead creates a `Map`:

```text
Date → Events
```

Example:

```text
2026-08-13 → [React Lecture]
2026-08-15 → [Project Meeting]
2026-08-18 → [Assignment Submission]
```

Calendar cells can then retrieve their events efficiently through map lookup.

This improves the efficiency of rendering large event datasets.

---

## 🖱️ Drag-and-Drop Architecture

The drag-and-drop workflow is:

```text
User selects EventCard
        ↓
onDragStart()
        ↓
Event ID stored in DataTransfer
        ↓
User drags event
        ↓
User drops event on CalendarDay
        ↓
onDrop()
        ↓
Event ID retrieved
        ↓
updateEvent()
        ↓
PUT /api/events/:id
        ↓
React state updated
        ↓
Calendar re-renders
```

This demonstrates event-driven UI design and state synchronization.

---

## 🌐 API Architecture

The application separates API communication from UI components.

```text
React Components
       ↓
useEvents()
       ↓
eventService.js
       ↓
REST API
       ↓
MSW Mock Server
```

Supported endpoints:

| Method   | Endpoint          | Purpose      |
| -------- | ----------------- | ------------ |
| `GET`    | `/api/events`     | Fetch events |
| `POST`   | `/api/events`     | Create event |
| `PUT`    | `/api/events/:id` | Update event |
| `DELETE` | `/api/events/:id` | Delete event |

---

## 🧪 Testing Strategy

The project uses a combination of unit and integration-oriented tests.

### Unit Tests

Individual components and utilities are tested:

* `EventCard`
* `EventForm`
* `calendarUtils`

### Hook/API Tests

`useEvents` tests:

* Loading events
* Creating events
* Updating events
* Deleting events

### Calendar Tests

The calendar tests:

* Event rendering
* Navigation controls
* Date selection
* Loading state

---

## 📈 Performance Profiling

React Developer Tools can be used to analyze rendering behavior.

Open:

```text
React Developer Tools
        ↓
Profiler
        ↓
Record
        ↓
Interact with calendar
```

Try:

1. Navigate between months.
2. Add an event.
3. Delete an event.
4. Drag an event to another date.
5. Observe which components re-render.

`EventCard` also contains a render log:

```jsx
console.log(`EventCard rendered: ${event.title}`);
```

This allows render behavior to be observed directly in the browser console.

---

## 🔄 System-Level Integration

```text
┌───────────────────────────┐
│      Calendar UI          │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ User Interaction          │
│ Click / Drag / Drop       │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ React State               │
│ useEvents()               │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ Performance Optimization  │
│ memo / useMemo / callback │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ API Service               │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ MSW Mock REST API         │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ Testing & Validation      │
│ Vitest + RTL              │
└───────────────────────────┘
```

---

## 📋 Experiment Requirements Covered

| Requirement             | Implementation |
| ----------------------- | -------------- |
| Interactive Calendar    | ✅              |
| Event-driven UI         | ✅              |
| Dynamic event rendering | ✅              |
| Drag-and-drop           | ✅              |
| State synchronization   | ✅              |
| `React.memo`            | ✅              |
| `useMemo`               | ✅              |
| `useCallback`           | ✅              |
| Re-render analysis      | ✅              |
| Performance profiling   | ✅              |
| API mocking             | ✅              |
| MSW                     | ✅              |
| Unit testing            | ✅              |
| Integration testing     | ✅              |
| Test coverage           | ✅              |
| Responsive UI           | ✅              |

---

## 🎓 Academic Concepts Demonstrated

This experiment demonstrates concepts from:

* **React Rendering Model**
* **Virtual DOM and Reconciliation**
* **Memoization**
* **Computational Efficiency**
* **Event-Driven UI Design**
* **State Management**
* **Algorithmic Optimization**
* **REST API Architecture**
* **Mocking and Isolated Testing**
* **Software Quality Assurance**
* **Performance Engineering**
* **Human-Computer Interaction**

---

## 📸 Application Preview

Add screenshots of the running application here:

```markdown
![Interactive Calendar](screenshots/calendar.png)
```

Recommended screenshots:

1. Main calendar
2. Add Event form
3. Drag-and-drop interaction
4. Browser console showing render logs
5. Vitest test results
6. React DevTools Profiler

---

## 🚀 Future Improvements

Possible extensions include:

* User authentication
* Persistent database
* Real backend API
* Multiple calendar views
* Weekly and daily views
* Recurring events
* Event categories
* Color-coded events
* Search and filtering
* Notifications and reminders
* Real-time synchronization using WebSockets
* Virtualized rendering for extremely large datasets

---

## 👨‍💻 Author

**Swayam Rawat**

BE CSE — Artificial Intelligence & Machine Learning

---

## 📄 License

This project is created for **academic and educational purposes** as part of the Interactive Calendar Optimization & Testing experiment.
