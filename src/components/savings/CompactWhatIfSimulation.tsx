'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Power } from 'lucide-react';
import { DashboardSummary } from '@/types';

export function CompactWhatIfSimulation({ summary }: { summary?: DashboardSummary }) {
  const [withAi, setWithAi] = useState(true);

  const savings = summary?.estimated_cost_savings || 0;
  const downtime = summary?.estimated_downtime_prevented || 0;

  const data = withAi ? {
    downtime: '6 Hours',
    losses: '$27,000',
    savings: `$${savings.toLocaleString()}`,
    roi: '338%'
  } : {
    downtime: `${downtime + 6} Hours`,
    losses: `$${(savings + 27000).toLocaleString()}`,
    savings: '$0',
    roi: '0%'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-4 shadow-xl relative overflow-hidden flex flex-col h-[180px] text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      
      <div className="relative z-10 flex justify-between items-center mb-3">
        <h3 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Simulation</h3>
        
        {/* Toggle */}
        <button 
          onClick={() => setWithAi(!withAi)}
          className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border", withAi ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-slate-700')}
        >
          <Power className={cn("w-3 h-3", withAi ? "text-emerald-400" : "text-slate-500")} />
          {withAi ? 'AI Active' : 'AI Offline'}
        </button>
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-2 gap-2">
        <AnimatePresence mode="wait">
          <motion.div key={withAi ? 'on1' : 'off1'} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-col justify-center">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Downtime</p>
            <p className={cn("text-base font-black tracking-tight", withAi ? 'text-white' : 'text-red-400')}>{data.downtime}</p>
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.div key={withAi ? 'on2' : 'off2'} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-col justify-center">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Est. Losses</p>
            <p className={cn("text-base font-black tracking-tight", withAi ? 'text-emerald-400' : 'text-red-400')}>{data.losses}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex justify-between items-center">
        <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest">Net Value Added</p>
        <AnimatePresence mode="wait">
          <motion.span key={withAi ? 'on3' : 'off3'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-black text-emerald-400">
            {data.savings}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
