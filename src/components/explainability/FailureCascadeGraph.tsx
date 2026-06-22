'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Thermometer, Database, AlertCircle, TrendingUp } from 'lucide-react';

export function FailureCascadeGraph() {
  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Failure Cascade Analysis</CardTitle>
        <CardDescription>Predicted progression path of the current anomaly.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4 relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-100 -translate-x-1/2 z-0" />
          
          <CascadeNode 
            icon={<TrendingUp className="h-4 w-4" />}
            title="Fan RPM Drop"
            desc="Detected 48 hours ago"
            color="text-amber-500"
            bg="bg-amber-100"
            prob="100%"
          />
          <Arrow />
          
          <CascadeNode 
            icon={<Thermometer className="h-4 w-4" />}
            title="Temperature Rise"
            desc="Exceeded threshold (T+12h)"
            color="text-amber-500"
            bg="bg-amber-100"
            prob="100%"
          />
          <Arrow />
          
          <CascadeNode 
            icon={<Database className="h-4 w-4" />}
            title="SSD Wear Increase"
            desc="Accelerated degradation (Current)"
            color="text-destructive"
            bg="bg-destructive/20"
            prob="94%"
            active
          />
          <Arrow dashed />
          
          <CascadeNode 
            icon={<Database className="h-4 w-4" />}
            title="Storage Array Failure"
            desc="Predicted state (T+14 Days)"
            color="text-slate-400"
            bg="bg-slate-100"
            prob="91%"
            faded
          />
          <Arrow dashed />

          <CascadeNode 
            icon={<AlertCircle className="h-4 w-4" />}
            title="Application Downtime"
            desc="Impact on SLA"
            color="text-slate-400"
            bg="bg-slate-100"
            prob="85%"
            faded
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CascadeNode({ icon, title, desc, color, bg, active, faded, prob }: any) {
  return (
    <div className={`relative z-10 flex items-center gap-4 bg-white p-3 rounded-xl border ${active ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20 scale-105 transition-transform' : 'border-slate-200'} ${faded ? 'opacity-60' : ''} w-full max-w-sm`}>
      <div className={`p-2 rounded-lg ${bg} ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <Badge variant="outline" className={active ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500'}>
        {prob}
      </Badge>
    </div>
  );
}

function Arrow({ dashed }: { dashed?: boolean }) {
  return (
    <div className="relative z-10 py-2">
      <div className={`h-8 w-px mx-auto ${dashed ? 'border-l-2 border-dashed border-slate-300' : 'bg-slate-300'}`} />
      <ArrowDown className="h-4 w-4 text-slate-300 mx-auto -mt-1" />
    </div>
  );
}
