'use client';

import { Activity, Clock, PenTool, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const timelineData = [
  {
    id: '1',
    device: 'Cooling Unit F12',
    eta: '2 Days',
    action: 'Inspect Cooling System',
    type: 'Critical',
  },
  {
    id: '2',
    device: 'Router R-04',
    eta: '5 Days',
    action: 'Check Network Interfaces',
    type: 'Warning',
  },
  {
    id: '3',
    device: 'Storage Node S1',
    eta: '12 Days',
    action: 'Prepare Drive Replacement',
    type: 'Info',
  }
];

export function FailureTimeline() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 h-full group relative overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="mb-6 relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Projections</p>
        <h3 className="text-base font-bold text-slate-800">Failure Timeline</h3>
      </div>

      <div className="relative z-10 flex-1 flex flex-col gap-6 pl-4">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[27px] top-2 bottom-4 w-px bg-slate-200" />

        {timelineData.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            className="relative flex items-start gap-5"
          >
            {/* Timeline Dot */}
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-[3px] border-white shadow-sm relative z-10",
              item.type === 'Critical' ? 'bg-red-500' : item.type === 'Warning' ? 'bg-amber-500' : 'bg-blue-500'
            )}>
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Content Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex-1 hover:bg-slate-100 transition-colors cursor-pointer group/card relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover/card:bg-blue-400 transition-colors" />
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[13px] font-bold text-slate-700">{item.device}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm">
                  <Clock className={cn("w-3 h-3", item.type === 'Critical' ? 'text-red-500' : 'text-amber-500')} />
                  <span className={cn("text-[10px] font-bold", item.type === 'Critical' ? 'text-red-600' : 'text-amber-600')}>
                    {item.eta}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-200/50">
                <PenTool className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Recommended Action</span>
                  <span className="text-[12px] font-bold text-slate-600">{item.action}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
