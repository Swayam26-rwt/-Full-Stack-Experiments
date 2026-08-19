export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDate(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

export function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    days.push({
      date: new Date(year, month - 1, daysInPreviousMonth - i),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextDay = 1;
  while (days.length < 42) {
    days.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });
    nextDay += 1;
  }

  return days;
}
