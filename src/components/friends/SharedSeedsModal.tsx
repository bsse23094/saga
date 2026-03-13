import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, Share2 } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';
import { getHabitIcon } from '../../utils/habitIcons';
import type { Friend } from '../../store/store';
import clsx from 'clsx';

interface Props {
  friend: Friend;
  open: boolean;
  onClose: () => void;
}

export default function SharedSeedsModal({ friend, open, onClose }: Props) {
  const { user } = useAuth();
  const habits = useSagaStore((s) => s.habits);
  const sharedHabitIds = useSagaStore((s) => s.sharedHabitIds);
  const toggleSharedHabit = useSagaStore((s) => s.toggleSharedHabit);

  const friendshipId = friend.friendship.id;
  const currentlyShared = sharedHabitIds[friendshipId] ?? [];

  const handleToggle = async (habitId: string) => {
    if (!user) return;
    await toggleSharedHabit(habitId, friendshipId, user.id);
  };

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="s-modal max-w-md mx-4 p-5 sm:p-6"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-cinzel text-sm tracking-wider text-saga-ink">
                    Share Seeds
                  </h3>
                  <p className="font-fell italic text-xs text-saga-caption mt-0.5">
                    with {friend.profile.display_name || friend.profile.username}
                  </p>
                </div>
                <button onClick={onClose} className="s-close-btn"><X size={16} /></button>
              </div>

              <p className="font-fell text-xs text-saga-caption leading-relaxed mb-4">
                Choose which habits (seeds) to share. Your companion will be able to see your progress on these habits in their activity view.
              </p>

              {/* Habit list */}
              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <Sprout size={28} strokeWidth={1} className="text-saga-faint/60 mx-auto mb-3" />
                  <p className="font-fell italic text-xs text-saga-faint">
                    No seeds planted yet. Visit The Farmland to plant your first habit.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {habits.map((habit) => {
                    const isShared = currentlyShared.includes(habit.id);
                    const HabitIcon = getHabitIcon(habit.icon);

                    return (
                      <motion.button
                        key={habit.id}
                        onClick={() => handleToggle(habit.id)}
                        className={clsx(
                          'w-full flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left',
                          isShared
                            ? 'bg-saga-forest/5 border-saga-forest/30'
                            : 'bg-saga-surface border-saga-border hover:border-saga-forest/20'
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={clsx(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            isShared
                              ? 'bg-saga-forest/10 text-saga-forest'
                              : 'bg-saga-surface text-saga-caption'
                          )}
                        >
                          <HabitIcon size={16} strokeWidth={1.5} />
                        </div>
                        <span className="font-cinzel text-[12px] text-saga-ink tracking-wide flex-1">
                          {habit.name}
                        </span>
                        {isShared && (
                          <Share2 size={12} className="text-saga-forest" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-saga-border">
                <p className="font-mono text-tiny text-saga-faint text-center tracking-wider">
                  {currentlyShared.length} of {habits.length} seeds shared
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
