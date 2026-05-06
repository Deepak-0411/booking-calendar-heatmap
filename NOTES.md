## Open scope features

### Stats strip

Shows avg occupancy, total revenue, peak night, longest stay, and top room
type for the visible month. Updates on every month change via useMemo.
Chose this because a front desk manager needs month-level numbers at a
glance — colors alone aren't enough.

### Hover tooltip

Hovering a cell shows the date, occupancy count, and which room numbers
are occupied. Chose this because drag-selecting just to peek at one day
is too heavy — a tooltip makes scanning fast.

## Trade-offs

- Auto-advance month while dragging was considered but removed — it caused
  jarring navigation jumps during drag and the brief only requires dragging
  onto the dimmed prev/next cells which already works.

- buildMonthData does a single pass to build both occupancyMap and roomsMap
  instead of two separate loops. Keeps the O(n) cost once per month change.

- Selection state lives in App so both CalendarGrid and BookingPanel share
  it without prop drilling through unrelated components.

## What I'd do with more time

- Filtering by room type, source, or status with heatmap updating live
- Keyboard navigation (arrow keys + shift to extend selection)
- CSV export for selected range
- A timeline/Gantt view per room alongside the calendar
