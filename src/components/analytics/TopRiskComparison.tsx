'use client';

import { Device } from '@/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export function TopRiskComparison({ devices }: { devices: Device[] }) {
  const data = [...devices]
    .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
    .slice(0, 5)
    .map(d => ({
      name: d.name,
      prob: Math.min(99, Math.round((d.risk_score || 0) + 12)),
      risk: Math.round(d.risk_score || 0)
    }));

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 h-full group shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rankings</p>
        <h3 className="text-base font-bold text-slate-800">Top Risk Device Comparison</h3>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} width={120} />
            <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="prob" name="Failure Probability" radius={[0, 4, 4, 0]} barSize={12} fill="#f59e0b" isAnimationActive={true} animationDuration={1500} />
            <Bar dataKey="risk" name="Risk Score" radius={[0, 4, 4, 0]} barSize={12} fill="#ef4444" isAnimationActive={true} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
