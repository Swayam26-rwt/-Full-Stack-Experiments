import React from "react";
import CalendarDay from "./CalendarDay";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = React.memo(function CalendarGrid({
  days,
  eventsByDate,
  onUpdateEvent,
  onDeleteEvent,
  onDateSelect,
}) {
  return (
    <>
      <div className="weekdays" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map(({ date, currentMonth }) => {
          const dateString = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-");

          return (
            <CalendarDay
              key={dateString}
              date={date}
              currentMonth={currentMonth}
              events={eventsByDate.get(dateString) || []}
              onUpdateEvent={onUpdateEvent}
              onDeleteEvent={onDeleteEvent}
              onDateSelect={onDateSelect}
            />
          );
        })}
      </div>
    </>
  );
});

export default CalendarGrid;
