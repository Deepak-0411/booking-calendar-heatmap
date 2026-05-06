import { useMemo } from "react";
import { getBookingsInRange, nightsBetween } from "../utils/occupancy";

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  pending: "bg-yellow-100 text-yellow-700",
};

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingPanel({ selection, bookings }) {
  const results = useMemo(() => {
    if (!selection) return [];
    return getBookingsInRange(selection.start, selection.end, bookings);
  }, [selection, bookings]);

  // No selection yet
  if (!selection) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2 py-16">
        <span className="text-3xl">📅</span>
        <p>Click or drag on the calendar</p>
        <p>to see bookings</p>
      </div>
    );
  }

  const isSingleDay = selection.start === selection.end;
  const rangeLabel = isSingleDay
    ? formatDate(selection.start)
    : `${formatDate(selection.start)} → ${formatDate(selection.end)}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
          {isSingleDay ? "Bookings on" : "Bookings in range"}
        </p>
        <p className="text-sm font-medium text-slate-700">{rangeLabel}</p>
        <p className="text-xs text-slate-400 mt-1">
          {results.length} booking{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Empty state */}
      {results.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-sm gap-1 py-8">
          <span className="text-2xl">🌙</span>
          <p>No bookings for this period</p>
        </div>
      )}

      {/* Booking cards */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {results.map((booking) => (
          <div
            key={booking.id}
            className={`rounded-lg border p-3 text-sm ${
              booking.status === "cancelled"
                ? "border-slate-200 opacity-60"
                : "border-slate-200"
            }`}
          >
            {/* Guest + status */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-800">
                {booking.guestName}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[booking.status] ?? "bg-slate-100 text-slate-600"}`}
              >
                {booking.status}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>Room</span>
              <span className="text-slate-700 font-medium">
                #{booking.roomNumber} · {booking.roomType}
              </span>

              <span>Check-in</span>
              <span className="text-slate-700">
                {formatDate(booking.checkIn)}
              </span>

              <span>Check-out</span>
              <span className="text-slate-700">
                {formatDate(booking.checkOut)}
              </span>

              <span>Nights</span>
              <span className="text-slate-700">
                {nightsBetween(booking.checkIn, booking.checkOut)}
              </span>

              {booking.source && (
                <>
                  <span>Source</span>
                  <span className="text-slate-700">{booking.source}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
