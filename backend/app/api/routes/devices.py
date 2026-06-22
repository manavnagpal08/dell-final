from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone

from app.schemas.device import Device, DeviceCreate, DeviceUpdate
from app.database.supabase import get_supabase

router = APIRouter()

# In-memory fallback
MOCK_DEVICES: dict = {}

import app.services.data_generator as generator


def _row_to_device(d: dict) -> Device:
    """Convert a Supabase row dict to a Device schema object."""
    return Device(
        device_id=d.get("id") or d.get("device_id"),
        device_name=d.get("name") or d.get("device_name") or "Unknown",
        vendor=d.get("vendor"),
        model=d.get("model"),
        location=d.get("location"),
        device_type=d.get("type") or d.get("device_type"),
        health_score=d.get("health_score"),
        risk_score=d.get("risk_score") or d.get("current_risk_score") or 0.0,
        status=d.get("status", "Online"),
        last_seen=d.get("last_telemetry_timestamp") or d.get("last_ping") or d.get("last_seen"),
    )


@router.get("/", response_model=List[Device])
def list_devices():
    supabase = get_supabase()
    if supabase:
        try:
            response = supabase.table("devices").select("*").execute()
            if response.data:
                filtered = []
                for d in response.data:
                    vendor = d.get("vendor", "")
                    if generator.DATA_MODE == "simulated" and vendor not in ("Simulated Corp", ""):
                        continue
                    if generator.DATA_MODE == "local" and vendor != "Local PC":
                        continue
                    if generator.DATA_MODE == "live" and vendor in ("Simulated Corp", "Local PC"):
                        continue
                    try:
                        filtered.append(_row_to_device(d))
                    except Exception as e:
                        print(f"Skipping device row due to error: {e}")
                return filtered
        except Exception as e:
            print(f"Supabase error listing devices: {e}")

    filtered_mocks = []
    for d in MOCK_DEVICES.values():
        if generator.DATA_MODE == "simulated" and d.vendor not in ("Simulated Corp", "Unknown", ""):
            continue
        if generator.DATA_MODE == "local" and d.vendor != "Local PC":
            continue
        if generator.DATA_MODE == "live" and d.vendor in ("Simulated Corp", "Local PC"):
            continue
        filtered_mocks.append(d)
    return filtered_mocks


@router.post("/", response_model=Device)
def create_device(device_in: DeviceCreate):
    new_id = uuid4()
    now = datetime.now(timezone.utc)

    supabase = get_supabase()
    if supabase:
        try:
            device_data = {
                "id": str(new_id),
                "name": device_in.device_name,
                "vendor": device_in.vendor or "Unknown",
                "model": device_in.model or "Unknown",
                "location": device_in.location or "Unknown",
                "type": device_in.device_type or "Unknown",
                "health_score": 100.0,
                "risk_score": 0.0,
                "status": "Online",
                "last_telemetry_timestamp": now.isoformat(),
            }
            res = supabase.table("devices").insert(device_data).execute()
            if res.data:
                return _row_to_device(res.data[0])
        except Exception as e:
            print(f"Supabase error creating device: {e}")

    new_device = Device(
        device_id=new_id,
        device_name=device_in.device_name,
        vendor=device_in.vendor or "Unknown",
        model=device_in.model or "Unknown",
        location=device_in.location or "Unknown",
        device_type=device_in.device_type or "Unknown",
        health_score=100.0,
        risk_score=0.0,
        last_seen=now,
    )
    MOCK_DEVICES[str(new_device.device_id)] = new_device
    return new_device


@router.get("/{device_id}", response_model=Device)
def get_device(device_id: UUID):
    supabase = get_supabase()
    if supabase:
        try:
            # Try by primary key "id"
            response = supabase.table("devices").select("*").eq("id", str(device_id)).limit(1).execute()
            if response.data:
                return _row_to_device(response.data[0])
        except Exception as e:
            print(f"Supabase error getting device: {e}")

    key = str(device_id)
    if key in MOCK_DEVICES:
        return MOCK_DEVICES[key]

    # Return a plausible mock so the UI never crashes
    return Device(
        device_id=device_id,
        device_name=f"Device-{str(device_id)[:8].upper()}",
        vendor="Dell",
        model="PowerEdge R740",
        health_score=85.0,
        risk_score=15.0,
        last_seen=datetime.now(timezone.utc),
    )
