import { getHeatmapColor } from "../utils/calendar";

export default function DayCell({ dayObj, occupancy, isSelected, isToday }) {
  const { date, dateStr, isCurrentMonth } = dayObj;

  const heatColor = isCurrentMonth
    ? getHeatmapColor(occupancy)
    : "bg-slate-50 text-slate-300";
  const selectedStyle = isSelected ? "ring-2 ring-blue-500 ring-inset" : "";
  const todayStyle = isToday ? "font-bold underline underline-offset-2" : "";

  return (
    <div
      data-date={dateStr}
      className={`
        relative h-20 p-2 rounded-md cursor-pointer select-none
        border border-slate-100
        ${heatColor} ${selectedStyle}
      `}
    >
      <span className={`text-sm ${todayStyle}`}>{date.getDate()}</span>
      {isCurrentMonth && occupancy > 0 && (
        <span className="absolute bottom-2 right-2 text-xs font-medium opacity-70">
          {occupancy}/10
        </span>
      )}
    </div>
  );
}
