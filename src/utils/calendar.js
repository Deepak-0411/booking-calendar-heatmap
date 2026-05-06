import { toDateStr } from "./occupancy";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Returns 42 day objects to fill the calendar grid
// Includes padding days from prev/next month so the grid is always a clean rectangle
export function getCalendarDays(year, month) {
  const days = [];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Padding from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    days.push({ dateStr: toDateStr(date), date, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({ dateStr: toDateStr(date), date, isCurrentMonth: true });
  }

  // Padding from next month to complete the last row
  let nextDay = 1;
  while (days.length < 42) {
    const date = new Date(year, month + 1, nextDay++);
    days.push({
      dateStr: toDateStr(date),
      date,
      isCurrentMonth: false,
    });
  }

  return days;
}

export function normalizeRange(a, b) {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

export function isInRange(dateStr, start, end) {
  return dateStr >= start && dateStr <= end;
}

// Returns bg color class based on occupancy out of 10 rooms
export function getHeatmapColor(occupancy) {
  if (occupancy === 0) return "bg-slate-50  text-slate-400";
  if (occupancy <= 2) return "bg-blue-100  text-blue-800";
  if (occupancy <= 4) return "bg-teal-100  text-teal-800";
  if (occupancy <= 6) return "bg-yellow-100 text-yellow-800";
  if (occupancy <= 8) return "bg-orange-200 text-orange-900";
  return "bg-red-400    text-white";
}

export { DAY_LABELS };
