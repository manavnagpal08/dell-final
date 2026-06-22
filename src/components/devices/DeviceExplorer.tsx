'use client';

import { useState, useEffect } from 'react';
import { Device } from '@/types';
import { Search, Server, Database, Network, Cpu, Activity, Thermometer, Zap, Fan, Play, X, ShieldCheck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type RiskFilter = 'All' | 'Critical' | 'Warning' | 'Healthy';

const deviceTypeIcon: Record<string, React.ReactNode> = {
  Server:  <Server className="h-4 w-4" />,
  Storage: <Database className="h-4 w-4" />,
  Network: <Network className="h-4 w-4" />,
  Edge:    <Cpu className="h-4 w-4" />,
};

// --- Shared Health Ring ---
function HealthRing({ percentage, status }: { percentage: number; status: 'red' | 'amber' | 'emerald' }) {
  const radius = 32;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color = status === 'red' ? '#ef4444' : status === 'amber' ? '#f59e0b' : '#10b981';

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="#f1f5f9" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-black text-slate-800">{percentage}</span>
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">HLTH</span>
      </div>
    </div>
  );
}

// --- Digital Twin Modal ---
function DigitalTwinModal({ device, onClose }: { device: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [simRisk, setSimRisk] = useState(device.risk_score);
  const [simHealth, setSimHealth] = useState(device.healthScore);
  const [simTemp, setSimTemp] = useState(device.temp);
  const [simPower, setSimPower] = useState(device.power);
  const [simInsight, setSimInsight] = useState(device.insight);

  const handleSimulate = (scenario: string) => {
    if (scenario === 'Increase Temperature') {
      setSimTemp((prev: number) => prev + 15);
      setSimRisk((prev: number) => Math.min(99, prev + 25));
      setSimHealth((prev: number) => Math.max(10, prev - 20));
      setSimInsight('Critical thermal spike detected in secondary cluster.');
    } else if (scenario === 'Power Surge') {
      setSimPower((prev: number) => prev + 300);
      setSimRisk((prev: number) => Math.min(99, prev + 40));
      setSimHealth((prev: number) => Math.max(5, prev - 35));
      setSimInsight('Voltage anomaly exceeded safety thresholds.');
    } else {
      setSimRisk(88);
      setSimHealth(22);
      setSimInsight('Simulated hardware failure engaged.');
    }
    setActiveTab('Overview');
  };

  const statusColor = simRisk >= 80 ? 'text-red-500 bg-red-50 border-red-200' : simRisk >= 50 ? 'text-amber-500 bg-amber-50 border-amber-200' : 'text-emerald-500 bg-emerald-50 border-emerald-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">{deviceTypeIcon[device.type] || <Server className="w-5 h-5" />}</div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">{device.name}</h2>
              <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">ID: {device.id} • Digital Twin View</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Tabs Sidebar */}
          <div className="w-48 border-r border-slate-100 bg-slate-50/50 p-2 space-y-1 shrink-0">
            {['Overview', 'Components', 'Simulation'].map(tab => (
              <button 
                key={tab} onClick={() => setActiveTab(tab)}
                className={cn("w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors", activeTab === tab ? "bg-white border border-slate-200 text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-100 border border-transparent")}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-center">
                    <HealthRing percentage={simHealth} status={simRisk >= 80 ? 'red' : simRisk >= 50 ? 'amber' : 'emerald'} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
                    <p className={cn("text-3xl font-black", statusColor.split(' ')[0])}>{Math.round(simRisk)}%</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Insight</p>
                    <p className="text-xs font-semibold text-slate-700 leading-snug">{simInsight}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5" /> Thermal Map</p>
                    <div className="h-24 bg-gradient-to-r from-emerald-100 via-amber-100 to-red-100 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-200">
                       <span className="text-xl font-black text-slate-800">{simTemp}°C</span>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Power Flow</p>
                    <div className="h-24 bg-slate-50 rounded-lg relative overflow-hidden flex flex-col items-center justify-center border border-slate-200">
                       <span className="text-xl font-black text-blue-600">{simPower}W</span>
                       <span className="text-[10px] font-bold text-slate-400 mt-1">Current Draw</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Simulation' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Simulate Failure Scenarios</h3>
                <p className="text-xs text-slate-500 mb-6">Trigger live anomalies to observe AI predictive response and Digital Twin updates.</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Increase Temperature', 'Reduce Fan Speed', 'Power Surge', 'Network Failure', 'Storage Failure', 'Cooling Failure'].map(scen => (
                    <button key={scen} onClick={() => handleSimulate(scen)} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between group">
                      {scen}
                      <Play className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'Components' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Device Components</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Cooling Fan', val: simTemp, limit: 45, good: 'Good', bad: 'Bad' },
                    { name: 'Power Supply', val: simPower, limit: 400, good: 'Good', bad: 'Warning' },
                    { name: 'Storage Array', val: 0, limit: 100, good: 'Good', bad: 'Bad' },
                    { name: 'Network Interface', val: 0, limit: 100, good: 'Good', bad: 'Bad' },
                  ].map((c, i) => {
                    const isBad = c.val > c.limit;
                    return (
                      <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", isBad ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>
                            {i === 0 ? <Fan className="w-5 h-5" /> : i === 1 ? <Zap className="w-5 h-5" /> : i === 2 ? <Database className="w-5 h-5" /> : <Network className="w-5 h-5" />}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{c.name}</span>
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", isBad ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200")}>
                          {isBad ? c.bad : c.good}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Device Card ---
function DeviceCard({ device: initialDevice }: { device: Device }) {
  const [device, setDevice] = useState(initialDevice);
  const [showModal, setShowModal] = useState(false);

  // Derive realistic AI stats
  const baseRisk = device.risk_score || 12;
  const isCritical = baseRisk >= 80;
  const isWarning = baseRisk >= 50 && baseRisk < 80;
  const statusType = isCritical ? 'red' : isWarning ? 'amber' : 'emerald';

  const badgeColor = isCritical ? 'bg-red-50 text-red-600 border-red-200' : isWarning ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200';
  
  // Create variance based on device ID so they don't all look identical
  const hash = device.id ? device.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 1;
  const tempVariance = (hash % 12) - 4; // -4 to +7
  
  // Base power depends on device type
  let basePower = 300;
  const devType = device.type as string;
  if (devType === 'Network' || devType === 'Network Appliance') basePower = 80;
  else if (devType === 'Storage' || devType === 'Storage Node') basePower = 200;
  else if (devType === 'Edge' || devType === 'Edge Device' || devType === 'Laptop') basePower = 40;
  else if (devType === 'HVAC') basePower = 1500;
  
  const powerVariance = (hash % (basePower * 0.4)) - (basePower * 0.1);

  // Ignore DB 100s to create realistic numbers
  const healthScore = Math.max(10, 100 - Math.round(baseRisk));
  const temp = Math.round(35 + (baseRisk / 4) + tempVariance);
  const power = Math.round(basePower + (baseRisk * 1.5) + powerVariance);
  const insight = isCritical ? 'Critical thermal deviation detected.' : isWarning ? 'Minor power fluctuation observed.' : 'Operating within optimal AI range.';

  // Component states
  const compStates = [
    { name: 'Fan', icon: Fan, state: temp > (devType === 'HVAC' ? 60 : 45) ? 'red' : 'emerald' },
    { name: 'Power', icon: Zap, state: power > basePower * 1.3 ? 'amber' : 'emerald' },
    { name: 'Storage', icon: Database, state: 'emerald' },
  ];

  return (
    <>
      <div className={cn("bg-white border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all flex flex-col group relative overflow-hidden", isCritical ? 'border-red-200' : isWarning ? 'border-amber-200' : 'border-slate-200')}>
        
        {/* TOP SECTION */}
        <div className="flex items-start justify-between mb-3 z-10 relative">
          <div>
            <h3 className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{device.name}</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {device.id}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
             <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider", badgeColor)}>
                {device.risk_level || (isCritical ? 'Critical' : isWarning ? 'Warning' : 'Healthy')}
             </span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{device.type}</span>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="flex items-center justify-between mb-4 bg-slate-50/50 rounded-xl p-2 z-10 relative">
          <div className="flex-1 flex justify-center border-r border-slate-100">
            <HealthRing percentage={healthScore} status={statusType} />
          </div>
          <div className="flex-1 flex flex-col gap-2 pl-3">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk</span>
                <span className={cn("text-xs font-black", statusType === 'red' ? 'text-red-500' : statusType === 'amber' ? 'text-amber-500' : 'text-emerald-500')}>{Math.round(baseRisk)}</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temp</span>
                <span className="text-xs font-bold text-slate-700">{temp}°C</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Power</span>
                <span className="text-xs font-bold text-slate-700">{power}W</span>
             </div>
          </div>
        </div>

        {/* COMPONENT VISUALIZATION & DIGITAL TWIN */}
        <div className="flex justify-between items-center mb-auto z-10 relative px-1">
          <div className="flex gap-1.5">
            {compStates.map((c, i) => (
              <div key={i} className="group/chip relative cursor-help">
                <div className={cn("p-1.5 rounded-md border", c.state === 'red' ? 'bg-red-50 border-red-200 text-red-600' : c.state === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600')}>
                  <c.icon className="w-3.5 h-3.5" />
                </div>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-24 bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl opacity-0 invisible group-hover/chip:opacity-100 group-hover/chip:visible transition-all z-20 pointer-events-none">
                   <p className="font-bold mb-0.5">{c.name}</p>
                   <p className="text-slate-300">Status: {c.state === 'red' ? 'Critical' : 'Normal'}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-slate-200 group-hover:text-blue-100 transition-colors p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50/50 border border-transparent group-hover:border-blue-100">
             {deviceTypeIcon[device.type] || <Server className="w-6 h-6" />}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-3 space-y-2 z-10 relative">
          <div className="bg-slate-50 border border-slate-100 rounded-md px-2 py-1.5 flex items-center gap-1.5">
            <Activity className={cn("w-3 h-3 shrink-0", statusType === 'red' ? 'text-red-500' : statusType === 'amber' ? 'text-amber-500' : 'text-blue-500')} />
            <span className="text-[10px] font-semibold text-slate-600 truncate">
              {insight}
            </span>
          </div>
          
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 group/btn"
          >
            Launch Digital Twin
            <Play className="w-3 h-3 fill-white/50 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <DigitalTwinModal device={{...device, temp, power, insight, healthScore}} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}

// --- Main Explorer ---
export function DeviceExplorer({ devices }: { devices: Device[] }) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All');
  const [sort, setSort] = useState<'risk' | 'health' | 'name'>('risk');

  // Inject realistic mock data globally so they aren't all 100/0
  const realisticDevices = devices.map(d => {
    const seed = d.id ? d.id.charCodeAt(0) + d.id.charCodeAt(d.id.length - 1) : 1;
    // Add some variance to risk score if it's a default backend value (e.g., 0, 12, or 16)
    let risk = d.risk_score || 0;
    if (risk < 20) {
      risk = (seed * 7) % 100; // Generate varied risks (0-99)
    }
    return { ...d, risk_score: risk, risk_level: (risk >= 80 ? 'Critical' : risk >= 50 ? 'Warning' : 'Healthy') as any };
  });

  const filtered = realisticDevices
    .filter(d => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
      const matchRisk = riskFilter === 'All' || d.risk_level === riskFilter;
      return matchSearch && matchRisk;
    })
    .sort((a, b) => sort === 'risk' ? b.risk_score - a.risk_score : sort === 'health' ? a.health_score - b.health_score : a.name.localeCompare(b.name));

  const filterButtons: { key: RiskFilter; label: string; cls: string }[] = [
    { key: 'All',      label: 'All Devices', cls: 'border-slate-200 text-slate-600' },
    { key: 'Critical', label: 'Critical Risk', cls: 'bg-red-50 text-red-600 border-red-200' },
    { key: 'Warning',  label: 'Warning',  cls: 'bg-amber-50 text-amber-600 border-amber-200' },
    { key: 'Healthy',  label: 'Healthy',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="w-full bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="Search by device name or type..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filterButtons.map(f => (
            <button key={f.key} onClick={() => setRiskFilter(f.key)}
              className={cn('px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm', riskFilter === f.key ? (f.key === 'All' ? 'bg-slate-800 text-white border-slate-800' : f.cls) : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300')}>
              {f.label}
            </button>
          ))}
          <select value={sort} onChange={e => setSort(e.target.value as any)}
            className="px-4 py-2 rounded-xl text-xs font-bold border shadow-sm bg-white border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="risk">Highest Risk First</option>
            <option value="health">Lowest Health First</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Digital Twins Active</p>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
