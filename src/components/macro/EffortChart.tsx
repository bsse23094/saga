import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: { date: string; effort: number }[];
}

export default function EffortChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="effortGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b2a2a" stopOpacity={0.35} />
            <stop offset="40%" stopColor="#a63d2f" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#b8922e" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="effortStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b2a2a" />
            <stop offset="100%" stopColor="#b8922e" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e2d9c8" strokeDasharray="3 3" opacity={0.5} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 8, fill: '#7a6f5e', fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: '#e2d9c8' }}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 8, fill: '#7a6f5e', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#fffdf8',
            border: '1px solid #e2d9c8',
            borderRadius: 8,
            fontSize: 10,
            fontFamily: 'JetBrains Mono',
            color: '#2c2417',
          }}
        />
        <Area
          type="monotone"
          dataKey="effort"
          stroke="url(#effortStroke)"
          strokeWidth={2.5}
          fill="url(#effortGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#8b2a2a', strokeWidth: 2, stroke: '#fffdf8' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
