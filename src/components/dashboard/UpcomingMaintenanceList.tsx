'use client';

import { CalendarClock, CheckCircle, Wrench, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function UpcomingMaintenanceList({ devices }: { devices: any[] }) {
  // Mock logic: Find high risk devices and create fake scheduled tickets
  const scheduledTickets = devices
    .filter(d => d.risk_score > 60 || d.risk_level === 'Critical' || d.risk_level === 'Warning')
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 4)
    .map((device, idx) => ({
      id: `TKT-${8024 + idx}`,
      deviceName: device.device_name || device.name || 'Unknown',
      action: device.risk_score > 80 ? 'Replace SSD Drive' : 'Thermal Paste & Fan Check',
      date: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      priority: device.risk_score > 80 ? 'High' : 'Medium'
    }));

  if (scheduledTickets.length === 0) {
    scheduledTickets.push({
      id: 'TKT-8024',
      deviceName: 'Storage-Array-Primary',
      action: 'Firmware Update',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      priority: 'Low'
    });
  }

  return (
    <Card className="h-full flex flex-col shadow-sm border-slate-200">
      <CardHeader className="pb-3 shrink-0 flex flex-row justify-between items-center">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-blue-500" />
            Automated Maintenance Schedule
          </CardTitle>
          <p className="text-xs text-slate-500 font-medium">Tickets generated from AI predictions</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 space-y-3">
        {scheduledTickets.map((tkt, i) => (
          <motion.div
            key={tkt.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
          >
            <div className={`mt-0.5 p-2 rounded-full flex items-center justify-center ${
              tkt.priority === 'High' ? 'bg-red-100 text-red-600' : 
              tkt.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              {tkt.priority === 'High' ? <AlertTriangle className="h-3.5 w-3.5" /> : <Wrench className="h-3.5 w-3.5" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{tkt.action}</p>
                <span className="text-[10px] font-bold text-slate-400">{tkt.id}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{tkt.deviceName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  Scheduled: {tkt.date}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Auto-Approved
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
