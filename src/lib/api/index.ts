import { Device, DashboardSummary, Alert, TelemetryRecord } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';


// ─── Helper: safe fetch with timeout ─────────────────────────────────────────
async function safeFetch(url: string, options?: RequestInit): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    const res = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    return res;
  } catch {
    return null;
  }
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const [devicesRes, alertsRes] = await Promise.all([
      safeFetch(`${API_URL}/devices/`),
      safeFetch(`${API_URL}/alerts/`),
    ]);

    if (!devicesRes?.ok || !alertsRes?.ok) throw new Error('API unavailable');

    const devices = await devicesRes.json();
    const criticalDevices = devices.filter((d: any) => d.status === 'Offline' || (d.current_risk_score || d.risk_score || 0) > 80).length;
    const warningDevices = devices.filter((d: any) => { const s = d.current_risk_score || d.risk_score || 0; return s > 50 && s <= 80; }).length;

    return {
      total_devices: devices.length,
      healthy_devices: devices.length - criticalDevices - warningDevices,
      warning_devices: warningDevices,
      critical_devices: criticalDevices,
      predicted_failures_7_days: criticalDevices + warningDevices,
      predicted_failures_30_days: (criticalDevices + warningDevices) * 2,
      estimated_downtime_prevented: Math.floor(devices.length * 2.5),
      estimated_cost_savings: devices.length * 4500,
    };
  } catch {
    return {
      total_devices: 0,
      healthy_devices: 0,
      warning_devices: 0,
      critical_devices: 0,
      predicted_failures_7_days: 0,
      predicted_failures_30_days: 0,
      estimated_downtime_prevented: 0,
      estimated_cost_savings: 0,
    };
  }
}

export async function getDevices(): Promise<Device[]> {
  try {
    const res = await safeFetch(`${API_URL}/devices/`);
    if (!res?.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid response type');

    return data.map((d: any) => ({
      id: d.device_id || d.id,
      name: d.device_name || d.name || 'Unknown Device',
      vendor: d.vendor || 'Unknown',
      model: d.model || 'Unknown',
      location: d.location || 'Datacenter',
      type: d.device_type || d.type || 'Server',
      health_score: d.health_score ?? (100 - (d.current_risk_score || d.risk_score || 0)),
      risk_score: d.current_risk_score || d.risk_score || 0,
      risk_level: (d.current_risk_score || d.risk_score || 0) > 80 ? 'Critical' : (d.current_risk_score || d.risk_score || 0) > 50 ? 'Warning' : 'Healthy',
      predicted_failure_type: d.predicted_failure_type || null,
      days_remaining: d.days_remaining || null,
      last_telemetry_timestamp: d.last_ping || d.last_seen || d.last_telemetry_timestamp || new Date().toISOString(),
      status: d.status || 'Online',
    }));
  } catch {
    return [];
  }
}

export async function getDeviceById(id: string): Promise<Device | null> {
  try {
    const res = await safeFetch(`${API_URL}/devices/${id}`);
    if (!res?.ok) throw new Error('API unavailable');
    const d = await res.json();
    return {
      id: d.device_id || d.id,
      name: d.device_name || d.name || 'Unknown Device',
      vendor: d.vendor || 'Unknown',
      model: d.model || 'Unknown',
      location: d.location || 'Datacenter A',
      type: d.device_type || d.type || 'Server',
      health_score: d.health_score ?? (100 - (d.current_risk_score || d.risk_score || 0)),
      risk_score: d.current_risk_score || d.risk_score || 0,
      risk_level: (d.current_risk_score || d.risk_score || 0) > 80 ? 'Critical' : (d.current_risk_score || d.risk_score || 0) > 50 ? 'Warning' : 'Healthy',
      predicted_failure_type: d.predicted_failure_type || null,
      days_remaining: d.days_remaining || null,
      last_telemetry_timestamp: d.last_ping || d.last_seen || d.last_telemetry_timestamp || new Date().toISOString(),
      status: d.status || 'Online',
    };
  } catch {
    return null;
  }
}

export async function getAlerts(): Promise<Alert[]> {
  try {
    const res = await safeFetch(`${API_URL}/alerts/`);
    if (!res?.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid response type');

    return data.map((a: any) => ({
      id: a.id,
      device_id: a.device_id,
      severity: a.severity || 'Warning',
      failure_probability: a.failure_probability ?? 0.8,
      failure_type: a.failure_type || a.title || 'General Anomaly',
      time_generated: a.time_generated || a.created_at || new Date().toISOString(),
      recommended_action: a.recommended_action || a.description || 'Investigate immediately',
      status: a.status || 'Active',
    }));
  } catch {
    return [];
  }
}

export async function getDeviceTelemetry(id: string): Promise<TelemetryRecord[]> {
  try {
    const res = await safeFetch(`${API_URL}/devices/${id}/telemetry?limit=50`);
    if (!res?.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid response type');
    return data.map((t: any) => ({
      id: t.id || Math.random().toString(),
      device_id: id,
      timestamp: t.timestamp,
      temperature: t.temperature ?? 0,
      fan_rpm: t.fan_rpm ?? 0,
      voltage: t.voltage ?? 12.0,
      power_usage: t.power_usage ?? 0,
      smart_health: t.smart_health ?? 100,
    })).reverse();
  } catch {
    return [];
  }
}

// Fix: Use correct backend endpoints (/acknowledge and /resolve)
export async function acknowledgeAlert(alertId: string): Promise<void> {
  try {
    await safeFetch(`${API_URL}/alerts/${alertId}/acknowledge`, { method: 'PATCH' });
  } catch (error) {
    console.error('acknowledgeAlert failed:', error);
  }
}

export async function resolveAlert(alertId: string): Promise<void> {
  try {
    await safeFetch(`${API_URL}/alerts/${alertId}/resolve`, { method: 'PATCH' });
  } catch (error) {
    console.error('resolveAlert failed:', error);
  }
}
