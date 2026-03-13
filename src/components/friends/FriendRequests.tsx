import { motion } from 'framer-motion';
import { Check, X, UserX, Clock } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';

export default function FriendRequests() {
  const { user } = useAuth();
  const pendingRequests = useSagaStore((s) => s.pendingRequests);
  const respondToRequest = useSagaStore((s) => s.respondToRequest);

  const handleRespond = async (friendshipId: string, accept: boolean) => {
    if (!user) return;
    await respondToRequest(friendshipId, accept, user.id);
  };

  if (pendingRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock size={32} strokeWidth={1} className="text-saga-faint/60 mb-4" />
        <p className="font-cinzel text-sm text-saga-caption tracking-wider mb-1">
          No Pending Requests
        </p>
        <p className="font-fell italic text-xs text-saga-faint max-w-xs leading-relaxed">
          When other warriors seek your companionship, their requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pendingRequests.map((req, i) => (
        <motion.div
          key={req.friendship.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="s-card flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-saga-gold/10 border border-saga-gold/20 flex items-center justify-center shrink-0">
              <span className="font-cinzel text-xs text-saga-gold font-semibold">
                {(req.profile.display_name || req.profile.username)[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-cinzel text-[13px] text-saga-ink tracking-wide truncate">
                {req.profile.display_name || req.profile.username}
              </p>
              <p className="font-mono text-tiny text-saga-faint tracking-wide">
                @{req.profile.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => handleRespond(req.friendship.id, true)}
              className="p-2.5 rounded-lg text-saga-forest hover:bg-saga-forest/10 cursor-pointer transition-colors"
              whileTap={{ scale: 0.9 }}
              title="Accept"
            >
              <Check size={18} />
            </motion.button>
            <motion.button
              onClick={() => handleRespond(req.friendship.id, false)}
              className="p-2.5 rounded-lg text-saga-crimson hover:bg-saga-crimson/10 cursor-pointer transition-colors"
              whileTap={{ scale: 0.9 }}
              title="Decline"
            >
              <X size={18} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
