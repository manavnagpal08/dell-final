import { ExplanationFactor } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

export async function predictFailure(payload: any) {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Predict failed");
  return res.json();
}

export async function getExplanation(predictionData: any): Promise<ExplanationFactor[]> {
  // Extract key factors from Gemini explanation
  if (predictionData && predictionData.explanation && predictionData.explanation.root_causes) {
    return predictionData.explanation.root_causes.map((factor: string, idx: number) => ({
      feature_name: `Factor ${idx + 1}`,
      impact: 'Negative',
      shap_value: 0.5,
      human_explanation: factor
    }));
  }
  return [];
}

export async function getModelHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}
