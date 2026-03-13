import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';
import { HABIT_ICONS } from '../../utils/habitIcons';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddHabitModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const addHabit = useSagaStore((s) => s.addHabit);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('sprout');

  const handleAdd = () => {
    if (!name.trim()) return;
    if (!user) return;
    addHabit({ id: crypto.randomUUID(), name: name.trim(), icon }, user.id);
    setName('');
    setIcon('sprout');
    onClose();
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
              className="s-modal max-w-sm mx-4 p-5 sm:p-6"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-cinzel text-sm tracking-wider text-saga-ink">
                  Plant a New Seed
                </h3>
                <button onClick={onClose} className="s-close-btn"><X size={16} /></button>
              </div>

              {/* Name */}
              <label className="s-section-label text-saga-caption mb-1.5 block">Habit Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="s-input mb-4"
                placeholder="e.g. Morning meditation"
                autoFocus
              />

              {/* Icon picker */}
              <label className="s-section-label text-saga-caption mb-1.5 block">Icon</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-5">
                {HABIT_ICONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setIcon(key)}
                    title={label}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      icon === key
                        ? 'bg-saga-forest/10 border-2 border-saga-forest/40 scale-110 text-saga-forest'
                        : 'bg-saga-surface border border-saga-border hover:border-saga-forest/20 text-saga-caption'
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </button>
                ))}
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleAdd}
                disabled={!name.trim()}
                className="s-btn-forest w-full py-3"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                PLANT SEED
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
