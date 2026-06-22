'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ShieldCheck, Clock, Target } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { DashboardSummary } from '@/types';

const mockTrendData = [
  { val: 65 }, { val: 68 }, { val: 72 }, { val: 70 }, { val: 75 }, { val: 78 }, { val: 82 }
];

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
        setCount(end);
        return;
    }
    let timer = setInterval(() => {
      start += (end - start) / 5;
      if (end - start < 0.5) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{Math.round(count).toLocaleString()}{suffix}</span>;
}

export function SavingsKpiHeader({ summary }: { summary?: DashboardSummary }) {
  const savings = summary?.estimated_cost_savings || 0;
  const downtime = summary?.estimated_downtime_prevented || 0;
  const preventions = summary?.predicted_failures_30_days || 0;

  const cards = [
    { id: 1, title: 'Money Saved', val: savings, prefix: '$', suffix: '', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', trendColor: '#10b981' },
    { id: 2, title: 'ROI', val: 338, prefix: '', suffix: '%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', trendColor: '#3b82f6' },
    { id: 3, title: 'Failures Prevented', val: preventions, prefix: '', suffix: '', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50', trendColor: '#6366f1' },
    { id: 4, title: 'Downtime Prevented', val: downtime, prefix: '', suffix: 'h', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50', trendColor: '#a855f7' },
    { id: 5, title: 'Accuracy', val: 98, prefix: '', suffix: '%', icon: Target, color: 'text-pink-500', bg: 'bg-pink-50', trendColor: '#ec4899' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <motion.div 
          key={card.id}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-all group flex flex-col justify-between h-[90px] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
            <div className={`p-1 rounded ${card.bg} group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-3 h-3 ${card.color}`} />
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              <AnimatedCounter value={card.val} prefix={card.prefix} suffix={card.suffix} />
            </h3>
            
            <div className="w-12 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id={`gradS-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={card.trendColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={card.trendColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke={card.trendColor} strokeWidth={1.5} fillOpacity={1} fill={`url(#gradS-${card.id})`} isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
