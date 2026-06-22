import { PageTransition } from '@/components/layout/PageTransition';
import { ExplainableAiDashboard } from '@/components/explainability/ExplainableAiDashboard';
import { getDevices, getAlerts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function PredictionsPage() {
  const devices = await getDevices();
  const alerts = await getAlerts();

  return (
    <PageTransition className="pb-8 max-w-[1400px] mx-auto flex flex-col gap-4 h-[calc(100vh-100px)]">
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">EXPLAINABLE AI</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-bold uppercase tracking-widest">
            AI Decision Transparency Engine
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ExplainableAiDashboard initialDevices={devices} initialAlerts={alerts} />
      </div>
    </PageTransition>
  );
}
