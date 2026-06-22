'use client';

import { Device } from '@/types';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Activity, AlertTriangle, PenTool, Clock, Server } from 'lucide-react';

interface TopRiskyDevicesListProps { devices: Device[] }

export function TopRiskyDevicesList({ devices }: TopRiskyDevicesListProps) {
  const [liveDevices, setLiveDevices] = useState(devices.slice(0, 8));

  useEffect(() => {
    // Simulate realistic live fluctuations
    const timer = setInterval(() => {
      setLiveDevices(prev => {
        return prev.map(d => {
          // 30% chance to fluctuate
          if (Math.random() > 0.7) {
            const shift = (Math.random() * 4) - 2; // -2 to +2
            const newScore = Math.min(99, Math.max(10, (d.risk_score || 80) + shift));
            return { ...d, risk_score: newScore };
          }
          return d;
        });
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const top = [...liveDevices].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0)).slice(0, 5);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl h-full flex flex-col shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="text-[15px] font-bold text-slate-800">Top Risk Devices</h3>
        </div>
        <Link href="/devices" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          Explore &rarr;
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {top.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            No devices found
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {top.map((device, i) => {
                const score = device.risk_score || 95;
                const daysLeft = device.days_remaining ? Math.max(1, Math.floor(device.days_remaining / 24)) : (score >= 90 ? '1d' : '5d');
                const action = score > 90 ? 'Inspect Components' : 'Run Diagnostics';
                
                return (
                  <motion.li 
                    layout
                    key={device.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500 opacity-80" />
                    <div className="flex items-start justify-between mb-3 ml-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 w-4">#{i + 1}</span>
                        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          <Server className="h-3 w-3 text-slate-500" />
                        </div>
                        <p className="text-[14px] font-bold text-slate-800">{device.name}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[16px] font-black text-red-500 leading-none">{Math.round(score)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Risk Score</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 ml-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-semibold">Health Score</span>
                          <span className="text-[12px] font-bold text-slate-700">{100 - Math.round(score)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-semibold">ETA to Failure</span>
                          <span className="text-[12px] font-bold text-amber-600">{daysLeft}</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <PenTool className="h-3.5 w-3.5 text-emerald-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-semibold">Recommended Action</span>
                          <span className="text-[11px] font-bold text-slate-700">{action}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ml-2">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)] relative" 
                        animate={{ width: `${score}%` }}
                        transition={{ ease: "easeInOut", duration: 1 }}
                      />
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
