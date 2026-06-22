'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Cpu, Activity, ShieldAlert, Radio, Network, Zap, 
  CheckCircle2, AlertTriangle, Crosshair, Fingerprint, Database, Sparkles, AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveDashboardClient({ summary, devices, alerts }: any) {
  const [mounted, setMounted] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setScanLine((prev) => (prev > 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  const criticalCount = devices.filter((d: any) => d.risk_level === 'Critical').length;
  
  return (
    <div className="dark -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-5rem)] bg-[#020617] text-slate-200 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f491a_1px,transparent_1px),linear-gradient(to_bottom,#082f491a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-900/20 rounded-full blur-[120px]" />
        
        {/* Animated Scanline */}
        <div 
          className="absolute left-0 right-0 h-1 bg-cyan-500/20 blur-[2px] shadow-[0_0_20px_rgba(6,182,212,0.5)] z-0"
          style={{ top: `${scanLine}%`, transition: 'top 0.05s linear' }}
        />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 bg-cyan-950 border border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <div className="absolute inset-0 bg-cyan-500/20 animate-ping rounded-lg" />
              <BrainCircuit className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                VYOM <span className="text-cyan-500">AI</span>
              </h1>
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mt-1 animate-pulse">
                Intelligence Before Impact
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-6 bg-slate-900/50 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">System Status</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                LIVE MONITORING
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Active Nodes</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{summary.total_devices}</span>
            </div>
          </div>
        </header>

        {/* --- TOP KPIs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 overflow-hidden transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <Network className="w-5 h-5 text-cyan-400" />
              </div>
              <Activity className="w-4 h-4 text-cyan-500/50" />
            </div>
            <h3 className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-1">Telemetry Stream</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white font-mono">{summary.total_devices}</span>
              <span className="text-cyan-400 text-sm font-bold mb-1 border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 rounded">ONLINE</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="group relative bg-slate-900/60 backdrop-blur-xl border border-red-900/50 hover:border-red-500/80 rounded-2xl p-5 overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(220,38,38,0.05)] hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
          >
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-950/50 rounded-lg border border-red-900/50 relative">
                <div className="absolute inset-0 rounded-lg border border-red-500 animate-ping opacity-20" />
                <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <Radio className="w-4 h-4 text-red-500/50 animate-pulse" />
            </div>
            <h3 className="text-red-400/80 text-xs font-bold tracking-widest uppercase mb-1">Critical At Risk</h3>
            <div className="flex items-end gap-3 relative z-10">
              <span className="text-4xl font-black text-red-400 font-mono drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">{criticalCount}</span>
              <span className="text-red-400 text-sm font-bold mb-1 border border-red-500/20 bg-red-500/10 px-2 py-0.5 rounded">ACTION REQ</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="group relative bg-slate-900/60 backdrop-blur-xl border border-amber-900/50 hover:border-amber-500/50 rounded-2xl p-5 overflow-hidden transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-950/50 rounded-lg border border-amber-900/50">
                <Crosshair className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <h3 className="text-amber-400/80 text-xs font-bold tracking-widest uppercase mb-1">Predicted Fails (30D)</h3>
            <div className="flex items-end gap-3 relative z-10">
              <span className="text-4xl font-black text-amber-400 font-mono">{summary.predicted_failures_30_days}</span>
            </div>
          </motion.div>

          {/* AI RISK ENGINE (Replaced Cost Savings) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="group relative bg-indigo-950/40 backdrop-blur-xl border border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-5 overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')] opacity-50" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-indigo-900/50 rounded-lg border border-indigo-500/50 relative">
                <div className="absolute inset-0 rounded-lg bg-indigo-500/20 blur-md animate-pulse" />
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-indigo-300">98.4% CONFIDENCE</span>
              </div>
            </div>
            <h3 className="text-indigo-300 text-xs font-bold tracking-widest uppercase mb-1 relative z-10">AI Risk Engine</h3>
            <div className="flex items-center gap-3 relative z-10 mt-2">
              <div className="flex-1 h-2 bg-indigo-950 rounded-full overflow-hidden border border-indigo-500/20">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="text-xs font-bold text-indigo-200">ANALYZING</span>
            </div>
          </motion.div>

        </div>

        {/* --- MAIN DASHBOARD AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CENTERPIECE: AI Neural Intelligence Engine */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[500px] flex flex-col shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20"><Fingerprint className="w-32 h-32 text-cyan-500" /></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" />
              <h2 className="text-xl font-black text-white tracking-wider">NEURAL INTELLIGENCE ENGINE</h2>
            </div>

            {/* Simulated Neural Network SVG Visualization */}
            <div className="flex-1 relative border border-slate-800/50 rounded-xl bg-[#020617]/50 overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_50%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#334155" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#334155" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Connection Lines */}
                <path d="M 100 100 Q 300 200 400 200 T 700 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 100 300 Q 300 200 400 200 T 700 300" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite_reverse]" />
                <path d="M 400 50 L 400 350" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
                
                {/* Data Packets */}
                <circle cx="100" cy="100" r="3" fill="#38bdf8" filter="url(#glow)">
                  <animateMotion path="M 100 100 Q 300 200 400 200 T 700 100" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="300" r="3" fill="#f87171" filter="url(#glow)">
                  <animateMotion path="M 100 300 Q 300 200 400 200 T 700 300" dur="4s" repeatCount="indefinite" />
                </circle>
                
                {/* Central AI Node */}
                <g transform="translate(400,200)">
                  <circle r="60" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" className="origin-center animate-[spin_10s_linear_infinite]" />
                  <circle r="45" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" className="origin-center animate-[spin_15s_linear_infinite_reverse]" />
                  <circle r="30" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" className="font-mono">CORE</text>
                </g>

                {/* Peripheral Nodes */}
                {[
                  {x: 100, y: 100, label: 'SRV-01'}, {x: 100, y: 300, label: 'DB-02', alert: true},
                  {x: 700, y: 100, label: 'NET-A'}, {x: 700, y: 300, label: 'STG-X'}
                ].map((node, i) => (
                  <g key={i} transform={`translate(${node.x},${node.y})`}>
                    <circle r="15" fill={node.alert ? '#7f1d1d' : '#0f172a'} stroke={node.alert ? '#ef4444' : '#334155'} strokeWidth="2" filter={node.alert ? 'url(#glow)' : ''} className={node.alert ? 'animate-pulse' : ''} />
                    <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="10" className="font-mono">{node.label}</text>
                  </g>
                ))}
              </svg>

              {/* Overlay HUD */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-slate-300">STREAM: 2.4 TB/s</span>
                </div>
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300">MODELS: ONLINE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ACTIVE ALERTS COMMAND CENTER */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col h-[500px]"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-pulse" />
                <h2 className="text-xl font-black text-white tracking-wider">LIVE ALERTS</h2>
              </div>
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs font-bold animate-pulse">
                {alerts.length} ACTIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {alerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <ShieldAlert className="w-12 h-12 opacity-20" />
                  <p className="font-mono text-sm">NO ANOMALIES DETECTED</p>
                </div>
              ) : (
                alerts.slice(0, 5).map((alert: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                    key={alert.id}
                    className="p-4 rounded-xl border bg-slate-900/80 backdrop-blur-sm relative group overflow-hidden"
                    style={{
                      borderColor: alert.severity === 'Critical' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'
                    }}
                  >
                    {alert.severity === 'Critical' && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]" />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                          alert.severity === 'Critical' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{alert.device_id}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour12: false })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">{alert.title}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-cyan-500 font-mono flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> AI PREDICTED
                      </span>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-cyan-900 border border-slate-700 hover:border-cyan-500 px-3 py-1 rounded transition-colors">
                        Inspect
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(51, 65, 85, 0.8); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.8); }
        @keyframes dash { to { stroke-dashoffset: -100; } }
        @keyframes dash_reverse { to { stroke-dashoffset: 100; } }
      `}</style>
    </div>
  );
}
