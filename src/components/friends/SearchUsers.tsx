import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Loader2, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSagaStore } from '../../store/store';
import type { Profile } from '../../lib/database.types';

interface Props {
  userId: string;
}

export default function SearchUsers({ userId }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const sendFriendRequest = useSagaStore((s) => s.sendFriendRequest);
  const friends = useSagaStore((s) => s.friends);

  const friendIds = new Set(friends.map((f) => f.profile.id));

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setMessage('');

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query.trim()}%,display_name.ilike.%${query.trim()}%`)
      .neq('id', userId)
      .limit(20);

    setResults(data ?? []);
    if (!data?.length) setMessage('No warriors found with that name.');
    setSearching(false);
  };

  const handleSend = async (toId: string) => {
    setSendingTo(toId);
    const { error } = await sendFriendRequest(userId, toId);
    if (error) {
      setMessage(error);
    } else {
      setSentTo((prev) => new Set([...prev, toId]));
      setMessage('Request sent!');
    }
    setSendingTo(null);
  };

  return (
    <div>
      {/* Search bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-saga-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="s-input pl-10"
            placeholder="Search by username or name..."
          />
        </div>
        <motion.button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="s-btn-crimson"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          <span className="hidden sm:inline">SEARCH</span>
        </motion.button>
      </div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-fell text-saga-caption text-center mb-4"
        >
          {message}
        </motion.p>
      )}

      {/* Results */}
      <div className="space-y-2">
        {results.map((profile, i) => {
          const isFriend = friendIds.has(profile.id);
          const isSent = sentTo.has(profile.id);
          const isSending = sendingTo === profile.id;

          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="s-card flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-saga-gold/10 border border-saga-gold/20 flex items-center justify-center shrink-0">
                  <span className="font-cinzel text-xs text-saga-gold font-semibold">
                    {(profile.display_name || profile.username)[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-cinzel text-[13px] text-saga-ink tracking-wide truncate">
                    {profile.display_name || profile.username}
                  </p>
                  <p className="font-mono text-tiny text-saga-faint tracking-wide">
                    @{profile.username}
                  </p>
                </div>
              </div>

              {isFriend ? (
                <span className="inline-flex items-center gap-1 font-mono text-tiny text-saga-forest tracking-wider">
                  <UserCheck size={12} /> FRIENDS
                </span>
              ) : isSent ? (
                <span className="font-mono text-tiny text-saga-caption tracking-wider">SENT</span>
              ) : (
                <motion.button
                  onClick={() => handleSend(profile.id)}
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 font-cinzel text-tiny tracking-wider text-saga-crimson hover:bg-saga-crimson/5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isSending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <UserPlus size={12} />
                  )}
                  ADD
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty hint */}
      {results.length === 0 && !message && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={32} strokeWidth={1} className="text-saga-faint/60 mb-4" />
          <p className="font-cinzel text-sm text-saga-caption tracking-wider mb-1">
            Find Companions
          </p>
          <p className="font-fell italic text-xs text-saga-faint max-w-xs leading-relaxed">
            Search for other warriors by their username or display name to begin sharing your journey.
          </p>
        </div>
      )}
    </div>
  );
}
