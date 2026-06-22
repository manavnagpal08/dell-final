'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Target, Leaf, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const INSIGHTS = [
  { id: 1, type: 'Emerging Risk', icon: AlertTriangle, title: 'Cooling F12 Anomaly', desc: 'Thermal behavior deviation detected.', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 2, type: 'Health Improvement', icon: ShieldCheck, title: 'Core Network', desc: '0% packet loss in last 72 hours.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 3, type: 'Energy Optimization', icon: Leaf, title: 'HVAC Zone B', desc: 'AI saved $4,200/mo in energy.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 4, type: 'Cost Opportunity', icon: TrendingUp, title: 'Switch Decommission', desc: 'ROI expected in 4.2 months.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 5, type: 'Predicted Failure', icon: Target, title: 'Storage Node C', desc: 'SMART error rate increasing.', color: 'text-amber-500', bg: 'bg-amber-50' },
];

export function CompactAiCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % INSIGHTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleInsights = [
    INSIGHTS[idx],
    INSIGHTS[(idx + 1) % INSIGHTS.length]
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-xl h-[90px] shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden group flex items-center px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-indigo-50/20 pointer-events-none" />
      
      <div className="w-[100px] shrink-0 border-r border-slate-100 pr-3 mr-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className="w-3 h-3 text-indigo-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Feed</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIdx((idx - 1 + INSIGHTS.length) % INSIGHTS.length)} className="p-0.5 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft className="w-3 h-3" /></button>
          <button onClick={() => setIdx((idx + 1) % INSIGHTS.length)} className="p-0.5 hover:bg-slate-100 rounded text-slate-400"><ChevronRight className="w-3 h-3" /></button>
        </div>
      </div>

      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          {visibleInsights.map((insight, i) => (
            <motion.div
              key={insight.id + '-' + i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center gap-3 px-2 border-r border-slate-100/50 last:border-0"
            >
              <div className={cn("p-2 rounded-lg shrink-0", insight.bg)}>
                <insight.icon className={cn("w-4 h-4", insight.color)} />
              </div>
              <div className="min-w-0">
                <p className={cn("text-[9px] font-black uppercase tracking-wider mb-0.5", insight.color)}>{insight.type}</p>
                <h4 className="text-xs font-bold text-slate-800 truncate">{insight.title}</h4>
                <p className="text-[10px] text-slate-500 truncate">{insight.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
