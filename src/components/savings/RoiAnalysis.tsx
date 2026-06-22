import { DollarSign, Percent, TrendingUp, AlertCircle } from 'lucide-react';

export function RoiAnalysis() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow">
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Financial Efficiency</p>
        <h3 className="text-lg font-bold text-slate-800">ROI Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Investment in Maintenance</p>
          </div>
          <p className="text-2xl font-black text-slate-800">$64,500</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Downtime Cost Avoided</p>
          </div>
          <p className="text-2xl font-black text-emerald-700">$282,500</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Net Savings</p>
          <p className="text-3xl font-black text-indigo-600">$218,000</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ROI %</p>
          <div className="flex items-center gap-1 justify-end text-emerald-500">
            <TrendingUp className="w-5 h-5" />
            <p className="text-3xl font-black">338%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
