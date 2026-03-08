import {
  Sprout,
  BookOpen,
  Dumbbell,
  Flower2,
  PenLine,
  Moon,
  Apple,
  Target,
  Droplets,
  Footprints,
  Music,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface HabitIconOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const HABIT_ICONS: HabitIconOption[] = [
  { key: 'sprout', label: 'Growth', icon: Sprout },
  { key: 'book', label: 'Reading', icon: BookOpen },
  { key: 'dumbbell', label: 'Exercise', icon: Dumbbell },
  { key: 'flower', label: 'Meditate', icon: Flower2 },
  { key: 'pen', label: 'Writing', icon: PenLine },
  { key: 'moon', label: 'Sleep', icon: Moon },
  { key: 'apple', label: 'Nutrition', icon: Apple },
  { key: 'target', label: 'Focus', icon: Target },
  { key: 'droplets', label: 'Hydration', icon: Droplets },
  { key: 'footprints', label: 'Walking', icon: Footprints },
  { key: 'music', label: 'Music', icon: Music },
  { key: 'sparkles', label: 'Cleaning', icon: Sparkles },
];

const iconMap = new Map(HABIT_ICONS.map((o) => [o.key, o.icon]));

/** Resolve a habit icon key to its Lucide component. Falls back to Sprout. */
export function getHabitIcon(key: string): LucideIcon {
  return iconMap.get(key) ?? Sprout;
}
