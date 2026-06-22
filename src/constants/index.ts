import { DeviceType, FailureType, RiskLevel, DeviceStatus, AlertSeverity, AlertStatus } from '../types';

export const DEVICE_TYPES: DeviceType[] = [
  'Server',
  'Workstation',
  'Storage Node',
  'Network Appliance',
  'Laptop',
  'Edge Device',
];

export const FAILURE_TYPES: FailureType[] = [
  'Storage Failure',
  'Thermal Failure',
  'Power Failure',
  'Cooling Failure',
  'Unknown Anomaly',
];

export const VENDORS = ['Dell', 'HP', 'Lenovo', 'Cisco', 'Custom'];

export const RISK_THRESHOLDS = {
  HEALTHY_MAX: 39,
  WARNING_MAX: 69,
  CRITICAL_MIN: 70,
};

export const getRiskLevel = (riskScore: number): RiskLevel => {
  if (riskScore <= RISK_THRESHOLDS.HEALTHY_MAX) return 'Healthy';
  if (riskScore <= RISK_THRESHOLDS.WARNING_MAX) return 'Warning';
  return 'Critical';
};

export const getHealthScore = (riskScore: number): number => {
  return 100 - riskScore;
};

export const CHART_COLORS = {
  HEALTHY: '#10b981', // emerald-500
  WARNING: '#f59e0b', // amber-500
  CRITICAL: '#ef4444', // red-500
  PRIMARY: '#3b82f6', // blue-500
  INFO: '#8b5cf6', // violet-500
};
