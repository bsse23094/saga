import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopNav from './TopNav';
import SplashIntro from './SplashIntro';
import { useSagaStore } from '../../store/store';

import TheClearingView from '../mind/TheClearingView';
import TheFarmlandView from '../micro/TheFarmlandView';
import TheMountainView from '../macro/TheMountainView';

const views = {
  mind: TheClearingView,
  micro: TheFarmlandView,
  macro: TheMountainView,
};

export default function AppShell() {
  const active = useSagaStore((s) => s.activeModule);
  const View = views[active];
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashIntro onEnter={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-saga-bg text-saga-body">
        <TopNav />
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
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
