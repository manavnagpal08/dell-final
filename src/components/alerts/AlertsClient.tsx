'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle, Eye, X, FileText, CalendarClock, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const sevConfig: Record<string, { badge: string; dot: string; border: string }> = {
  Critical: { badge: 'vy-badge-red',   dot: 'bg-red-500',   border: 'border-l-red-400' },
  Warning:  { badge: 'vy-badge-amber', dot: 'bg-amber-400', border: 'border-l-amber-400' },
  Info:     { badge: 'vy-badge-blue',  dot: 'bg-blue-400',  border: 'border-l-blue-400' },
};

const statusBadge: Record<string, string> = {
  Active:        'vy-badge-red',
  Investigating: 'vy-badge-amber',
  Acknowledged:  'vy-badge-blue',
  Resolved:      'vy-badge-green',
  Open:          'vy-badge-red',
};

export function AlertsClient({ allAlerts, initialFilter, initialSearch }: { allAlerts: any[], initialFilter: string, initialSearch: string }) {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState(initialSearch);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  
  // Local state to simulate resolving alerts
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const activeAlerts = allAlerts.filter(a => !resolvedIds.has(a.id));

  const filtered = activeAlerts.filter(a => {
    const matchesSev = filter === 'All' || a.severity === filter;
    const matchesSearch = !search || a.device_id.toLowerCase().includes(search.toLowerCase()) || a.failure_type.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const counts = {
    Critical: activeAlerts.filter(a => a.severity === 'Critical').length,
    Warning:  activeAlerts.filter(a => a.severity === 'Warning').length,
    Info:     activeAlerts.filter(a => a.severity === 'Info').length,
    Total:    activeAlerts.length,
  };

  const handleResolve = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setResolvedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (selectedAlert?.id === id) {
      setSelectedAlert(null);
    }
  };

  const handleSchedule = () => {
    // Simulated scheduling integration
    alert('Task sent to Maintenance AI calendar.');
  };

  const handleGenerateReport = () => {
    // Simulated PDF generation
    alert('AI Diagnostic Report PDF generated.');
  };

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="live-dot live-dot-red" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Live Alerts Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Active Alerts</h1>
          <p className="text-slate-500 text-sm mt-0.5">AI-generated risk alerts with investigation tracking.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 vy-card rounded-xl">
          <Bell className="h-4 w-4 text-red-500" />
          <span className="text-sm font-bold text-slate-800">{counts.Total} Active</span>
          <span className="text-xs text-slate-400">alerts</span>
        </div>
      </div>

      {/* Category chips */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
        {(['Critical', 'Warning', 'Info'] as const).map(sev => {
          const cfg = sevConfig[sev];
          const isActive = filter === sev;
          const count = sev === 'Critical' ? counts.Critical : sev === 'Warning' ? counts.Warning : counts.Info;
          return (
            <button key={sev} onClick={() => setFilter(isActive ? 'All' : sev)}
              className={cn('block w-full vy-card rounded-xl p-4 text-left transition-all hover:shadow-md cursor-pointer', isActive && 'ring-2 ring-indigo-400 ring-offset-1')}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{sev}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-400 mt-0.5">Alerts</p>
            </button>
          );
        })}
        <button onClick={() => setFilter('All')} className={cn('block w-full vy-card rounded-xl p-4 text-left transition-all hover:shadow-md cursor-pointer', filter === 'All' && 'ring-2 ring-indigo-400 ring-offset-1')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{counts.Total}</p>
          <p className="text-xs text-slate-400 mt-0.5">All Alerts</p>
        </button>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const cfg = sevConfig[alert.severity] || sevConfig['Medium'];
          const prob = Math.round((alert.failure_probability || 0) * 100);
          return (
            <div key={alert.id} className={cn('vy-card rounded-xl border-l-4 p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300', cfg.border)}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', cfg.badge)}>{alert.severity}</span>
                    <span className="text-sm font-bold text-slate-800">{alert.failure_type}</span>
                    <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{alert.device_id}</span>
                    <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto', statusBadge[alert.status] || 'vy-badge-blue')}>{alert.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{alert.recommended_action}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span>{new Date(alert.time_generated).toLocaleString()}</span>
                    <span className="text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Maintenance Scheduled: 22 Jun 2026 • 10:00 AM</span>
                  </div>
                </div>

                <div className="md:w-44 space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 shrink-0 flex flex-col justify-center">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedAlert(alert)} className="flex-1 text-[10px] font-bold py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1 transition-colors">
                      <Eye className="h-3 w-3" /> Investigate
                    </button>
                    <button onClick={(e) => handleResolve(alert.id, e)} className="flex-1 text-[10px] font-bold py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center gap-1 transition-colors">
                      <CheckCircle className="h-3 w-3" /> Resolve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">No active alerts found.</div>
        )}
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {selectedAlert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAlert(null)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-800">
                  <Search className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold">Investigation Details</h3>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
                {/* Header Info */}
                <div>
                  <h2 className="text-xl font-black text-slate-800">{selectedAlert.device_id}</h2>
                  <p className="text-sm font-semibold text-indigo-600 mb-4">{selectedAlert.failure_type}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Prob</p>
                      <p className={cn("text-lg font-black", Math.round(selectedAlert.failure_probability * 100) >= 80 ? 'text-red-500' : 'text-amber-500')}>{Math.round(selectedAlert.failure_probability * 100)}%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                      <p className="text-lg font-black text-blue-500">94%</p>
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Root Cause Analysis</h4>
                    <p className="text-slate-600 leading-relaxed text-xs">Vibration and thermal data indicates early-stage mechanical wear. Matches historic failure pattern #882.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Recommended Action</h4>
                    <p className="text-slate-600 leading-relaxed text-xs">{selectedAlert.recommended_action}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Est. Downtime</h4>
                      <p className="text-slate-600 text-xs font-semibold">2 Hours</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Est. Savings</h4>
                      <p className="text-emerald-600 text-xs font-bold">$12,400</p>
                    </div>
                  </div>
                </div>

                {/* Expandable Alert History */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-between p-3 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Alert History
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showHistory && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 bg-white space-y-3">
                          {[
                            { t: '09:49 PM', a: 'Alert Generated' },
                            { t: '09:50 PM', a: 'AI Analysis Completed' },
                            { t: '09:52 PM', a: 'Maintenance Recommended' },
                            { t: '09:55 PM', a: 'Maintenance Scheduled' },
                            { t: '10:01 PM', a: 'Notice Sent' },
                          ].map((h, i) => (
                            <div key={i} className="flex gap-3 text-[11px]">
                              <span className="font-bold text-slate-400 w-16 shrink-0">{h.t}</span>
                              <span className="font-semibold text-slate-700">{h.a}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expandable Workflow Progress */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setShowWorkflow(!showWorkflow)} className="w-full flex items-center justify-between p-3 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Workflow Progress
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showWorkflow && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showWorkflow && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 bg-white">
                          <div className="relative pl-4 space-y-4 before:absolute before:inset-y-2 before:left-[7px] before:w-0.5 before:bg-slate-100">
                            {[
                              { label: 'Alert Generated', active: true },
                              { label: 'AI Investigation', active: true },
                              { label: 'Report Generated', active: false },
                              { label: 'Maintenance Scheduled', active: true },
                              { label: 'Notice Sent', active: false },
                              { label: 'Resolved', active: false },
                            ].map((step, i) => (
                              <div key={i} className="relative flex items-center text-[11px] font-bold">
                                <div className={cn("absolute -left-5 w-2 h-2 rounded-full border-2 border-white box-content", step.active ? "bg-blue-500" : "bg-slate-200")} />
                                <span className={cn(step.active ? "text-slate-800" : "text-slate-400")}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 shrink-0">
                <button onClick={handleGenerateReport} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                  <FileText className="w-3.5 h-3.5" /> Report
                </button>
                <button onClick={handleSchedule} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                  <CalendarClock className="w-3.5 h-3.5" /> Schedule
                </button>
                <button onClick={() => handleResolve(selectedAlert.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> Resolve
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
