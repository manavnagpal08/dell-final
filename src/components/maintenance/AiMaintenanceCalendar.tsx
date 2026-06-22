'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EVENTS = [
  { day: 12, name: 'Cooling Unit F12', type: 'Critical', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  { day: 14, name: 'Router R-04', type: 'Recommended', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { day: 15, name: 'Server Rack A', type: 'High Priority', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  { day: 22, name: 'Power Supply P1', type: 'Critical', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  { day: 28, name: 'Backup Generator', type: 'Scheduled', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' }
];

export function AiMaintenanceCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = 30;
  const startOffset = 2; // offset for the first day of the month

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-20" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const event = EVENTS.find(e => e.day === i);
      const isSelected = selectedDay === i;
      
      days.push(
        <div 
          key={i} 
          onClick={() => event && setSelectedDay(isSelected ? null : i)}
          className={cn(
            "h-20 border border-slate-100 p-1.5 rounded-lg flex flex-col transition-all cursor-pointer relative",
            event ? 'hover:border-blue-300 hover:shadow-sm bg-white' : 'bg-slate-50/50 hover:bg-slate-50',
            isSelected && event ? 'ring-2 ring-blue-500 shadow-md z-10 scale-105' : ''
          )}
        >
          <span className="text-xs font-bold text-slate-400">{i}</span>
          {event && (
            <motion.div 
              layoutId={`event-${i}`}
              className={cn("mt-auto p-1.5 rounded text-[9px] font-bold border truncate", event.bg, event.border, event.text)}
            >
              {event.name}
            </motion.div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-5 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">AI Maintenance Calendar</h3>
          <p className="text-xs text-slate-500 font-medium">Predictive scheduling matrix</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
          <span className="text-sm font-black text-slate-800 w-24 text-center">October 2026</span>
          <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 flex-1">
        {renderDays()}
      </div>

      <AnimatePresence>
        {selectedDay && EVENTS.find(e => e.day === selectedDay) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-5 left-5 right-5 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-20 flex justify-between items-center"
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">October {selectedDay}</p>
              <h4 className="font-bold text-slate-800">{EVENTS.find(e => e.day === selectedDay)?.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Recommended intervention window begins. Estimated 2hr downtime.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Settings className="w-3.5 h-3.5" /> Optimize Schedule
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
