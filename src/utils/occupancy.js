// checkIn inclusive, checkOut exclusive
// "2026-02-10" >= "2026-02-10" && "2026-02-10" < "2026-02-13" → true
export function bookingOccupiesDate(booking, dateStr) {
  if (booking.status === "cancelled") return false;
  return dateStr >= booking.checkIn && dateStr < booking.checkOut;
}

export function buildMonthData(bookings, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const occupancyMap = {}; //how many rooms occupied each day
  const roomsMap = {}; //which room numbers occupied each day

  //   occupancyMap: {
  //     "2026-02-10": 3,
  //     "2026-02-11": 5
  //   },
  //   roomsMap: {
  //     "2026-02-10": [101, 203, 305],
  //     "2026-02-11": [101, 102, 203, 305, 401]
  //   }

  // Month bounds
  const monthStart = toDateStr(new Date(year, month, 1)); // inclusive
  const monthEndExclusive = toDateStr(new Date(year, month, daysInMonth + 1)); // exclusive

  // Pre-fill all days so calendar can render empty dates too
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = toDateStr(new Date(year, month, d));
    occupancyMap[dateStr] = 0;
    roomsMap[dateStr] = [];
  }

  for (const b of bookings) {
    if (b.status === "cancelled") continue;

    // Skip bookings completely outside this month
    if (b.checkIn >= monthEndExclusive || b.checkOut <= monthStart) continue;

    // Clamp booking to visible month window
    const startStr = b.checkIn > monthStart ? b.checkIn : monthStart;
    const endStr =
      b.checkOut < monthEndExclusive ? b.checkOut : monthEndExclusive;

    // Walk only the dates this booking actually occupies
    const dt = new Date(startStr);
    const end = new Date(endStr);

    while (dt < end) {
      const dateStr = toDateStr(dt);
      occupancyMap[dateStr]++;
      roomsMap[dateStr].push(b.roomNumber);
      dt.setDate(dt.getDate() + 1);
    }
  }

  return { occupancyMap, roomsMap };
}

// Computes month-level stats for the StatsStrip
export function buildMonthStats(bookings, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStart = toDateStr(new Date(year, month, 1)); // inclusive
  const monthEndExclusive = toDateStr(new Date(year, month, daysInMonth + 1)); // exclusive

  // Build once, reuse for occupancy stats
  const { occupancyMap } = buildMonthData(bookings, year, month);
  const dailyCounts = Object.values(occupancyMap);

  const totalOccupancy = dailyCounts.reduce((sum, n) => sum + n, 0);
  const peakOccupancy = dailyCounts.length ? Math.max(...dailyCounts) : 0;

  let totalRevenue = 0;
  let longestStay = 0;
  const roomTypeCounts = {};

  for (const b of bookings) {
    if (b.status === "cancelled") continue;

    // Skip bookings completely outside this month
    if (b.checkIn >= monthEndExclusive || b.checkOut <= monthStart) continue;

    totalRevenue += b.totalAmount ?? 0;
    roomTypeCounts[b.roomType] = (roomTypeCounts[b.roomType] ?? 0) + 1;

    const nights = nightsBetween(b.checkIn, b.checkOut);
    if (nights > longestStay) longestStay = nights;
  }

  // Assumes hotel has 10 total rooms
  const avgOccupancy = Math.round((totalOccupancy / (daysInMonth * 10)) * 100);

  const topRoomType =
    Object.entries(roomTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return {
    avgOccupancy,
    totalRevenue,
    peakOccupancy,
    longestStay,
    topRoomType,
  };
}

export function getBookingsInRange(startStr, endStr, bookings) {
  const result = [];
  for (const b of bookings) {
    if (b.checkIn <= endStr && b.checkOut > startStr) result.push(b);
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

export function nightsBetween(checkIn, checkOut) {
  const ONEDAY = 86400000; //1000 * 60 * 60 * 24
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.round((d2 - d1) / ONEDAY);
}
