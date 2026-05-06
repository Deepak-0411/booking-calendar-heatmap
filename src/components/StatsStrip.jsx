import { useMemo } from "react";
import { buildMonthStats } from "../utils/occupancy";

function Stat({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xl font-semibold text-slate-800">{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

export default function StatsStrip({ bookings, year, month }) {
  const stats = useMemo(
    () => buildMonthStats(bookings, year, month),
    [bookings, year, month],
  );

  const revenue = stats.totalRevenue.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-white rounded-xl shadow-sm px-6 py-4 mb-6">
      <Stat
        label="Avg occupancy"
        value={`${stats.avgOccupancy}%`}
        sub="of 10 rooms"
      />
      <Stat label="Total revenue" value={revenue} sub="confirmed only" />
      <Stat
        label="Peak night"
        value={`${stats.peakOccupancy}/10`}
        sub="rooms occupied"
      />
      <Stat label="Longest stay" value={`${stats.longestStay}n`} sub="nights" />
      <Stat label="Top room type" value={stats.topRoomType} sub="most booked" />
    </div>
  );
}
