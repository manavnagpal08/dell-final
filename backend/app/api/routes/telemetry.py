from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID, uuid4
from datetime import datetime, timezone

from app.schemas.telemetry import Telemetry, TelemetryCreate
from app.database.supabase import get_supabase
from app.ml.unified_risk_engine import UnifiedRiskEngine

router = APIRouter()
unified_engine = UnifiedRiskEngine()

# In-memory store for when Supabase is unavailable
MOCK_TELEMETRY: dict = {}

@router.get("/{device_id}/telemetry", response_model=List[Telemetry])
def get_device_telemetry(device_id: UUID, limit: int = 50):
    supabase = get_supabase()
    if supabase:
        try:
            response = (
                supabase.table("telemetry_records")
                .select("*")
                .eq("device_id", str(device_id))
                .order("timestamp", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [
                    Telemetry(
                        id=r.get("id"),
                        device_id=r.get("device_id"),
                        timestamp=r.get("timestamp"),
                        temperature=r.get("temperature", 0),
                        fan_rpm=r.get("fan_rpm", 0),
                        power_usage=r.get("power_usage", 0),
                    )
                    for r in response.data
                ]
        except Exception as e:
            print(f"Supabase error fetching telemetry: {e}")

    # Return in-memory mock telemetry
    device_records = MOCK_TELEMETRY.get(str(device_id), [])
    return device_records[-limit:]


@router.post("/{device_id}/telemetry", response_model=Telemetry)
def submit_telemetry(device_id: UUID, telemetry_in: TelemetryCreate):
    new_id = uuid4()
    now = datetime.now(timezone.utc)

    # Run ML prediction
    telemetry_data = telemetry_in.model_dump(exclude={"device_id", "timestamp"})
    try:
        prediction = unified_engine.predict(telemetry_data)
        risk_score = prediction.get("overall_risk_score", 0)
        health_score = prediction.get("overall_health_score", 100)
        failure_type = prediction.get("predicted_primary_failure", "Unknown")
        prob = prediction.get("operational_prediction", {}).get("confidence", 0.0)
    except Exception as e:
        print(f"ML engine error: {e}")
        risk_score = 0
        health_score = 100
        failure_type = "Unknown"
        prob = 0.0

    record = Telemetry(
        id=new_id,
        device_id=device_id,
        timestamp=now,
        temperature=telemetry_in.temperature,
        fan_rpm=telemetry_in.fan_rpm,
        power_usage=telemetry_in.power_usage,
        smart_health=telemetry_in.smart_health,
    )

    supabase = get_supabase()
    use_mock = False
    if supabase:
        try:
            record_data = {
                "id": str(new_id),
                "device_id": str(device_id),
                "timestamp": now.isoformat(),
                "temperature": telemetry_in.temperature,
                "fan_rpm": telemetry_in.fan_rpm,
                "voltage": 12.0,
                "power_usage": telemetry_in.power_usage,
                "smart_health": telemetry_in.smart_health,
            }
            supabase.table("telemetry_records").insert(record_data).execute()

            # Update device risk scores
            update_payload = {
                "risk_score": risk_score,
                "health_score": health_score,
                "status": "Online",
                "last_telemetry_timestamp": now.isoformat(),
            }
            supabase.table("devices").update(update_payload).eq("id", str(device_id)).execute()

            # Generate alert if critical
            if risk_score > 80:
                alert_data = {
                    "id": str(uuid4()),
                    "device_id": str(device_id),
                    "severity": "Critical",
                    "failure_probability": prob,
                    "failure_type": failure_type,
                    "recommended_action": f"Immediate inspection required. Risk score: {risk_score:.0f}.",
                    "status": "Active",
                    "time_generated": now.isoformat(),
                }
                supabase.table("alerts").insert(alert_data).execute()

        except Exception as e:
            print(f"Supabase error submitting telemetry: {e}")
            use_mock = True
    else:
        use_mock = True

    if use_mock:
        # Store in memory when Supabase is unavailable
        key = str(device_id)
        if key not in MOCK_TELEMETRY:
            MOCK_TELEMETRY[key] = []
        MOCK_TELEMETRY[key].append(record)
        if len(MOCK_TELEMETRY[key]) > 100:
            MOCK_TELEMETRY[key] = MOCK_TELEMETRY[key][-100:]
            
        # Update device in MOCK_DEVICES
        from app.api.routes.devices import MOCK_DEVICES
        if key in MOCK_DEVICES:
            MOCK_DEVICES[key].risk_score = risk_score
            MOCK_DEVICES[key].health_score = health_score
            MOCK_DEVICES[key].last_seen = now
            
        # Generate alert if critical or occasionally for healthy devices to keep feed active
        if risk_score > 80:
            from app.api.routes.alerts import MOCK_ALERTS
            from app.schemas.alert import Alert
            alert_id = uuid4()
            MOCK_ALERTS[str(alert_id)] = Alert(
                id=alert_id,
                device_id=device_id,
                severity="Critical",
                failure_probability=prob,
                failure_type=failure_type,
                recommended_action=f"Immediate inspection required. Risk score: {risk_score:.0f}.",
                status="Active",
                time_generated=now
            )
        else:
            # For demo purposes, occasionally inject an Info event for healthy devices
            import random
            if random.random() < 0.1:  # 10% chance per telemetry tick
                from app.api.routes.alerts import MOCK_ALERTS
                from app.schemas.alert import Alert
                alert_id = uuid4()
                info_msgs = [
                    "Routine diagnostics completed successfully.",
                    "Thermal levels are optimal.",
                    "Battery health verified.",
                    "System load balanced.",
                    "Network telemetry synced."
                ]
                MOCK_ALERTS[str(alert_id)] = Alert(
                    id=alert_id,
                    device_id=device_id,
                    severity="Info",
                    failure_probability=0.01,
                    failure_type="System Check",
                    recommended_action=random.choice(info_msgs),
                    status="Active",
                    time_generated=now
                )

    return record
