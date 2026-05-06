import { useMemo, useState, useEffect, useCallback } from "react";
import {
  getCalendarDays,
  DAY_LABELS,
  normalizeRange,
  isInRange,
} from "../utils/calendar";
import { buildMonthData, toDateStr } from "../utils/occupancy";
import DayCell from "./DayCell";

export default function CalendarGrid({
  year,
  month,
  bookings,
  selection,
  onSelectionChange,
}) {
  const today = toDateStr(new Date());

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);

  // Single pass for both maps
  const { occupancyMap, roomsMap } = useMemo(
    () => buildMonthData(bookings, year, month),
    [bookings, year, month],
  );

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const finalizeDrag = useCallback(() => {
    if (dragStart) {
      const range = normalizeRange(dragStart, dragEnd ?? dragStart);
      onSelectionChange(range);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [dragStart, dragEnd, onSelectionChange]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mouseup", finalizeDrag);
    return () => window.removeEventListener("mouseup", finalizeDrag);
  }, [isDragging, finalizeDrag]);

  function handleMouseDown(dateStr) {
    setIsDragging(true);
    setDragStart(dateStr);
    setDragEnd(dateStr);
  }

  function handleMouseEnter(dateStr) {
    if (!isDragging) return;
    setDragEnd(dateStr);
  }

  // During drag show live range, after drag show finalized selection from App
  const displayRange =
    isDragging && dragStart
      ? normalizeRange(dragStart, dragEnd ?? dragStart)
      : selection;

  return (
    <div className="select-none">
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
            rooms={roomsMap[dayObj.dateStr] ?? []}
            isSelected={
              displayRange
                ? isInRange(
                    dayObj.dateStr,
                    displayRange.start,
                    displayRange.end,
                  )
                : false
            }
            isToday={dayObj.dateStr === today}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => handleMouseEnter(dayObj.dateStr)}
          />
        ))}
      </div>
    </div>
  );
}
