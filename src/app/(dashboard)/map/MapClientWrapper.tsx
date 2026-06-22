'use client';

import { useState } from 'react';
import { InfrastructureMap } from '@/components/dashboard/InfrastructureMap';
import { PageTransition } from '@/components/layout/PageTransition';
import { Switch } from '@/components/ui/switch';
import { Activity, Server, ShieldAlert, WifiOff, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Device } from '@/types';

export function MapClientWrapper({ devices }: { devices: Device[] }) {
  const [riskHeatmapEnabled, setRiskHeatmapEnabled] = useState(false);

  const total = devices.length;
  const healthy = devices.filter(d => d.risk_level === 'Healthy').length;
  const warning = devices.filter(d => d.risk_level === 'Warning').length;
  const critical = devices.filter(d => d.risk_level === 'Critical').length;
  const offline = devices.filter(d => d.status === 'Offline').length;
  const predicted = devices.filter(d => d.predicted_failure_type !== null).length;

  return (
    <PageTransition className="h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden bg-slate-50 p-6">
      
      {/* Top Floating Statistics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Map Overview</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Alliance University Digital Twin</p>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 p-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-xl">
            <Server className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Total Devices</p>
              <p className="text-sm font-black text-slate-800">{total}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Healthy</p>
              <p className="text-sm font-black text-slate-800">{healthy}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Warning</p>
              <p className="text-sm font-black text-slate-800">{warning}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Critical</p>
              <p className="text-sm font-black text-red-600">{critical}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <WifiOff className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Offline</p>
              <p className="text-sm font-black text-slate-800">{offline}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-xl">
            <Zap className="w-4 h-4 text-indigo-600" />
            <div>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Failures (7D)</p>
              <p className="text-sm font-black text-indigo-700">{predicted} Predicted</p>
            </div>
          </div>
        </div>

        {/* Heatmap Toggle */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 px-4 py-2.5 rounded-2xl shadow-sm">
          <Activity className={cn("w-4 h-4", riskHeatmapEnabled ? "text-indigo-600" : "text-slate-400")} />
          <span className="text-xs font-bold text-slate-700">AI Risk Heatmap</span>
          <Switch 
            checked={riskHeatmapEnabled} 
            onCheckedChange={setRiskHeatmapEnabled} 
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="flex-1 w-full relative z-0">
        <InfrastructureMap devices={devices} />
      </div>

    </PageTransition>
  );
}
