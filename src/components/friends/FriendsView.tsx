import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, Shield } from 'lucide-react';
import { getQuoteByCategory } from '../../utils/quotes';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';
import SearchUsers from './SearchUsers';
import FriendRequests from './FriendRequests';
import FriendsList from './FriendsList';

type Tab = 'friends' | 'requests' | 'search';

export default function FriendsView() {
  const { user } = useAuth();
  const pendingRequests = useSagaStore((s) => s.pendingRequests);
  const [tab, setTab] = useState<Tab>('friends');

  const tabs: { key: Tab; label: string; icon: typeof Users; badge?: number }[] = [
    { key: 'friends', label: 'Companions', icon: Users },
    { key: 'requests', label: 'Requests', icon: Shield, badge: pendingRequests.length },
    { key: 'search', label: 'Search', icon: Search },
  ];

  return (
    <section>
      {/* Chapter banner */}
      <div className="relative mb-4 sm:mb-6 py-3 sm:py-5 px-4 sm:px-6 rounded-xl overflow-hidden border border-saga-gold/10">
        <div className="absolute inset-0 bg-gradient-to-r from-saga-gold/[0.08] via-saga-amber/[0.04] to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-saga-gold/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-saga-gold/10 flex items-center justify-center">
              <Users size={13} strokeWidth={1.5} className="text-saga-gold" />
            </div>
            <span className="font-cinzel text-micro tracking-[0.25em] text-saga-gold/70 uppercase">
              Chapter IV — The Fellowship
            </span>
          </div>
          <p className="font-fell italic text-[13px] text-saga-caption leading-relaxed max-w-lg">
            &ldquo;{getQuoteByCategory('peace').text}&rdquo;
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="s-heading">The Fellowship</h2>
        <p className="s-subtitle">No warrior walks alone. Find companions and share your journey.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-0 sm:gap-1 mb-6 border-b border-saga-border">
        {tabs.map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none justify-center sm:justify-start px-2 sm:px-4 py-2.5 font-cinzel text-[11px] sm:text-small tracking-wider cursor-pointer transition-colors ${
              tab === key ? 'text-saga-ink' : 'text-saga-faint hover:text-saga-caption'
            }`}
          >
            <Icon size={13} strokeWidth={1.5} />
            <span>{label}</span>
            {badge && badge > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-saga-crimson text-white text-[8px] font-mono rounded-full flex items-center justify-center">
                {badge}
              </span>
            ) : null}
            {tab === key && (
              <motion.div
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-saga-gold rounded-t"
                layoutId="friendsTab"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'friends' && <FriendsList />}
          {tab === 'requests' && <FriendRequests />}
          {tab === 'search' && user && <SearchUsers userId={user.id} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
