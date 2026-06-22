'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, ShieldCheck, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Device, DashboardSummary } from '@/types';

export function FlipAnalyticsCards({ devices = [], summary }: { devices?: Device[], summary?: DashboardSummary }) {
  const [flipped, setFlipped] = useState<string | null>(null);

  const healthScore = devices.length > 0 ? devices.reduce((a, b) => a + (b.health_score || 100), 0) / devices.length : 100;
  const criticalCount = devices.filter(d => d.risk_level === 'Critical').length;
  const warningCount = devices.filter(d => d.risk_level === 'Warning').length;

  const CARDS = [
    { id: 'Risk', icon: AlertTriangle, val: `${(100 - healthScore).toFixed(1)}%`, label: 'Avg Risk', color: 'text-red-500', bg: 'bg-red-50', backTitle: 'Risk Breakdown', backVal1: criticalCount.toString(), backLbl1: 'Critical', backVal2: warningCount.toString(), backLbl2: 'Warning' },
    { id: 'Savings', icon: DollarSign, val: `$${((summary?.estimated_cost_savings || 0) / 1000).toFixed(1)}k`, label: 'Net Saved', color: 'text-emerald-500', bg: 'bg-emerald-50', backTitle: 'Cost Analysis', backVal1: '84%', backLbl1: 'ROI', backVal2: `$${(criticalCount * 4.5).toFixed(1)}k`, backLbl2: 'At Risk' },
    { id: 'Health', icon: ShieldCheck, val: `${healthScore.toFixed(1)}%`, label: 'System Health', color: 'text-blue-500', bg: 'bg-blue-50', backTitle: 'Health Status', backVal1: '98%', backLbl1: 'Network', backVal2: '88%', backLbl2: 'Power' },
    { id: 'Predictions', icon: Target, val: '98.5%', label: 'AI Accuracy', color: 'text-indigo-500', bg: 'bg-indigo-50', backTitle: 'Model Insights', backVal1: summary?.predicted_failures_30_days?.toString() || '0', backLbl1: 'Failures (30d)', backVal2: '14h', backLbl2: 'Window' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(card => (
        <div key={card.id} className="relative h-[100px] perspective-1000 cursor-pointer group" onClick={() => setFlipped(flipped === card.id ? null : card.id)}>
          <motion.div 
            className="w-full h-full relative preserve-3d transition-all duration-500 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] hover:shadow-md rounded-xl"
            animate={{ rotateX: flipped === card.id ? 180 : 0 }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between group-hover:-translate-y-0.5 transition-transform">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.id}</p>
                <div className={cn("p-1.5 rounded-lg", card.bg)}>
                  <card.icon className={cn("w-3.5 h-3.5", card.color)} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{card.val}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-3 flex flex-col justify-between" style={{ transform: 'rotateX(180deg)' }}>
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{card.backTitle}</p>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-black text-indigo-700 leading-none">{card.backVal1}</p>
                  <p className="text-[9px] font-bold text-indigo-400/80 uppercase tracking-wider mt-0.5">{card.backLbl1}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-indigo-700 leading-none">{card.backVal2}</p>
                  <p className="text-[9px] font-bold text-indigo-400/80 uppercase tracking-wider mt-0.5">{card.backLbl2}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
