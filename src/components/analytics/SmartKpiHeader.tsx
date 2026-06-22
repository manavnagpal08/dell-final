'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Activity, Target } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Device, Alert } from '@/types';

const mockTrendData = [
  { val: 65 }, { val: 68 }, { val: 72 }, { val: 70 }, { val: 75 }, { val: 78 }, { val: 82 }
];

function AnimatedCounter({ value, isPercent = false }: { value: number | string, isPercent?: boolean }) {
  const [count, setCount] = useState(0);
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

  useEffect(() => {
    let start = 0;
    const end = numValue;
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
  }, [numValue]);

  const display = typeof value === 'string' && value.includes('Risk') 
    ? value 
    : isPercent 
      ? `${count.toFixed(1)}%` 
      : Math.round(count).toString();

  return <span>{display}</span>;
}

export function SmartKpiHeader({ devices = [], alerts = [] }: { devices?: Device[], alerts?: Alert[] }) {
  const healthScore = devices.length > 0 ? devices.reduce((a, b) => a + (b.health_score || 100), 0) / devices.length : 100;
  const riskIndex = healthScore > 80 ? 'Low Risk' : healthScore > 50 ? 'Medium Risk' : 'High Risk';

  const cards = [
    { id: 1, title: 'Fleet Health', val: healthScore, isPercent: true, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 2, title: 'Risk Level', val: riskIndex, isPercent: false, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 3, title: 'Active Alerts', val: alerts.length, isPercent: false, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 4, title: 'AI Confidence', val: 96.5, isPercent: true, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div 
          key={card.id}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-all group flex flex-col justify-between h-[120px] relative overflow-hidden"
        >
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
            <div className={`p-1.5 rounded-lg ${card.bg} group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              <AnimatedCounter value={card.val} isPercent={card.isPercent} />
            </h3>
            
            {/* Mini Sparkline inside card */}
            <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={card.id === 3 ? '#f59e0b' : '#3b82f6'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={card.id === 3 ? '#f59e0b' : '#3b82f6'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke={card.id === 3 ? '#f59e0b' : '#3b82f6'} strokeWidth={2} fillOpacity={1} fill={`url(#grad-${card.id})`} isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
