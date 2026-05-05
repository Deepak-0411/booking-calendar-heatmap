// checkIn inclusive, checkOut exclusive
// "2026-02-10" >= "2026-02-10" && "2026-02-10" < "2026-02-13" → true
export function bookingOccupiesDate(booking, dateStr) {
  if (booking.status === "cancelled") return false;
  return dateStr >= booking.checkIn && dateStr < booking.checkOut;
}

// Returns occupancy count (0–10) for a given date string
export function getOccupancy(dateStr, bookings) {
  let count = 0;
  for (const b of bookings) {
    if (bookingOccupiesDate(b, dateStr)) count++;
  }
  return count;
}

// Precompute a Map of { "YYYY-MM-DD" → occupancyCount } for an entire month
// Call this ONCE when bookings load or month changes, not per cell
export function buildOccupancyMap(bookings, year, month) {
  const map = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = toDateStr(new Date(year, month, day));
    map[dateStr] = 0;
  }

  for (const b of bookings) {
    if (b.status === "cancelled") continue;
    for (const dateStr of Object.keys(map)) {
      if (dateStr >= b.checkIn && dateStr < b.checkOut) {
        map[dateStr]++;
      }
    }
  }

  return map;
}

// Returns bookings overlapping [startStr, endStr] — includes cancelled (shown with badge in panel)
// Overlap condition: booking starts before range ends AND booking ends after range starts
export function getBookingsInRange(startStr, endStr, bookings) {
  const result = [];
  for (const b of bookings) {
    if (b.checkIn <= endStr && b.checkOut > startStr) {
      result.push(b);
    }
  }
  return result;
}

// Date → "YYYY-MM-DD"
export function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "2026-02-10" and "2026-02-13" → 3 nights
export function nightsBetween(checkIn, checkOut) {
  const ONEDAY = 86400000; //1000 * 60 * 60 * 24
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.round((d2 - d1) / ONEDAY);
}
