import { Badge } from '@/components/ui/badge';
import { DeviceStatus } from '@/types';

export function StatusBadge({ status }: { status: DeviceStatus }) {
  if (status === 'Offline') {
    return <Badge variant="secondary" className="bg-slate-100 text-slate-600">{status}</Badge>;
  }
  if (status === 'Maintenance') {
    return <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">{status}</Badge>;
  }
  return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{status}</Badge>;
}
