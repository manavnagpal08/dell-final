'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BuildingDetailsPanel } from './BuildingDetailsPanel';
import { Device } from '@/types';

// Pre-defined spatial slots on the isometric grid for up to 12 devices
const SLOTS = [
  { points: '300,150 380,110 460,150 380,190', cx: 380, cy: 150 },
  { points: '480,240 560,200 640,240 560,280', cx: 560, cy: 240 },
  { points: '660,330 740,290 820,330 740,370', cx: 740, cy: 330 },
  { points: '200,200 280,160 360,200 280,240', cx: 280, cy: 200 },
  { points: '380,290 460,250 540,290 460,330', cx: 460, cy: 290 },
  { points: '560,380 640,340 720,380 640,420', cx: 640, cy: 380 },
  { points: '100,250 180,210 260,250 180,290', cx: 180, cy: 250 },
  { points: '280,340 360,300 440,340 360,380', cx: 360, cy: 340 },
  { points: '460,430 540,390 620,430 540,470', cx: 540, cy: 430 },
  { points: '180,390 260,350 340,390 260,430', cx: 260, cy: 390 },
  { points: '360,480 440,440 520,480 440,520', cx: 440, cy: 480 },
  { points: '540,570 620,530 700,570 620,610', cx: 620, cy: 570 },
];

export function InteractiveMap({ riskHeatmapEnabled, devices }: { riskHeatmapEnabled: boolean, devices: Device[] }) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Take up to 12 devices to fit our slots
  const mapNodes = devices.slice(0, 12).map((device, i) => ({
    ...device,
    ...SLOTS[i]
  }));

  const getStatusColor = (status: string, riskLevel: string) => {
    if (status === 'Offline') return '#64748b';
    if (riskHeatmapEnabled) {
      if (riskLevel === 'Critical') return '#ef4444'; 
      if (riskLevel === 'Warning') return '#f97316'; 
      if (riskLevel === 'Healthy') return '#3b82f6'; 
      return '#94a3b8';
    }
    switch (riskLevel) {
      case 'Healthy': return '#10b981';
      case 'Warning': return '#f59e0b';
      case 'Critical': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Floors / Background Grid */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="glassFloor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(240, 248, 255, 0.2)" />
          </linearGradient>
          <linearGradient id="glassFloorStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
          </linearGradient>
        </defs>

        {/* Floor 1 (Bottom) */}
        <g transform="translate(0, 100)">
          <polygon points="100,500 500,300 900,500 500,700" fill="url(#glassFloor)" stroke="url(#glassFloorStroke)" strokeWidth="2" />
          <text x="120" y="520" fill="#64748b" className="text-xs font-black uppercase tracking-widest" style={{transform: "skewY(26deg)"}}>Floor 1 - Power & Cooling</text>
        </g>
        
        {/* Floor 2 (Middle) */}
        <g transform="translate(0, 0)">
          <polygon points="100,400 500,200 900,400 500,600" fill="url(#glassFloor)" stroke="url(#glassFloorStroke)" strokeWidth="2" />
          <text x="120" y="420" fill="#64748b" className="text-xs font-black uppercase tracking-widest" style={{transform: "skewY(26deg)"}}>Floor 2 - Networking & Edge</text>
        </g>
        
        {/* Floor 3 (Top) */}
        <g transform="translate(0, -100)">
          <polygon points="100,300 500,100 900,300 500,500" fill="url(#glassFloor)" stroke="url(#glassFloorStroke)" strokeWidth="2" />
          <text x="120" y="320" fill="#64748b" className="text-xs font-black uppercase tracking-widest" style={{transform: "skewY(26deg)"}}>Floor 3 - Datacenter Core</text>
        </g>

        {/* Connection Paths (Data Streams) to the Hub */}
        {mapNodes.map(node => (
          <motion.path
            key={`path-${node.id}`}
            d={`M${node.cx},${node.cy} Q500,100 500,30`}
            fill="none"
            stroke={node.risk_level === 'Critical' ? '#ef4444' : '#cbd5e1'}
            strokeWidth={node.risk_level === 'Critical' ? 2 : 1}
            strokeDasharray="5,5"
            className={node.risk_level === 'Critical' ? "animate-dash-flow" : ""}
            style={node.risk_level === 'Critical' ? { filter: 'url(#glow)' } : { opacity: 0.5 }}
          />
        ))}

        {/* Live Alert Center Hub */}
        <circle cx="500" cy="30" r="10" fill="#3b82f6" filter="url(#glow)" />
        <circle cx="500" cy="30" r="20" fill="none" stroke="#3b82f6" strokeWidth="1" className="animate-ping opacity-50" />
        <text x="500" y="65" textAnchor="middle" fill="#3b82f6" className="text-[10px] font-bold tracking-widest uppercase">AI Core Hub</text>

        {/* Racks SVG */}
        {mapNodes.map((node) => {
          const color = getStatusColor(node.status, node.risk_level);
          const isSelected = selectedDevice?.id === node.id;

          // Parse polygon to build 3D sides
          const p = node.points.split(' ').map(pt => {
            const [x,y] = pt.split(',').map(Number);
            return {x,y};
          });

          return (
            <g key={node.id} onClick={() => setSelectedDevice(node)} className="cursor-pointer group">
              {/* Pulsing ring for critical */}
              {node.risk_level === 'Critical' && (
                <motion.circle
                  cx={node.cx} cy={node.cy} r={60}
                  fill="none" stroke="#ef4444" strokeWidth="2"
                  initial={{ opacity: 0.8, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Shadow Base */}
              <polygon points={node.points} fill="rgba(0,0,0,0.05)" transform="translate(0, 15)" />
              
              {/* 3D Sides */}
              <polygon points={`${p[1].x},${p[1].y} ${p[1].x},${p[1].y+30} ${p[2].x},${p[2].y+30} ${p[2].x},${p[2].y}`} fill="#e2e8f0" opacity="0.8" />
              <polygon points={`${p[0].x},${p[0].y} ${p[0].x},${p[0].y+30} ${p[1].x},${p[1].y+30} ${p[1].x},${p[1].y}`} fill="#cbd5e1" opacity="0.8" />

              {/* Top Surface */}
              <motion.polygon
                points={node.points}
                fill={color}
                stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.4)'}
                strokeWidth={2}
                initial={{ y: 0 }}
                whileHover={{ y: -5, filter: 'brightness(1.1)' }}
                animate={{ y: isSelected ? -10 : 0 }}
                className="transition-all duration-300 drop-shadow-xl"
                style={{ opacity: isSelected ? 1 : 0.85 }}
              />

              {/* Data Node Overlay */}
              <circle cx={node.cx} cy={node.cy} r="4" fill="#fff" />
              <text x={node.cx} y={node.cy - 10} textAnchor="middle" fill="#475569" className="text-[10px] font-bold pointer-events-none group-hover:fill-slate-900 transition-colors">
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      <BuildingDetailsPanel device={selectedDevice} onClose={() => setSelectedDevice(null)} />
    </div>
  );
}
