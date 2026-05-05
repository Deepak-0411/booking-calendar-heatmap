import { useMemo } from "react";
import { getCalendarDays, DAY_LABELS } from "../utils/calendar";
import { buildOccupancyMap, toDateStr } from "../utils/occupancy";
import DayCell from "./DayCell";

export default function CalendarGrid({ year, month, bookings }) {
  const today = toDateStr(new Date());

  // Recomputes only when bookings or month changes — not on every render
  const occupancyMap = useMemo(
    () => buildOccupancyMap(bookings, year, month),
    [bookings, year, month],
  );

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  return (
    <div>
      {/* Day labels header */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-slate-400 py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj) => (
          <DayCell
            key={dayObj.dateStr}
            dayObj={dayObj}
            occupancy={occupancyMap[dayObj.dateStr] ?? 0}
            isSelected={false}
            isToday={dayObj.dateStr === today}
          />
        ))}
      </div>
    </div>
  );
}
