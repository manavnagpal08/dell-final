import { PageTransition } from '@/components/layout/PageTransition';
import { getAlerts } from '@/lib/api';
import { AlertsClient } from '@/components/alerts/AlertsClient';

export default async function AlertsPage({ searchParams }: { searchParams: Promise<{ filter?: string, search?: string }> }) {
  const allAlerts = await getAlerts();
  
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'All';
  const search = resolvedSearchParams.search || '';

  return (
    <PageTransition className="pb-8 max-w-[1200px] mx-auto">
      <AlertsClient allAlerts={allAlerts} initialFilter={filter} initialSearch={search} />
    </PageTransition>
  );
}
