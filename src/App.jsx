import { useState } from "react";
import { useBookings } from "./hooks/useBookings";
import { useCalendar } from "./hooks/useCalendar";
import MonthNav from "./components/MonthNav";
import CalendarGrid from "./components/CalendarGrid";

export default function App() {
  const { bookings, loading, error } = useBookings();
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
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Occupancy Calendar
        </h1>
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
        />
      </div>
    </div>
  );
}
