'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Activity, ShieldAlert, ArrowLeft, Building2, Layers, MapPin, Search } from 'lucide-react';
import { Device } from '@/types';
import { useRouter } from 'next/navigation';

// Mock location mapping for Hackathon
const BUILDINGS = ['Engineering Block', 'BTech Block', 'MBA Block', 'Library', 'Hostel'];
const FLOORS = ['Floor 1', 'Floor 2', 'Floor 3'];

function assignMockLocation(deviceId: string) {
  // Deterministic mock location based on device ID
  let sum = 0;
  for (let i = 0; i < deviceId.length; i++) {
    sum += deviceId.charCodeAt(i);
  }
  return {
    building: BUILDINGS[sum % BUILDINGS.length],
    floor: FLOORS[(sum * 7) % FLOORS.length],
  };
}

function getStatusColor(status: string) {
  if (status === 'Critical') return 'bg-red-500 border-red-600 text-white';
  if (status === 'Warning') return 'bg-amber-500 border-amber-600 text-white';
  return 'bg-emerald-500 border-emerald-600 text-white';
}

function getStatusBg(status: string) {
  if (status === 'Critical') return 'bg-red-500/10 border-red-500/20';
  if (status === 'Warning') return 'bg-amber-500/10 border-amber-500/20';
  return 'bg-emerald-500/10 border-emerald-500/20';
}

type Level = 'CAMPUS' | 'BUILDING' | 'FLOOR';

export function InfrastructureMap({ devices }: { devices: Device[] }) {
  const router = useRouter();
  const [level, setLevel] = useState<Level>('CAMPUS');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  // Group devices by mock location
  const mapData = useMemo(() => {
    const data: Record<string, Record<string, Device[]>> = {};
    BUILDINGS.forEach(b => {
      data[b] = {};
      FLOORS.forEach(f => {
        data[b][f] = [];
      });
    });

    devices.forEach(device => {
      const { building, floor } = assignMockLocation(device.id);
      if (data[building] && data[building][floor]) {
        data[building][floor].push(device);
      }
    });
    return data;
  }, [devices]);

  // Aggregate health for a building
  const getBuildingStats = (building: string) => {
    let total = 0, critical = 0, warning = 0;
    Object.values(mapData[building]).forEach(floorDevices => {
      floorDevices.forEach(d => {
        total++;
        if (d.risk_level === 'Critical') critical++;
        if (d.risk_level === 'Warning') warning++;
      });
    });
    
    let status = 'Healthy';
    if (critical > 0) status = 'Critical';
    else if (warning > 0) status = 'Warning';

    return { total, critical, warning, status };
  };

  // Aggregate health for a floor
  const getFloorStats = (building: string, floor: string) => {
    const floorDevices = mapData[building][floor];
    let total = floorDevices.length, critical = 0, warning = 0;
    floorDevices.forEach(d => {
      if (d.risk_level === 'Critical') critical++;
      if (d.risk_level === 'Warning') warning++;
    });
    
    let status = 'Healthy';
    if (critical > 0) status = 'Critical';
    else if (warning > 0) status = 'Warning';

    return { total, critical, warning, status, devices: floorDevices };
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] md:min-h-[600px] vy-card overflow-hidden bg-slate-900 border-slate-800 text-slate-100">
      {/* Header toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold tracking-tight text-white">Infrastructure Map</h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <span className={`cursor-pointer hover:text-white transition-colors ${level === 'CAMPUS' ? 'text-blue-400 font-bold' : ''}`} onClick={() => { setLevel('CAMPUS'); setSelectedBuilding(null); setSelectedFloor(null); }}>Campus</span>
            {selectedBuilding && (
              <>
                <span>/</span>
                <span className={`cursor-pointer hover:text-white transition-colors ${level === 'BUILDING' ? 'text-blue-400 font-bold' : ''}`} onClick={() => { setLevel('BUILDING'); setSelectedFloor(null); }}>{selectedBuilding}</span>
              </>
            )}
            {selectedFloor && (
              <>
                <span>/</span>
                <span className="text-blue-400 font-bold">{selectedFloor}</span>
              </>
            )}
          </div>
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

      {/* Map Viewport */}
      <div className="flex-1 relative p-6 overflow-hidden bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
        <AnimatePresence mode="wait">
          
          {/* LEVEL 1: CAMPUS */}
          {level === 'CAMPUS' && (
            <motion.div 
              key="campus"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 overflow-y-auto"
            >
              {BUILDINGS.map(building => {
                const stats = getBuildingStats(building);
                return (
                  <div 
                    key={building}
                    onClick={() => { setSelectedBuilding(building); setLevel('BUILDING'); }}
                    className={`relative group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 overflow-hidden ${getStatusBg(stats.status)} hover:shadow-2xl flex flex-col justify-between h-full min-h-[200px]`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    {stats.status === 'Critical' && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
                    
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${getStatusColor(stats.status)} shadow-lg`}>
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{building}</h3>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Campus Facility</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-2 mt-6">
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 backdrop-blur-md">
                        <p className="text-xs text-slate-400 font-semibold mb-1">Devices</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 backdrop-blur-md">
                        <p className="text-xs text-amber-400/80 font-semibold mb-1">Warnings</p>
                        <p className="text-xl font-bold text-amber-400">{stats.warning}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 backdrop-blur-md">
                        <p className="text-xs text-red-400/80 font-semibold mb-1">Critical</p>
                        <p className="text-xl font-bold text-red-400">{stats.critical}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* LEVEL 2: BUILDING OVERVIEW */}
          {level === 'BUILDING' && selectedBuilding && (
            <motion.div 
              key="building"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col items-center justify-center gap-4"
            >
              {FLOORS.slice().reverse().map((floor, i) => {
                const stats = getFloorStats(selectedBuilding, floor);
                return (
                  <div 
                    key={floor}
                    onClick={() => { setSelectedFloor(floor); setLevel('FLOOR'); }}
                    className={`w-full max-w-3xl cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 hover:scale-[1.02] ${getStatusBg(stats.status)} flex items-center justify-between group relative overflow-hidden`}
                  >
                    {stats.status === 'Critical' && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={`p-4 rounded-xl ${getStatusColor(stats.status)} shadow-lg flex items-center justify-center font-bold text-xl w-16 h-16`}>
                        {3 - i}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{floor}</h3>
                        <p className="text-sm font-semibold text-slate-400 mt-1">{stats.total} Active Devices</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                      {stats.critical > 0 && (
                        <div className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                          <ShieldAlert className="h-5 w-5" />
                          {stats.critical} Critical Alerts
                        </div>
                      )}
                      <ArrowRight className="h-6 w-6 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-2" />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* LEVEL 3: FLOOR DEVICE LAYOUT */}
          {level === 'FLOOR' && selectedBuilding && selectedFloor && (
            <motion.div 
              key="floor"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 content-start h-full p-4 overflow-y-auto">
                {getFloorStats(selectedBuilding, selectedFloor).devices.map(device => (
                  <div 
                    key={device.id}
                    onClick={() => router.push(`/devices/${device.id}`)}
                    className={`relative group cursor-pointer aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 hover:z-20 ${getStatusBg(device.status)} hover:shadow-2xl`}
                  >
                    {device.risk_level === 'Critical' && <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none rounded-xl" />}
                    <Server className={`h-8 w-8 mb-2 ${device.risk_level === 'Critical' ? 'text-red-400' : device.risk_level === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <p className="text-[10px] font-bold text-white text-center px-1 truncate w-full">{device.name}</p>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 p-4 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white text-sm">{device.name}</span>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(device.status)}`}>{device.status}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Health Score</span>
                          <span className="font-bold text-white">{device.health_score ?? 100}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Failure Prob.</span>
                          <span className="font-bold text-red-400">{device.risk_score?.toFixed(1) || '0.0'}%</span>
                        </div>
                        {device.predicted_failure_type && (
                          <div className="mt-2 pt-2 border-t border-slate-700">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Predicted Failure</span>
                            <span className="text-xs font-medium text-amber-400">{device.predicted_failure_type}</span>
                          </div>
                        )}
                        {device.risk_level === 'Critical' && (
                          <div className="mt-2 pt-2 border-t border-slate-700">
                            <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">Recommended Action</span>
                            <span className="text-xs font-medium text-white">Review AI Insights & Schedule Maintenance.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// Arrow helper since lucide-react ArrowRight wasn't imported initially if missing
function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
