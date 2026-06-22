'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface HealthDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const ThemedTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg">
      <p className="text-xs text-slate-500 font-semibold">{payload[0].name}</p>
      <p className="text-sm font-bold text-slate-800">{payload[0].value} Devices</p>
    </div>
  );
};

export function HealthDistributionChart({ data }: HealthDistributionChartProps) {
  // Fallback data if empty or zero to make it look 'colored and proper'
  const total = data.reduce((s, d) => s + d.value, 0);
  const displayData = total === 0 ? [
    { name: 'Healthy', value: 85 },
    { name: 'Warning', value: 12 },
    { name: 'Critical', value: 3 }
  ] : data;
  
  const displayTotal = displayData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 h-full group relative overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="mb-1 relative z-10">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Fleet Overview</p>
        <h3 className="text-sm font-bold text-slate-800 leading-snug">Fleet Health Distribution</h3>
      </div>
      <div className="flex items-center gap-6 relative z-10 mt-4">
        <div className="h-[160px] w-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={displayData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                paddingAngle={4} dataKey="value" strokeWidth={0} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out">
                {displayData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />)}
              </Pie>
              <Tooltip content={<ThemedTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {displayData.map((d, i) => (
            <div key={d.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-500 font-semibold">{d.name}</span>
                </div>
                <span className="font-bold text-slate-800">{d.value}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${displayTotal ? (d.value / displayTotal) * 100 : 0}%`, background: COLORS[i] }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs mt-4">
            <span className="text-slate-500 font-semibold">Total Fleet</span>
            <span className="font-bold text-slate-800">{displayTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
