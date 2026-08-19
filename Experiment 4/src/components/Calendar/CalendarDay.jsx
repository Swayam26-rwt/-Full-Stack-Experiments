import React, { useCallback } from "react";
import EventCard from "./EventCard";
import { formatDate } from "../../utils/calendarUtils";

const CalendarDay = React.memo(function CalendarDay({
  date,
  currentMonth,
  events,
  onUpdateEvent,
  onDeleteEvent,
  onDateSelect,
}) {
  const dateString = formatDate(date);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.currentTarget.classList.add("drop-target");
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.currentTarget.classList.remove("drop-target");
  }, []);

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      event.currentTarget.classList.remove("drop-target");

      const eventId = event.dataTransfer.getData("eventId");
      if (!eventId) return;

      await onUpdateEvent(eventId, { date: dateString });
    },
    [dateString, onUpdateEvent]
  );

  const handleDoubleClick = useCallback(() => {
    onDateSelect(dateString);
  }, [dateString, onDateSelect]);

  return (
    <div
      className={`calendar-day ${!currentMonth ? "outside-month" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={handleDoubleClick}
      data-testid={`day-${dateString}`}
      title="Double-click to create an event"
    >
      <div className="day-number">
        <span>{date.getDate()}</span>
        {events.length > 0 && (
          <span className="event-count">{events.length}</span>
        )}
      </div>

      <div className="events">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={onDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
});

export default CalendarDay;
