import { useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import EventForm from "./components/EventForm/EventForm";
import { useEvents } from "./hooks/useEvents";
import "./App.css";

function App() {
  const {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddEvent = async (eventData) => {
    try {
      await addEvent(eventData);
      setShowForm(false);
    } catch {
      // Error is already handled by useEvents.
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="eyebrow">Experiment 4 • 24BAI70336</div>
          <h1>Interactive Calendar-</h1>
          <p>
            Drag events between dates, create schedules, and observe optimized
            rendering.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setSelectedDate(null);
            setShowForm(true);
          }}
        >
          + Add Event
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="stat-card">
          <span>Optimization</span>
          <strong>memo + hooks</strong>
        </div>
        <div className="stat-card">
          <span>API</span>
          <strong>MSW Mock</strong>
        </div>
        <div className="stat-card">
          <span>Testing</span>
          <strong>Vitest</strong>
        </div>
      </section>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <EventForm
          selectedDate={selectedDate}
          onSubmit={handleAddEvent}
          onClose={() => setShowForm(false)}
        />
      )}

      <main>
        <Calendar
          events={events}
          loading={loading}
          onUpdateEvent={updateEvent}
          onDeleteEvent={deleteEvent}
          onDateSelect={handleDateSelect}
        />
      </main>

     
    </div>
  );
}

export default App;
