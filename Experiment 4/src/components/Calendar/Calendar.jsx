import { useCallback, useMemo, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import { getMonthDays } from "../../utils/calendarUtils";
import Loading from "../UI/Loading";

function Calendar({
  events,
  loading,
  onUpdateEvent,
  onDeleteEvent,
  onDateSelect,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // useMemo: calendar calculations are performed only when month/year changes.
  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  // useMemo: build an index once instead of filtering the whole event list
  // for every calendar cell.
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

  const previousMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="calendar" aria-label="Interactive calendar">
      <CalendarHeader
        currentDate={currentDate}
        onPrevious={previousMonth}
        onNext={nextMonth}
        onToday={goToToday}
      />

      <CalendarGrid
        days={days}
        eventsByDate={eventsByDate}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
        onDateSelect={onDateSelect}
      />
    </section>
  );
}

export default Calendar;
