'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Device } from '@/types';
import { MapPin } from 'lucide-react';

const FLOORS = [
  { name: 'Floor 3', desc: 'DATACENTER CORE', color: 'from-blue-500 to-indigo-600' },
  { name: 'Floor 2', desc: 'NETWORKING', color: 'from-emerald-500 to-teal-600' },
  { name: 'Floor 1', desc: 'INFRASTRUCTURE', color: 'from-purple-500 to-pink-600' },
  { name: 'Ground Floor', desc: 'AI & SERVICES', color: 'from-blue-400 to-cyan-500' },
];

function assignMockLocation(deviceId: string) {
  let sum = 0;
  for (let i = 0; i < deviceId.length; i++) {
    sum += deviceId.charCodeAt(i);
  }
  return FLOORS[sum % FLOORS.length].name;
}

function getStatusColor(status: string) {
  if (status === 'Critical') return 'bg-red-500 shadow-red-500/50';
  if (status === 'Warning') return 'bg-amber-500 shadow-amber-500/50';
  return 'bg-emerald-500 shadow-emerald-500/50';
}

// True 3D CSS Server Rack Component
function Server3D({ device, onClick }: { device: Device, onClick: () => void }) {
  const isCritical = device.risk_level === 'Critical';
  const isWarning = device.risk_level === 'Warning';
  
  const ledColor = isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
                   isWarning ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 
                   'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]';

  return (
    <div 
      onClick={onClick}
      className="relative w-12 h-16 cursor-pointer group hover:scale-110 transition-transform duration-300"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Front Face (stands up) */}
      <div 
        className="absolute w-12 h-16 bg-slate-800 border border-slate-600 flex flex-col items-center justify-start p-1 pt-2 gap-1"
        style={{ transform: 'translateZ(12px) rotateX(-90deg)', transformOrigin: 'bottom' }}
      >
        <div className={`w-8 h-0.5 rounded-full ${ledColor} animate-pulse`} />
        <div className="w-8 h-0.5 rounded-full bg-blue-500/50" />
        <div className="w-8 h-0.5 rounded-full bg-blue-500/50" />
        <div className={`mt-auto mb-1 w-2 h-2 rounded-full ${ledColor}`} />
      </div>

      {/* Back Face */}
      <div 
        className="absolute w-12 h-16 bg-slate-900 border border-slate-800"
        style={{ transform: 'translateZ(12px) rotateX(-90deg) translateZ(-24px)', transformOrigin: 'bottom' }}
      />

      {/* Right Face */}
      <div 
        className="absolute w-6 h-16 bg-slate-700 border border-slate-600 origin-left"
        style={{ transform: 'translateZ(12px) rotateX(-90deg) rotateY(90deg) translateX(0) translateZ(48px)', transformOrigin: 'bottom' }}
      />

      {/* Left Face */}
      <div 
        className="absolute w-6 h-16 bg-slate-900 border border-slate-800 origin-right"
        style={{ transform: 'translateZ(12px) rotateX(-90deg) rotateY(-90deg) translateX(0) translateZ(48px)', transformOrigin: 'bottom' }}
      />

      {/* Top Face */}
      <div 
        className="absolute w-12 h-6 bg-slate-600 border border-slate-500"
        style={{ transform: 'translateZ(28px)' }}
      />

      {/* Shadow on the floor */}
      <div 
        className="absolute w-12 h-6 bg-black/40 blur-md"
        style={{ transform: 'translateZ(-1px)' }}
      />

      {/* Floating Info Card */}
      <div 
        className="absolute w-32 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ 
          transform: 'translateZ(60px) rotateX(-90deg) translateY(-20px) translateX(-30px)', 
          transformOrigin: 'bottom center'
        }}
      >
        <p className="text-[10px] font-bold text-white mb-1 truncate">{device.name}</p>
        <div className="flex justify-between items-center text-[9px]">
          <span className="text-slate-400">Health</span>
          <span className="text-white font-bold">{device.health_score}%</span>
        </div>
      </div>
    </div>
  );
}

export function InfrastructureMap({ devices }: { devices: Device[] }) {
  const router = useRouter();

  const mapData = useMemo(() => {
    const data: Record<string, Device[]> = {};
    FLOORS.forEach(f => {
      data[f.name] = [];
    });

    devices.forEach(device => {
      const floor = assignMockLocation(device.id);
      if (data[floor] && data[floor].length < 9) {
        data[floor].push(device);
      }
    });
    return data;
  }, [devices]);

  return (
    <div className="flex flex-col h-full min-h-[800px] vy-card overflow-hidden bg-[#0B1120] border-slate-800 text-slate-100 relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl z-20 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <MapPin className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">Datacenter Digital Twin</h2>
            <p className="text-xs text-slate-400 font-medium">Alliance University Central Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-950/50 p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" /> Healthy
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5">
            <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" /> Warning
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5">
            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444] animate-pulse" /> Critical
          </div>
        </div>
      </div>

      {/* 3D Isometric Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        
        <div 
          className="relative w-full max-w-5xl h-[800px] flex items-center justify-center"
          style={{ perspective: '2000px' }}
        >
          {/* Base Container with Transform */}
          <div 
            className="relative w-full h-full"
            style={{ 
              transformStyle: 'preserve-3d', 
              transform: 'rotateX(60deg) rotateZ(-45deg) translateY(-100px)' 
            }}
          >
            {FLOORS.map((floor, index) => {
              const floorDevices = mapData[floor.name] || [];
              const floorZ = (3 - index) * 200; // Spacing floors along Z axis
              
              return (
                <div 
                  key={floor.name}
                  className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -ml-[300px] -mt-[300px]"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${floorZ}px)`
                  }}
                >
                  {/* Thick Glass Floor Surface */}
                  <div 
                    className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md border-[2px] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    
                    {/* Inner Grid Design */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
                    <div className="absolute inset-0 border border-blue-500/20 m-4" />

                    {/* Floor Label (Attached to the front-left edge) */}
                    <div 
                      className="absolute bottom-0 left-0 -ml-32 -mb-8 flex flex-col justify-end"
                      style={{ transform: 'rotateX(-90deg) rotateY(0deg) rotateZ(45deg)', transformOrigin: 'bottom right' }}
                    >
                      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-4 rounded-xl shadow-2xl flex flex-col min-w-[200px]">
                        <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${floor.color} mb-2`} />
                        <h3 className="text-white font-black text-xl uppercase tracking-wider">{floor.name}</h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">{floor.desc}</p>
                      </div>
                    </div>

                    {/* Devices Grid */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-12 p-16" style={{ transformStyle: 'preserve-3d' }}>
                      {floorDevices.map((device, i) => (
                        <div key={device.id} className="w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                          <Server3D device={device} onClick={() => router.push(`/devices/${device.id}`)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floor Edge Thickness (Front Right) */}
                  <div 
                    className="absolute top-0 right-0 w-4 h-[600px] bg-white/5 border-l border-white/10 origin-right backdrop-blur-sm"
                    style={{ transform: 'rotateY(-90deg)' }}
                  />
                  {/* Floor Edge Thickness (Bottom Left) */}
                  <div 
                    className="absolute bottom-0 left-0 w-[600px] h-4 bg-white/10 border-t border-white/20 origin-bottom backdrop-blur-sm"
                    style={{ transform: 'rotateX(90deg)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
