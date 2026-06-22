#!/bin/bash

# ==============================================================================
# VyomAi Enterprise Integration - cURL Example
# Use this script to integrate external systems, legacy apps, or custom IoT 
# devices with VyomAi. The FastAPI backend will accept this data,
# save it to Supabase, and run real-time ML anomaly detection.
# ==============================================================================

# Your deployed backend URL (or localhost if running locally)
API_URL="http://localhost:8000/api/v1"

# The unique ID of your device (e.g., from your previous app)
DEVICE_ID="legacy-app-server-01"

echo "🚀 Integrating with VyomAi Backend..."
echo "----------------------------------------"

# 1. Register the device (if it doesn't exist)
echo "1️⃣ Registering Device ($DEVICE_ID)..."
curl -X 'POST' \
  "$API_URL/devices/" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "device_id": "'"$DEVICE_ID"'",
  "device_name": "Legacy Backend Server",
  "vendor": "Custom Integration",
  "model": "v2.0",
  "device_type": "Server",
  "status": "Active"
}'

echo -e "\n"
sleep 1

# 2. Send Actual Telemetry Data for ML Analysis
# This data will be processed by the Isolation Forest and XGBoost models
echo "2️⃣ Sending Live Telemetry Data..."
curl -X 'POST' \
  "$API_URL/devices/$DEVICE_ID/telemetry" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "device_id": "'"$DEVICE_ID"'",
  "timestamp": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'",
  "temperature": 78.5,
  "fan_rpm": 4200,
  "voltage": 11.8,
  "power_usage": 340.5,
  "smart_5_raw": 12.0,
  "smart_187_raw": 0.0,
  "smart_197_raw": 2.0
}'

echo -e "\n"
echo "✅ Data successfully sent to VyomAi!"
echo "You can now view this device and its AI risk predictions in the beautiful Next.js Dashboard."
