'use client';

import { useMemo } from 'react';
import { Server, Activity, ArrowRight, Battery, Cpu, Database, MapPin } from 'lucide-react';
import { Device } from '@/types';
import { useRouter } from 'next/navigation';

// Mock location mapping to distribute devices nicely across floors
const FLOORS = [
  { name: 'Floor 3', desc: 'DATACENTER CORE', color: 'bg-blue-500' },
  { name: 'Floor 2', desc: 'NETWORKING', color: 'bg-emerald-500' },
  { name: 'Floor 1', desc: 'INFRASTRUCTURE', color: 'bg-purple-500' },
  { name: 'Ground Floor', desc: 'AI & SERVICES', color: 'bg-blue-400' },
];

function assignMockLocation(deviceId: string) {
  let sum = 0;
  for (let i = 0; i < deviceId.length; i++) {
    sum += deviceId.charCodeAt(i);
  }
  return FLOORS[sum % FLOORS.length].name;
}

function getStatusColor(status: string) {
  if (status === 'Critical') return 'bg-red-500';
  if (status === 'Warning') return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getDeviceIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('power') || lower.includes('ups') || lower.includes('battery')) return <Battery className="h-6 w-6" />;
  if (lower.includes('node') || lower.includes('compute')) return <Cpu className="h-6 w-6" />;
  if (lower.includes('storage') || lower.includes('array')) return <Database className="h-6 w-6" />;
  return <Server className="h-6 w-6" />;
}

export function InfrastructureMap({ devices }: { devices: Device[] }) {
  const router = useRouter();

  // Group devices by mock location
  const mapData = useMemo(() => {
    const data: Record<string, Device[]> = {};
    FLOORS.forEach(f => {
      data[f.name] = [];
    });

    devices.forEach(device => {
      const floor = assignMockLocation(device.id);
      if (data[floor]) {
        // Limit to 9 devices per floor to keep the grid tidy
        if (data[floor].length < 9) {
          data[floor].push(device);
        }
      }
    });
    return data;
  }, [devices]);

  return (
    <div className="flex flex-col h-full min-h-[700px] vy-card overflow-hidden bg-slate-900 border-slate-800 text-slate-100">
      {/* Header toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-bold tracking-tight text-white">Alliance University Digital Twin</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" /> Healthy
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" /> Warning
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444] animate-pulse" /> Critical
          </div>
        </div>
      </div>

      {/* Map Viewport - 3D Isometric Stack */}
      <div className="flex-1 relative bg-[url('/grid.svg')] bg-center overflow-hidden flex items-center justify-center pt-24 pb-12">
        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none z-0" />
        
        <div className="relative w-full max-w-4xl h-[600px] [perspective:2000px] flex items-center justify-center ml-24">
          
          {FLOORS.map((floor, index) => {
            const floorDevices = mapData[floor.name] || [];
            
            // The floors are stacked vertically using translateY, and given depth using rotateX and rotateZ.
            // Note: reverse index so Ground Floor is at the bottom (highest translateY)
            const stackOffset = (index - 1.5) * 160; 
            
            return (
              <div 
                key={floor.name}
                className="absolute w-[450px] h-[450px] [transform-style:preserve-3d] transition-transform duration-500 hover:z-50"
                style={{ 
                  transform: `translateY(${stackOffset}px) rotateX(60deg) rotateZ(-45deg)` 
                }}
              >
                {/* Side Labels that 'float' next to the floor, counter-rotated to face the camera */}
                <div 
                  className="absolute -left-32 top-0 flex flex-col justify-center"
                  style={{ transform: 'rotateZ(45deg) rotateX(-60deg) translate(-120px, 150px)' }}
                >
                  <div className="flex gap-4">
                    <div className={`w-1 rounded-full ${floor.color}`} />
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider">{floor.name}</h3>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest">{floor.desc}</p>
                    </div>
                  </div>
                </div>

                {/* The Floor Base Plane */}
                <div className="absolute inset-0 bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  {/* Grid lines inside the floor */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:150px_150px]" />
                  
                  {/* Grid of Devices */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-6 p-8">
                    {floorDevices.map(device => (
                      <div 
                        key={device.id}
                        className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
                      >
                        {/* The actual device element counter-rotated to stand upright */}
                        <div 
                          onClick={() => router.push(`/devices/${device.id}`)}
                          className="absolute flex flex-col items-center justify-end group/device cursor-pointer transition-transform hover:scale-125 z-10"
                          style={{ 
                            transform: 'rotateZ(45deg) rotateX(-60deg) translateY(-20px)',
                            transformOrigin: 'bottom center'
                          }}
                        >
                          {/* 3D Box Representation of Device */}
                          <div className={`relative w-16 h-12 bg-slate-800 rounded shadow-xl flex items-center justify-center border-t border-l border-slate-700 ${device.risk_level === 'Critical' ? 'shadow-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : ''}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded" />
                            {device.risk_level === 'Critical' && <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded" />}
                            {getDeviceIcon(device.name)}
                          </div>
                          
                          {/* Status Dot */}
                          <div className={`w-3 h-3 rounded-full mt-3 shadow-lg ${getStatusColor(device.risk_level)}`} />
                          
                          {/* Label */}
                          <div className="mt-2 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/50 backdrop-blur-md">
                            <p className="text-[9px] font-bold text-white whitespace-nowrap">{device.name}</p>
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-4 w-48 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-2xl opacity-0 group-hover/device:opacity-100 transition-opacity pointer-events-none">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-xs font-bold text-white leading-tight">{device.name}</p>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(device.risk_level)}`} />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                              <span>Health Score</span>
                              <span className="font-bold text-white">{device.health_score}%</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Failure Prob.</span>
                              <span className="font-bold text-red-400">{device.risk_score?.toFixed(1) || '0.0'}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
