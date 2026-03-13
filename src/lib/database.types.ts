/* ═══════════════════════════════════════════════════════════════
   SAGA — Supabase Database Types
   ═══════════════════════════════════════════════════════════════ */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          noise_text: string | null;
          path_text: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          noise_text?: string | null;
          path_text?: string | null;
          tags?: string[];
        };
        Update: {
          noise_text?: string | null;
          path_text?: string | null;
          tags?: string[];
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
        };
        Update: {
          name?: string;
          icon?: string;
        };
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          date: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          date: string;
        };
        Update: {
          habit_id?: string;
          date?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'declined';
        };
        Update: {
          status?: 'pending' | 'accepted' | 'declined';
        };
      };
      shared_habits: {
        Row: {
          id: string;
          habit_id: string;
          friendship_id: string;
          shared_by: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          friendship_id: string;
          shared_by: string;
        };
        Update: {
          habit_id?: string;
          friendship_id?: string;
          shared_by?: string;
        };
      };
    };
  };
}

/* ─── Convenience aliases ────────────────────────────────── */
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type JournalEntryRow = Database['public']['Tables']['journal_entries']['Row'];
export type HabitRow = Database['public']['Tables']['habits']['Row'];
export type HabitLogRow = Database['public']['Tables']['habit_logs']['Row'];
export type FriendshipRow = Database['public']['Tables']['friendships']['Row'];
export type SharedHabitRow = Database['public']['Tables']['shared_habits']['Row'];
