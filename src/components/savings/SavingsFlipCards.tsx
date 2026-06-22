'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Cpu, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardSummary } from '@/types';

export function SavingsFlipCards({ summary }: { summary?: DashboardSummary }) {
  const [flipped, setFlipped] = useState<string | null>(null);

  const savingsStr = `$${((summary?.estimated_cost_savings || 0) / 1000).toFixed(1)}k`;

  const CARDS = [
    { 
      id: 'Savings', icon: TrendingUp, val: savingsStr, label: 'Savings Generated', color: 'text-emerald-500', bg: 'bg-emerald-50', 
      backTitle: 'Value Breakdown', details: [{ l: 'Avoided Repairs', v: `$${((summary?.estimated_cost_savings || 0) * 0.6 / 1000).toFixed(1)}k` }, { l: 'Uptime Value', v: `$${((summary?.estimated_cost_savings || 0) * 0.4 / 1000).toFixed(1)}k` }] 
    },
    { 
      id: 'Incident', icon: ShieldCheck, val: 'Critical Event', label: 'Largest Incident Prevented', color: 'text-indigo-500', bg: 'bg-indigo-50', 
      backTitle: 'Server Rack Incident', details: [{ l: 'Potential Loss', v: '$32.5k' }, { l: 'Confidence', v: '96%' }] 
    },
    { 
      id: 'Asset', icon: Cpu, val: 'Network', label: 'Best Performing Asset', color: 'text-blue-500', bg: 'bg-blue-50', 
      backTitle: 'Core Network', details: [{ l: 'Uptime', v: '99.9%' }, { l: 'Anomalies', v: '0' }] 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {CARDS.map(card => (
        <div key={card.id} className="relative h-[90px] perspective-1000 cursor-pointer group" onClick={() => setFlipped(flipped === card.id ? null : card.id)}>
          <motion.div 
            className="w-full h-full relative preserve-3d transition-all duration-500 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] hover:shadow-md rounded-xl"
            animate={{ rotateX: flipped === card.id ? 180 : 0 }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between group-hover:-translate-y-0.5 transition-transform">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <div className={cn("p-1.5 rounded", card.bg)}>
                  <card.icon className={cn("w-3.5 h-3.5", card.color)} />
                </div>
              </div>
              <p className="text-xl font-black text-slate-800 tracking-tight">{card.val}</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-3 flex flex-col justify-between" style={{ transform: 'rotateX(180deg)' }}>
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{card.backTitle}</p>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="flex justify-between items-end">
                {card.details.map((d, i) => (
                  <div key={i} className={i === 1 ? 'text-right' : ''}>
                    <p className="text-sm font-black text-indigo-700 leading-none">{d.v}</p>
                    <p className="text-[8px] font-bold text-indigo-400/80 uppercase tracking-wider mt-0.5">{d.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
