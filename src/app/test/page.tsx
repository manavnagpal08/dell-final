'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDevices } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

export default function TestPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [testMode, setTestMode] = useState<string>('mixed');
  
  // Operational fields
  const [temperature, setTemperature] = useState(45);
  const [fanRpm, setFanRpm] = useState(2500);
  const [powerUsage, setPowerUsage] = useState(150);
  const [smartHealth, setSmartHealth] = useState(100);
  
  // Storage fields (SMART attributes)
  const [smart5, setSmart5] = useState(0);
  const [smart187, setSmart187] = useState(0);
  const [smart188, setSmart188] = useState(0);
  const [smart197, setSmart197] = useState(0);
  const [smart198, setSmart198] = useState(0);
  
  const [logs, setLogs] = useState<any[]>([]);
  const [isAutoSending, setIsAutoSending] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initDevices = async () => {
      try {
        let currentDevices = await getDevices();
        if (currentDevices.length < 10) {
          setLogs(prev => [{ time: new Date().toLocaleTimeString(), info: `Seeding ${10 - currentDevices.length} devices...` }, ...prev]);
          const toCreate = 10 - currentDevices.length;
          for (let i = 0; i < toCreate; i++) {
            const res = await fetch(`${API_URL}/devices/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                device_name: `Vyom-Edge-Node-${Math.floor(Math.random() * 1000)}`,
                vendor: "Simulated Corp",
                model: "EdgeX-100",
                location: "Datacenter Alpha",
                device_type: "Server"
              })
            });
            if (!res.ok) throw new Error(`Failed to create device`);
          }
          currentDevices = await getDevices();
        }
        setDevices(currentDevices);
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), info: `Loaded ${currentDevices.length} devices successfully.` }, ...prev]);
      } catch (err: any) {
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), error: `Init Devices Error: ${err.message}` }, ...prev]);
      }
    };
    initDevices();
  }, []);

  const sendData = async () => {
    if (devices.length === 0) return;
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    const deviceId = randomDevice.id;

    let payload: any = {};
    
    if (testMode === 'mixed') {
      const stateType = Math.random();
      if (stateType < 0.1) {
        payload = { temperature: 95, fan_rpm: 400, power_usage: 250, smart_health: 10 }; // Critical Op
      } else if (stateType < 0.2) {
        payload = { temperature: 40, fan_rpm: 2500, power_usage: 150, smart_5_raw: 100, smart_187_raw: 50 }; // Critical Storage
      } else {
        payload = { temperature: 45, fan_rpm: 2500, power_usage: 150, smart_health: 100, smart_5_raw: 0, smart_187_raw: 0 }; // Healthy
      }
    } else if (testMode === 'operational_anomaly') {
      payload = { temperature: 95 + Math.random() * 5, fan_rpm: 400 + Math.random() * 50, power_usage: 250, smart_health: 10 };
    } else if (testMode === 'storage_anomaly') {
      payload = { temperature: 40, fan_rpm: 2500, power_usage: 150, smart_health: 80, smart_5_raw: 150 + Math.random() * 50, smart_187_raw: 20 + Math.random() * 10, smart_197_raw: 5 };
    } else {
      // Custom
      payload = {
        temperature: Number(temperature),
        fan_rpm: Number(fanRpm),
        power_usage: Number(powerUsage),
        smart_health: Number(smartHealth),
        smart_5_raw: Number(smart5),
        smart_187_raw: Number(smart187),
        smart_188_raw: Number(smart188),
        smart_197_raw: Number(smart197),
        smart_198_raw: Number(smart198),
      };
    }

    try {
      const res = await fetch(`${API_URL}/devices/${deviceId}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      
      const devRes = await fetch(`${API_URL}/devices/${deviceId}`);
      const devData = devRes.ok ? await devRes.json() : null;

      const logEntry = {
        time: new Date().toLocaleTimeString(),
        device: randomDevice.name,
        sent: payload,
        ml_prediction: devData ? {
          risk_level: devData.risk_level,
          risk_score: devData.risk_score,
          health_score: devData.health_score
        } : "Failed"
      };
      setLogs(prev => [logEntry, ...prev].slice(0, 50));
    } catch (err: any) {
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), error: `Failed to send: ${err.message}` }, ...prev]);
    }
  };

  useEffect(() => {
    if (isAutoSending) {
      intervalRef.current = setInterval(() => sendData(), 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAutoSending, devices, testMode, temperature, fanRpm, powerUsage, smartHealth, smart5, smart187, smart188, smart197, smart198]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">ML Model Telemetry Test</h1>
      
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-sm">Select Test Mode:</label>
          <select 
            className="border p-2 rounded text-sm w-64"
            value={testMode} 
            onChange={(e) => setTestMode(e.target.value)}
          >
            <option value="mixed">Auto (Mixed Anomalies)</option>
            <option value="operational_anomaly">Force Operational Anomaly</option>
            <option value="storage_anomaly">Force Storage Anomaly</option>
            <option value="custom">Custom Data Entry</option>
          </select>
        </div>

        {testMode === 'custom' && (
          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="text-xs font-medium text-slate-500">Temp (°C)</label>
              <Input type="number" value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Fan RPM</label>
              <Input type="number" value={fanRpm} onChange={e => setFanRpm(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Power (W)</label>
              <Input type="number" value={powerUsage} onChange={e => setPowerUsage(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Health (%)</label>
              <Input type="number" value={smartHealth} onChange={e => setSmartHealth(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">SMART 5 (Reallocated)</label>
              <Input type="number" value={smart5} onChange={e => setSmart5(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">SMART 187 (Uncorrectable)</label>
              <Input type="number" value={smart187} onChange={e => setSmart187(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">SMART 188 (Timeout)</label>
              <Input type="number" value={smart188} onChange={e => setSmart188(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">SMART 197 (Pending)</label>
              <Input type="number" value={smart197} onChange={e => setSmart197(Number(e.target.value))} />
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4 items-center">
          <Button onClick={sendData} className="bg-blue-600 hover:bg-blue-700 text-white">
            Send Payload Once
          </Button>
          <Button 
            onClick={() => setIsAutoSending(!isAutoSending)} 
            variant={isAutoSending ? "destructive" : "outline"}
          >
            {isAutoSending ? "Stop Auto-Send" : "Start Auto-Send"}
          </Button>
          
          <div className="border-l pl-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">Company Testing:</span>
            <Input 
              type="file" 
              accept=".csv" 
              className="w-64 cursor-pointer text-xs" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                   const reader = new FileReader();
                   reader.onload = async (evt) => {
                     const text = evt.target?.result;
                     if (typeof text === 'string') {
                       setLogs(prev => [{ time: new Date().toLocaleTimeString(), info: `Uploading and processing CSV file with ML Models...` }, ...prev]);
                       // Real CSV parsing and API integration
                       const rows = text.split('\\n').filter(r => r.trim().length > 0);
                       if (rows.length < 2) return;
                       
                       const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
                       let successCount = 0;
                       
                       // Process sequentially to not overload backend
                       for (let i = 1; i < rows.length; i++) {
                         const cols = rows[i].split(',').map(c => c.trim());
                         if (cols.length !== headers.length) continue;
                         
                         let payload: any = {};
                         headers.forEach((h, idx) => {
                           payload[h] = isNaN(Number(cols[idx])) ? cols[idx] : Number(cols[idx]);
                         });
                         
                         const randomDevice = devices[Math.floor(Math.random() * devices.length)];
                         if (!randomDevice) continue;
                         
                         try {
                           const res = await fetch(`${API_URL}/devices/${randomDevice.id}/telemetry`, {
                             method: 'POST',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify(payload)
                           });
                           if (res.ok) successCount++;
                         } catch (e) {
                           console.error(e);
                         }
                       }
                       
                       setLogs(prev => [{ time: new Date().toLocaleTimeString(), info: `Successfully processed ${successCount} actual telemetry rows from CSV and sent to live ML engine.` }, ...prev]);
                     }
                   };
                   reader.readAsText(file);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border h-[400px] overflow-auto">
        <h2 className="font-semibold mb-4">Live Activity Logs & ML Engine Output</h2>
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="bg-white p-3 rounded border text-sm font-mono flex flex-col gap-2">
              <div className="flex items-center gap-3 text-slate-500">
                <span>[{log.time}]</span>
                {log.device && <span className="text-blue-600 font-semibold">{log.device}</span>}
              </div>
              {log.error && <div className="text-red-500">{log.error}</div>}
              {log.info && <div className="text-blue-500">{log.info}</div>}
              {log.sent && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="font-semibold text-slate-700 block mb-1">Sent Telemetry:</span>
                    <pre className="text-[11px] overflow-x-auto">{JSON.stringify(log.sent, null, 2)}</pre>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border-l-[3px] border-emerald-500">
                    <span className="font-semibold text-emerald-700 block mb-1">ML Engine Result:</span>
                    <pre className="text-[11px] text-emerald-800">{JSON.stringify(log.ml_prediction, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
