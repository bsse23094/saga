import { Swords, Sprout, Mountain, Users, LogOut } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';
import { getDailyQuote } from '../../utils/quotes';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const tabs = [
  { key: 'mind' as const, icon: Swords, label: 'The Clearing', sub: 'Chapter I', color: 'text-saga-crimson', accent: 'bg-saga-crimson' },
  { key: 'micro' as const, icon: Sprout, label: 'The Farmland', sub: 'Chapter II', color: 'text-saga-forest', accent: 'bg-saga-forest' },
  { key: 'macro' as const, icon: Mountain, label: 'The Mountain', sub: 'Chapter III', color: 'text-saga-steel', accent: 'bg-saga-steel' },
  { key: 'friends' as const, icon: Users, label: 'The Fellowship', sub: 'Chapter IV', color: 'text-saga-gold', accent: 'bg-saga-gold' },
];

export default function TopNav() {
  const active = useSagaStore((s) => s.activeModule);
  const setActive = useSagaStore((s) => s.setActiveModule);
  const pendingRequests = useSagaStore((s) => s.pendingRequests);
  const { profile, signOut } = useAuth();
  const quote = getDailyQuote();

  return (
    <nav className="sticky top-0 z-40 w-full bg-saga-surface/95 backdrop-blur-sm border-b border-saga-border shadow-[0_1px_4px_rgba(44,36,23,0.06)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Brand row */}
        <div className="flex items-center justify-between h-11 sm:h-12 border-b border-saga-border/40">
          <div className="flex items-baseline gap-3">
            <h1 className="font-cinzel text-lg tracking-[0.3em] font-semibold select-none">
              <span className="bg-gradient-to-r from-saga-crimson via-saga-ember to-saga-gold bg-clip-text text-transparent">SAGA</span>
            </h1>
            <span className="hidden sm:inline font-cinzel text-micro tracking-[0.2em] text-saga-muted uppercase">
              Self-Mastery Arc
            </span>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden md:block font-fell italic text-small text-saga-caption truncate max-w-xs">
              &ldquo;{quote.text}&rdquo;
              <span className="font-cinzel text-micro tracking-widest text-saga-faint ml-2">
                — {quote.source}
              </span>
            </p>

            {/* User section */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-saga-border/40">
              {profile && (
                <span className="hidden sm:block font-mono text-tiny text-saga-caption tracking-wide">
                  @{profile.username}
                </span>
              )}
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-saga-faint hover:text-saga-crimson hover:bg-saga-crimson/5 cursor-pointer transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-center -mb-px">
          {tabs.map(({ key, icon: Icon, label, sub, color, accent }) => {
            const isActive = active === key;
            const hasBadge = key === 'friends' && pendingRequests.length > 0;
            const shortLabel = label.replace('The ', '');
            return (
              <motion.button
                key={key}
                onClick={() => setActive(key)}
                className={clsx(
                  'relative flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2.5 flex-1 sm:flex-none px-1 sm:px-4 py-2 sm:py-2.5 rounded-t-lg',
                  'cursor-pointer group transition-colors duration-200 min-h-[44px]',
                  isActive ? 'bg-saga-bg' : 'hover:bg-saga-bg/50'
                )}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className={clsx('absolute bottom-0 left-2 right-2 h-0.5 rounded-t', accent)}
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative">
                  <Icon
                    size={15}
                    strokeWidth={1.5}
                    className={clsx(
                      'transition-colors',
                      isActive ? color : 'text-saga-faint group-hover:text-saga-caption'
                    )}
                  />
                  {hasBadge && (
                    <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-saga-crimson rounded-full border-2 border-saga-surface" />
                  )}
                </div>

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

                {/* Mobile short label */}
                <span className={clsx(
                  'block sm:hidden font-cinzel text-[9px] tracking-wider leading-none transition-colors',
                  isActive ? 'text-saga-ink' : 'text-saga-faint'
                )}>
                  {shortLabel}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
