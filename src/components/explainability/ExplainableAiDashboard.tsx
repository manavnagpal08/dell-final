'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, ChevronDown, Activity, Zap, FileText, CheckCircle, 
  History, Eye, ShieldAlert, Cpu, Share2, Network, Thermometer, Fan
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDevices } from '@/lib/api';
import { Device } from '@/types';

const getIconForType = (type: string) => {
  if (type === 'Cooling') return Fan;
  if (type === 'Storage') return FileText;
  if (type === 'Network') return Network;
  if (type === 'Server') return Cpu;
  if (type === 'Database') return Zap;
  return Activity;
};

export function ExplainableAiDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Server');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeChart, setActiveChart] = useState('Feature Importance');
  const [showHistory, setShowHistory] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    getDevices().then(data => {
      setDevices(data);
      if (data.length > 0) {
        setActiveCategory(data[0].type || 'Server');
        setSelectedDevice(data[0]);
      }
    });
  }, []);

  const types = Array.from(new Set(devices.map(d => d.type || 'Server')));
  
  const groups = types.map(type => ({
    id: type,
    title: `${type} Systems`,
    icon: getIconForType(type),
    devices: devices.filter(d => (d.type || 'Server') === type).map(d => ({
      ...d,
      risk: d.risk_score || 0,
      status: (d.risk_score || 0) >= 80 ? 'red' : (d.risk_score || 0) >= 40 ? 'amber' : 'emerald'
    }))
  }));

  const currentGroup = groups.find(g => g.id === activeCategory) || groups[0];

  if (devices.length === 0) {
    return <div className="p-8 text-slate-400">Loading AI Explainability Models...</div>;
  }

  const selectedDeviceObj = selectedDevice ? currentGroup?.devices?.find(d => d.id === selectedDevice.id) || currentGroup?.devices?.[0] : currentGroup?.devices?.[0];

  if (!selectedDeviceObj) {
    return <div className="p-8 text-slate-400">No devices available in this category.</div>;
  }

  const riskScore = selectedDeviceObj.risk;
  const isHealthy = riskScore < 40;

  const reasoningFactors = isHealthy ? [
    { name: 'Nominal Operation', val: 95, color: 'bg-emerald-500' },
    { name: 'Stable Temperature', val: 80, color: 'bg-emerald-400' },
  ] : [
    { name: 'Temperature Variance', val: Math.round(riskScore * 0.4), color: 'bg-red-500' },
    { name: 'Performance Degradation', val: Math.round(riskScore * 0.3), color: 'bg-orange-500' },
    { name: 'Historical Pattern Match', val: Math.round(riskScore * 0.2), color: 'bg-amber-500' },
  ];

  const devicesRequiringExplanation = devices.filter(d => (d.risk_score || 0) >= 40).length;

  return (
    <div className="flex flex-col gap-4 h-full relative">
      
      {/* 1. Top Summary Cards */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 shadow-sm flex items-center justify-between shrink-0 overflow-x-auto custom-scrollbar">
        {[
          { l: 'Total Devices Analyzed', v: devices.length.toString() },
          { l: 'Devices Requiring Explanation', v: devicesRequiringExplanation.toString() },
          { l: 'Average AI Confidence', v: '96%' },
          { l: 'Models Active', v: '8' },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-2 px-4 border-r border-slate-100 last:border-0 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.l}:</span>
            <span className="text-lg font-black text-slate-800">{stat.v}</span>
          </div>
        ))}
      </div>

      {/* Main Split Layout */}
      <div className="grid lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* LEFT PANEL: Device Explorer (30%) */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl flex flex-col shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Category</h3>
            <div className="relative">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-slate-300 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {currentGroup?.icon && <currentGroup.icon className="w-4 h-4 text-indigo-500" />}
                  {currentGroup?.title}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              
              <AnimatePresence>
                {showCategoryDropdown && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCategoryDropdown(false)} className="fixed inset-0 z-10" />
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                      {groups.map(group => (
                        <button
                          key={group.id}
                          onClick={() => {
                            setActiveCategory(group.id);
                            setShowCategoryDropdown(false);
                            if (group.devices.length > 0) setSelectedDevice(group.devices[0] as any);
                          }}
                          className={cn("w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors", activeCategory === group.id ? "text-indigo-600 bg-indigo-50/50" : "text-slate-600")}
                        >
                          <group.icon className={cn("w-4 h-4", activeCategory === group.id ? "text-indigo-500" : "text-slate-400")} />
                          {group.title}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1 mb-2">Devices</h3>
            {currentGroup?.devices?.map(dev => (
              <button 
                key={dev.id}
                onClick={() => setSelectedDevice(dev as any)}
                className={cn(
                  "w-full text-left p-3 rounded-lg flex items-center justify-between transition-all",
                  selectedDeviceObj?.id === dev.id ? "bg-indigo-50 border border-indigo-100 shadow-sm" : "bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                )}
              >
                <div className="truncate pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{dev.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">ID: {dev.id}</p>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", dev.status === 'red' ? 'text-red-500' : dev.status === 'amber' ? 'text-amber-500' : 'text-emerald-500')}>
                    Risk: {dev.risk}%
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-1.5 w-16">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", `bg-${dev.status}-500`)} style={{ width: `${Math.max(dev.risk, 5)}%` }} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN PANEL: AI Decision Explanation (70%) */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">AI Decision Explanation</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800">{selectedDeviceObj.name}</h2>
            </div>
            
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Risk Score</p>
                <p className={cn("text-2xl font-black", selectedDeviceObj.risk >= 80 ? 'text-red-500' : selectedDeviceObj.risk >= 40 ? 'text-amber-500' : 'text-emerald-500')}>
                  {selectedDeviceObj.risk}%
                </p>
              </div>
              <div className="text-right border-l border-slate-200 pl-6">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">AI Confidence</p>
                <p className="text-2xl font-black text-blue-600">96%</p>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* AI REASONING BREAKDOWN */}
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800">AI Reasoning Breakdown</h3>
                
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                    {activeChart} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                    {['Feature Importance', 'Sensor Correlation', 'Historical Comparison'].map(opt => (
                      <button key={opt} onClick={() => setActiveChart(opt)} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {reasoningFactors.map((factor, i) => (
                  <div key={i} className="group relative">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">{factor.name}</span>
                      <span className="text-slate-500">{isHealthy ? '' : '+'}{factor.val}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${factor.val}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                        className={cn("h-full rounded-full", factor.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROOT CAUSE EXPLAINER */}
            <div className={cn("border rounded-xl p-5 shadow-sm relative overflow-hidden", isHealthy ? "bg-emerald-50/50 border-emerald-100" : "bg-blue-50/50 border-blue-100")}>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <BrainCircuit className={cn("w-24 h-24", isHealthy ? "text-emerald-600" : "text-blue-600")} />
              </div>
              <h3 className={cn("text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 relative z-10", isHealthy ? "text-emerald-600" : "text-blue-600")}>
                <FileText className="w-3.5 h-3.5" /> {isHealthy ? 'System Analysis' : 'Root Cause Explainer'}
              </h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed relative z-10">
                {isHealthy 
                  ? "The model detected no significant anomalies. Sensor readings are within nominal baseline thresholds. Machine learning models predict stable operation."
                  : `"The model detected anomalies correlating with ${selectedDeviceObj.predicted_failure_type || 'hardware stress'}. Similar conditions were observed in historical cases that resulted in degradation."`
                }
              </p>
            </div>

            {/* HISTORICAL EVIDENCE */}
            {!isHealthy && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-between p-4 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2"><History className="w-4 h-4 text-indigo-500" /> Historical Evidence</span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showHistory && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {showHistory && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-5 bg-white border-t border-slate-100 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Similar Cases</p>
                          <p className="text-2xl font-black text-slate-800">87</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Failure Time</p>
                          <p className="text-2xl font-black text-amber-500">{selectedDeviceObj.days_remaining || 14} Days</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Similarity Score</p>
                          <p className="text-2xl font-black text-indigo-500">91%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* AI DECISION TIMELINE */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => setShowTimeline(!showTimeline)} className="w-full flex items-center justify-between p-4 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> AI Decision Journey</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showTimeline && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showTimeline && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-6 bg-white border-t border-slate-100">
                      <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-100">
                        {[
                          { l: 'Sensor Data Collected', d: 'Continuous monitoring recorded operation metrics.' },
                          { l: isHealthy ? 'Pattern Matched Baseline' : 'Anomaly Detected', d: isHealthy ? 'Readings matched healthy signatures.' : 'Neural network identified early signs of stress.' },
                          { l: 'Risk Scored', d: `Probability model assigned ${riskScore}% risk.` },
                          { l: 'Decision Explained', d: 'Feature weights extracted for transparency.', highlight: true },
                        ].map((step, i) => (
                          <div key={i} className="relative">
                            <div className={cn("absolute -left-[29px] w-3 h-3 rounded-full border-2 border-white box-content shadow-sm", step.highlight ? "bg-indigo-500" : "bg-blue-400")} />
                            <h4 className={cn("text-xs font-bold mb-0.5", step.highlight ? "text-indigo-600" : "text-slate-800")}>{step.l}</h4>
                            <p className="text-[11px] font-medium text-slate-500 leading-tight">{step.d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
