import time
import requests
import random
from datetime import datetime, timezone

API_URL = "http://localhost:8000/api/v1"

DEVICES = [
    {"name": "Cooling Unit F12", "location": "Engineering Block", "type": "HVAC"},
    {"name": "Router R-04", "location": "Library", "type": "Network"},
    {"name": "Server Rack A", "location": "Datacenter 1", "type": "Server"},
    {"name": "Power Supply P1", "location": "BTech Building", "type": "Power"},
    {"name": "Backup Generator", "location": "Hostel Area", "type": "Power"}
]

registered_devices = []

def register_devices():
    print("Registering simulated devices...")
    for dev in DEVICES:
        res = requests.post(f"{API_URL}/devices", json={
            "device_name": dev["name"],
            "location": dev["location"],
            "device_type": dev["type"],
            "vendor": "Simulated Corp"
        })
        if res.status_code == 200:
            registered_devices.append(res.json()['device_id'])
            print(f"Registered {dev['name']} -> ID: {res.json()['device_id']}")
        else:
            print(f"Failed to register {dev['name']}: {res.text}")

def simulate():
    print("Starting simulated telemetry stream...")
    tick = 0
    while True:
        tick += 1
        for i, d_id in enumerate(registered_devices):
            # Base values
            temp = random.uniform(40.0, 50.0)
            rpm = random.uniform(2500, 3000)
            power = random.uniform(150, 200)
            
            # Inject an anomaly for the first device every 10 ticks
            if i == 0 and tick % 10 == 0:
                temp = random.uniform(85.0, 95.0) # Critical temp
                rpm = random.uniform(500, 1000) # Fan failure
                print(f"!!! INJECTING ANOMALY FOR DEVICE 0 ({d_id}) !!!")
                
            payload = {
                "device_id": str(d_id),
                "temperature": temp,
                "fan_rpm": rpm,
                "power_usage": power
            }
            
            try:
                requests.post(f"{API_URL}/telemetry/{d_id}/telemetry", json=payload)
            except Exception as e:
                print(f"Failed to send telemetry for {d_id}: {e}")
                
        print(f"Tick {tick}: Sent telemetry for {len(registered_devices)} devices")
        time.sleep(5)

if __name__ == "__main__":
    # Wait for API
    time.sleep(2)
    register_devices()
    if registered_devices:
        simulate()
    else:
        print("No devices registered. Exiting.")
