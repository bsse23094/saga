import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Compass, Wheat } from 'lucide-react';
import { getRandomQuote, type Quote } from '../../utils/quotes';

interface Props {
  onEnter: () => void;
}

export default function SplashIntro({ onEnter }: Props) {
  const [quote, setQuote] = useState<Quote>(getRandomQuote);
  const [quoteKey, setQuoteKey] = useState(0);

  // Auto-cycle quote every 6 seconds
  const cycleQuote = useCallback(() => {
    setQuote(getRandomQuote());
    setQuoteKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycleQuote, 6000);
    return () => clearInterval(interval);
  }, [cycleQuote]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-saga-bg"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Background texture — subtle ink wash */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top decorative line */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-saga-border to-transparent" />

        {/* Floating samurai / viking icons */}
        <motion.div
          className="absolute top-1/4 left-[8%] sm:left-[12%] text-saga-border/20 sm:text-saga-border/30"
          animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sword size={32} className="sm:w-12 sm:h-12" strokeWidth={0.7} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-[8%] sm:right-[12%] text-saga-border/20 sm:text-saga-border/30"
          animate={{ y: [6, -10, 6] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Compass size={28} className="sm:w-10 sm:h-10" strokeWidth={0.7} />
        </motion.div>
        <motion.div
          className="absolute top-[60%] left-[15%] sm:left-[18%] text-saga-border/15 sm:text-saga-border/20"
          animate={{ y: [4, -6, 4], rotate: [3, -3, 3] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Wheat size={24} className="sm:w-9 sm:h-9" strokeWidth={0.7} />
        </motion.div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-saga-border to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative flex flex-col items-center text-center px-8 max-w-xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.35em] font-semibold select-none mb-1">
            <span className="bg-gradient-to-r from-saga-crimson via-saga-ember to-saga-gold bg-clip-text text-transparent">SAGA</span>
          </h1>
          <p className="font-cinzel text-tiny tracking-[0.3em] text-saga-faint uppercase">
            The Path of Self-Mastery
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="w-16 h-px bg-saga-crimson/40 my-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />

        {/* Quote (animated swap) */}
        <div className="min-h-20 sm:min-h-24 sm:min-h-28 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex flex-col items-center cursor-pointer select-none"
              onClick={cycleQuote}
            >
              <p className="font-fell italic text-base sm:text-lg md:text-xl text-saga-body leading-relaxed max-w-md">
                &ldquo;{quote.text}&rdquo;
              </p>
              <span className="font-cinzel text-micro tracking-[0.2em] text-saga-faint mt-3 uppercase">
                — {quote.source}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enter button */}
        <motion.button
          onClick={onEnter}
          className="mt-10 font-cinzel text-small tracking-[0.2em] uppercase
                     px-10 py-3.5 rounded-lg border-2 border-saga-crimson/40
                     text-saga-crimson hover:bg-saga-crimson hover:text-white hover:border-saga-crimson
                     cursor-pointer transition-all duration-300 select-none
                     shadow-[0_0_20px_rgba(139,42,42,0.1)] hover:shadow-[0_0_30px_rgba(139,42,42,0.2)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03, borderColor: 'rgba(139, 42, 42, 0.6)' }}
          whileTap={{ scale: 0.97 }}
        >
          BEGIN YOUR SAGA
        </motion.button>

        {/* Tap hint */}
        <motion.p
          className="mt-4 font-mono text-micro text-saga-faint/50 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          tap quote to refresh
        </motion.p>
      </div>
    </motion.div>
  );
}
