'use client';

import { useState, useEffect } from 'react';
import { Database, Laptop, Radio, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type DataMode = 'simulated' | 'local' | 'live';

export function DataModeSelector() {
  const [mode, setModeState] = useState<DataMode>('simulated');

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )data_mode=([^;]+)'));
    if (match && match[2] && match[2] !== mode) {
      const m = match[2] as DataMode;
      setModeState(m);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';
      fetch(`${API_URL}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: m })
      }).catch(console.error);
    }
  }, []);

  const setMode = async (m: DataMode) => {
    setModeState(m);
    document.cookie = `data_mode=${m}; path=/`;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';
      await fetch(`${API_URL}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: m })
      });
      // Optionally trigger a page reload so server components refetch with new cookie
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const modes = {
    simulated: {
      label: 'Campus Simulation',
      icon: <Database className="h-4 w-4 mr-2 text-blue-500" />,
      desc: 'High-volume mock IoT data'
    },
    local: {
      label: 'Local PC Telemetry',
      icon: <Laptop className="h-4 w-4 mr-2 text-emerald-500" />,
      desc: 'Live metrics from this machine'
    },
    live: {
      label: 'Live Devices (API)',
      icon: <Radio className="h-4 w-4 mr-2 text-amber-500" />,
      desc: 'External IoT webhooks'
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 border border-slate-200 bg-slate-50 hover:bg-slate-100 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          <div className="flex items-center">
            {modes[mode].icon}
            <span className="font-semibold text-slate-700 text-sm">{modes[mode].label}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        {(Object.keys(modes) as DataMode[]).map((m) => (
          <DropdownMenuItem 
            key={m} 
            onClick={() => setMode(m)}
            className={`flex flex-col items-start py-2 cursor-pointer ${mode === m ? 'bg-slate-50' : ''}`}
          >
            <div className="flex items-center font-semibold text-slate-700">
              {modes[m].icon}
              {modes[m].label}
            </div>
            <p className="text-xs text-slate-500 ml-6">{modes[m].desc}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
