'use client';

import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ChevronDown, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGeminiAnalytics } from '@/hooks/useGeminiAnalytics';
import { RefreshCw } from 'lucide-react';

const VIEWS = ['Risk Trend', 'Health Trend', 'Failure Forecast', 'Cost Savings', 'Energy Efficiency', 'Device Stability', 'Maintenance Impact'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-xl">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label || payload[0].name}</p>
      <p className="font-black text-slate-800 text-sm">{payload[0].value}</p>
    </div>
  );
};

export function InteractiveAnalyticsHub() {
  const [activeView, setActiveView] = useState(VIEWS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading } = useGeminiAnalytics();

  const renderChart = () => {
    if (loading || !data) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin mb-2" />
          <p className="text-xs">Generating AI Analytics...</p>
        </div>
      );
    }
    switch(activeView) {
      case 'Failure Forecast':
      case 'Maintenance Impact':
        return (
          <BarChart data={data[activeView === 'Maintenance Impact' ? 'Maintenance Efficiency' : 'Failure Forecast']} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.5)' }} />
            <Bar dataKey="val" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000}>
              {data[activeView === 'Maintenance Impact' ? 'Maintenance Efficiency' : 'Failure Forecast'].map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'Health Trend':
      case 'Device Stability':
        return (
          <LineChart data={data[activeView === 'Health Trend' ? 'Device Health' : 'Network Stability']} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={activeView === 'Health Trend' ? 'day' : 'time'} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#10b981' }} isAnimationActive={true} animationDuration={1000} />
          </LineChart>
        );
      case 'Energy Efficiency':
        return (
          <div className="flex items-center justify-center h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={20} data={data['Power Utilization']}>
                <RadialBar background dataKey="val" cornerRadius={10} isAnimationActive={true} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-black text-emerald-500">{data['Power Utilization']?.[0]?.val || 85}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
            </div>
          </div>
        );
      case 'Cost Savings':
        return (
          <AreaChart data={data['Cost Savings']} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" isAnimationActive={true} animationDuration={1000} />
          </AreaChart>
        );
      default:
        // Risk Trend
        return (
          <AreaChart data={data['Risk Evolution']} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="val" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" isAnimationActive={true} animationDuration={1000} />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-[400px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col relative z-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Interactive Analytics Hub</h3>
        </div>
        
        {/* Dropdown Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm"
          >
            {activeView}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden z-50 py-1"
              >
                {VIEWS.map(v => (
                  <button 
                    key={v}
                    onClick={() => { setActiveView(v); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${v === activeView ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
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
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
