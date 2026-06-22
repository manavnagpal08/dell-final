'use client';

import { useState } from 'react';
import { CheckSquare, AlertTriangle, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CHECKLIST = [
  { id: 1, text: 'Inspect Cooling Unit F12', status: 'pending', priority: 'high' },
  { id: 2, text: 'Replace UPS Battery', status: 'done', priority: 'medium' },
  { id: 3, text: 'Verify Router Interface', status: 'pending', priority: 'low' },
  { id: 4, text: 'Clean HVAC Filters', status: 'pending', priority: 'medium' },
  { id: 5, text: 'Validate Thermal Sensors', status: 'pending', priority: 'high' },
];

const TIMELINE = [
  { days: '7 Days', count: 2, color: 'text-red-500', bg: 'bg-red-50', bar: 'bg-red-500' },
  { days: '15 Days', count: 3, color: 'text-orange-500', bg: 'bg-orange-50', bar: 'bg-orange-500' },
  { days: '30 Days', count: 4, color: 'text-amber-500', bg: 'bg-amber-50', bar: 'bg-amber-500' },
  { days: '60 Days', count: 6, color: 'text-blue-500', bg: 'bg-blue-50', bar: 'bg-blue-500' },
];

export function MaintenanceIntelligencePanel() {
  const [tasks, setTasks] = useState(CHECKLIST);
  const [generating, setGenerating] = useState(false);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* AI Checklist */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)]">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-500" />
          AI Maintenance Checklist
        </h3>
        <div className="space-y-2">
          {tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
            >
              <div className={cn("w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors shrink-0", task.status === 'done' ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300")}>
                {task.status === 'done' && <CheckSquare className="w-3 h-3" />}
              </div>
              <span className={cn("text-xs font-semibold select-none", task.status === 'done' ? "text-slate-400 line-through" : "text-slate-700")}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Timeline */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)]">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Failure Prevention Window</h3>
        <div className="space-y-3">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 w-12">{item.days}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${(item.count / 6) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                  className={cn("h-full rounded-full", item.bar)} 
                />
              </div>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", item.bg, item.color)}>{item.count} Devices</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Notifications */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex-1">
        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Info className="w-3 h-3" /> Smart Notifications
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400" />
            <p className="text-xs font-semibold text-slate-800 mb-1">Cooling Unit F12 predicted failure window begins in 12 days.</p>
            <p className="text-[10px] font-bold text-emerald-600">Potential loss avoided: $12,400</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
            <p className="text-xs font-semibold text-slate-800 mb-1">Server Rack A thermal anomaly detected.</p>
            <p className="text-[10px] font-bold text-blue-600">Confidence: 92%</p>
          </div>
        </div>
      </div>

      {/* Take Action Button */}
      <button 
        onClick={handleGenerate}
        disabled={generating}
        className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none" />
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>Optimizing Schedule...</span>
            </motion.div>
          ) : (
            <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Generate Maintenance Plan</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
