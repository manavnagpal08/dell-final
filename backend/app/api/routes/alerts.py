from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID
import uuid
from datetime import datetime, timezone

from app.schemas.alert import Alert, AlertCreate, AlertUpdate
from app.database.supabase import get_supabase

import app.services.data_generator as generator

router = APIRouter()

MOCK_ALERTS: dict = {}

@router.get("/", response_model=List[Alert])
def get_alerts():
    supabase = get_supabase()
    if supabase:
        try:
            # Try joining with devices; if it fails fall back to simple query
            try:
                response = (
                    supabase.table("alerts")
                    .select("*, devices(vendor)")
                    .order("time_generated", desc=True)
                    .limit(50)
                    .execute()
                )
            except Exception:
                response = (
                    supabase.table("alerts")
                    .select("*")
                    .order("time_generated", desc=True)
                    .limit(50)
                    .execute()
                )

            if response.data:
                filtered_alerts = []
                for a in response.data:
                    vendor = (a.get("devices") or {}).get("vendor", "Unknown")

                    if generator.DATA_MODE == "simulated" and vendor not in ("Simulated Corp", "Unknown"):
                        continue
                    if generator.DATA_MODE == "local" and vendor != "Local PC":
                        continue
                    if generator.DATA_MODE == "live" and vendor in ("Simulated Corp", "Local PC"):
                        continue

                    filtered_alerts.append(
                        Alert(
                            id=a.get("id"),
                            device_id=a.get("device_id"),
                            severity=a.get("severity", "Warning"),
                            failure_probability=a.get("failure_probability", 0.0),
                            failure_type=a.get("failure_type", "Unknown"),
                            time_generated=a.get("time_generated"),
                            recommended_action=a.get("recommended_action", ""),
                            status=a.get("status", "Active"),
                        )
                    )
                return filtered_alerts
        except Exception as e:
            print(f"Supabase error fetching alerts: {e}")

    from app.api.routes.devices import MOCK_DEVICES as DEVICE_MOCK
    filtered_mocks = []
    for a in MOCK_ALERTS.values():
        device = DEVICE_MOCK.get(str(a.device_id))
        vendor = device.vendor if device else "Unknown"
        if generator.DATA_MODE == "simulated" and vendor not in ("Simulated Corp", "Unknown"):
            continue
        if generator.DATA_MODE == "local" and vendor != "Local PC":
            continue
        if generator.DATA_MODE == "live" and vendor in ("Simulated Corp", "Local PC"):
            continue
        filtered_mocks.append(a)
    return filtered_mocks


@router.post("/", response_model=Alert)
def create_alert(alert_in: AlertCreate):
    new_alert = Alert(
        id=uuid.uuid4(),
        time_generated=datetime.now(timezone.utc),
        **alert_in.model_dump(),
    )
    MOCK_ALERTS[str(new_alert.id)] = new_alert
    return new_alert


@router.patch("/{alert_id}/acknowledge", response_model=Optional[Alert])
def acknowledge_alert(alert_id: UUID):
    supabase = get_supabase()
    if supabase:
        try:
            supabase.table("alerts").update({"status": "Acknowledged"}).eq("id", str(alert_id)).execute()
        except Exception as e:
            print(f"Supabase error acknowledging alert: {e}")

    key = str(alert_id)
    if key in MOCK_ALERTS:
        MOCK_ALERTS[key].status = "Acknowledged"
        return MOCK_ALERTS[key]
    return None


@router.patch("/{alert_id}/resolve", response_model=Optional[Alert])
def resolve_alert(alert_id: UUID):
    supabase = get_supabase()
    if supabase:
        try:
            supabase.table("alerts").update({"status": "Resolved"}).eq("id", str(alert_id)).execute()
        except Exception as e:
            print(f"Supabase error resolving alert: {e}")

    key = str(alert_id)
    if key in MOCK_ALERTS:
        MOCK_ALERTS[key].status = "Resolved"
        return MOCK_ALERTS[key]
    return None


# Keep backward-compat PUT route that the old frontend called
@router.put("/{alert_id}/status", response_model=Optional[Alert])
def update_alert_status(alert_id: UUID, body: AlertUpdate):
    supabase = get_supabase()
    if supabase:
        try:
            supabase.table("alerts").update({"status": body.status}).eq("id", str(alert_id)).execute()
        except Exception as e:
            print(f"Supabase error updating alert status: {e}")

    key = str(alert_id)
    if key in MOCK_ALERTS:
        MOCK_ALERTS[key].status = body.status
        return MOCK_ALERTS[key]
    return None
