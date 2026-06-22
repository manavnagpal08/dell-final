import { ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RECS = [
  { id: 'F12', name: 'Cooling Unit F12', risk: 92, rec: 'Replace Fan Assembly', savings: 12400, conf: 89, priority: 'Critical' },
  { id: 'R04', name: 'Router R-04', risk: 85, rec: 'Swap Network Interface', savings: 8700, conf: 82, priority: 'High' },
  { id: 'S01', name: 'Server Rack A', risk: 64, rec: 'Optimize Thermal Load', savings: 4500, conf: 76, priority: 'Medium' }
];

export function AiRecommendationEngine() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Prescriptive Actions</p>
          <h3 className="text-lg font-bold text-slate-800">AI Recommendation Engine</h3>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {RECS.map(r => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden">
            <div className={cn("absolute top-0 left-0 right-0 h-1", r.priority === 'Critical' ? 'bg-red-500' : r.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500')} />
            <div className="flex justify-between items-start mb-4 mt-1">
              <h4 className="font-bold text-slate-800">{r.name}</h4>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider", r.priority === 'Critical' ? 'bg-red-50 text-red-600' : r.priority === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600')}>
                {r.priority}
              </span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">Risk Score</span>
                <span className={cn("font-bold", r.risk >= 90 ? 'text-red-600' : 'text-amber-600')}>{r.risk}%</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm font-bold text-slate-700 flex items-start gap-1.5">
                  <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  {r.rec}
                </p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">AI Confidence</span>
                <span className="font-bold text-blue-600">{r.conf}%</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Est. Savings</p>
              <p className="font-black text-emerald-600 text-lg">${r.savings.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
