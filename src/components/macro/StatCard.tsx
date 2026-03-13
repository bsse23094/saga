import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'crimson' | 'forest' | 'gold' | 'steel';
}

const colorMap = {
  crimson: { bg: 'bg-gradient-to-br from-saga-crimson/10 to-saga-ember/5', text: 'text-saga-crimson', icon: 'text-saga-crimson/60', ring: 'ring-saga-crimson/10' },
  forest:  { bg: 'bg-gradient-to-br from-saga-forest/10 to-saga-moss/5',  text: 'text-saga-forest',  icon: 'text-saga-forest/60',  ring: 'ring-saga-forest/10' },
  gold:    { bg: 'bg-gradient-to-br from-saga-gold/10 to-saga-amber/5',   text: 'text-saga-gold',    icon: 'text-saga-gold/60',    ring: 'ring-saga-gold/10' },
  steel:   { bg: 'bg-gradient-to-br from-saga-steel/10 to-saga-ocean/5',  text: 'text-saga-steel',   icon: 'text-saga-steel/60',   ring: 'ring-saga-steel/10' },
};

export default function StatCard({ icon: Icon, label, value, color }: Props) {
  const c = colorMap[color];

  return (
    <div className={clsx('rounded-xl border border-saga-border p-3 sm:p-4 ring-1', c.bg, c.ring)}>
      <div className={clsx('w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2', `${c.bg}`)}>
        <Icon size={15} strokeWidth={1.5} className={clsx(c.icon)} />
      </div>
      <div className={clsx('font-cinzel text-lg sm:text-xl font-semibold', c.text)}>{value}</div>
      <div className="font-mono text-[9px] sm:text-micro tracking-wider text-saga-caption uppercase mt-0.5 sm:mt-1">{label}</div>
    </div>
  );
}
