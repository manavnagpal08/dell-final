'use client';

import { useState, useEffect } from 'react';
import { Server, Activity, Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';

interface IntegrationStatus {
  integration: string;
  status: string;
}

export default function IntegrationsPage() {
  const [statuses, setStatuses] = useState<Record<string, IntegrationStatus>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

  const fetchStatus = async (type: string) => {
    try {
      const res = await fetch(`${API_URL}/integrations/${type}/status`);
      const data = await res.json();
      setStatuses(prev => ({ ...prev, [type]: data }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus('zabbix');
    fetchStatus('redfish');
    fetchStatus('snmp');
  }, []);

  const handleAction = async (type: string, action: string) => {
    const key = `${type}-${action}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`${API_URL}/integrations/${type}/${action}`, {
        method: 'POST',
      });
      const data = await res.json();
      setResults(prev => ({ ...prev, [type]: data }));
    } catch (e: any) {
      setResults(prev => ({ 
        ...prev, 
        [type]: { success: false, message: e.message || 'Action failed', error: 'Network error' } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const integrations = [
    { 
      id: 'zabbix', 
      name: 'Zabbix API', 
      type: 'IT Infrastructure Monitoring',
      icon: <Activity className="h-6 w-6 text-orange-500" />,
      desc: 'Import real monitored hosts, health metrics, triggers, and alerts from Zabbix.',
      actions: ['test-connection', 'sync-hosts', 'sync-telemetry', 'sync-alerts']
    },
    { 
      id: 'redfish', 
      name: 'Redfish API', 
      type: 'Hardware Management',
      icon: <Server className="h-6 w-6 text-red-500" />,
      desc: 'Collect real hardware telemetry from Dell iDRAC, HP iLO, and other BMCs.',
      actions: ['test-connection', 'sync-systems', 'sync-telemetry', 'sync-alerts']
    },
    { 
      id: 'snmp', 
      name: 'SNMP Polling', 
      type: 'Network & Systems',
      icon: <Database className="h-6 w-6 text-blue-500" />,
      desc: 'Collect real telemetry from devices exposing SNMP v2c/v3.',
      actions: ['test-connection', 'poll', 'sync-telemetry']
    }
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Enterprise Integrations</h1>
          <p className="text-slate-500 mt-1">Connect VyomAi directly to your production hardware and monitoring infrastructure.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {integrations.map((app) => {
            const status = statuses[app.id]?.status || 'Checking...';
            const res = results[app.id];
            
            return (
              <div key={app.id} className="vy-card p-6 flex flex-col h-full border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {app.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{app.name}</h3>
                      <p className="text-xs text-slate-500">{app.type}</p>
                    </div>
                  </div>
                  
                  {status === 'Configured' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      <CheckCircle className="h-3 w-3" /> Configured
                    </span>
                  ) : status === 'Not Configured' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      <AlertCircle className="h-3 w-3" /> Not Configured
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Checking
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-6">{app.desc}</p>
                
                {res && (
                  <div className={`mb-6 p-4 rounded-lg text-sm ${res.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                    <div className="font-bold flex items-center gap-2">
                      {res.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {res.message}
                    </div>
                    {res.error && <div className="mt-2 text-xs font-mono bg-red-100 p-2 rounded">{res.error}</div>}
                    {res.records_processed !== undefined && (
                      <div className="mt-2 text-xs">
                        Records processed: {res.records_processed} | Failed: {res.records_failed}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  {app.actions.map(action => {
                    const isLoad = loading[`${app.id}-${action}`];
                    return (
                      <Button 
                        key={action}
                        variant={action.includes('test') ? 'default' : 'outline'}
                        className={`w-full text-xs ${action.includes('test') ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600'}`}
                        onClick={() => handleAction(app.id, action)}
                        disabled={isLoad}
                      >
                        {isLoad ? <RefreshCw className="h-3 w-3 animate-spin mr-2" /> : null}
                        {action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
