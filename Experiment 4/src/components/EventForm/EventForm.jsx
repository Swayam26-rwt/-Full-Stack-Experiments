import { useState } from "react";

function EventForm({ selectedDate, onSubmit, onClose }) {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(selectedDate || today);
  const [time, setTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        date,
        time,
        description: description.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="modal-heading">
            <div>
              <div className="eyebrow">Schedule</div>
              <h2 id="event-form-title">Create Event</h2>
            </div>
            <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          <label>
            Event Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
              autoFocus
            />
          </label>

          <div className="form-row">
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label>
              Time
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows="4"
            />
          </label>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
