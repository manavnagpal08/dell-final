'use client';

import { Device } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const COMPONENTS = ['Cooling', 'Storage', 'Power', 'Network', 'Thermal'];

function getBgColorOnly(risk: number) {
  if (risk < 30) return 'bg-emerald-500';
  if (risk < 70) return 'bg-amber-500';
  return 'bg-red-500';
}

export function FleetHealthHeatmap({ devices }: { devices: Device[] }) {
  const topDevices = [...devices].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0)).slice(0, 6);

  const heatmapData = topDevices.map(d => {
    const baseRisk = d.risk_score || 10;
    return {
      name: d.name || 'DEV',
      id: d.id,
      components: COMPONENTS.map((comp, idx) => {
        const randomFactor = (d.id.charCodeAt(0) + idx) % 10; 
        const compRisk = Math.min(99, Math.max(5, baseRisk + (randomFactor * 6) - 20));
        return { name: comp, risk: compRisk };
      })
    };
  });

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 h-full group relative overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col">
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sub-System Analysis</p>
        <h3 className="text-base font-bold text-slate-800">Fleet Health Heatmap</h3>
      </div>
      <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Device</div>
            {COMPONENTS.map(c => <div key={c} className="text-[10px] font-bold text-slate-400 uppercase text-center">{c}</div>)}
          </div>
          <div className="space-y-2">
            {heatmapData.map((row, i) => (
              <motion.div key={row.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} className="grid grid-cols-6 gap-2 items-center">
                <div className="text-[11px] font-bold text-slate-700 truncate pr-2">{row.name}</div>
                {row.components.map((comp, j) => (
                  <div key={j} className="relative group/cell aspect-[3/1] w-full rounded border border-slate-100 overflow-hidden cursor-crosshair">
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 + (i * 0.05) + (j * 0.05), duration: 0.5 }} className={cn("absolute inset-0 origin-left opacity-80 group-hover/cell:opacity-100 transition-opacity", getBgColorOnly(comp.risk))} />
                    <div className="absolute inset-0 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center justify-center bg-slate-900/90 text-white text-[10px] font-bold z-20 backdrop-blur-sm">{comp.risk}%</div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
