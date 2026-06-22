'use client';

import { DollarSign, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const LEADERBOARD = [
  { id: 'HVAC-001', name: 'Cooling Unit F12', prevented: 12400, type: 'Cooling Fan Failure', conf: 92, risk: 'Critical' },
  { id: 'NET-004', name: 'Router R-04', prevented: 8700, type: 'Network Failure', conf: 85, risk: 'Warning' },
  { id: 'SRV-088', name: 'Server Rack A', prevented: 32500, type: 'Motherboard Burnout', conf: 96, risk: 'Critical' },
  { id: 'PWR-012', name: 'Main UPS Unit', prevented: 45000, type: 'Total Power Loss', conf: 89, risk: 'Critical' },
  { id: 'STR-003', name: 'Storage Node C', prevented: 6200, type: 'Drive Array Failure', conf: 78, risk: 'Warning' },
].sort((a, b) => b.prevented - a.prevented);

export function DeviceSavingsLeaderboard() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rankings</p>
        <h3 className="text-lg font-bold text-slate-800">Device Savings Leaderboard</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {LEADERBOARD.map((dev, i) => (
          <div key={dev.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors group/item">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-100 shrink-0">
                #{i + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  {dev.name}
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider", dev.risk === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}>{dev.risk}</span>
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{dev.type} (Conf: {dev.conf}%)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1"><ShieldCheck className="w-3 h-3" /> Prevented</p>
              <p className="font-black text-slate-800 text-lg">${dev.prevented.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
