import { getDevices } from '@/lib/api';
import { DeviceExplorer } from '@/components/devices/DeviceExplorer';
import { PageTransition } from '@/components/layout/PageTransition';

export default async function DevicesPage() {
  const devices = await getDevices();
  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Device Explorer</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage and monitor <span className="text-blue-600 font-semibold">{devices.length}</span> devices with AI-powered risk scoring.</p>
      </div>
      <DeviceExplorer devices={devices} />
    </PageTransition>
  );
}
