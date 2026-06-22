import { AlertTriangle, Clock, Zap } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { getAlerts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function AnomaliesPage() {
  const alerts = await getAlerts();
  
  // Format the alerts into anomalies
  const anomalies = alerts.map((a, i) => {
    // Generate a pseudo-ID if not present
    const id = `AN-${a.id.split('-')[0] || 890 + i}`.toUpperCase();
    
    // Estimate a relative time since time_generated is ISO string
    // For a hackathon, we can just say "Recently" or calculate properly if needed
    // Let's just use the time portion
    const timeStr = new Date(a.time_generated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return {
      id: id,
      type: a.failure_type || 'Unknown Anomaly',
      device: a.device_id.split('-')[0] || a.device_id,
      time: timeStr,
      severity: a.severity === 'Critical' ? 'High' : (a.severity === 'Warning' ? 'Medium' : 'Low')
    };
  });

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Unusual Activity</h1>
          <p className="text-slate-500 mt-1">AI-detected behavioral anomalies across your fleet.</p>
        </div>

        <div className="vy-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recent Anomalies ({anomalies.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {anomalies.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No unusual activity detected recently.</div>
            ) : anomalies.map((anom, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    anom.severity === 'High' ? 'bg-orange-100 text-orange-600' :
                    anom.severity === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{anom.type}</h3>
                    <p className="text-xs text-slate-500">{anom.device} • {anom.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Clock className="h-3 w-3" /> {anom.time}
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                    anom.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    anom.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {anom.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
