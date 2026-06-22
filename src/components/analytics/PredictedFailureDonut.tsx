'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

const ThemedTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg">
      <p className="text-xs text-slate-500 font-semibold">{payload[0].name}</p>
      <div className="mt-1 flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-800">Count: {payload[0].value}</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">High Severity</span>
      </div>
    </div>
  );
};

export function PredictedFailureDonut() {
  const displayData = [
    { name: 'Cooling Failure', value: 45 },
    { name: 'Thermal Failure', value: 30 },
    { name: 'Storage Failure', value: 15 },
    { name: 'Power Failure', value: 10 },
    { name: 'Network Failure', value: 5 }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 h-full group relative overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Analysis</p>
        <h3 className="text-base font-bold text-slate-800">Predicted Failure Breakdown</h3>
      </div>
      <div className="h-[240px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={displayData} cx="50%" cy="45%" innerRadius={65} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out">
              {displayData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm" />)}
            </Pie>
            <Tooltip content={<ThemedTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
