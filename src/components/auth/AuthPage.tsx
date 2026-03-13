import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sprout, BookOpen, Mountain, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getRandomQuote } from '../../utils/quotes';
import type { Quote } from '../../utils/quotes';

/* ─── Floating quote that rotates every 6s ────────────────── */
function RotatingQuote() {
  const [quote, setQuote] = useState<Quote>(getRandomQuote());

  useEffect(() => {
    const interval = setInterval(() => setQuote(getRandomQuote()), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quote.text}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <p className="font-fell italic text-sm text-white/70 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 mt-2 block uppercase">
          — {quote.source}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Feature pill ────────────────────────────────────────── */
function FeaturePill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">
      <Icon size={13} strokeWidth={1.5} className="text-white/50" />
      <span className="font-mono text-[10px] tracking-wider text-white/60 uppercase">{label}</span>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
    } else {
      if (!username.trim()) { setError('Username is required.'); setLoading(false); return; }
      if (username.length < 3) { setError('Username must be at least 3 characters.'); setLoading(false); return; }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Username can only contain letters, numbers, and underscores.'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }

      const { error: err, needsConfirmation } = await signUp(email, password, username, displayName || username);
      if (err) {
        setError(err);
      } else if (needsConfirmation) {
        setSuccess('Account created! Check your email to verify, then sign in.');
        setMode('login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-saga-bg">

      {/* ═══ LEFT — Visual / Brand Panel ═══ */}
      <div className="relative lg:w-[55%] flex flex-col items-center justify-center overflow-hidden bg-[#1a1610] px-6 sm:px-8 py-8 sm:py-12 lg:py-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2c2417]/90 via-[#1a1610] to-[#0f0d09]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20256%20256%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27n%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.75%27%20numOctaves=%274%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-saga-crimson/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent via-saga-crimson/20 to-transparent" />
        <div className="absolute top-1/2 -translate-y-1/2 left-8 w-12 h-px bg-gradient-to-r from-saga-gold/20 to-transparent hidden lg:block" />
        <div className="absolute top-1/2 -translate-y-1/2 right-8 w-12 h-px bg-gradient-to-l from-saga-gold/20 to-transparent hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-8 max-w-md">

          {/* Title cluster */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sword size={20} strokeWidth={1.2} className="text-saga-crimson/60" />
              <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl tracking-[0.35em] text-white font-semibold">
                SAGA
              </h1>
              <Sword size={20} strokeWidth={1.2} className="text-saga-crimson/60 -scale-x-100" />
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-saga-gold/30 to-transparent mx-auto mb-3" />
            <p className="font-cinzel text-[10px] tracking-[0.35em] text-white/40 uppercase">
              The Path of Self-Mastery
            </p>
          </motion.div>

          {/* Decorative runic divider */}
          <motion.div
            className="flex items-center gap-4 text-white/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="w-8 h-px bg-current" />
            <span className="font-cinzel text-[10px] tracking-[0.4em]">&#x2726;</span>
            <div className="w-8 h-px bg-current" />
          </motion.div>

          {/* Rotating quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <RotatingQuote />
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <FeaturePill icon={BookOpen} label="Journal" />
            <FeaturePill icon={Sprout} label="Habits" />
            <FeaturePill icon={Mountain} label="Analytics" />
            <FeaturePill icon={Users} label="Fellowship" />
          </motion.div>

          {/* Bottom tagline (desktop only) */}
          <motion.p
            className="font-fell italic text-xs text-white/25 mt-6 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Every legend begins with a single step.
          </motion.p>
        </div>
      </div>

      {/* ═══ RIGHT — Auth Form Panel ═══ */}
      <div className="lg:w-[45%] flex flex-col items-center justify-center px-6 py-12 lg:py-0">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile-only title */}
          <div className="text-center mb-6 lg:hidden">
            <div className="w-8 h-px bg-saga-border mx-auto mb-4" />
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-saga-faint uppercase">
              {mode === 'login' ? 'Welcome back, warrior' : 'Begin your journey'}
            </p>
          </div>

          {/* Desktop greeting */}
          <div className="hidden lg:block mb-8">
            <h2 className="font-cinzel text-xl text-saga-ink tracking-wider mb-1">
              {mode === 'login' ? 'Welcome Back' : 'Join the Saga'}
            </h2>
            <p className="font-fell italic text-sm text-saga-caption">
              {mode === 'login'
                ? 'Continue your path of mastery.'
                : 'Forge your legend, one day at a time.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b border-saga-border">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 pb-3 font-cinzel text-small tracking-[0.15em] uppercase cursor-pointer transition-colors relative ${
                  mode === m ? 'text-saga-ink' : 'text-saga-faint hover:text-saga-caption'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
                {mode === m && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-saga-crimson rounded-t"
                    layoutId="authTab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="s-section-label text-saga-caption mb-1.5 block">Username</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-saga-faint" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="s-input pl-10"
                        placeholder="your_username"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="s-section-label text-saga-caption mb-1.5 block">Display Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-saga-faint" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="s-input pl-10"
                        placeholder="How others see you"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="s-section-label text-saga-caption mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-saga-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="s-input pl-10"
                  placeholder="warrior@saga.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="s-section-label text-saga-caption mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-saga-faint" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="s-input pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-saga-faint hover:text-saga-caption cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-saga-crimson text-xs font-fell text-center bg-saga-crimson/5 border border-saga-crimson/15 rounded-lg px-3 py-2"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-saga-forest text-xs font-fell text-center bg-saga-forest/5 border border-saga-forest/15 rounded-lg px-3 py-2"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="s-btn-crimson w-full py-3 mt-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  />
                  {mode === 'login' ? 'ENTERING...' : 'FORGING...'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {mode === 'login' ? 'ENTER THE SAGA' : 'BEGIN YOUR SAGA'}
                  <ArrowRight size={14} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Bottom separator */}
          <div className="mt-8 text-center">
            <div className="w-8 h-px bg-saga-border mx-auto mb-3" />
            <p className="font-fell italic text-[11px] text-saga-faint/50">
              {mode === 'login'
                ? 'New warrior? Switch to Register above.'
                : 'Already have an account? Switch to Sign In above.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
