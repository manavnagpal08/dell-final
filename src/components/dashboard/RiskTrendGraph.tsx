'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles } from 'lucide-react';

const data = [
  { day: 'Mon', risk: 45, alerts: 12 },
  { day: 'Tue', risk: 52, alerts: 15 },
  { day: 'Wed', risk: 48, alerts: 10 },
  { day: 'Thu', risk: 61, alerts: 22 },
  { day: 'Fri', risk: 55, alerts: 18 },
  { day: 'Sat', risk: 68, alerts: 27 },
  { day: 'Sun', risk: 72, alerts: 31 },
];

const ThemedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg">
      <p className="text-xs text-slate-500 font-semibold">{label}</p>
      <div className="mt-1 space-y-1">
        <p className="text-[11px] font-bold text-red-500">Risk Score: {payload[0].value}</p>
        <p className="text-[11px] font-bold text-slate-700">Alerts: {payload[1].value}</p>
      </div>
    </div>
  );
};

export function RiskTrendGraph() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 h-full group relative overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Evolution</p>
          <h3 className="text-base font-bold text-slate-800">Fleet Risk Trend (7D)</h3>
        </div>
        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">AI Forecast Active</span>
        </div>
      </div>

      <div className="h-[220px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis yAxisId="right" orientation="right" hide />
            <Tooltip content={<ThemedTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area yAxisId="left" type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" isAnimationActive={true} animationDuration={2000} />
            <Area yAxisId="right" type="step" dataKey="alerts" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} isAnimationActive={true} animationDuration={2000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
