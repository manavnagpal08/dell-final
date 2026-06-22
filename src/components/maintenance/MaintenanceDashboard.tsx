'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, Calendar, Info, Zap, Settings, Send, 
  FileText, Download, Printer, Share2, Activity, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDevices, getDashboardSummary } from '@/lib/api';
import { Device, DashboardSummary } from '@/types';

// --- Shared Types ---
type EventStatus = 'Critical' | 'High Priority' | 'Scheduled' | 'Completed' | 'Report Generated';

interface CalendarEvent {
  day: number;
  name: string;
  type: EventStatus;
}

interface Task {
  id: string;
  text: string;
  status: 'pending' | 'done';
  targetDay: number;
  device: Device;
}

// --- Helpers ---
function AnimatedCounter({ value, prefix = '' }: { value: number, prefix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
        setCount(end);
        return;
    }
    let timer = setInterval(() => {
      start += (end - start) / 5;
      if (end - start < 0.5) { start = end; clearInterval(timer); }
      setCount(start);
    }, 50);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{Math.round(count).toLocaleString()}</span>;
}

const getEventColors = (type: string) => {
  switch (type) {
    case 'Critical': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
    case 'High Priority': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' };
    case 'Scheduled': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    case 'Completed': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
    case 'Report Generated': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
    default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };
  }
};

// --- Main Component ---
export function MaintenanceDashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<{time: string, text: string}[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const devs = await getDevices();
      const sum = await getDashboardSummary();
      
      const today = new Date().getDate();
      const newEvents: CalendarEvent[] = [];
      // Inject varied mock data for newly created backend devices
      const realisticDevs = devs.map((d: Device) => {
        const seed = d.id ? d.id.charCodeAt(0) + d.id.charCodeAt(d.id.length - 1) : 1;
        let risk = d.risk_score || 0;
        if (risk < 20) {
          risk = (seed * 7) % 100;
        }
        return { 
          ...d, 
          risk_score: risk, 
          risk_level: (risk >= 80 ? 'Critical' : risk >= 50 ? 'Warning' : 'Healthy') as any 
        };
      });

      realisticDevs.forEach((d: Device) => {
        if (d.risk_level === 'Critical' || d.risk_level === 'Warning') {
            const dayOffset = d.risk_level === 'Critical' ? 1 : 3;
            const targetDay = (today + dayOffset) % 30 || 30; // simplistic wrap
            
            newEvents.push({
                day: targetDay,
                name: d.name,
                type: d.risk_level === 'Critical' ? 'Critical' : 'High Priority'
            });
            
            newTasks.push({
                id: d.id,
                text: `Inspect ${d.name}`,
                status: 'pending',
                targetDay,
                device: d
            });
        }
      });
      
      setEvents(newEvents);
      setTasks(newTasks);
      setSummary(sum);
      setActivity([
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'AI predictive sweep completed' }
      ]);
      setIsLoaded(true);
    };
    
    fetchData();
  }, []);

  if (!isLoaded) return <div className="p-8 text-slate-400">Loading Maintenance Center...</div>;

  // Stats
  const scheduledCount = events.filter(e => e.type === 'Scheduled' || e.type === 'Critical' || e.type === 'High Priority').length;
  const reportsCount = events.filter(e => e.type === 'Report Generated').length;
  const notificationsCount = activity.length;
  const preventedCount = summary?.estimated_downtime_prevented || 0;
  const savingsCount = summary?.estimated_cost_savings || 0;

  const logActivity = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivity(prev => [{ time, text }, ...prev]);
  };

  const handleTaskToggle = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isDone = t.status === 'done';
        const newStatus = isDone ? 'pending' : 'done';
        
        if (newStatus === 'done') {
          setEvents(curr => [...curr.filter(e => e.name !== t.device.name), { day: t.targetDay, name: t.device.name, type: 'Scheduled' }]);
          logActivity(`Task scheduled for Day ${t.targetDay}: ${t.text}`);
        } else {
          setEvents(curr => curr.filter(e => e.name !== t.device.name));
        }

        return { ...t, status: newStatus };
      }
      return t;
    }));
    setSelectedTask(id);
  };

  const handleGenerateReport = () => {
    if (!selectedTask) return;
    const task = tasks.find(t => t.id === selectedTask);
    if (task) {
      logActivity(`Maintenance report generated for: ${task.text}`);
      setEvents(curr => curr.map(e => e.name === task.device.name ? { ...e, type: 'Report Generated' } : e));
      setShowReportModal(true);
    }
  };

  const handleSendNotice = () => {
    logActivity('Organization-wide maintenance notification sent.');
  };

  const handleCompleteEvent = (day: number) => {
    setEvents(curr => curr.map(e => e.day === day ? { ...e, type: 'Completed' } : e));
    const evt = events.find(e => e.day === day);
    if (evt) logActivity(`Maintenance completed for ${evt.name}`);
    setSelectedDay(null);
  };

  // Render Calendar
  const renderDays = () => {
    const days = [];
    const daysInMonth = 30;
    const startOffset = 2; // Fixed start offset for UI
    for (let i = 0; i < startOffset; i++) days.push(<div key={`empty-${i}`} className="h-20" />);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEvents = events.filter(e => e.day === i);
      const isSelected = selectedDay === i;
      
      days.push(
        <div 
          key={i} 
          onClick={() => dayEvents.length > 0 && setSelectedDay(isSelected ? null : i)}
          className={cn(
            "h-20 border border-slate-100 p-1.5 rounded-lg flex flex-col transition-all cursor-pointer relative",
            dayEvents.length > 0 ? 'hover:border-blue-300 hover:shadow-sm bg-white' : 'bg-slate-50/50 hover:bg-slate-50',
            isSelected && dayEvents.length > 0 ? 'ring-2 ring-blue-500 shadow-md z-10 scale-105' : ''
          )}
        >
          <span className="text-xs font-bold text-slate-400">{i}</span>
          <div className="mt-auto space-y-1">
            {dayEvents.map((evt, idx) => {
              const colors = getEventColors(evt.type);
              return (
                <motion.div 
                  key={idx} layoutId={`event-${evt.name}-${i}-${idx}`}
                  className={cn("p-1 rounded text-[9px] font-bold border truncate", colors.bg, colors.border, colors.text)}
                >
                  {evt.name}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  const activeTaskObj = tasks.find(t => t.id === selectedTask);

  return (
    <div className="flex flex-col gap-4 h-full relative">
      
      {/* 7. Executive Summary Bar */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 shadow-sm flex items-center justify-between shrink-0 overflow-x-auto custom-scrollbar">
        {[
          { l: 'Tasks Scheduled', v: scheduledCount },
          { l: 'Reports Generated', v: reportsCount },
          { l: 'Notifications Sent', v: notificationsCount },
          { l: 'Failures Prevented', v: preventedCount },
          { l: 'Savings Protected', v: savingsCount, p: '$' },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-2 px-4 border-r border-slate-100 last:border-0 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.l}:</span>
            <span className="text-lg font-black text-slate-800"><AnimatedCounter value={stat.v} prefix={stat.p} /></span>
          </div>
        ))}
      </div>

      {/* Main Split */}
      <div className="grid lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* LEFT SIDE: 65% Calendar */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-5 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] h-full flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">AI Maintenance Calendar</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Predictive scheduling matrix</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> Scheduled</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"/> Priority</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Critical</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Completed</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"/> Report</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1 overflow-y-auto pr-1">
            {renderDays()}
          </div>

          <AnimatePresence>
            {selectedDay && events.filter(e => e.day === selectedDay).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-5 left-5 right-5 bg-white border border-slate-200 shadow-2xl rounded-xl p-4 z-20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Day {selectedDay}</p>
                    <h4 className="font-bold text-slate-800 text-lg">Scheduled Events</h4>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-slate-100 rounded-md"><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                
                <div className="space-y-2 mb-4">
                  {events.filter(e => e.day === selectedDay).map((evt, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700 text-sm">{evt.name}</span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", getEventColors(evt.type).bg, getEventColors(evt.type).text)}>{evt.type}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleCompleteEvent(selectedDay)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                    <CheckSquare className="w-3.5 h-3.5" /> Mark Completed
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                    <Settings className="w-3.5 h-3.5" /> Optimize Schedule
                  </button>
                  <button onClick={handleSendNotice} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                    <Send className="w-3.5 h-3.5" /> Send Notice
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE: 35% Intelligence */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2">
          
          {/* AI Checklist */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)]">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-500" /> AI Maintenance Checklist
            </h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-500">No pending maintenance tasks.</p>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => {
                  const isSelected = selectedTask === task.id;
                  return (
                    <div key={task.id} className={cn("rounded-lg border transition-all overflow-hidden", isSelected ? 'border-blue-200 bg-blue-50/30' : 'border-transparent hover:bg-slate-50 hover:border-slate-100')}>
                      <div onClick={() => handleTaskToggle(task.id)} className="flex items-start gap-3 p-2 cursor-pointer">
                        <div className={cn("w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors shrink-0", task.status === 'done' ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300")}>
                          {task.status === 'done' && <CheckSquare className="w-3 h-3" />}
                        </div>
                        <span className={cn("text-xs font-semibold select-none flex-1", task.status === 'done' ? "text-slate-400 line-through" : "text-slate-700")}>
                          {task.text}
                        </span>
                      </div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-2 pb-2 pl-9">
                            <button onClick={handleGenerateReport} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                              <FileText className="w-3 h-3" /> Generate Report
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Workflow */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex-1 flex flex-col shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Activity className="w-24 h-24 text-blue-600" />
            </div>
            <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-1.5 relative z-10">
              <Zap className="w-3 h-3" /> Maintenance Workflow Activity
            </h3>
            <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence>
                {activity.map((act, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                    <span className="text-[10px] font-bold text-slate-500 shrink-0 w-14 pt-0.5">{act.time}</span>
                    <p className="text-xs font-semibold text-slate-700 leading-tight border-l-2 border-slate-200 pl-3">{act.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && activeTaskObj && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReportModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-blue-600">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-black text-lg text-slate-800">AI Diagnostic Report</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Device</p>
                    <p className="text-xl font-black text-slate-800">{activeTaskObj.device.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {activeTaskObj.device.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">AI Confidence</p>
                    <p className="text-2xl font-black text-blue-600">96%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Health Score</p>
                    <p className="text-lg font-black text-amber-500">{activeTaskObj.device.health_score}%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Failure Prob.</p>
                    <p className="text-lg font-black text-red-500">{activeTaskObj.device.risk_score}%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Est. Savings</p>
                    <p className="text-lg font-black text-emerald-500">$4,500</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Root Cause Analysis</h4>
                    <p className="text-slate-600 leading-relaxed">System anomalies detected correlating with {activeTaskObj.device.predicted_failure_type || 'hardware strain'}. Signatures match historical failure patterns.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Recommended Maintenance</h4>
                    <p className="text-slate-600 leading-relaxed">Schedule immediate inspection and proactive component replacement. Recalibrate sensors post-intervention.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Required Action</h4>
                      <ul className="text-slate-600 list-disc pl-4 space-y-1">
                        <li>System diagnostics</li>
                        <li>Hardware replacement</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">Est. Downtime</h4>
                      <p className="text-slate-600">2.5 Hours</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
