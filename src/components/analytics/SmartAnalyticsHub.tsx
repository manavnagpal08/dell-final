'use client';

import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ChevronDown, BarChart2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGeminiAnalytics } from '@/hooks/useGeminiAnalytics';

const VIEWS = ['Risk Evolution', 'Failure Forecast', 'Device Health', 'Cost Savings', 'Maintenance Efficiency', 'Power Utilization', 'Network Stability'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-md border border-slate-200 shadow-md">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label || payload[0].name}</p>
      <p className="font-black text-slate-800 text-xs">{payload[0].value}</p>
    </div>
  );
};

export function SmartAnalyticsHub() {
  const [activeView, setActiveView] = useState(VIEWS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading } = useGeminiAnalytics();

  const renderChart = () => {

    switch(activeView) {
      case 'Failure Forecast':
      case 'Maintenance Efficiency':
        return (
          <BarChart data={data[activeView as keyof typeof data]} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} dy={5} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.5)' }} />
            <Bar dataKey="val" radius={[3, 3, 0, 0]} isAnimationActive={true} animationDuration={1000} barSize={30}>
              {data[activeView as keyof typeof data].map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'Device Health':
      case 'Network Stability':
        return (
          <LineChart data={data[activeView as keyof typeof data]} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={activeView === 'Device Health' ? 'day' : 'time'} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} dy={5} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 5, fill: '#10b981' }} isAnimationActive={true} animationDuration={1000} />
          </LineChart>
        );
      case 'Power Utilization':
        return (
          <div className="flex items-center justify-center h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={15} data={data['Power Utilization']}>
                <RadialBar background dataKey="val" cornerRadius={8} isAnimationActive={true} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-xl font-black text-emerald-500">{data['Power Utilization']?.[0]?.val || 85}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
            </div>
          </div>
        );
      case 'Cost Savings':
        return (
          <AreaChart data={data['Cost Savings']} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} dy={5} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" isAnimationActive={true} animationDuration={1000} />
          </AreaChart>
        );
      default:
        // Risk Evolution
        return (
          <AreaChart data={data['Risk Evolution']} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} dy={5} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="val" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" isAnimationActive={true} animationDuration={1000} />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 h-[240px] shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] flex flex-col relative z-20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-indigo-50 rounded text-indigo-600">
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Smart Analytics Hub</h3>
        </div>
        
        {/* Dropdown Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-colors shadow-sm"
          >
            {activeView}
            <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isOpen && 'rotate-180')} />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 py-1"
              >
                {VIEWS.map(v => (
                  <button 
                    key={v} onClick={() => { setActiveView(v); setIsOpen(false); }}
                    className={cn("w-full text-left px-3 py-2 text-[10px] font-bold transition-colors", v === activeView ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50')}
                  >
                    {v}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, filter: 'blur(2px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(2px)' }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {loading || !data ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin mb-2" />
                <p className="text-xs">Generating AI Analytics...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
