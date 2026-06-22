import { BrainCircuit, Cpu, Network, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';

export default function ExplainabilityPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">How AI Decides</h1>
          <p className="text-slate-500 mt-1">Transparent insights into our machine learning models.</p>
        </div>

        <div className="vy-card p-8">
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Random Forest Ensemble Model</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                VYOMAI primarily uses an ensemble of decision trees trained on historical failure data to predict future anomalies. The model analyzes 45 different telemetry vectors per second from each device.
              </p>
              <div className="flex gap-4 mt-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Confidence Score: 98.4%</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Last Trained: 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="vy-card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-500" /> Key Decision Factors
            </h3>
            <ul className="space-y-4">
              {[
                { factor: 'Sustained Thermal Spikes', weight: '35%' },
                { factor: 'Vibration Anomalies', weight: '25%' },
                { factor: 'Voltage Fluctuations', weight: '20%' },
                { factor: 'Fan RPM Degradation', weight: '15%' },
                { factor: 'Other Telemetry', weight: '5%' },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{item.factor}</span>
                  <span className="font-bold text-indigo-600">{item.weight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="vy-card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Network className="h-5 w-5 text-emerald-500" /> Neural Network Pipeline
            </h3>
            <div className="space-y-4">
              {[
                'Data Ingestion via IoT Agents',
                'Feature Engineering & Normalization',
                'Real-time Inference Engine',
                'Confidence Threshold Filtering',
                'Alert Generation',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
