import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─── types ──────────────────────────────────────────────── */
export type Module = 'mind' | 'micro' | 'macro';

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
  icon: string;  // lucide icon key — see habitIcons.ts
  log: Record<string, boolean>; // 'YYYY-MM-DD' → done
}

/* ─── state shape ────────────────────────────────────────── */
interface SagaState {
  activeModule: Module;
  setActiveModule: (m: Module) => void;

  entries: JournalEntry[];
  addEntry: (e: JournalEntry) => void;
  deleteEntry: (id: string) => void;

  habits: Habit[];
  addHabit: (h: Habit) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
}

/* ─── store ──────────────────────────────────────────────── */
export const useSagaStore = create<SagaState>()(
  persist(
    (set) => ({
      activeModule: 'mind',
      setActiveModule: (m) => set({ activeModule: m }),

      entries: [],
      addEntry: (e) => set((s) => ({ entries: [e, ...s.entries] })),
      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      habits: [],
      addHabit: (h) => set((s) => ({ habits: [...s.habits, h] })),
      removeHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      toggleHabit: (id, date) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, log: { ...h.log, [date]: !h.log[date] } } : h,
          ),
        })),
    }),
    { name: 'saga-store' },
  ),
);
