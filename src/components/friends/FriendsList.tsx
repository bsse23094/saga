import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Share2, UserMinus } from 'lucide-react';
import { useSagaStore } from '../../store/store';
import { useAuth } from '../../contexts/AuthContext';
import SharedSeedsModal from './SharedSeedsModal';
import FriendActivityMap from './FriendActivityMap';
import type { Friend } from '../../store/store';

export default function FriendsList() {
  const { user } = useAuth();
  const friends = useSagaStore((s) => s.friends);
  const removeFriend = useSagaStore((s) => s.removeFriend);
  const [sharingWith, setSharingWith] = useState<Friend | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Friend | null>(null);

  const handleRemove = async (friendshipId: string) => {
    if (!user) return;
    if (!confirm('Remove this companion?')) return;
    await removeFriend(friendshipId, user.id);
  };

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users size={32} strokeWidth={1} className="text-saga-faint/60 mb-4" />
        <p className="font-cinzel text-sm text-saga-caption tracking-wider mb-1">
          No Companions Yet
        </p>
        <p className="font-fell italic text-xs text-saga-faint max-w-xs leading-relaxed">
          Search for other warriors and send them a request to begin sharing your journey together.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {friends.map((friend, i) => (
          <motion.div
            key={friend.friendship.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="s-card"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saga-gold/15 to-saga-amber/10 border border-saga-gold/25 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="font-cinzel text-sm text-saga-gold font-semibold">
                    {(friend.profile.display_name || friend.profile.username)[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-cinzel text-[13px] text-saga-ink tracking-wide truncate">
                    {friend.profile.display_name || friend.profile.username}
                  </p>
                  <p className="font-mono text-tiny text-saga-faint tracking-wide">
                    @{friend.profile.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1">
                <motion.button
                  onClick={() => setViewingActivity(friend)}
                  className="p-2.5 rounded-lg text-saga-steel hover:bg-saga-steel/10 cursor-pointer transition-colors"
                  whileTap={{ scale: 0.9 }}
                  title="View Activity"
                >
                  <Eye size={16} />
                </motion.button>
                <motion.button
                  onClick={() => setSharingWith(friend)}
                  className="p-2.5 rounded-lg text-saga-forest hover:bg-saga-forest/10 cursor-pointer transition-colors"
                  whileTap={{ scale: 0.9 }}
                  title="Share Seeds"
                >
                  <Share2 size={16} />
                </motion.button>
                <motion.button
                  onClick={() => handleRemove(friend.friendship.id)}
                  className="p-2.5 rounded-lg text-saga-faint hover:text-saga-crimson hover:bg-saga-crimson/5 cursor-pointer transition-colors"
                  whileTap={{ scale: 0.9 }}
                  title="Remove"
                >
                  <UserMinus size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shared Seeds Modal */}
      {sharingWith && (
        <SharedSeedsModal
          friend={sharingWith}
          open={!!sharingWith}
          onClose={() => setSharingWith(null)}
        />
      )}

      {/* Friend Activity Overlay */}
      {viewingActivity && (
        <FriendActivityMap
          friend={viewingActivity}
          open={!!viewingActivity}
          onClose={() => setViewingActivity(null)}
        />
      )}
    </>
  );
}
