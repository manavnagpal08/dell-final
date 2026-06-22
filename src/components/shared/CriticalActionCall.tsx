'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, AlertTriangle, Activity } from 'lucide-react';
import { getDevices } from '@/lib/api';

export function CriticalActionCall() {
  const [incomingCall, setIncomingCall] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Only trigger alert if real critical devices exist
  useEffect(() => {
    if (sessionStorage.getItem('callHandled')) return;

    const timer = setTimeout(async () => {
      try {
        const devices = await getDevices();
        const criticalDevices = devices.filter((d: any) => d.risk_level === 'Critical');
        if (criticalDevices.length > 0 && !sessionStorage.getItem('callHandled')) {
          const device = criticalDevices[0];
          setAlertMessage(
            `Critical risk detected on ${device.name || 'device'}. Immediate action required to prevent failure.`
          );
          setIncomingCall(true);
        }
      } catch {
        // No data or API error — do not trigger alert
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setIncomingCall(false);
    setCallActive(true);
    // Auto end call after 5 seconds
    setTimeout(() => {
      setCallActive(false);
      sessionStorage.setItem('callHandled', 'true');
    }, 5000);
  };

  const handleDecline = () => {
    setIncomingCall(false);
    sessionStorage.setItem('callHandled', 'true');
  };

  return (
    <AnimatePresence>
      {(incomingCall || callActive) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden text-white relative"
          >
            {/* Background pulsating effect for incoming call */}
            {incomingCall && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 rounded-full bg-red-500/30"
                />
              </div>
            )}

            <div className="p-8 flex flex-col items-center relative z-10 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                {callActive ? (
                  <Activity className="w-10 h-10 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                )}
              </div>
              
              <h2 className="text-2xl font-semibold mb-2">
                {callActive ? 'Action Initiated' : 'Critical System Alert'}
              </h2>
              <p className="text-slate-400 text-sm mb-12">
                {callActive 
                  ? 'Running automated containment protocol...' 
                  : alertMessage}
              </p>

              {incomingCall && (
                <div className="flex w-full justify-between px-4 mt-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleDecline}
                      className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                      <PhoneOff className="w-7 h-7 text-white" />
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Decline</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleAccept}
                      className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-bounce"
                    >
                      <Phone className="w-7 h-7 text-white" />
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Accept Action</span>
                  </div>
                </div>
              )}

              {callActive && (
                <div className="mt-8">
                  <p className="text-emerald-400 text-sm font-medium animate-pulse">00:0{Math.floor(Math.random() * 5)}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
