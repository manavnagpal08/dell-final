'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Server, Zap, Database, Network, Cpu } from 'lucide-react';

const TABS = [
  { id: 'Cooling', icon: Zap },
  { id: 'Power', icon: Zap },
  { id: 'Storage', icon: Database },
  { id: 'Network', icon: Network },
  { id: 'Compute', icon: Cpu }
];

const TAB_DATA: Record<string, { health: number, load: number, temp: number }> = {
  Cooling: { health: 65, load: 88, temp: 72 },
  Power: { health: 88, load: 45, temp: 40 },
  Storage: { health: 94, load: 25, temp: 35 },
  Network: { health: 98, load: 15, temp: 30 },
  Compute: { health: 91, load: 75, temp: 65 }
};

export function InteractiveSystemExplorer() {
  const [active, setActive] = useState(TABS[0].id);
  const data = TAB_DATA[active];

  const radialData = [
    { name: 'Health', value: data.health, fill: data.health < 80 ? '#f59e0b' : '#10b981' },
    { name: 'Load', value: data.load, fill: '#3b82f6' },
    { name: 'Temp', value: data.temp, fill: '#ef4444' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-[400px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col">
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Domain Isolation</p>
        <h3 className="text-lg font-bold text-slate-800">System Explorer</h3>
      </div>
      
      {/* Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-xl mb-4 overflow-x-auto custom-scrollbar">
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActive(tab.id)}
            className={cn("flex-1 px-2 py-2 flex flex-col items-center gap-1 text-[10px] font-bold rounded-lg transition-all", active === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/30')}
          >
            <tab.icon className="w-4 h-4" />
            {tab.id}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-between"
          >
            <div className="w-[180px] h-[180px] shrink-0 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={12} data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={6} isAnimationActive={true} animationDuration={1000} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-2 pl-2 border-l border-slate-100">
              {[
                { label: 'Domain Health', val: `${data.health}%`, color: data.health < 80 ? 'text-amber-500' : 'text-emerald-500' },
                { label: 'Current Load', val: `${data.load}%`, color: 'text-blue-500' },
                { label: 'Avg Core Temp', val: `${data.temp}°C`, color: 'text-red-500' }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <p className={cn("text-lg font-black tracking-tight", stat.color)}>{stat.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
