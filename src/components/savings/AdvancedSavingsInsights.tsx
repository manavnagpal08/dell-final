'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PieChart, Activity, ShieldAlert, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'breakdown', title: 'Cost Breakdown', icon: PieChart, color: 'text-blue-500', bg: 'bg-blue-50', content: 'Hardware replacement costs account for 64% of potential losses. Labor and downtime constitute the remaining 36%.' },
  { id: 'sources', title: 'Savings Sources', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', content: 'Largest savings generated from HVAC optimizations ($82k) and predictive drive replacements ($44k).' },
  { id: 'risk', title: 'Risk Avoidance', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50', content: '14 Critical failures intercepted before occurrence. Mean Time Between Failures (MTBF) improved by 210%.' },
  { id: 'econ', title: 'Maintenance Economics', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', content: 'Predictive maintenance cost: $64,500. Avoided reactive maintenance cost: $282,500. Net Economic Value Added: $218k.' },
];

export function AdvancedSavingsInsights() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xs font-bold text-slate-800">Advanced Insights</h3>
      </div>
      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="group">
            <button 
              onClick={() => setOpenId(openId === sec.id ? null : sec.id)}
              className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={cn("p-1.5 rounded-md", sec.bg)}>
                  <sec.icon className={cn("w-3 h-3", sec.color)} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">{sec.title}</span>
              </div>
              <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", openId === sec.id && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openId === sec.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="px-3 pb-3 pt-1 ml-9 text-[10px] text-slate-600 font-medium leading-relaxed">
                    {sec.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
