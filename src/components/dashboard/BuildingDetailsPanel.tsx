'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Server, Activity, Thermometer, Zap, AlertTriangle, X, CheckCircle2, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Device } from '@/types';

export function BuildingDetailsPanel({ 
  device, 
  onClose 
}: { 
  device: Device | null, 
  onClose: () => void 
}) {
  if (!device) return null;

  const getStatusColor = (status: string, riskLevel: string) => {
    if (status === 'Offline') return 'text-slate-500 bg-slate-50 border-slate-200';
    switch (riskLevel) {
      case 'Healthy': return 'text-emerald-500 bg-emerald-50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'Warning': return 'text-amber-500 bg-amber-50 border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'Critical': return 'text-red-500 bg-red-50 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      default: return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string, riskLevel: string) => {
    if (status === 'Offline') return <Server className="h-5 w-5" />;
    switch (riskLevel) {
      case 'Healthy': return <CheckCircle2 className="h-5 w-5" />;
      case 'Warning': return <AlertTriangle className="h-5 w-5" />;
      case 'Critical': return <AlertOctagon className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute top-6 right-6 w-80 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden z-40"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{device.name}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{device.type}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5", getStatusColor(device.status, device.risk_level))}>
                  {getStatusIcon(device.status, device.risk_level)}
                  {device.status === 'Offline' ? 'Offline' : device.risk_level}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Activity className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Health</span>
                </div>
                <p className="text-xl font-black text-slate-800">{device.health_score}%</p>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Risk</span>
                </div>
                <p className="text-xl font-black text-slate-800">{device.risk_score}%</p>
              </div>
              <div className="col-span-2 bg-slate-50/80 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Specs</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-1">{device.vendor} {device.model}</p>
                <p className="text-xs text-slate-500">{device.location}</p>
              </div>
            </div>

            <div className={cn("border rounded-xl p-3 relative overflow-hidden group", device.predicted_failure_type ? "bg-red-50/50 border-red-100" : "bg-blue-50/50 border-blue-100")}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", device.predicted_failure_type ? "text-red-600" : "text-blue-600")}>AI Failure Prediction</p>
              <p className="text-sm font-semibold text-slate-700">
                {device.predicted_failure_type 
                  ? `${device.predicted_failure_type} (in ${device.days_remaining} days)`
                  : 'No imminent failures predicted'}
              </p>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium text-center">Last Telemetry: {new Date(device.last_telemetry_timestamp).toLocaleString()}</p>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
              <Button className={cn("w-full shadow-lg transition-all", device.risk_level === 'Critical' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25')}>
                Send Alert
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full bg-white/50 border-slate-200 text-slate-700">
                  Generate Ticket
                </Button>
                <Button variant="outline" className="w-full bg-indigo-50/50 border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                  View AI Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
