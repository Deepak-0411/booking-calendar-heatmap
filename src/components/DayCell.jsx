import { useState } from "react";
import { getHeatmapColor } from "../utils/calendar";

export default function DayCell({
  dayObj,
  occupancy,
  rooms,
  isSelected,
  isToday,
  onMouseDown,
  onMouseEnter,
}) {
  const { date, dateStr, isCurrentMonth } = dayObj;
  const [showTooltip, setShowTooltip] = useState(false);

  const heatColor = isCurrentMonth
    ? getHeatmapColor(occupancy)
    : "bg-slate-50 text-slate-300";

  return (
    <div
      data-date={dateStr}
      onMouseDown={() => onMouseDown(dateStr)}
      onMouseEnter={(e) => {
        onMouseEnter(dateStr);
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
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

      {/* Tooltip */}
      {showTooltip && isCurrentMonth && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
          <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <p className="font-medium mb-1">
              {date.toLocaleDateString("default", {
                month: "short",
                day: "numeric",
              })}
            </p>
            {occupancy === 0 ? (
              <p className="text-slate-400">No rooms occupied</p>
            ) : (
              <>
                <p className="text-slate-300">{occupancy}/10 rooms</p>
                <p className="text-slate-400 mt-0.5">
                  #{rooms.slice(0, 5).join(", ")}
                  {rooms.length > 5 ? ` +${rooms.length - 5}` : ""}
                </p>
              </>
            )}
          </div>
          {/* Arrow */}
          <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}
