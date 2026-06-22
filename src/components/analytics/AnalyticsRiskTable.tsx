'use client';

import { Device } from '@/types';
import { Clock, CheckCircle2, ShieldAlert, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalyticsRiskTable({ devices }: { devices: Device[] }) {
  const topRisky = [...devices].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0)).slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-base font-bold text-slate-800">Advanced Device Risk Analysis</h2>
        <p className="text-[13px] text-slate-500 font-medium">Predictive overview of impending failures across the fleet</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Device</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Health Score</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Failure Prob.</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Predicted Failure Type</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Days Until Failure</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Recommended Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {topRisky.map((d, i) => {
              const prob = Math.min(99, Math.round((d.risk_score || 0) + 12));
              const health = Math.max(1, Math.round(100 - prob));
              const eta = d.risk_score > 90 ? '2 Days' : d.risk_score > 70 ? '5 Days' : '14 Days';
              const type = d.risk_score > 90 ? 'Cooling Failure' : 'Thermal Anomaly';
              const action = d.risk_score > 90 ? 'Replace Cooling Fan' : 'Inspect Components';

              return (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-[13px]">{d.name}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{d.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-bold text-emerald-700">{health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000", prob > 80 ? 'bg-red-500' : 'bg-amber-500')} style={{ width: `${prob}%` }} />
                      </div>
                      <span className={cn("font-bold text-[12px]", prob > 80 ? 'text-red-600' : 'text-amber-600')}>{prob}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700 text-[13px]">{type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 inline-flex px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-bold text-[11px]">{eta}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-slate-700 text-[12px]">{action}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
