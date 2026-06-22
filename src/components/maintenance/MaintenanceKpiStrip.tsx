'use client';

import { motion } from 'framer-motion';
import { CalendarClock, AlertTriangle, CalendarCheck, ShieldCheck, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

function AnimatedCounter({ value, prefix = '' }: { value: number, prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
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

  return <span>{prefix}{Math.round(count).toLocaleString()}</span>;
}

export function MaintenanceKpiStrip() {
  const kpis = [
    { title: 'Due This Week', val: 12, icon: CalendarClock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Critical Maintenance', val: 3, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Scheduled Tasks', val: 45, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Prevented Failures', val: 14, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Estimated Savings', val: 185000, prefix: '$', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {kpis.map((k, i) => (
        <motion.div 
          key={k.title}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{k.title}</p>
            <p className="text-xl font-black text-slate-800 mt-0.5 tracking-tight">
              <AnimatedCounter value={k.val} prefix={k.prefix} />
            </p>
          </div>
          <div className={cn("p-2 rounded-lg", k.bg)}>
            <k.icon className={cn("w-4 h-4", k.color)} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
