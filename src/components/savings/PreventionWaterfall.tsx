'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Potential Loss', start: 0, end: 420000, value: 420000, color: '#ef4444' },
  { name: 'AI Intervention', start: 310000, end: 420000, value: -110000, color: '#3b82f6' },
  { name: 'Prev. Maintenance', start: 230000, end: 310000, value: -80000, color: '#10b981' },
  { name: 'Avoided Downtime', start: 142000, end: 230000, value: -88000, color: '#8b5cf6' },
  { name: 'Final Cost', start: 0, end: 142000, value: 142000, color: '#64748b' }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const isNegative = item.value < 0;
  return (
    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl">
      <p className="font-bold text-slate-800">{item.name}</p>
      <p className={`text-sm font-black mt-1 ${isNegative ? 'text-emerald-500' : 'text-slate-600'}`}>
        {isNegative ? '-' : ''}${Math.abs(item.value).toLocaleString()}
      </p>
    </div>
  );
};

export function PreventionWaterfall() {
  // We use standard BarChart with a trick: we pass an array [start, end] as the dataKey.
  const waterfallData = data.map(d => ({
    name: d.name,
    range: [d.start, d.end],
    color: d.color,
    value: d.value
  }));

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow flex flex-col group">
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Bridge</p>
        <h3 className="text-lg font-bold text-slate-800">AI Prevention Impact</h3>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} interval={0} angle={-25} textAnchor="end" dy={10} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
            <Bar dataKey="range" radius={4} isAnimationActive={true} animationDuration={1500}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
