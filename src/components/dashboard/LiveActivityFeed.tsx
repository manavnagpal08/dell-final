'use client';

import { useEffect, useState } from 'react';
import { Activity, AlertCircle, RefreshCw, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type EventType = 'alert' | 'prediction' | 'maintenance' | 'anomaly';

interface LiveEvent {
  id: string;
  type: EventType;
  device: string;
  severity: string;
  message: string;
  time: string;
  isNew?: boolean;
}

const iconMap: Record<EventType, React.ReactNode> = {
  prediction:  <Activity className="h-3.5 w-3.5 text-primary" />,
  alert:       <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
  maintenance: <Wrench className="h-3.5 w-3.5 text-emerald-500" />,
  anomaly:     <AlertCircle className="h-3.5 w-3.5 text-violet-500" />,
};

const sevConfig: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-500 border border-red-500/20',
  High:     'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  Warning:  'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  Medium:   'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  Info:     'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
};



function safeTimeAgo(ts: string) {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); }
  catch { return 'recently'; }
}

interface LiveActivityFeedProps {
  alerts?: any[];
}

export function LiveActivityFeed({ alerts = [] }: LiveActivityFeedProps) {
  const [isLive, setIsLive] = useState(true);

  const events: LiveEvent[] = alerts.map(a => ({
    id: a.id,
    type: 'alert' as EventType,
    device: a.device_id || 'Unknown',
    severity: a.severity || 'Info',
    message: a.failure_type || a.title || 'Anomaly detected',
    time: safeTimeAgo(a.time_generated || a.created_at),
    isNew: new Date().getTime() - new Date(a.time_generated || a.created_at).getTime() < 10000
  })).slice(0, 10);

  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl h-full flex flex-col relative group overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-slate-50/50 relative z-10">
        <div className="flex items-center gap-2">
          <div className={cn('live-dot', isLive ? 'live-dot-green' : 'live-dot-blue', 'animate-pulse shadow-[0_0_8px_#3b82f6]')} />
          <h3 className="text-[15px] font-bold text-slate-800">
            {isLive ? 'Live Enterprise Feed' : 'Activity Feed'}
          </h3>
        </div>
        <RefreshCw
          className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={handleRefresh}
        />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 relative z-10 p-2">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            No live events
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.map(ev => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={cn('flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors', ev.isNew && 'bg-blue-50/50')}
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100 shadow-sm shrink-0">
                  {iconMap[ev.type]}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{ev.device}</span>
                    <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', sevConfig[ev.severity] || sevConfig.Info)}>
                      {ev.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto font-medium">{ev.time}</span>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-snug line-clamp-2">{ev.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
