import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sprout, BookOpen, Activity } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';
import { getHabitIcon } from '../../utils/habitIcons';
import { yearDays, todayKey } from '../../utils/dateUtils';
import Heatmap from '../macro/Heatmap';
import type { Friend, Habit } from '../../store/store';
import clsx from 'clsx';

interface Props {
  friend: Friend;
  open: boolean;
  onClose: () => void;
}

export default function FriendActivityMap({ friend, open, onClose }: Props) {
  const { user } = useAuth();
  const getFriendActivity = useSagaStore((s) => s.getFriendActivity);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entryDates, setEntryDates] = useState<Record<string, number>>({});
  const [allHabitDates, setAllHabitDates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getFriendActivity(friend.profile.id, user.id).then((data) => {
        setHabits(data.habits);
        const ed: Record<string, number> = {};
        data.entries.forEach(({ date, count }) => { ed[date] = count; });
        setEntryDates(ed);
        setAllHabitDates(data.allHabitDates);
        setLoading(false);
      });
    }
  }, [open, friend.profile.id, user?.id]);

  const year = new Date().getFullYear();
  const days = yearDays(year);
  const today = todayKey();

  // Build heatmap from ALL activity (journal entries + ALL habit logs — not sharing-dependent)
  const heatmapData = days.map((d) => {
    const score = (entryDates[d] ? 2 : 0) + (allHabitDates[d] || 0);
    return { date: d, value: score };
  });

  // Stats use ALL activity (heatmap-level)
  const activeDays = new Set([
    ...Object.keys(entryDates),
    ...Object.keys(allHabitDates),
  ]).size;

  let streak = 0;
  const d = new Date(today);
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (entryDates[key] || allHabitDates[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  const displayName = friend.profile.display_name || friend.profile.username;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="s-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="s-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="s-overlay-header">
              <div>
                <h3 className="font-cinzel text-sm tracking-wider text-saga-ink">
                  {displayName}&apos;s Journey
                </h3>
                <p className="font-mono text-tiny text-saga-faint">@{friend.profile.username}</p>
              </div>
              <button onClick={onClose} className="s-close-btn"><X size={16} /></button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 size={24} className="animate-spin text-saga-faint mb-3" />
                  <p className="font-fell italic text-xs text-saga-faint">Loading activity...</p>
                </div>
              ) : (
                <>
                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="rounded-xl border border-saga-border bg-saga-steel/5 p-3 text-center">
                      <Activity size={14} className="mx-auto mb-1.5 text-saga-steel/50" />
                      <div className="font-cinzel text-lg font-semibold text-saga-steel">{activeDays}</div>
                      <div className="font-mono text-micro tracking-wider text-saga-caption uppercase">Active Days</div>
                    </div>
                    <div className="rounded-xl border border-saga-border bg-saga-gold/5 p-3 text-center">
                      <Sprout size={14} className="mx-auto mb-1.5 text-saga-gold/50" />
                      <div className="font-cinzel text-lg font-semibold text-saga-gold">{habits.length}</div>
                      <div className="font-mono text-micro tracking-wider text-saga-caption uppercase">Shared Seeds</div>
                    </div>
                    <div className="rounded-xl border border-saga-border bg-saga-crimson/5 p-3 text-center">
                      <BookOpen size={14} className="mx-auto mb-1.5 text-saga-crimson/50" />
                      <div className="font-cinzel text-lg font-semibold text-saga-crimson">{streak}d</div>
                      <div className="font-mono text-micro tracking-wider text-saga-caption uppercase">Streak</div>
                    </div>
                  </div>

                  {/* Heatmap */}
                  <div className="s-card">
                    <h4 className="s-section-label mb-4">{year} Activity Map</h4>
                    <Heatmap data={heatmapData} />
                  </div>

                  {/* Shared habits */}
                  {habits.length > 0 ? (
                    <div>
                      <h4 className="s-section-label mb-3">Shared Seeds</h4>
                      <div className="space-y-2">
                        {habits.map((habit) => {
                          const HabitIcon = getHabitIcon(habit.icon);
                          const doneToday = !!habit.log[today];
                          const total = Object.values(habit.log).filter(Boolean).length;

                          return (
                            <div
                              key={habit.id}
                              className={clsx(
                                's-card flex items-center gap-3',
                                doneToday && 'border-saga-forest/30'
                              )}
                            >
                              <div
                                className={clsx(
                                  'w-9 h-9 rounded-xl flex items-center justify-center',
                                  doneToday
                                    ? 'bg-saga-forest/10 text-saga-forest'
                                    : 'bg-saga-surface text-saga-caption'
                                )}
                              >
                                <HabitIcon size={18} strokeWidth={1.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-cinzel text-[12px] text-saga-ink tracking-wide">
                                  {habit.name}
                                </p>
                                <p className="font-mono text-tiny text-saga-faint">
                                  {total} days completed
                                  {doneToday && ' · ✓ today'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sprout size={28} strokeWidth={1} className="text-saga-faint/60 mx-auto mb-3" />
                      <p className="font-fell italic text-xs text-saga-faint leading-relaxed max-w-xs mx-auto">
                        {displayName} hasn&apos;t shared any seeds with you yet.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
