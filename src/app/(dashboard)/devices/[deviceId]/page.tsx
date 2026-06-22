import { getDeviceById, getDeviceTelemetry } from '@/lib/api';
import { getExplanation, predictFailure } from '@/lib/ml';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DeviceTelemetryCharts } from '@/components/devices/DeviceTelemetryCharts';
import { ExplainabilityPanel } from '@/components/explainability/ExplainabilityPanel';
import { DeviceInfoCard } from '@/components/devices/DeviceInfoCard';
import { ActiveRiskCard } from '@/components/devices/ActiveRiskCard';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/card';
import { DeviceActions } from '@/components/devices/DeviceActions';
import Link from 'next/link';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export default async function DeviceDetailPage({ params }: { params: { deviceId: string } }) {
  const device = await getDeviceById(params.deviceId);
  
  if (!device) {
    notFound();
  }

  const telemetry = await getDeviceTelemetry(device.id);
  
  let factors: import('@/types').ExplanationFactor[] = [];
  let confidence = 0;
  let predictionData = null;
  
  if (device.risk_level !== 'Healthy') {
    predictionData = await predictFailure({ deviceId: device.id, telemetry });
    factors = await getExplanation(predictionData);
    confidence = Math.round((predictionData?.confidence || 0) * 100);
    // Overwrite mock risk info with real prediction
    if (predictionData) {
      device.risk_score = predictionData.overall_risk_score;
      device.health_score = predictionData.overall_health_score;
      device.predicted_failure_type = predictionData.predicted_primary_failure;
      device.days_remaining = predictionData.days_remaining;
    }
  }

  return (
    <PageTransition className="space-y-6">
      {/* Back Navigation */}
      <Link href="/devices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Devices
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{device.name}</h2>
            <StatusBadge status={device.status} />
          </div>
          <p className="text-muted-foreground text-sm">Device ID: <span className="font-mono">{device.id}</span></p>
        </div>
        <DeviceActions device={device} />
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-3">
        <StaggerItem className="md:col-span-1 h-full">
          <DeviceInfoCard device={device} />
        </StaggerItem>
        <StaggerItem className="md:col-span-2 h-full">
          <ActiveRiskCard device={device} />
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="grid gap-6 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <DeviceTelemetryCharts data={telemetry} />
        </StaggerItem>
        <StaggerItem>
          {device.risk_level !== 'Healthy' ? (
            <ExplainabilityPanel 
              factors={factors}
              confidence={confidence}
              prediction={device.type || 'Hardware Issue'}
              recommendation={predictionData?.explanation?.recommendation}
              business_impact={predictionData?.explanation?.business_impact}
            />
          ) : (
            <div className="vy-card h-full flex flex-col items-center justify-center p-8 text-muted-foreground min-h-[300px] border-dashed border-2 border-border/50 bg-secondary/10">
              <div className="p-4 rounded-full bg-emerald-500/10 mb-4 shadow-inner">
                <BrainCircuit className="h-10 w-10 text-emerald-500 opacity-80" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Device is Healthy</p>
              <p className="text-sm text-center">AI analysis confirms normal operating parameters. No risk factors identified.</p>
            </div>
          )}
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
