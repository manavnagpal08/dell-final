-- VyomAi Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users (Extending Supabase Auth if needed, or standalone)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Operator', -- Admin, Operator, Viewer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    device_name VARCHAR(255) NOT NULL,
    vendor VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    device_type VARCHAR(50),
    location VARCHAR(255),
    health_score FLOAT,
    risk_score FLOAT,
    status VARCHAR(50) DEFAULT 'Active',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Telemetry Records
CREATE TABLE IF NOT EXISTS telemetry_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    fan_rpm INTEGER,
    voltage FLOAT,
    power_usage FLOAT,
    smart_5_raw FLOAT,
    smart_187_raw FLOAT,
    smart_188_raw FLOAT,
    smart_194_raw FLOAT,
    smart_197_raw FLOAT,
    smart_198_raw FLOAT,
    smart_199_raw FLOAT
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    prediction_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    model_type VARCHAR(50),
    failure_type VARCHAR(100),
    risk_score FLOAT,
    health_score FLOAT,
    days_remaining INTEGER,
    confidence FLOAT
);

-- Explanations
CREATE TABLE IF NOT EXISTS explanations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
    summary TEXT,
    root_causes JSONB,
    business_impact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    severity VARCHAR(50), -- Critical, High, Medium, Low
    status VARCHAR(50) DEFAULT 'Open', -- Open, Acknowledged, Resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    action TEXT,
    priority VARCHAR(50),
    estimated_cost FLOAT,
    downtime_saved FLOAT,
    maintenance_window VARCHAR(100),
    business_impact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Events
CREATE TABLE IF NOT EXISTS maintenance_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    description TEXT,
    cost FLOAT,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Explanation Factors (SHAP Values)
CREATE TABLE IF NOT EXISTS explanation_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES predictions(prediction_id) ON DELETE CASCADE,
    feature_name VARCHAR(100),
    shap_value FLOAT,
    impact VARCHAR(50), -- Positive, Negative
    human_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Integrations
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(100), -- Dell OpenManage, HP iLO, etc.
    type VARCHAR(50),
    status VARCHAR(50), -- Connected, Disconnected, Error
    last_sync TIMESTAMP WITH TIME ZONE,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Anomalies
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    anomaly_score FLOAT,
    confidence FLOAT,
    reason TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Copilot Conversations
CREATE TABLE IF NOT EXISTS copilot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Copilot Messages
CREATE TABLE IF NOT EXISTS copilot_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES copilot_conversations(id) ON DELETE CASCADE,
    role VARCHAR(50), -- user, model
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set up Row Level Security (RLS) - Example for devices
-- ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view devices in their organization" ON devices FOR SELECT USING (organization_id = auth.uid());
