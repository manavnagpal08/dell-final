import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';

import { SmartKpiHeader } from '@/components/analytics/SmartKpiHeader';
import { SmartAnalyticsHub } from '@/components/analytics/SmartAnalyticsHub';
import { CompactAiCarousel } from '@/components/analytics/CompactAiCarousel';
import { FlipAnalyticsCards } from '@/components/analytics/FlipAnalyticsCards';
import { ExecutiveDrilldown } from '@/components/analytics/ExecutiveDrilldown';

import { getDevices, getAlerts, getDashboardSummary } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const devices = await getDevices();
  const alerts = await getAlerts();
  const summary = await getDashboardSummary();

  return (
    <PageTransition className="pb-8 max-w-[1200px] mx-auto flex flex-col gap-3 h-auto">
      <div className="mb-1">
        <h1 className="text-xl font-black tracking-tight text-slate-800">AI Intelligence Console</h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Executive monitoring and predictive forecasting hub.
        </p>
      </div>

      <StaggerContainer className="flex flex-col gap-3">
        {/* Row 1: KPI Header */}
        <StaggerItem>
          <SmartKpiHeader devices={devices} alerts={alerts} />
        </StaggerItem>

        <div className="grid lg:grid-cols-3 gap-3">
          {/* Left Column: Massive Hub + Flip Cards */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <StaggerItem>
              <SmartAnalyticsHub />
            </StaggerItem>
            <StaggerItem>
              <FlipAnalyticsCards devices={devices} summary={summary} />
            </StaggerItem>
          </div>

          {/* Right Column: AI Insights Carousel + Drilldown Accordion */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <StaggerItem>
              <CompactAiCarousel />
            </StaggerItem>
            <StaggerItem className="flex-1">
              <ExecutiveDrilldown />
            </StaggerItem>
          </div>
        </div>
      </StaggerContainer>
    </PageTransition>
  );
}
