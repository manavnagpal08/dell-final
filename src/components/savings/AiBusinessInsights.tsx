'use client';

import { BrainCircuit, Zap, ShieldCheck } from 'lucide-react';

export function AiBusinessInsights() {
  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col justify-between group hover:shadow-md transition-all">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI Business Intelligence</h3>
        </div>
        <p className="text-slate-700 font-medium text-lg leading-snug mb-4">
          "AI detected thermal degradation in <span className="font-bold text-indigo-700">Cooling Unit F12</span>. Early intervention prevented an estimated <span className="font-bold text-emerald-600">$12,400</span> repair event."
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-indigo-100/50">
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Historical Similarity</p>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-amber-500" />
            <span className="text-lg font-black text-slate-800">87%</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">AI Confidence</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-black text-slate-800">92%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
