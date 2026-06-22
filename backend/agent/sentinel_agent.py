import time
import requests
import psutil
import socket
import uuid
import json
import os
from datetime import datetime, timezone

# For a real enterprise scenario, the DEVICE_ID would be provisioned during installation
# and stored in a secure local configuration file or registry.
CONFIG_FILE = "agent_config.json"
API_URL = os.getenv("SENTINEL_API_URL", "http://localhost:8000/api/v1")

def get_or_create_device_id():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            config = json.load(f)
            return config.get('device_id')
    else:
        new_id = str(uuid.uuid4())
        with open(CONFIG_FILE, 'w') as f:
            json.dump({'device_id': new_id}, f)
        return new_id

DEVICE_ID = get_or_create_device_id()

def register_device():
    # Attempt to register device on startup
    payload = {
        "device_id": DEVICE_ID,
        "device_name": socket.gethostname(),
        "vendor": "Generic", # Would use wmi in full windows impl
        "model": "Windows Host",
        "device_type": "Server",
        "status": "Active"
    }
    try:
        res = requests.post(f"{API_URL}/devices/", json=payload, timeout=5)
        if res.status_code in [200, 201]:
            print(f"Device registered/verified: {DEVICE_ID}")
        else:
            print(f"Failed to register. Server responded: {res.text}")
    except requests.exceptions.RequestException as e:
        print(f"Registration error (Server might be down): {e}")

def collect_telemetry():
    # Collect real system metrics
    cpu_temp = 45.0 # psutil.sensors_temperatures() not always available on Windows
    
    # Mock some values that require elevated WMI/SMART access for safety in hackathon
    telemetry = {
        "device_id": DEVICE_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature": 40.0 + (psutil.cpu_percent() / 2), # Simulated temp based on CPU load
        "fan_rpm": 2500 if psutil.cpu_percent() < 50 else 4500,
        "voltage": 12.0,
        "power_usage": 100.0 + psutil.cpu_percent(),
        "smart_5_raw": 0.0,
        "smart_187_raw": 0.0,
        "smart_197_raw": 0.0
    }
    return telemetry

def send_telemetry(telemetry):
    try:
        res = requests.post(f"{API_URL}/devices/{DEVICE_ID}/telemetry", json=telemetry, timeout=5)
        if res.status_code == 200:
            print(f"[{datetime.now().isoformat()}] Telemetry sent successfully.")
        else:
            print(f"Failed to send telemetry. Status: {res.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    print(f"Starting VyomAi Agent for Device ID: {DEVICE_ID}")
    register_device()
    
    while True:
        data = collect_telemetry()
        send_telemetry(data)
        time.sleep(30) # Configurable interval
