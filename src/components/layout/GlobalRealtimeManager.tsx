'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneIncoming, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalRealtimeManager() {
  const router = useRouter();
  const [criticalAlert, setCriticalAlert] = useState<any>(null);
  const seenAlerts = useRef<Set<string>>(new Set());

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

  useEffect(() => {
    // Poll every 5 seconds
    const interval = setInterval(async () => {
      // 1. Force Next.js router to refresh server components globally
      router.refresh();

      // 2. Fetch all data explicitly to populate network tab and trigger state updates
      try {
        const [alertsRes, devicesRes] = await Promise.all([
          fetch(`${API_URL}/alerts`, { cache: 'no-store' }),
          fetch(`${API_URL}/devices`, { cache: 'no-store' })
        ]);
        if (!alertsRes.ok) return;
        const alerts = await alertsRes.json();
        
        if (Array.isArray(alerts)) {
          const activeCritical = alerts.find(
            (a: any) => 
              a.severity === 'Critical' && 
              a.status === 'Active' && 
              !seenAlerts.current.has(a.id)
          );

          if (activeCritical && !criticalAlert) {
            seenAlerts.current.add(activeCritical.id);
            let devName = activeCritical.device_id;
            if (devicesRes.ok) {
              const devices = await devicesRes.json();
              const dev = devices.find((d: any) => d.id === activeCritical.device_id || d.device_id === activeCritical.device_id);
              if (dev) devName = dev.device_name || dev.name || devName;
            }
            setCriticalAlert({ ...activeCritical, deviceName: devName });
          }
        }
      } catch (error) {
        // Silent catch for polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router, API_URL, criticalAlert]);

  const handleAcknowledge = async () => {
    if (!criticalAlert) return;
    try {
      await fetch(`${API_URL}/alerts/${criticalAlert.id}/acknowledge`, { method: 'PATCH' });
    } catch (e) {
      // Silent catch
    }
    setCriticalAlert(null);
    router.refresh();
  };

  const handleDecline = () => {
    setCriticalAlert(null);
  };

  return (
    <AnimatePresence>
      {criticalAlert && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-6 right-6 z-[100] flex flex-col"
        >
          <motion.div
            className="w-96 overflow-hidden rounded-2xl bg-slate-900 border border-red-500/50 shadow-[0_10px_40px_rgba(239,68,68,0.3)]"
          >
            <div className="relative p-5 flex items-start gap-4">
              {/* Ringing Animation Small */}
              <div className="relative flex-shrink-0 mt-1">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-red-500/20"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="absolute inset-0 rounded-full bg-red-500/40"
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-lg">
                  <PhoneIncoming className="h-5 w-5 text-white animate-pulse" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-bold text-white mb-1 tracking-tight">
                  CRITICAL FAILURE DETECTED
                </h2>
                <p className="text-red-400 text-xs font-semibold mb-1 truncate">
                  {criticalAlert.deviceName || criticalAlert.device_id || 'Unknown Device'}
                </p>
                <p className="text-slate-300 text-xs mb-3 line-clamp-2">
                  {criticalAlert.failure_type || criticalAlert.title || 'Immediate attention required.'}
                </p>

                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={handleDecline}
                    className="flex-1 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleAcknowledge}
                    className="flex-1 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium shadow-[0_0_10px_rgba(239,68,68,0.4)] hover:bg-red-500 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] flex items-center justify-center gap-1"
                  >
                    <Check className="h-3 w-3" /> Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
