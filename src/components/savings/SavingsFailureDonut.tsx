'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Cooling Failures', value: 85000, color: '#3b82f6' },
  { name: 'Thermal Failures', value: 65000, color: '#f59e0b' },
  { name: 'Storage Failures', value: 42000, color: '#8b5cf6' },
  { name: 'Power Failures', value: 28000, color: '#ef4444' },
  { name: 'Network Failures', value: 15000, color: '#10b981' }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl">
      <p className="font-bold text-slate-800 text-sm mb-1">{payload[0].name}</p>
      <p className="text-emerald-600 font-black">${payload[0].value.toLocaleString()} Saved</p>
    </div>
  );
};

export function SavingsFailureDonut() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow flex flex-col group">
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cost Avoidance</p>
        <h3 className="text-lg font-bold text-slate-800">Savings by Failure Type</h3>
      </div>
      <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="45%" innerRadius={75} outerRadius={105} paddingAngle={4} dataKey="value" strokeWidth={0} isAnimationActive={true} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-sm" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
