'use client';

import { BrainCircuit, Zap, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const INSIGHTS = [
  {
    id: 1,
    title: 'Cooling Unit F12 Anomaly',
    desc: 'Cooling Unit F12 has shown abnormal thermal behavior for 18 hours. Internal temperatures have spiked 12% above baseline thresholds.',
    similarity: '87%',
    window: '48 hours',
    action: 'Inspect cooling subsystem immediately. Prepare fan assembly replacement.',
    color: 'red'
  },
  {
    id: 2,
    title: 'Router R-04 Network Degradation',
    desc: 'Packet loss increased by 4% over the last 6 hours correlating with power supply voltage drops.',
    similarity: '92%',
    window: '5 days',
    action: 'Schedule maintenance for PSU swap and check network interfaces.',
    color: 'amber'
  },
  {
    id: 3,
    title: 'Storage Node Drive Predictive Failure',
    desc: 'SMART attributes indicate rising reallocation sector counts on Drive Bay 3.',
    similarity: '76%',
    window: '14 days',
    action: 'Migrate active data and prepare hot-swap drive replacement.',
    color: 'blue'
  }
];

export function AnalyticsInsightPanel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % INSIGHTS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const insight = INSIGHTS[activeIdx];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 h-full shadow-xl relative overflow-hidden flex flex-col justify-between group">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <BrainCircuit className="w-48 h-48 text-indigo-400 transform rotate-12 group-hover:scale-110 transition-transform duration-1000" />
      </div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-indigo-500/20 rounded-md border border-indigo-500/30">
            <Zap className="w-4 h-4 text-indigo-300" />
          </div>
          <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-widest">AI Intelligence Engine</h3>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Active Insights</h2>
      </div>

      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <h4 className="text-lg font-bold text-white mb-2">{insight.title}</h4>
              <p className="text-indigo-100/80 text-sm leading-relaxed">{insight.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">Pattern Similarity</p>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-xl font-black text-white">{insight.similarity}</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">Failure Window</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span className="text-xl font-black text-white">{insight.window}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-4 mt-2">
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1.5">Recommended Action</p>
              <p className="text-sm font-semibold text-indigo-100 flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                {insight.action}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination indicators */}
      <div className="relative z-10 flex items-center gap-2 mt-6">
        {INSIGHTS.map((_, i) => (
          <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === activeIdx ? "w-6 bg-indigo-400" : "w-1.5 bg-indigo-800")} />
        ))}
      </div>
    </div>
  );
}
