'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', withoutAI: 85000, withAI: 85000 },
  { month: 'Feb', withoutAI: 110000, withAI: 95000 },
  { month: 'Mar', withoutAI: 145000, withAI: 105000 },
  { month: 'Apr', withoutAI: 190000, withAI: 112000 },
  { month: 'May', withoutAI: 240000, withAI: 125000 },
  { month: 'Jun', withoutAI: 295000, withAI: 135000 },
  { month: 'Jul', withoutAI: 360000, withAI: 142000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const without = payload[0]?.value || 0;
  const withAI = payload[1]?.value || 0;
  const savings = without - withAI;
  
  return (
    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl">
      <p className="font-bold text-slate-800 mb-2">{label} Projections</p>
      <div className="space-y-1 text-sm">
        <p className="text-red-500 font-semibold flex justify-between gap-4">Without AI: <span>${without.toLocaleString()}</span></p>
        <p className="text-blue-500 font-semibold flex justify-between gap-4">With VYOM: <span>${withAI.toLocaleString()}</span></p>
        <div className="border-t border-slate-200 pt-1 mt-1">
          <p className="text-emerald-600 font-black flex justify-between gap-4">Savings Gap: <span>+${savings.toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  );
};

export function SavingsTrendChart() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow flex flex-col group">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Financial Trajectory</p>
          <h3 className="text-lg font-bold text-slate-800">Savings Trend Analysis</h3>
        </div>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
          +$218,000 Generated
        </div>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
            <YAxis hide domain={[0, 'dataMax + 50000']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="withoutAI" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorWithout)" isAnimationActive={true} animationDuration={2000} />
            <Area type="monotone" dataKey="withAI" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWith)" isAnimationActive={true} animationDuration={2000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
