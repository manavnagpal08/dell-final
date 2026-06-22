'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Target, Leaf, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const INSIGHTS = [
  { id: 1, type: 'Emerging Risk', icon: AlertTriangle, title: 'Cooling Unit F12 Anomaly', desc: 'Abnormal thermal behavior detected. Immediate inspection recommended.', conf: 92, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 2, type: 'Best Performing', icon: ShieldCheck, title: 'Core Network Architecture', desc: '0% packet loss across all zones in the last 72 hours.', conf: 98, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 3, type: 'Energy Optimization', icon: Leaf, title: 'HVAC Zone B Efficiency', desc: 'AI optimized cooling cycles, saving estimated $4,200/mo in energy.', conf: 85, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 4, type: 'Cost Opportunity', icon: TrendingUp, title: 'Legacy Switch Decommission', desc: 'Replacing 3 legacy switches will yield ROI in 4.2 months.', conf: 89, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

function ShieldCheck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

export function AiInsightsCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % INSIGHTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const insight = INSIGHTS[idx];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl h-[180px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 pointer-events-none" />
      
      <div className="flex flex-col h-full p-5 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Intelligence Feed</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIdx((idx - 1 + INSIGHTS.length) % INSIGHTS.length)} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
            <button onClick={() => setIdx((idx + 1) % INSIGHTS.length)} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
          </div>
        </div>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center gap-4"
            >
              <div className={cn("p-3 rounded-xl shrink-0 border", insight.bg, insight.border)}>
                <insight.icon className={cn("w-6 h-6", insight.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-[10px] font-black uppercase tracking-wider mb-0.5", insight.color)}>{insight.type}</p>
                <h4 className="text-sm font-bold text-slate-800 truncate">{insight.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">{insight.desc}</p>
              </div>
              <div className="shrink-0 text-right pl-4 border-l border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{insight.conf}%</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {INSIGHTS.map((_, i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === idx ? "w-6 bg-blue-500" : "w-2 bg-slate-200")} />
          ))}
        </div>
      </div>
    </div>
  );
}
