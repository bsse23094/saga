import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'crimson' | 'forest' | 'gold' | 'steel';
}

const colorMap = {
  crimson: { bg: 'bg-saga-crimson/8', text: 'text-saga-crimson', icon: 'text-saga-crimson/50' },
  forest:  { bg: 'bg-saga-forest/8',  text: 'text-saga-forest',  icon: 'text-saga-forest/50' },
  gold:    { bg: 'bg-saga-gold/8',    text: 'text-saga-gold',    icon: 'text-saga-gold/50' },
  steel:   { bg: 'bg-saga-steel/8',   text: 'text-saga-steel',   icon: 'text-saga-steel/50' },
};

export default function StatCard({ icon: Icon, label, value, color }: Props) {
  const c = colorMap[color];

  return (
    <div className={clsx('rounded-xl border border-saga-border p-4', c.bg)}>
      <Icon size={16} strokeWidth={1.5} className={clsx('mb-2', c.icon)} />
      <div className={clsx('font-cinzel text-xl font-semibold', c.text)}>{value}</div>
      <div className="font-mono text-micro tracking-wider text-saga-caption uppercase mt-1">{label}</div>
    </div>
  );
}
