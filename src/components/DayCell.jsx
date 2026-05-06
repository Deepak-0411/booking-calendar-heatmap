import { getHeatmapColor } from "../utils/calendar";

export default function DayCell({
  dayObj,
  occupancy,
  isSelected,
  isToday,
  onMouseDown,
  onMouseEnter,
}) {
  const { date, dateStr, isCurrentMonth } = dayObj;

  const heatColor = isCurrentMonth
    ? getHeatmapColor(occupancy)
    : "bg-slate-50 text-slate-300";

  return (
    <div
      data-date={dateStr}
      onMouseDown={() => onMouseDown(dateStr)}
      onMouseEnter={() => onMouseEnter(dateStr)}
      className={`
        relative h-20 p-2 rounded-md cursor-pointer select-none
        border border-slate-100 transition-colors duration-75
        ${isSelected ? "bg-blue-200 text-blue-900 border-blue-300" : heatColor}
      `}
    >
      <span
        className={`text-sm ${isToday ? "font-bold underline underline-offset-2" : ""}`}
      >
        {date.getDate()}
      </span>

      {isCurrentMonth && occupancy > 0 && !isSelected && (
        <span className="absolute bottom-2 right-2 text-xs font-medium opacity-70">
          {occupancy}/10
        </span>
      )}
    </div>
  );
}
