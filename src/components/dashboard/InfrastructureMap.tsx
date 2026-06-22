'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Device } from '@/types';
import {
  Server,
  Cpu,
  Battery,
  Router,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

const FLOORS = [
  { name: 'FLOOR 3', desc: 'DATACENTER CORE', color: 'bg-blue-500' },
  { name: 'FLOOR 2', desc: 'NETWORKING', color: 'bg-emerald-500' },
  { name: 'FLOOR 1', desc: 'INFRASTRUCTURE', color: 'bg-purple-500' },
  { name: 'GROUND FLOOR', desc: 'AI & SERVICES', color: 'bg-blue-500' },
];

function assignMockLocation(deviceId: string) {
  let sum = 0;
  for (let i = 0; i < deviceId.length; i++) sum += deviceId.charCodeAt(i);
  return FLOORS[sum % FLOORS.length].name;
}

function getStatusDot(status?: string) {
  if (status === 'Critical') return 'bg-red-500';
  if (status === 'Warning') return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getDeviceIcon(name: string) {
  const value = name.toLowerCase();

  if (value.includes('power') || value.includes('ups')) return Battery;
  if (value.includes('router')) return Router;
  if (value.includes('compute') || value.includes('ai')) return Cpu;
  return Server;
}

function DeviceBlock({
  device,
  onClick,
}: {
  device: Device;
  onClick: () => void;
}) {
  const Icon = getDeviceIcon(device.name);

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition hover:-translate-y-1 hover:bg-blue-50"
    >
      <div className="relative flex h-16 w-20 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-300 shadow-md">
        <Icon className="h-8 w-8 text-slate-700" />

        <span
          className={`absolute -bottom-2 h-3 w-3 rounded-full border-2 border-white ${getStatusDot(
            device.risk_level
          )}`}
        />
      </div>

      <p className="max-w-[120px] truncate text-center text-xs font-semibold text-slate-800">
        {device.name}
      </p>
    </button>
  );
}

export function InfrastructureMap({ devices }: { devices: Device[] }) {
  const router = useRouter();

  const mapData = useMemo(() => {
    const data: Record<string, Device[]> = {};

    FLOORS.forEach((floor) => {
      data[floor.name] = [];
    });

    devices.forEach((device) => {
      const floor = assignMockLocation(device.id);
      if (data[floor] && data[floor].length < 3) {
        data[floor].push(device);
      }
    });

    return data;
  }, [devices]);

  const healthy = devices.filter((d) => d.risk_level === 'Healthy').length;
  const warning = devices.filter((d) => d.risk_level === 'Warning').length;
  const critical = devices.filter((d) => d.risk_level === 'Critical').length;

  return (
    <div className="min-h-[760px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Map Overview
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Alliance University Digital Twin
            </p>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Stat label="Total Devices" value={devices.length} color="blue" />
          <Stat label="Healthy" value={healthy} color="emerald" />
          <Stat label="Warning" value={warning} color="amber" />
          <Stat label="Critical" value={critical} color="red" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        {/* Building */}
        <div className="relative flex min-h-[560px] items-center justify-center rounded-3xl bg-gradient-to-b from-slate-50 to-white">
          <div className="w-full max-w-4xl">
            {FLOORS.map((floor) => {
              const floorDevices = mapData[floor.name] || [];

              return (
                <div key={floor.name} className="grid grid-cols-[150px_1fr] gap-6">
                  {/* Floor label */}
                  <div className="flex items-center gap-3">
                    <div className={`h-16 w-1 rounded-full ${floor.color}`} />
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {floor.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">
                        {floor.desc}
                      </p>
                    </div>
                  </div>

                  {/* Floor plate */}
                  <div className="relative mb-5 rounded-[2rem] border border-blue-100 bg-white/80 px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                    <div className="absolute inset-x-8 top-0 h-px bg-blue-100" />

                    <div className="grid grid-cols-3 gap-6">
                      {floorDevices.map((device) => (
                        <DeviceBlock
                          key={device.id}
                          device={device}
                          onClick={() => router.push(`/devices/${device.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h3 className="font-black text-slate-900">AI Risk Summary</h3>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm font-medium text-slate-500">All Systems</p>
              <p className="mt-1 text-xl font-black text-emerald-600">
                Healthy
              </p>
              <p className="mt-2 text-xs text-slate-500">
                No immediate risks detected
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-black text-slate-900">Device Status</h3>

            <StatusRow label="Healthy" value={healthy} color="bg-emerald-500" />
            <StatusRow label="Warning" value={warning} color="bg-amber-500" />
            <StatusRow label="Critical" value={critical} color="bg-red-500" />
            <StatusRow label="Offline" value={0} color="bg-slate-400" />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-black text-slate-900">Recent Alerts</h3>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
              No active alerts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'blue' | 'emerald' | 'amber' | 'red';
}) {
  const dot =
    color === 'blue'
      ? 'bg-blue-500'
      : color === 'emerald'
      ? 'bg-emerald-500'
      : color === 'amber'
      ? 'bg-amber-500'
      : 'bg-red-500';

  return (
    <div className="min-w-[130px] border-r border-slate-200 px-5 py-3 last:border-r-0">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      </div>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}
