import asyncio
import httpx
import random
import platform
import psutil
from datetime import datetime
from app.core.logging import logger

# Global state for the generator
DATA_MODE = "simulated"  # 'simulated', 'local', or 'live'
IS_RUNNING = True

API_URL = "http://localhost:9000/api/v1"

DEVICES = [
    {"name": "Cooling Unit F12", "location": "Engineering Block", "type": "HVAC"},
    {"name": "Router R-04", "location": "Library", "type": "Network"},
    {"name": "Server Rack A", "location": "Datacenter 1", "type": "Server"},
    {"name": "Power Supply P1", "location": "BTech Building", "type": "Power"},
    {"name": "Backup Generator", "location": "Hostel Area", "type": "Power"},
    {"name": "Storage Array Alpha", "location": "Datacenter 2", "type": "Storage"},
    {"name": "Core Switch 1", "location": "MDF Room", "type": "Network"},
    {"name": "Compute Node 01", "location": "Rack 4", "type": "Server"},
    {"name": "Compute Node 02", "location": "Rack 4", "type": "Server"},
    {"name": "UPS System Beta", "location": "Power Room", "type": "Power"},
    {"name": "Cooling Unit F13", "location": "Engineering Block", "type": "HVAC"},
    {"name": "AI Inference Node", "location": "Datacenter 1", "type": "Server"}
]

registered_sim_devices = []
local_pc_id = None

async def register_devices():
    global registered_sim_devices, local_pc_id
    async with httpx.AsyncClient(follow_redirects=True) as client:
        # Register Sim Devices
        logger.info("Registering simulated devices...")
        for dev in DEVICES:
            try:
                res = await client.post(f"{API_URL}/devices/", json={
                    "device_name": dev["name"],
                    "location": dev["location"],
                    "device_type": dev["type"],
                    "vendor": "Simulated Corp"
                })
                if res.status_code == 200:
                    registered_sim_devices.append(res.json()['device_id'])
            except Exception as e:
                logger.error(f"Failed to register sim device: {e}")
        
        # Register Local PC
        pc_name = platform.node()
        try:
            res = await client.post(f"{API_URL}/devices/", json={
                "device_name": f"{pc_name}",
                "location": "Presenter Desk",
                "device_type": "Laptop Workstation",
                "vendor": "Local PC"
            })
            if res.status_code == 200:
                local_pc_id = res.json()['device_id']
        except Exception as e:
            logger.error(f"Failed to register local pc: {e}")

async def run_data_generator():
    await asyncio.sleep(5) # Wait for server to fully start
    await register_devices()
    
    tick = 0
    async with httpx.AsyncClient(follow_redirects=True) as client:
        while IS_RUNNING:
            tick += 1
            
            if DATA_MODE == "simulated":
                for i, d_id in enumerate(registered_sim_devices):
                    temp = random.uniform(40.0, 50.0)
                    rpm = random.uniform(2500, 3000)
                    power = random.uniform(150, 200)
                    
                    if i == 0 and tick % 10 == 0:
                        temp = random.uniform(85.0, 95.0) # Critical temp
                        rpm = random.uniform(500, 1000) # Fan failure
                        
                    payload = {"device_id": str(d_id), "temperature": temp, "fan_rpm": rpm, "power_usage": power}
                    try:
                        await client.post(f"{API_URL}/devices/{d_id}/telemetry", json=payload)
                    except Exception:
                        pass
            
            elif DATA_MODE == "local":
                if local_pc_id:
                    cpu_load = psutil.cpu_percent(interval=None)
                    fan_rpm = 1500 + (cpu_load * 30)
                    temp = 40.0 + (cpu_load * 0.4)
                    ram = psutil.virtual_memory().percent
                    
                    try:
                        batt = psutil.sensors_battery()
                        batt_pct = batt.percent if batt else 100
                    except:
                        batt_pct = 100
                    
                    payload = {
                        "device_id": str(local_pc_id),
                        "temperature": temp,
                        "fan_rpm": fan_rpm,
                        "power_usage": ram * 2.5,
                        "smart_health": batt_pct
                    }
                    try:
                        await client.post(f"{API_URL}/devices/{local_pc_id}/telemetry", json=payload)
                    except Exception:
                        pass
            
            # If "live", do nothing (wait for external webhooks)
            await asyncio.sleep(5)

def set_data_mode(mode: str):
    global DATA_MODE
    if mode in ['simulated', 'local', 'live']:
        DATA_MODE = mode
        logger.info(f"Data mode switched to: {mode}")
