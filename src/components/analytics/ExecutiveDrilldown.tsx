'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Server, DollarSign, Target, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'perf', title: 'Device Performance', icon: Server, color: 'text-blue-500', bg: 'bg-blue-50', content: '94% of fleet operating within nominal thermal envelopes. Cooling unit F12 shows 14% efficiency degradation.' },
  { id: 'fin', title: 'Financial Impact', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', content: '$218,000 saved YTD through predictive intervention. Estimated $45,000 at risk if Warning-level devices fail.' },
  { id: 'pred', title: 'Prediction Details', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50', content: 'AI model retrained 48 hours ago. Confidence interval currently 98.5%. Top predicted failure: Network Switch L3 (48h window).' },
  { id: 'maint', title: 'Maintenance History', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50', content: '14 critical interventions completed this month. Average Time To Repair (MTTR) reduced by 4.2 hours.' },
];

export function ExecutiveDrilldown() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800">Executive Drilldown</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="group">
            <button 
              onClick={() => setOpenId(openId === sec.id ? null : sec.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-1.5 rounded-lg", sec.bg)}>
                  <sec.icon className={cn("w-3.5 h-3.5", sec.color)} />
                </div>
                <span className="text-xs font-bold text-slate-700">{sec.title}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", openId === sec.id && "rotate-180")} />
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
                  <div className="px-4 pb-4 pt-1 ml-11 text-[11px] text-slate-600 font-medium leading-relaxed">
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
