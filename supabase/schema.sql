-- Supabase Schema for VyomAi

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Devices Table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vendor TEXT NOT NULL,
  model TEXT NOT NULL,
  location TEXT,
  type TEXT NOT NULL,
  health_score INTEGER NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  predicted_failure_type TEXT,
  days_remaining INTEGER,
  last_telemetry_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL
);

-- Telemetry Records Table
CREATE TABLE telemetry_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature NUMERIC NOT NULL,
  fan_rpm NUMERIC NOT NULL,
  voltage NUMERIC NOT NULL,
  power_usage NUMERIC NOT NULL,
  smart_health NUMERIC NOT NULL
);

-- Predictions Table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  failure_type TEXT NOT NULL,
  probability NUMERIC NOT NULL,
  days_remaining INTEGER NOT NULL,
  confidence NUMERIC NOT NULL,
  model_version TEXT NOT NULL
);

-- Explanation Factors Table
CREATE TABLE explanation_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
  factor TEXT NOT NULL,
  impact_score NUMERIC NOT NULL,
  description TEXT NOT NULL
);

-- Alerts Table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  failure_probability NUMERIC NOT NULL,
  failure_type TEXT NOT NULL,
  time_generated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recommended_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
);

-- Recommendations Table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  component TEXT NOT NULL,
  priority TEXT NOT NULL,
  estimated_cost NUMERIC,
  downtime_saved NUMERIC,
  suggested_schedule TEXT,
  business_impact TEXT
);

-- Setup Row Level Security (RLS)
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE explanation_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (Adjust as needed)
CREATE POLICY "Allow read access for authenticated users" ON devices FOR SELECT USING (auth.role() = 'authenticated');
-- (Repeat for other tables)


-- Integrations Configuration Table
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Configured',
  base_url TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  devices_synced INTEGER DEFAULT 0,
  telemetry_records_synced INTEGER DEFAULT 0,
  alerts_synced INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Credentials
CREATE TABLE integration_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  credential_key TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Sync Logs
CREATE TABLE integration_sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users on integrations" ON integrations FOR SELECT USING (auth.role() = 'authenticated');

