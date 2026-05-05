export default function MonthNav({ monthLabel, onPrev, onNext, onToday }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-slate-800">{monthLabel}</h2>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm"
        >
          ← Prev
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm"
        >
          Today
        </button>
        <button
          onClick={onNext}
          className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
