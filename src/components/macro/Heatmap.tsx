import clsx from 'clsx';

interface HeatmapProps {
  data: { date: string; value: number }[];
}

const COLORS = [
  'bg-saga-surface',               // 0 — empty
  'bg-saga-forest/20',             // 1 — light
  'bg-saga-forest/40',             // 2 — medium  
  'bg-saga-forest/65',             // 3 — warm
  'bg-saga-crimson/70',            // 4+ — hot
];

function getColor(v: number) {
  if (v === 0) return COLORS[0];
  if (v === 1) return COLORS[1];
  if (v === 2) return COLORS[2];
  if (v <= 4) return COLORS[3];
  return COLORS[4];
}

export default function Heatmap({ data }: HeatmapProps) {
  // Group by week (7 rows, ~53 columns)
  const weeks: { date: string; value: number }[][] = [];
  let currentWeek: { date: string; value: number }[] = [];

  // Pad to start on the correct day of week
  const firstDate = new Date(data[0]?.date || '2025-01-01');
  const startPad = firstDate.getDay(); // 0=Sun
  for (let i = 0; i < startPad; i++) {
    currentWeek.push({ date: '', value: -1 });
  }

  data.forEach((d) => {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Compute which week-column each month starts in
  const monthMarkers: { month: number; weekIdx: number }[] = [];
  let prevMonth = -1;
  weeks.forEach((week, wi) => {
    for (const day of week) {
      if (!day.date) continue;
      const m = new Date(day.date).getMonth();
      if (m !== prevMonth) {
        monthMarkers.push({ month: m, weekIdx: wi });
        prevMonth = m;
        break;
      }
    }
  });

  const cellSize = 10; // w-2.5 = 10px
  const gap = 2;
  const step = cellSize + gap;
  const dayLabelWidth = 14; // day labels column + margin

  return (
    <div className="overflow-x-auto">
      {/* Month labels — positioned at actual week column */}
      <div className="relative mb-1" style={{ marginLeft: dayLabelWidth, height: 14 }}>
        {monthMarkers.map(({ month, weekIdx }, i) => {
          // On narrow screens, skip every other label to avoid cluttering
          const nextIdx = monthMarkers[i + 1]?.weekIdx ?? weeks.length;
          const colSpan = nextIdx - weekIdx;
          const tooNarrow = colSpan < 4; // less than 4 weeks — skip on mobile
          return (
            <span
              key={month}
              className={clsx(
                'absolute font-mono text-saga-faint tracking-wider',
                'text-[8px] sm:text-micro',
                tooNarrow && 'hidden sm:inline'
              )}
              style={{ left: weekIdx * step }}
            >
              {MONTH_NAMES[month]}
            </span>
          );
        })}
      </div>

      <div className="flex gap-[2px]">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-1 shrink-0">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i} className="font-mono text-micro text-saga-faint h-2.5 leading-[10px]">
              {i % 2 === 1 ? d : ''}
            </span>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={clsx(
                  'w-2.5 h-2.5 rounded-[2px] transition-colors',
                  day.value < 0 ? 'bg-transparent' : getColor(day.value)
                )}
                title={day.date ? `${day.date}: ${day.value} pts` : ''}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 justify-end">
        <span className="font-mono text-micro text-saga-faint mr-1">Less</span>
        {COLORS.map((c, i) => (
          <div key={i} className={clsx('w-2.5 h-2.5 rounded-[2px]', c)} />
        ))}
        <span className="font-mono text-micro text-saga-faint ml-1">More</span>
      </div>
    </div>
  );
}
