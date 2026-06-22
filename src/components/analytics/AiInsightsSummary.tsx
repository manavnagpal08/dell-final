'use client';

import { BrainCircuit, TrendingUp, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export function AiInsightsSummary() {
  const summaries = [
    { label: 'Emerging Risk', val: 'Thermal Anomaly (Zone B)', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Largest Risk Increase', val: 'Cooling Unit F12 (+14%)', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Most Stable Asset Group', val: 'Core Network Switches', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Predicted Failure Window', val: '48 Hrs (Cooling F12)', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 h-full shadow-xl relative overflow-hidden flex flex-col justify-between group">
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <BrainCircuit className="w-32 h-32 text-indigo-400 transform rotate-12 group-hover:scale-110 transition-transform duration-1000" />
      </div>
      
      <div className="relative z-10 mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight">AI Insights Panel</h3>
        <p className="text-indigo-200/80 text-xs mt-1">Real-time synthesized intelligence</p>
      </div>

      <div className="relative z-10 space-y-3">
        {summaries.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-3 hover:bg-white/10 transition-colors cursor-default">
            <div className={`p-2 rounded-lg ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-sm font-bold text-white mt-0.5">{s.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


