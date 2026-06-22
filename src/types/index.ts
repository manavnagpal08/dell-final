export type DeviceType = 'Server' | 'Workstation' | 'Storage Node' | 'Network Appliance' | 'Laptop' | 'Edge Device';
export type FailureType = 'Storage Failure' | 'Thermal Failure' | 'Power Failure' | 'Cooling Failure' | 'Unknown Anomaly';
export type RiskLevel = 'Healthy' | 'Warning' | 'Critical';
export type DeviceStatus = 'Online' | 'Offline' | 'Maintenance';
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export interface Device {
  id: string;
  name: string;
  vendor: string;
  model: string;
  location: string;
  type: DeviceType;
  health_score: number;
  risk_score: number;
  risk_level: RiskLevel;
  predicted_failure_type: FailureType | null;
  days_remaining: number | null;
  last_telemetry_timestamp: string;
  status: DeviceStatus;
}

export interface TelemetryRecord {
  id: string;
  device_id: string;
  timestamp: string;
  temperature: number;
  fan_rpm: number;
  voltage: number;
  power_usage: number;
  smart_health: number;
}

export interface Prediction {
  id: string;
  device_id: string;
  prediction_timestamp: string;
  failure_type: FailureType;
  probability: number;
  days_remaining: number;
  confidence: number;
  model_version: string;
}

export interface Alert {
  id: string;
  device_id: string;
  severity: AlertSeverity;
  failure_probability: number;
  failure_type: FailureType | 'General Anomaly';
  time_generated: string;
  recommended_action: string;
  status: AlertStatus;
}

export interface Recommendation {
  id: string;
  device_id: string;
  action: string;
  component: string;
  priority: 'High' | 'Medium' | 'Low';
  estimated_cost: number;
  downtime_saved: number;
  suggested_schedule: string;
  business_impact: string;
}

export interface ExplanationFactor {
  id: string;
  prediction_id: string;
  factor: string;
  impact_score: number; // 0 to 100, or negative if it reduces risk
  description: string;
}

export interface MaintenanceEvent {
  id: string;
  device_id: string;
  scheduled_time: string;
  action: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface DashboardSummary {
  total_devices: number;
  healthy_devices: number;
  warning_devices: number;
  critical_devices: number;
  predicted_failures_7_days: number;
  predicted_failures_30_days: number;
  estimated_downtime_prevented: number; // in hours
  estimated_cost_savings: number; // in dollars
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Disconnected' | 'Adapter Ready';
  last_sync: string | null;
}
