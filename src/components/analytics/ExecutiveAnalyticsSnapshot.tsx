'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart3, Clock, DollarSign, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const VIEWS = [
  { id: 'Operational', icon: Clock, title: 'Operational Efficiency', metric1: '99.9%', label1: 'Uptime', metric2: '14h', label2: 'MTTR', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Financial', icon: DollarSign, title: 'Cost Optimization', metric1: '$218k', label1: 'Saved', metric2: '$45k', label2: 'At Risk', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Reliability', icon: ShieldAlert, title: 'System Reliability', metric1: '94%', label1: 'Health', metric2: '2', label2: 'Anomalies', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'Sustainability', icon: BarChart3, title: 'Sustainability', metric1: '-12%', label1: 'Energy', metric2: '840', label2: 'kWh', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export function ExecutiveAnalyticsSnapshot() {
  const [active, setActive] = useState(VIEWS[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 h-[204px] shadow-xl relative overflow-hidden flex flex-col group text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Executive Summary</p>
          <h3 className="text-sm font-bold">{active.title}</h3>
        </div>
        
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-colors backdrop-blur-sm">
            {active.id} <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {open && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 top-full mt-2 w-40 bg-white shadow-xl rounded-xl overflow-hidden z-50 text-slate-800"
              >
                {VIEWS.map(v => (
                  <button 
                    key={v.id} onClick={() => { setActive(v); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <v.icon className={cn("w-3 h-3", v.color)} />
                    {v.id}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 h-full"
          >
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-black tracking-tight">{active.metric1}</p>
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">{active.label1}</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-black tracking-tight">{active.metric2}</p>
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">{active.label2}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
