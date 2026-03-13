import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile, FriendshipRow } from '../lib/database.types';

/* ─── types ──────────────────────────────────────────────── */
export type Module = 'mind' | 'micro' | 'macro' | 'friends';

export interface JournalEntry {
  id: string;
  timestamp: number;
  noiseText: string;
  pathText: string;
  tags: string[];
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  log: Record<string, boolean>; // 'YYYY-MM-DD' → done
}

export interface Friend {
  friendship: FriendshipRow;
  profile: Profile;
}

/* ─── state shape ────────────────────────────────────────── */
interface SagaState {
  activeModule: Module;
  setActiveModule: (m: Module) => void;

  /* Journal */
  entries: JournalEntry[];
  loadEntries: (userId: string) => Promise<void>;
  addEntry: (e: JournalEntry, userId: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;

  /* Habits */
  habits: Habit[];
  loadHabits: (userId: string) => Promise<void>;
  addHabit: (h: Omit<Habit, 'log'>, userId: string) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, date: string) => Promise<void>;

  /* Friends */
  friends: Friend[];
  pendingRequests: Friend[];
  loadFriends: (userId: string) => Promise<void>;
  sendFriendRequest: (fromId: string, toId: string) => Promise<{ error: string | null }>;
  respondToRequest: (friendshipId: string, accept: boolean, userId: string) => Promise<void>;
  removeFriend: (friendshipId: string, userId: string) => Promise<void>;

  /* Shared habits */
  sharedHabitIds: Record<string, string[]>; // friendshipId → habit ids
  loadSharedHabits: (userId: string) => Promise<void>;
  toggleSharedHabit: (habitId: string, friendshipId: string, userId: string) => Promise<void>;

  /* Friend activity */
  getFriendActivity: (friendId: string, userId: string) => Promise<{
    habits: Habit[];
    entries: { date: string; count: number }[];
    allHabitDates: Record<string, number>; // ALL habit activity dates (for heatmap, not sharing-dependent)
  }>;

  /* Data loading */
  dataLoaded: boolean;
  loadAllData: (userId: string) => Promise<void>;
  clearData: () => void;
}

/* ─── store ──────────────────────────────────────────────── */
export const useSagaStore = create<SagaState>()((set, get) => ({
  activeModule: 'mind',
  setActiveModule: (m) => set({ activeModule: m }),

  /* ─── Journal ──────────────────────────────────────────── */
  entries: [],

  loadEntries: async (userId) => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      set({
        entries: data.map((e: any) => ({
          id: e.id,
          timestamp: new Date(e.created_at).getTime(),
          noiseText: e.noise_text ?? '',
          pathText: e.path_text ?? '',
          tags: e.tags ?? [],
        })),
      });
    }
  },

  addEntry: async (e, userId) => {
    const { data, error } = await supabase.from('journal_entries').insert({
      id: e.id,
      user_id: userId,
      noise_text: e.noiseText,
      path_text: e.pathText,
      tags: e.tags,
    }).select().single();

    if (!error && data) {
      set((s) => ({
        entries: [
          {
            id: data.id,
            timestamp: new Date(data.created_at).getTime(),
            noiseText: data.noise_text ?? '',
            pathText: data.path_text ?? '',
            tags: data.tags ?? [],
          },
          ...s.entries,
        ],
      }));
    }
  },

  deleteEntry: async (id) => {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (!error) {
      set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
    }
  },

  /* ─── Habits ───────────────────────────────────────────── */
  habits: [],

  loadHabits: async (userId) => {
    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!habitsData) return;

    const habitIds = habitsData.map((h) => h.id);
    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .in('habit_id', habitIds.length ? habitIds : ['__none__']);

    const logsByHabit: Record<string, Record<string, boolean>> = {};
    (logsData ?? []).forEach((l) => {
      if (!logsByHabit[l.habit_id]) logsByHabit[l.habit_id] = {};
      logsByHabit[l.habit_id][l.date] = true;
    });

    set({
      habits: habitsData.map((h) => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        log: logsByHabit[h.id] ?? {},
      })),
    });
  },

  addHabit: async (h, userId) => {
    const { data, error } = await supabase.from('habits').insert({
      id: h.id,
      user_id: userId,
      name: h.name,
      icon: h.icon,
    }).select().single();

    if (!error && data) {
      set((s) => ({
        habits: [...s.habits, { id: data.id, name: data.name, icon: data.icon, log: {} }],
      }));
    }
  },

  removeHabit: async (id) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (!error) {
      set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
    }
  },

  toggleHabit: async (id, date) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;

    const isDone = !!habit.log[date];

    if (isDone) {
      // Remove the log
      await supabase.from('habit_logs').delete().eq('habit_id', id).eq('date', date);
    } else {
      // Add the log
      await supabase.from('habit_logs').insert({ habit_id: id, date });
    }

    set((s) => ({
      habits: s.habits.map((h) =>
        h.id === id
          ? {
              ...h,
              log: isDone
                ? Object.fromEntries(Object.entries(h.log).filter(([d]) => d !== date))
                : { ...h.log, [date]: true },
            }
          : h,
      ),
    }));
  },

  /* ─── Friends ──────────────────────────────────────────── */
  friends: [],
  pendingRequests: [],

  loadFriends: async (userId) => {
    // Load accepted friendships
    const { data: friendships } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    // Load pending requests (where I'm the addressee)
    const { data: pending } = await supabase
      .from('friendships')
      .select('*')
      .eq('addressee_id', userId)
      .eq('status', 'pending');

    const allFriendIds = new Set<string>();
    (friendships ?? []).forEach((f) => {
      allFriendIds.add(f.requester_id === userId ? f.addressee_id : f.requester_id);
    });
    (pending ?? []).forEach((f) => {
      allFriendIds.add(f.requester_id);
    });

    const friendIdArray = Array.from(allFriendIds);
    let profiles: Record<string, Profile> = {};

    if (friendIdArray.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIdArray);

      (profilesData ?? []).forEach((p) => {
        profiles[p.id] = p;
      });
    }

    set({
      friends: (friendships ?? []).map((f) => {
        const friendId = f.requester_id === userId ? f.addressee_id : f.requester_id;
        return { friendship: f, profile: profiles[friendId] };
      }).filter((f) => f.profile),
      pendingRequests: (pending ?? []).map((f) => ({
        friendship: f,
        profile: profiles[f.requester_id],
      })).filter((f) => f.profile),
    });
  },

  sendFriendRequest: async (fromId, toId) => {
    if (fromId === toId) return { error: 'You cannot add yourself.' };

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .or(
        `and(requester_id.eq.${fromId},addressee_id.eq.${toId}),and(requester_id.eq.${toId},addressee_id.eq.${fromId})`
      );

    if (existing && existing.length > 0) {
      const status = existing[0].status;
      if (status === 'accepted') return { error: 'Already friends!' };
      if (status === 'pending') return { error: 'Request already sent.' };
    }

    const { error } = await supabase.from('friendships').insert({
      requester_id: fromId,
      addressee_id: toId,
      status: 'pending',
    });

    if (error) return { error: error.message };
    return { error: null };
  },

  respondToRequest: async (friendshipId, accept, userId) => {
    if (accept) {
      await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);
    } else {
      await supabase
        .from('friendships')
        .update({ status: 'declined' })
        .eq('id', friendshipId);
    }
    await get().loadFriends(userId);
  },

  removeFriend: async (friendshipId, userId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    await get().loadFriends(userId);
  },

  /* ─── Shared Habits ───────────────────────────────────── */
  sharedHabitIds: {},

  loadSharedHabits: async (userId) => {
    const { data } = await supabase
      .from('shared_habits')
      .select('*')
      .eq('shared_by', userId);

    const byFriendship: Record<string, string[]> = {};
    (data ?? []).forEach((sh) => {
      if (!byFriendship[sh.friendship_id]) byFriendship[sh.friendship_id] = [];
      byFriendship[sh.friendship_id].push(sh.habit_id);
    });

    set({ sharedHabitIds: byFriendship });
  },

  toggleSharedHabit: async (habitId, friendshipId, userId) => {
    const current = get().sharedHabitIds[friendshipId] ?? [];
    const isShared = current.includes(habitId);

    if (isShared) {
      await supabase
        .from('shared_habits')
        .delete()
        .eq('habit_id', habitId)
        .eq('friendship_id', friendshipId)
        .eq('shared_by', userId);

      set((s) => ({
        sharedHabitIds: {
          ...s.sharedHabitIds,
          [friendshipId]: (s.sharedHabitIds[friendshipId] ?? []).filter((id) => id !== habitId),
        },
      }));
    } else {
      await supabase.from('shared_habits').insert({
        habit_id: habitId,
        friendship_id: friendshipId,
        shared_by: userId,
      });

      set((s) => ({
        sharedHabitIds: {
          ...s.sharedHabitIds,
          [friendshipId]: [...(s.sharedHabitIds[friendshipId] ?? []), habitId],
        },
      }));
    }
  },

  /* ─── Friend Activity ─────────────────────────────────── */
  getFriendActivity: async (friendId, userId) => {
    // Check friendship exists
    const { data: friendship } = await supabase
      .from('friendships')
      .select('*')
      .or(
        `and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`
      )
      .eq('status', 'accepted')
      .single();

    if (!friendship) return { habits: [], entries: [], allHabitDates: {} };

    // ─── ALL habit log dates (for heatmap, always visible) ───
    // Uses a SECURITY DEFINER function that bypasses RLS
    const { data: activityRows } = await supabase
      .rpc('get_friend_activity_dates', { friend_user_id: friendId });

    const allHabitDates: Record<string, number> = {};
    (activityRows ?? []).forEach((r: { activity_date: string; activity_count: number }) => {
      allHabitDates[r.activity_date] = r.activity_count;
    });

    // ─── Shared habits only (for the habit detail list) ───
    const { data: sharedRows } = await supabase
      .from('shared_habits')
      .select('habit_id')
      .eq('friendship_id', friendship.id)
      .eq('shared_by', friendId);

    const sharedHabitIds = (sharedRows ?? []).map((r) => r.habit_id);

    let habits: Habit[] = [];
    if (sharedHabitIds.length > 0) {
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .in('id', sharedHabitIds);

      const { data: logsData } = await supabase
        .from('habit_logs')
        .select('*')
        .in('habit_id', sharedHabitIds);

      const logsByHabit: Record<string, Record<string, boolean>> = {};
      (logsData ?? []).forEach((l) => {
        if (!logsByHabit[l.habit_id]) logsByHabit[l.habit_id] = {};
        logsByHabit[l.habit_id][l.date] = true;
      });

      habits = (habitsData ?? []).map((h) => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        log: logsByHabit[h.id] ?? {},
      }));
    }

    // ─── Journal entry dates (for heatmap, always visible) ───
    const { data: entriesData } = await supabase
      .from('journal_entries')
      .select('created_at')
      .eq('user_id', friendId);

    const entryDates: Record<string, number> = {};
    (entriesData ?? []).forEach((e) => {
      const date = new Date(e.created_at).toISOString().slice(0, 10);
      entryDates[date] = (entryDates[date] || 0) + 1;
    });

    return {
      habits,
      entries: Object.entries(entryDates).map(([date, count]) => ({ date, count })),
      allHabitDates,
    };
  },

  /* ─── Data loading ─────────────────────────────────────── */
  dataLoaded: false,

  loadAllData: async (userId) => {
    await Promise.all([
      get().loadEntries(userId),
      get().loadHabits(userId),
      get().loadFriends(userId),
      get().loadSharedHabits(userId),
    ]);
    set({ dataLoaded: true });
  },

  clearData: () => {
    set({
      entries: [],
      habits: [],
      friends: [],
      pendingRequests: [],
      sharedHabitIds: {},
      dataLoaded: false,
      activeModule: 'mind',
    });
  },
}));
