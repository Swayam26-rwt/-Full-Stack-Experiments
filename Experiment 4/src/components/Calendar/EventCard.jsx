import React, { useCallback } from "react";

const EventCard = React.memo(function EventCard({ event, onDelete }) {
  // Keep this console statement for React DevTools/render analysis.
  console.log(`EventCard rendered: ${event.title}`);

  const handleDragStart = useCallback(
    (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("eventId", String(event.id));
    },
    [event.id]
  );

  const handleDelete = useCallback(() => {
    onDelete(event.id);
  }, [event.id, onDelete]);

  return (
    <article
      className="event-card"
      draggable
      onDragStart={handleDragStart}
      data-testid={`event-${event.id}`}
    >
      <div className="event-title">{event.title}</div>
      <div className="event-time">{event.time}</div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        aria-label={`Delete ${event.title}`}
        title="Delete event"
      >
        ×
      </button>
    </article>
  );
});

export default EventCard;
