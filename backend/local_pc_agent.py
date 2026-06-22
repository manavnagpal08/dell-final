import time
import requests
import platform
import psutil

API_URL = "http://localhost:9000/api/v1"

def get_system_metrics():
    # Simulate Fan RPM based on CPU load (since psutil sensors_fans is often unavailable on Windows/Mac)
    cpu_load = psutil.cpu_percent(interval=1)
    base_fan = 1500
    fan_rpm = base_fan + (cpu_load * 30)

    # Simulate Temp based on CPU load
    temp = 40.0 + (cpu_load * 0.4)
    
    # Try to get actual temp if available (Linux usually)
    try:
        temps = psutil.sensors_temperatures()
        if temps and 'coretemp' in temps:
            temp = temps['coretemp'][0].current
    except Exception:
        pass
        
    ram = psutil.virtual_memory().percent
    
    return {
        "temperature": temp,
        "fan_rpm": fan_rpm,
        "power_usage": ram * 2.5 # Fake power correlation
    }

def register_local_pc():
    pc_name = platform.node()
    print(f"Registering Local PC: {pc_name}...")
    res = requests.post(f"{API_URL}/devices", json={
        "device_name": f"{pc_name} (Local Demo)",
        "location": "Presenter Desk",
        "device_type": "Laptop Workstation",
        "vendor": platform.system()
    })
    
    if res.status_code == 200:
        d_id = res.json()['device_id']
        print(f"Successfully registered Local PC -> ID: {d_id}")
        return d_id
    else:
        print(f"Failed to register PC: {res.text}")
        return None

def run_agent(device_id):
    print("Starting Live Telemetry Stream from Local PC...")
    tick = 0
    while True:
        tick += 1
        metrics = get_system_metrics()
        
        try:
            requests.post(f"{API_URL}/telemetry/{device_id}/telemetry", json=metrics)
            print(f"Tick {tick}: Sent metrics CPU:{metrics['power_usage']/2.5:.1f}% Temp:{metrics['temperature']:.1f}C")
        except Exception as e:
            print(f"Failed to send telemetry: {e}")
            
        time.sleep(3)

if __name__ == "__main__":
    time.sleep(2)
    device_id = register_local_pc()
    if device_id:
        run_agent(device_id)
