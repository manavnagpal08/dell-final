'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

const TABS = ['Cooling', 'Power', 'Storage', 'Network', 'Compute'];

const TAB_DATA: Record<string, { desc: string, risk: number, health: number, components: any[] }> = {
  Cooling: {
    desc: 'HVAC and internal fan assemblies', risk: 82, health: 65,
    components: [{ name: 'Compressor', val: 40 }, { name: 'Fan Unit', val: 60 }]
  },
  Power: {
    desc: 'UPS units and internal PSUs', risk: 45, health: 88,
    components: [{ name: 'UPS Node A', val: 75 }, { name: 'UPS Node B', val: 25 }]
  },
  Storage: {
    desc: 'Drive arrays and NVMe nodes', risk: 25, health: 94,
    components: [{ name: 'SSD Pool', val: 80 }, { name: 'HDD Archive', val: 20 }]
  },
  Network: {
    desc: 'Core switches and routers', risk: 15, health: 98,
    components: [{ name: 'Core Switch', val: 50 }, { name: 'Edge Router', val: 50 }]
  },
  Compute: {
    desc: 'Server CPU and Memory utilization', risk: 35, health: 91,
    components: [{ name: 'CPU Load', val: 65 }, { name: 'Memory', val: 35 }]
  }
};

const COLORS = ['#3b82f6', '#cbd5e1'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg">
      <p className="font-bold text-slate-800 text-xs">{payload[0].name}</p>
      <p className="text-slate-500 font-semibold text-[10px]">{payload[0].value}% of Domain Risk</p>
    </div>
  );
};

export function InteractiveSystemAnalysis() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const data = TAB_DATA[activeTab];

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col group">
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Domain Isolation</p>
        <h3 className="text-lg font-bold text-slate-800">Interactive System Analysis</h3>
      </div>
      
      {/* Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-xl mb-6 overflow-x-auto custom-scrollbar">
        {TABS.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn("flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap", activeTab === tab ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/30')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full flex items-center justify-between gap-6"
          >
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-black text-xl text-slate-800">{activeTab} Systems</h4>
                <p className="text-xs font-semibold text-slate-500">{data.desc}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Domain Risk</p>
                  <p className={cn("text-2xl font-black", data.risk > 50 ? 'text-red-500' : 'text-emerald-500')}>{data.risk}%</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Domain Health</p>
                  <p className={cn("text-2xl font-black", data.health < 80 ? 'text-amber-500' : 'text-emerald-500')}>{data.health}%</p>
                </div>
              </div>
            </div>

            <div className="w-[160px] h-[160px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.components} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="val" strokeWidth={0}>
                    {data.components.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
