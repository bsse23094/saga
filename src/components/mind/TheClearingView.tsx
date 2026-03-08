import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Feather, Clock, Trash2, Swords } from 'lucide-react';
import { getQuoteByCategory } from '../../utils/quotes';
import { useSagaStore } from '../../store/store';
import type { JournalEntry } from '../../store/store';
import { formatJournalDate } from '../../utils/dateUtils';
import EntryDrawer from './EntryDrawer';

export default function TheClearingView() {
  const entries = useSagaStore((s) => s.entries);
  const deleteEntry = useSagaStore((s) => s.deleteEntry);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const openNew = () => { setSelectedEntry(null); setDrawerOpen(true); };
  const openEntry = (e: JournalEntry) => { setSelectedEntry(e); setDrawerOpen(true); };

  return (
    <section>
      {/* Chapter banner */}
      <div className="relative mb-6 py-5 px-6 rounded-xl bg-gradient-to-r from-saga-crimson/[0.04] to-transparent border-l-2 border-saga-crimson/20">
        <div className="flex items-center gap-2 mb-1">
          <Swords size={13} strokeWidth={1.5} className="text-saga-crimson/50" />
          <span className="font-cinzel text-micro tracking-[0.25em] text-saga-crimson/60 uppercase">Chapter I — The Clearing</span>
        </div>
        <p className="font-fell italic text-[13px] text-saga-caption leading-relaxed max-w-lg">
          &ldquo;{getQuoteByCategory('warrior').text}&rdquo;
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h2 className="s-heading">The Clearing</h2>
          <p className="s-subtitle">Like a warrior entering the clearing — release the noise and find your path.</p>
        </div>
        <motion.button
          onClick={openNew}
          className="s-btn-crimson w-full sm:w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={14} /> NEW ENTRY
        </motion.button>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Feather size={36} strokeWidth={1} className="text-saga-faint/60 mb-5" />
          <p className="font-cinzel text-sm text-saga-caption tracking-wider mb-1.5">
            The clearing is empty
          </p>
          <p className="font-fell italic text-xs text-saga-faint max-w-xs leading-relaxed">
            Begin writing to release the noise in your mind and discover the path beneath it.
          </p>
        </motion.div>
      )}

      {/* Entries */}
      <div className="grid gap-4">
        <AnimatePresence>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => openEntry(entry)}
              className="s-card-interactive group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Timestamp */}
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={12} className="text-saga-faint" />
                    <span className="s-data">{formatJournalDate(entry.timestamp)}</span>
                  </div>

                  {/* Noise | Path columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <span className="s-section-label text-saga-crimson/60 mb-1 block">Noise</span>
                      <p className="font-fell text-[13px] text-saga-body leading-relaxed line-clamp-3">
                        {entry.noiseText || <span className="italic text-saga-faint">—</span>}
                      </p>
                    </div>
                    <div>
                      <span className="s-section-label text-saga-forest/60 mb-1 block">Path</span>
                      <p className="font-fell text-[13px] text-saga-body leading-relaxed line-clamp-3">
                        {entry.pathText || <span className="italic text-saga-faint">—</span>}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entry.tags.map((t) => (
                        <span key={t} className="s-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                  className="sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-saga-faint hover:text-saga-crimson hover:bg-saga-crimson/5 cursor-pointer transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <EntryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} existingEntry={selectedEntry} />
    </section>
  );
}
