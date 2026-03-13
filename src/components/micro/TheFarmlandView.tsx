import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sprout, Wheat } from 'lucide-react';
import { getQuoteByCategory } from '../../utils/quotes';
import { useSagaStore } from '../../store/store';
import { getHabitIcon } from '../../utils/habitIcons';
import { todayKey, lastNDays } from '../../utils/dateUtils';
import AddHabitModal from './AddHabitModal';
import clsx from 'clsx';

export default function TheFarmlandView() {
  const habits = useSagaStore((s) => s.habits);
  const toggleHabit = useSagaStore((s) => s.toggleHabit);
  const removeHabit = useSagaStore((s) => s.removeHabit);
  const [modalOpen, setModalOpen] = useState(false);

  const today = todayKey();
  const days = lastNDays(14);
  const completedToday = habits.filter((h) => h.log[today]).length;
  const total = habits.length;

  return (
    <section>
      {/* Chapter banner */}
      <div className="relative mb-4 sm:mb-6 py-3 sm:py-5 px-4 sm:px-6 rounded-xl overflow-hidden border border-saga-forest/10">
        <div className="absolute inset-0 bg-gradient-to-r from-saga-forest/[0.08] via-saga-moss/[0.04] to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-saga-forest/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-saga-forest/10 flex items-center justify-center">
              <Wheat size={13} strokeWidth={1.5} className="text-saga-forest" />
            </div>
            <span className="font-cinzel text-micro tracking-[0.25em] text-saga-forest/70 uppercase">Chapter II — The Farmland</span>
          </div>
          <p className="font-fell italic text-[13px] text-saga-caption leading-relaxed max-w-lg">
            &ldquo;{getQuoteByCategory('farmland').text}&rdquo;
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h2 className="s-heading">The Farmland</h2>
          <p className="s-subtitle">Thorfinn traded his blade for a hoe. Plant your seeds daily.</p>
        </div>
        <motion.button
          onClick={() => setModalOpen(true)}
          className="s-btn-forest w-full sm:w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={14} /> NEW HABIT
        </motion.button>
      </div>

      {/* Today's progress */}
      {total > 0 && (
        <div className="s-card mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-saga-forest/[0.03] to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="s-section-label text-saga-forest/70">Today&apos;s Harvest</span>
              <span className="font-mono text-xs font-semibold text-saga-forest">{completedToday}/{total}</span>
            </div>
            <div className="s-progress-track">
              <motion.div
                className="s-progress-fill-forest"
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (completedToday / total) * 100 : 0}%` }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {habits.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Sprout size={36} strokeWidth={1} className="text-saga-faint/60 mb-5" />
          <p className="font-cinzel text-sm text-saga-caption tracking-wider mb-1.5">
            No seeds planted yet
          </p>
          <p className="font-fell italic text-xs text-saga-faint max-w-xs leading-relaxed">
            Plant your first habit seed and watch it grow through daily effort.
          </p>
        </motion.div>
      )}

      {/* Habit list */}
      <div className="space-y-3">
        {habits.map((habit, i) => {
          const doneToday = !!habit.log[today];
          const streak = getStreak(habit.log, today);

          const HabitIcon = getHabitIcon(habit.icon);

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={clsx(
                's-card transition-all duration-200',
                doneToday && 'border-saga-forest/30 shadow-sm'
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3">
                {/* Toggle today */}
                <motion.button
                  onClick={() => toggleHabit(habit.id, today)}
                  className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'transition-all cursor-pointer',
                    doneToday
                      ? 'bg-saga-forest/10 border-2 border-saga-forest/40 shadow-sm text-saga-forest'
                      : 'bg-saga-surface border-2 border-saga-border hover:border-saga-forest/30 text-saga-caption'
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  <HabitIcon size={20} strokeWidth={1.5} />
                </motion.button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[13px] text-saga-ink tracking-wide">
                      {habit.name}
                    </span>
                    {doneToday && <span className="s-badge-forest">DONE</span>}
                  </div>
                  {streak > 0 && (
                    <span className="font-mono text-tiny tracking-wide">
                      <span className="text-saga-gold">✧</span>{' '}
                      <span className="text-saga-gold font-semibold">{streak} day streak</span>
                    </span>
                  )}
                </div>

                <button onClick={() => removeHabit(habit.id)} className="s-btn-danger-text">
                  REMOVE
                </button>
              </div>

              {/* 14-day trail */}
              <div className="flex gap-0.5 sm:gap-1">
                {days.map((day) => {
                  const done = !!habit.log[day];
                  const isToday = day === today;
                  return (
                    <motion.button
                      key={day}
                      onClick={() => toggleHabit(habit.id, day)}
                      className={clsx(
                        'flex-1 h-3 sm:h-2.5 rounded-sm cursor-pointer transition-all',
                        isToday && 'ring-1 ring-saga-ink/20 ring-offset-1 ring-offset-saga-card',
                        done ? 'bg-saga-forest/60 shadow-sm' : 'bg-saga-surface hover:bg-saga-forest/15'
                      )}
                      whileHover={{ scale: 1.4 }}
                      title={day}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-micro font-mono text-saga-faint">14 days ago</span>
                <span className="text-micro font-mono text-saga-faint">today</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AddHabitModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

function getStreak(log: Record<string, boolean>, today: string): number {
  let streak = 0;
  const d = new Date(today);
  while (log[d.toISOString().slice(0, 10)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
