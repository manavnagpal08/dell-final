'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Activity, Target, ChevronRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockTrendData = [
  { val: 65 }, { val: 68 }, { val: 72 }, { val: 70 }, { val: 75 }, { val: 78 }, { val: 82 }
];

export function ExecutiveAiOverview() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    { id: 1, title: 'Fleet Health', val: '94%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', trend: 'Stable across 85% of nodes' },
    { id: 2, title: 'Risk Level', val: 'Low', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', trend: 'Decreasing due to recent fixes' },
    { id: 3, title: 'Active Alerts', val: '2 Critical', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', trend: 'Cooling Unit F12 flagged' },
    { id: 4, title: 'AI Confidence', val: '98.5%', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', trend: 'Model recently retrained' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div 
          key={card.id}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative h-[120px] perspective-1000"
        >
          <motion.div 
            className="w-full h-full relative preserve-3d transition-all duration-500 shadow-sm hover:shadow-md rounded-2xl cursor-pointer"
            animate={{ rotateX: hoveredCard === card.id ? 180 : 0 }}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">{card.val}</p>
            </div>

            {/* Back of Card (Hover State) */}
            <div className="absolute inset-0 backface-hidden bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between text-white" style={{ transform: 'rotateX(180deg)' }}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7-Day Trend</p>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
              <div className="h-10 w-full mb-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTrendData}>
                    <defs>
                      <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill={`url(#grad-${card.id})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-300 font-medium leading-tight">{card.trend}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
