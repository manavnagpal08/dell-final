import { ExplanationFactor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, CheckCircle2, AlertTriangle, Briefcase } from 'lucide-react';

interface ExplainabilityPanelProps {
  factors: ExplanationFactor[];
  confidence: number;
  prediction: string;
  recommendation?: string;
  business_impact?: string;
}

export function ExplainabilityPanel({ factors, confidence, prediction, recommendation, business_impact }: ExplainabilityPanelProps) {
  return (
    <Card className="shadow-lg border-blue-200 bg-white overflow-hidden h-full">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-slate-900 font-bold">
            <BrainCircuit className="mr-2 h-5 w-5 text-blue-600" />
            AI Reasoning
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Score</span>
            <span className="text-lg font-black text-red-500">{confidence}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Reasons */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Reasons:</h4>
          <ul className="space-y-2.5">
            {factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="leading-snug">
                  {/* Handle both current format and legacy gemini format */}
                  <strong className="text-slate-800">{factor.factor || (factor as any).feature_name}:</strong> {factor.description || (factor as any).human_explanation}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confidence & Action */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">AI Confidence:</span>
            <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">{confidence}%</span>
          </div>
          
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wide">Recommended Action:</h4>
              </div>
              <p className="text-sm text-slate-800 font-medium pl-6">
                {recommendation || "Schedule preventive maintenance and component inspection within 7 days."}
              </p>
            </div>
            
            {business_impact && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Business Impact:</h4>
                </div>
                <p className="text-sm text-slate-800 font-medium pl-6">
                  {business_impact}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
