import { getDashboardSummary, getDevices, getAlerts, getDeviceTelemetry } from '@/lib/api';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FailureTypeChart } from '@/components/dashboard/FailureTypeChart';
import { HealthDistributionChart } from '@/components/dashboard/HealthDistributionChart';
import { LiveActivityFeed } from '@/components/dashboard/LiveActivityFeed';
import { RecentAlertsList } from '@/components/dashboard/RecentAlertsList';
import { TopRiskyDevicesList } from '@/components/dashboard/TopRiskyDevicesList';
import { UpcomingMaintenanceList } from '@/components/dashboard/UpcomingMaintenanceList';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Server, ShieldAlert, Activity, Zap, Clock, AlertTriangle, CheckCircle2, Database, Shield, Hourglass, Bell, Target, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const devices = await getDevices();
  const alerts = await getAlerts();

  const activeCriticalAlerts = alerts.filter((a: any) => a.severity === 'Critical' && a.status === 'Active');
  const criticalDeviceIds = new Set(activeCriticalAlerts.map((a: any) => a.device_id));
  
  let criticalCount = 0;
  let warningCount = 0;
  let healthyCount = 0;

  devices.forEach((d: any) => {
    if (d.risk_level === 'Critical' || criticalDeviceIds.has(d.id)) {
      criticalCount++;
    } else if (d.risk_level === 'Warning') {
      warningCount++;
    } else {
      healthyCount++;
    }
  });
  
  let isLocalMode = devices.length === 1 && devices[0].vendor === 'Local PC';
  let batteryPct = 100;
  if (isLocalMode) {
    const tele = await getDeviceTelemetry(devices[0].id);
    if (tele && tele.length > 0) {
      batteryPct = tele[0].smart_health ?? 100;
    }
  }
  
  const avgHealth = devices.length > 0 ? Math.round(devices.reduce((acc: any, d: any) => acc + (d.health_score ?? 100), 0) / devices.length) : 100;
  const avgTimeToFailure = devices.length > 0 ? `${Math.max(1, Math.round(devices.reduce((acc: any, d: any) => acc + (d.days_remaining || 30), 0) / devices.length))} Days` : "N/A";

  const healthData = [
    { name: 'Healthy',  value: healthyCount },
    { name: 'Warning',  value: warningCount },
    { name: 'Critical', value: criticalCount },
  ];

  const failureTypes = devices
    .filter((d: any) => d.risk_level === 'Critical' || d.risk_level === 'Warning')
    .reduce((acc: any, curr: any) => {
      const t = curr.type || 'Hardware';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const failureData = Object.entries(failureTypes)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a: any, b: any) => b.value - a.value);

  if (failureData.length === 0) {
      failureData.push({ name: 'None', value: 1 });
  }

  // Get current time formatted as 11:43 AM
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <PageTransition className="space-y-6 pb-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">All Devices Summary</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Real-time overview of device health and AI predictions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Last updated: {currentTime}</span>
        </div>
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard title="Total Devices" value={summary.total_devices} description="Monitored in real-time"
            icon={<Database className="h-6 w-6" />} accentColor="blue" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Critical at Risk" value={criticalCount} description="Immediate attention"
            icon={<ShieldAlert className="h-6 w-6" />} accentColor="red" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Future Failures (30D)" value={Math.max(summary.predicted_failures_30_days, criticalCount)} description="Predicted failures"
            icon={<Zap className="h-6 w-6" />} accentColor="amber" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Overall Health Score" value={`${avgHealth}%`} description="Excellent health"
            icon={<CheckCircle2 className="h-6 w-6" />} accentColor="green" />
        </StaggerItem>
        
        {/* Row 2 */}
        <StaggerItem>
          <MetricCard title="Downtime Prevented" value={`${summary.estimated_downtime_prevented} hrs`} description="Saving operational time"
            icon={<Clock className="h-6 w-6" />} accentColor="teal" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Avg Time to Failure" value={avgTimeToFailure} description="Across all devices"
            icon={<Hourglass className="h-6 w-6" />} accentColor="purple" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Active Alerts" value={alerts.length} description="Requires attention"
            icon={<Bell className="h-6 w-6" />} accentColor="red" />
        </StaggerItem>
        <StaggerItem>
          {isLocalMode ? (
            <MetricCard title="Local Battery" value={`${batteryPct}%`} description="Current level"
              icon={<Zap className="h-6 w-6" />} accentColor="blue" />
          ) : (
            <MetricCard title="Prediction Accuracy" value="96.4%" description="AI model accuracy"
              icon={<Target className="h-6 w-6" />} accentColor="blue" />
          )}
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="grid gap-4 lg:grid-cols-2">
        <StaggerItem>
          <FailureTypeChart data={failureData} />
        </StaggerItem>
        <StaggerItem>
          <HealthDistributionChart data={healthData} />
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="grid gap-4 lg:grid-cols-3">
        <StaggerItem className="h-[380px] lg:col-span-1">
          <LiveActivityFeed alerts={alerts} />
        </StaggerItem>
        <StaggerItem className="h-[380px] lg:col-span-1">
          <RecentAlertsList alerts={alerts} />
        </StaggerItem>
        <StaggerItem className="h-[380px] lg:col-span-1">
          <TopRiskyDevicesList devices={devices} />
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
