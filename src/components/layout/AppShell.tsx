import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import TopNav from './TopNav';
import SplashIntro from './SplashIntro';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';

import TheClearingView from '../mind/TheClearingView';
import TheFarmlandView from '../micro/TheFarmlandView';
import TheMountainView from '../macro/TheMountainView';
import FriendsView from '../friends/FriendsView';

const views = {
  mind: TheClearingView,
  micro: TheFarmlandView,
  macro: TheMountainView,
  friends: FriendsView,
};

export default function AppShell() {
  const active = useSagaStore((s) => s.activeModule);
  const View = views[active];
  const [showSplash, setShowSplash] = useState(true);
  const { emailJustVerified, clearEmailVerifiedFlash } = useAuth();

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashIntro onEnter={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-saga-bg text-saga-body">
        <TopNav />
        <AnimatePresence>
          {emailJustVerified && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border-b border-saga-forest/30 bg-saga-forest/10"
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 size={16} className="text-saga-forest shrink-0" />
                  <p className="font-cinzel text-[10px] sm:text-tiny tracking-[0.14em] uppercase text-saga-ink truncate">
                    Email verified successfully. Welcome to your saga.
                  </p>
                </div>
                <button
                  onClick={clearEmailVerifiedFlash}
                  className="p-1 rounded text-saga-caption hover:text-saga-ink hover:bg-saga-bg/60 cursor-pointer transition-colors"
                  aria-label="Dismiss verification message"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-10 pb-8 sm:pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <View />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
