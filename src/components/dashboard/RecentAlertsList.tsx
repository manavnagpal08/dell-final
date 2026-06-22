'use client';

import { Alert } from '@/types';
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface RecentAlertsListProps {
  alerts: Alert[];
}

const severityConfig: Record<string, { dot: string; badge: string; label: string }> = {
  Critical: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-600 border border-red-100', label: 'Critical' },
  Warning:  { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 border border-amber-100', label: 'Warning' },
  Info:     { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-600 border border-blue-100', label: 'Info' },
};

function timeAgo(ts: string) {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); }
  catch { return 'recently'; }
}

export function RecentAlertsList({ alerts }: RecentAlertsListProps) {
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl h-full flex flex-col shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h3 className="text-[15px] font-bold text-slate-800">Recent Critical Alerts</h3>
        </div>
        <a href="/alerts" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All &rarr;
        </a>
      </div>
      <div className="flex-1 overflow-y-auto">
        {recentAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            No active alerts
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentAlerts.map((alert) => {
              const sev = severityConfig[alert.severity] ?? severityConfig.Warning;
              const deviceShort = alert.device_id
                ? alert.device_id.split('-')[0].toUpperCase()
                : 'UNKNOWN';
              return (
                <li key={alert.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', sev.dot)} />
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-slate-800 mb-0.5 truncate">{alert.failure_type}</p>
                      <p className="text-[12px] font-medium text-slate-400">
                        Device: <span className="text-blue-600 font-semibold">{deviceShort}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {timeAgo(alert.time_generated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', sev.badge)}>
                      {sev.label}
                    </span>
                    <span className="text-[13px] font-bold text-red-500">
                      {alert.failure_probability ? `${Math.round(alert.failure_probability * 100)}%` : '80%'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
