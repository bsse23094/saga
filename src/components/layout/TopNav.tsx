import { Swords, Sprout, Mountain } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { getDailyQuote } from '../../utils/quotes';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const tabs = [
  { key: 'mind' as const, icon: Swords, label: 'The Clearing', sub: 'Chapter I' },
  { key: 'micro' as const, icon: Sprout, label: 'The Farmland', sub: 'Chapter II' },
  { key: 'macro' as const, icon: Mountain, label: 'The Mountain', sub: 'Chapter III' },
];

export default function TopNav() {
  const active = useSagaStore((s) => s.activeModule);
  const setActive = useSagaStore((s) => s.setActiveModule);
  const quote = getDailyQuote();

  return (
    <nav className="sticky top-0 z-40 w-full bg-saga-surface/95 backdrop-blur-sm border-b border-saga-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Brand row */}
        <div className="flex items-center justify-between h-11 sm:h-12 border-b border-saga-border/40">
          <div className="flex items-baseline gap-3">
            <h1 className="font-cinzel text-lg tracking-[0.3em] text-saga-ink font-semibold select-none">
              SAGA
            </h1>
            <span className="hidden sm:inline font-cinzel text-micro tracking-[0.2em] text-saga-muted uppercase">
              Self-Mastery Arc
            </span>
          </div>
          <p className="hidden md:block font-fell italic text-small text-saga-caption truncate max-w-sm">
            &ldquo;{quote.text}&rdquo;
            <span className="font-cinzel text-micro tracking-widest text-saga-faint ml-2">
              — {quote.source}
            </span>
          </p>
        </div>

        {/* Tab row */}
        <div className="flex items-center gap-1 -mb-px">
          {tabs.map(({ key, icon: Icon, label, sub }) => {
            const isActive = active === key;
            return (
              <motion.button
                key={key}
                onClick={() => setActive(key)}
                className={clsx(
                  'relative flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-2.5 rounded-t-lg',
                  'cursor-pointer group transition-colors duration-200 min-h-[44px]',
                  isActive ? 'bg-saga-bg' : 'hover:bg-saga-bg/50'
                )}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-saga-crimson rounded-t"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  size={15}
                  strokeWidth={1.5}
                  className={clsx(
                    'transition-colors',
                    isActive ? 'text-saga-crimson' : 'text-saga-faint group-hover:text-saga-caption'
                  )}
                />

                <div className="text-left hidden sm:block">
                  <span className={clsx(
                    'block font-cinzel text-small tracking-wider leading-none transition-colors',
                    isActive ? 'text-saga-ink' : 'text-saga-caption group-hover:text-saga-body'
                  )}>
                    {label}
                  </span>
                  <span className={clsx(
                    'block font-mono text-micro tracking-wide mt-0.5 transition-colors',
                    isActive ? 'text-saga-caption' : 'text-saga-faint'
                  )}>
                    {sub}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
