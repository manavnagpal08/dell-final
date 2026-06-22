import { getDevices } from '@/lib/api';
import { MapClientWrapper } from './MapClientWrapper';

export default async function MapOverviewPage() {
  const devices = await getDevices();
  return <MapClientWrapper devices={devices} />;
}
