'use client';

import { useState, useEffect } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Target, ShieldAlert, Activity, DollarSign, Briefcase, Zap } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { getDevices, getDashboardSummary } from '@/lib/api';
import { Device, DashboardSummary } from '@/types';

const LightTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="vy-card px-3 py-2 rounded-lg">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>{p.name}: ${p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function ExecutiveCommandCenterPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDevices().then(setDevices);
    getDashboardSummary().then(setSummary);
  }, []);

  if (!summary) return <div className="p-8 text-slate-400">Loading command center...</div>;

  const criticalDevices = devices.filter(d => d.risk_level === 'Critical').length;
  const downtimePrevented = summary.estimated_downtime_prevented || 0;
  const moneyAtRisk = criticalDevices * 4500;
  const healthScore = devices.length > 0 ? Math.round(devices.reduce((acc, d) => acc + (d.health_score || 100), 0) / devices.length) : 100;
  const riskIndex = healthScore > 80 ? 'Low' : healthScore > 50 ? 'Medium' : 'High';
  const allNominal = criticalDevices === 0;

  const savingsData = [
    { month: 'Current', savings: summary.estimated_cost_savings || 0, cost: devices.length * 500 }
  ];

  const getAvgHealth = (type: string) => {
    const subset = devices.filter(d => d.type === type);
    if (subset.length === 0) return 100;
    return Math.round(subset.reduce((a, d) => a + (d.health_score || 100), 0) / subset.length);
  };

  const radarData = [
    { metric: 'Storage', value: getAvgHealth('Storage') },
    { metric: 'Network', value: getAvgHealth('Network') },
    { metric: 'Thermal', value: getAvgHealth('Cooling') },
    { metric: 'Compute', value: getAvgHealth('Server') },
    { metric: 'Power',   value: 100 },
    { metric: 'Cooling', value: getAvgHealth('Cooling') },
  ];

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Management View</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Command Center</h1>
          <p className="text-slate-500 text-sm">Overview of system health, money saved, and business risks.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 vy-card rounded-xl">
          <div className={`live-dot ${allNominal ? 'live-dot-green' : 'live-dot-red'}`} />
          <span className={`text-sm font-semibold ${allNominal ? 'text-emerald-700' : 'text-red-700'}`}>
            {allNominal ? 'All Systems Nominal' : 'Action Required'}
          </span>
        </div>
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard title="Fleet Health Score" value={`${healthScore}/100`}
            icon={<Target className="h-4 w-4" />} accentColor={healthScore > 80 ? "green" : "red"} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Business Risk Index" value={riskIndex}
            icon={<ShieldAlert className="h-4 w-4" />} accentColor={riskIndex === 'Low' ? "green" : "amber"} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Downtime Prevented" value={`${downtimePrevented} hrs`}
            icon={<Activity className="h-4 w-4" />} accentColor="blue" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Money at Risk" value={`$${moneyAtRisk}`}
            icon={<DollarSign className="h-4 w-4" />} accentColor={moneyAtRisk > 0 ? "red" : "green"} />
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="grid gap-4 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <div className="vy-card p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Money Overview</p>
              <h3 className="text-base font-bold text-slate-800">Current Savings vs Maintenance Cost</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip content={<LightTooltip />} />
                  <Area type="monotone" dataKey="savings" name="Savings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
                  <Area type="monotone" dataKey="cost"    name="Cost"    stroke="#EF4444" strokeWidth={2}   fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="vy-card p-5 h-full">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">System Health</p>
              <h3 className="text-base font-bold text-slate-800">Component Health Radar</h3>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Radar name="Health" dataKey="value" stroke="#4F6EF7" fill="#4F6EF7" fillOpacity={0.12} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <StaggerItem>
        <div className="vy-card p-6 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-50">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">AI Executive Summary</h3>
              <p className="text-xs text-slate-400">Model Confidence: 96%</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            {criticalDevices > 0 ? (
              <><span className="text-red-600 font-bold">{criticalDevices} critical devices</span> require intervention. </>
            ) : (
              <><span className="text-emerald-600 font-bold">No critical devices</span> currently require intervention.</>
            )}
            Predicted downtime prevention opportunity stands at <span className="text-amber-600 font-bold">{downtimePrevented} hours</span>,
            representing estimated savings of <span className="text-emerald-600 font-bold">${summary.estimated_cost_savings.toLocaleString()}</span>.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {[
              { label: 'Avg Fleet Health', value: `${healthScore}%`, color: healthScore > 80 ? 'text-emerald-600' : 'text-amber-600' },
              { label: 'Actions Pending', value: criticalDevices.toString(), color: criticalDevices > 0 ? 'text-amber-600' : 'text-emerald-600' },
              { label: 'Avg. Confidence', value: '96%', color: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>
    </PageTransition>
  );
}
