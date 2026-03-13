import { useSagaStore } from '../../store/store';
import { yearDays, todayKey } from '../../utils/dateUtils';
import { getQuoteByCategory } from '../../utils/quotes';
import Heatmap from './Heatmap';
import EffortChart from './EffortChart';
import StatCard from './StatCard';
import { BookOpen, Sprout, Flame, TrendingUp, Compass } from 'lucide-react';

export default function TheMountainView() {
  const entries = useSagaStore((s) => s.entries);
  const habits = useSagaStore((s) => s.habits);

  const year = new Date().getFullYear();
  const days = yearDays(year);
  const today = todayKey();

  /* ─── Build heatmap data ─── */
  const entryDates = new Set(entries.map((e) => new Date(e.timestamp).toISOString().slice(0, 10)));
  const habitDoneDates: Record<string, number> = {};
  habits.forEach((h) => {
    Object.keys(h.log).forEach((d) => {
      if (h.log[d]) habitDoneDates[d] = (habitDoneDates[d] || 0) + 1;
    });
  });

  const heatmapData = days.map((d) => {
    const score = (entryDates.has(d) ? 2 : 0) + (habitDoneDates[d] || 0);
    return { date: d, value: score };
  });

  /* ─── Stats ─── */
  const totalEntries = entries.length;
  const totalHabitDone = Object.values(habitDoneDates).reduce((a, b) => a + b, 0);
  const activeDays = new Set([
    ...Array.from(entryDates),
    ...Object.keys(habitDoneDates),
  ]).size;

  // Current streak
  let streak = 0;
  const d = new Date(today);
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (entryDates.has(key) || habitDoneDates[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  /* ─── Effort chart (last 30 days cumulative) ─── */
  const last30: { date: string; effort: number }[] = [];
  let cumulative = 0;
  for (let i = 29; i >= 0; i--) {
    const nd = new Date();
    nd.setDate(nd.getDate() - i);
    const key = nd.toISOString().slice(0, 10);
    const dayScore = (entryDates.has(key) ? 2 : 0) + (habitDoneDates[key] || 0);
    cumulative += dayScore;
    last30.push({ date: key.slice(5), effort: cumulative });
  }

  return (
    <section>
      {/* Chapter banner */}
      <div className="relative mb-4 sm:mb-6 py-3 sm:py-5 px-4 sm:px-6 rounded-xl overflow-hidden border border-saga-steel/10">
        <div className="absolute inset-0 bg-gradient-to-r from-saga-steel/[0.08] via-saga-ocean/[0.04] to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-saga-steel/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-saga-steel/10 flex items-center justify-center">
              <Compass size={13} strokeWidth={1.5} className="text-saga-steel" />
            </div>
            <span className="font-cinzel text-micro tracking-[0.25em] text-saga-steel/70 uppercase">Chapter III — The Mountain</span>
          </div>
          <p className="font-fell italic text-[13px] text-saga-caption leading-relaxed max-w-lg">
            &ldquo;{getQuoteByCategory('ambition').text}&rdquo;
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="s-heading">The Mountain</h2>
        <p className="s-subtitle">Like Musashi surveying the valley — step back and see how far you&apos;ve climbed.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 mb-6 sm:mb-8">
        <StatCard icon={BookOpen} label="Journal Entries" value={totalEntries} color="crimson" />
        <StatCard icon={Sprout} label="Habits Completed" value={totalHabitDone} color="forest" />
        <StatCard icon={Flame} label="Current Streak" value={`${streak}d`} color="gold" />
        <StatCard icon={TrendingUp} label="Active Days" value={activeDays} color="steel" />
      </div>

      {/* Heatmap */}
      <div className="s-card mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-saga-forest/[0.02] via-transparent to-saga-crimson/[0.02]" />
        <div className="relative">
          <h3 className="s-section-label mb-4">{year} Contribution Map</h3>
          <Heatmap data={heatmapData} />
        </div>
      </div>

      {/* Chart */}
      <div className="s-card mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-saga-crimson/[0.02] to-saga-gold/[0.02]" />
        <div className="relative">
          <h3 className="s-section-label mb-4">Cumulative Effort — Last 30 Days</h3>
          <EffortChart data={last30} />
        </div>
      </div>

      {/* Closing motif */}
      <div className="text-center py-6">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-saga-crimson/30 to-transparent mx-auto mb-4" />
        <p className="font-fell italic text-xs text-saga-caption/60 leading-relaxed max-w-sm mx-auto">
          &ldquo;The mountain doesn&apos;t move. But the man who climbs it changes.&rdquo;
        </p>
        <span className="font-cinzel text-micro tracking-[0.2em] text-saga-faint/40 block mt-1">
          Musashi — Vagabond
        </span>
      </div>
    </section>
  );
}
