import { useState } from "react";
import { useBookings } from "./hooks/useBookings";
import { useCalendar } from "./hooks/useCalendar";
import MonthNav from "./components/MonthNav";
import CalendarGrid from "./components/CalendarGrid";
import BookingPanel from "./components/BookingPanel";
import StatsStrip from "./components/StatsStrip";

export default function App() {
  const { bookings, loading, error, retry } = useBookings();
  const { year, month, prevMonth, nextMonth, goToToday, monthLabel } =
    useCalendar();
  const [selection, setSelection] = useState(null);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading bookings...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
        >
          Try again
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Occupancy Calendar
        </h1>

        <StatsStrip bookings={bookings} year={year} month={month} />

        {/* flex items-start keeps both columns anchored to top */}
        <div className="flex gap-6 items-start">
          {/* Calendar */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <MonthNav
              monthLabel={monthLabel}
              onPrev={prevMonth}
              onNext={nextMonth}
              onToday={goToToday}
            />
            <CalendarGrid
              year={year}
              month={month}
              bookings={bookings}
              selection={selection}
              onSelectionChange={setSelection}
              onNextMonth={nextMonth}
              onPrevMonth={prevMonth}
            />
          </div>

          {/* Panel — fixed height, internal scroll only */}
          <div className="w-80 h-[39.1rem] bg-white rounded-xl shadow-sm p-6 sticky top-8 overflow-y-auto">
            <BookingPanel
              selection={selection}
              bookings={bookings}
              onClearSelection={() => setSelection(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
