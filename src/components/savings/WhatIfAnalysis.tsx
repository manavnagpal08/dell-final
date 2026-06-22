import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function WhatIfAnalysis() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 h-full shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      <div className="relative z-10 mb-6">
        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Comparative Scenario</p>
        <h3 className="text-lg font-bold text-white">What-If Analysis</h3>
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without AI */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-red-400">
            <XCircle className="w-5 h-5" />
            <h4 className="font-bold uppercase tracking-wider text-sm">Without AI</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Predicted Event</p>
              <p className="text-lg font-black text-white">5 Failures</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Downtime</p>
              <p className="text-lg font-black text-white">42 Hours</p>
            </div>
            <div>
              <p className="text-[10px] text-red-400/80 uppercase tracking-wider">Financial Loss</p>
              <p className="text-2xl font-black text-red-400">$185,000</p>
            </div>
          </div>
        </div>
        
        {/* With VYOM AI */}
        <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-xl p-5 backdrop-blur-md relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-full p-1 border-4 border-slate-900 hidden md:block">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-bold uppercase tracking-wider text-sm">With VYOM AI</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-indigo-200/60 uppercase tracking-wider">Predicted Event</p>
              <p className="text-lg font-black text-white">1 Failure</p>
            </div>
            <div>
              <p className="text-[10px] text-indigo-200/60 uppercase tracking-wider">Downtime</p>
              <p className="text-lg font-black text-white">6 Hours</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider">Financial Loss</p>
              <p className="text-2xl font-black text-emerald-400">$27,000</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Savings Bar */}
      <div className="relative z-10 mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-0.5">Value Generated</p>
          <p className="text-sm font-semibold text-emerald-100">Direct savings from AI prediction</p>
        </div>
        <div className="text-3xl font-black text-emerald-400">
          $158,000
        </div>
      </div>
    </div>
  );
}
