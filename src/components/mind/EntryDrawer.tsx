import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import type { JournalEntry } from '../../store/store';

interface Props {
  open: boolean;
  onClose: () => void;
  existingEntry: JournalEntry | null;
}

export default function EntryDrawer({ open, onClose, existingEntry }: Props) {
  const addEntry = useSagaStore((s) => s.addEntry);
  const [noiseText, setNoiseText] = useState('');
  const [pathText, setPathText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const noiseRef = useRef<HTMLTextAreaElement>(null);

  const isViewMode = !!existingEntry;

  useEffect(() => {
    if (open && existingEntry) {
      setNoiseText(existingEntry.noiseText);
      setPathText(existingEntry.pathText);
      setTags(existingEntry.tags);
    } else if (open) {
      setNoiseText('');
      setPathText('');
      setTags([]);
      setTagInput('');
      setTimeout(() => noiseRef.current?.focus(), 300);
    }
  }, [open, existingEntry]);

  const handleSave = () => {
    if (!noiseText.trim() && !pathText.trim()) return;
    addEntry({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      noiseText: noiseText.trim(),
      pathText: pathText.trim(),
      tags,
    });
    onClose();
  };

  const handleTagKey = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().toLowerCase();
      if (!tags.includes(t)) setTags((prev) => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="s-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="s-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="s-overlay-header">
              <h3 className="font-cinzel text-sm tracking-wider text-saga-ink">
                {isViewMode ? 'Journal Entry' : 'New Entry'}
              </h3>
              <button onClick={onClose} className="s-close-btn"><X size={16} /></button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div>
                <label className="s-section-label text-saga-crimson/70 mb-2 block">
                  The Noise — what&apos;s weighing on you?
                </label>
                <textarea
                  ref={noiseRef}
                  value={noiseText}
                  onChange={(e) => setNoiseText(e.target.value)}
                  readOnly={isViewMode}
                  rows={6}
                  className="s-textarea"
                  placeholder="Let it out. Unfiltered, raw, honest..."
                />
              </div>

              <div>
                <label className="s-section-label text-saga-forest/70 mb-2 block">
                  The Path — what clarity emerges?
                </label>
                <textarea
                  value={pathText}
                  onChange={(e) => setPathText(e.target.value)}
                  readOnly={isViewMode}
                  rows={6}
                  className="s-textarea"
                  placeholder="What action can you take? What truth surfaces?"
                />
              </div>

              <div>
                <label className="s-section-label text-saga-caption mb-2 block">
                  <Tag size={10} className="inline mr-1 -mt-px" /> Tags
                </label>
                {!isViewMode && (
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                    className="s-input font-mono text-small mb-2"
                    placeholder="Add tag + Enter"
                  />
                )}
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => !isViewMode && removeTag(t)}
                      className="s-tag cursor-pointer hover:border-saga-crimson/30 transition-colors"
                    >
                      {t}
                      {!isViewMode && <span className="ml-1 text-saga-faint">×</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            {!isViewMode && (
              <div className="px-6 py-4 border-t border-saga-border">
                <motion.button
                  onClick={handleSave}
                  disabled={!noiseText.trim() && !pathText.trim()}
                  className="s-btn-crimson w-full py-3"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={14} /> COMMIT TO THE CLEARING
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
