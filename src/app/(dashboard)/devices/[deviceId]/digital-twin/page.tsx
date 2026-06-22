'use client';

import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Thermometer, Zap, Fan, Network, ShieldCheck } from 'lucide-react';

export default function DigitalTwinPage({ params }: { params: { deviceId: string } }) {
  const components = [
    { name: 'Storage Array', status: 'Critical', icon: Database, color: 'text-destructive', bg: 'bg-destructive/10' },
    { name: 'Thermal System', status: 'Warning', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Power Supply', status: 'Healthy', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Cooling Fans', status: 'Healthy', icon: Fan, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Network Interface', status: 'Healthy', icon: Network, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Digital Twin View</h2>
          <p className="text-muted-foreground text-sm">Real-time component-level status for {params.deviceId}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200/60 bg-white/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Subsystem Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {components.map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${comp.bg}`}>
                        <comp.icon className={`h-5 w-5 ${comp.color}`} />
                      </div>
                      <span className="font-medium text-slate-800">{comp.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${comp.color}`}>{comp.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200/60 bg-white/50 backdrop-blur-xl h-full flex flex-col items-center justify-center p-8 min-h-[400px] relative overflow-hidden">
            {/* Mock 3D or visual representation area */}
            <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
            <div className="relative z-10 text-center space-y-4">
              <div className="relative mx-auto w-48 h-48 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                <div className="absolute inset-2 rounded-full border-4 border-emerald-500 border-t-destructive border-r-amber-500 opacity-50" />
                <ServerIcon className="h-16 w-16 text-slate-400 animate-none" style={{ animationDirection: 'reverse' }} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">{params.deviceId} Twin</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Live telemetry is actively mirroring the physical state of the hardware.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

function ServerIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}
