import React from "react";

const CalendarHeader = React.memo(function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
}) {
  const title = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-header">
      <div className="calendar-navigation">
        <button
          className="icon-btn"
          onClick={onPrevious}
          aria-label="Previous month"
        >
          ←
        </button>

        <button className="today-btn" onClick={onToday}>
          Today
        </button>

        <button
          className="icon-btn"
          onClick={onNext}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <h2>{title}</h2>

      <div className="header-note">42 cells • memoized</div>
    </div>
  );
});

export default CalendarHeader;
