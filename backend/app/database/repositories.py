from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime, timezone
import uuid

from supabase import Client
from .supabase import get_supabase
from app.schemas.device import Device, DeviceCreate, DeviceUpdate
from app.schemas.telemetry import Telemetry, TelemetryCreate
from app.schemas.prediction import Prediction, PredictionCreate, ExplanationFactor
from app.schemas.alert import Alert, AlertCreate, AlertUpdate
from app.schemas.recommendation import Recommendation, RecommendationCreate
from app.schemas.anomaly import Anomaly, AnomalyCreate

MOCK_DB = {
    "devices": [],
    "telemetry_records": [],
    "predictions": [],
    "alerts": [],
    "recommendations": [],
    "anomalies": [],
    "explanation_factors": []
}

class BaseRepository:
    def __init__(self):
        self.supabase: Client | None = get_supabase()

class DeviceRepository(BaseRepository):
    def get_all(self) -> List[Device]:
        if not self.supabase:
            return [Device(**data) for data in MOCK_DB["devices"]]
        res = self.supabase.table("devices").select("*").execute()
        return [Device(**data) for data in res.data]

    def get_by_id(self, device_id: UUID) -> Optional[Device]:
        if not self.supabase:
            for d in MOCK_DB["devices"]:
                if str(d.get("device_id")) == str(device_id):
                    return Device(**d)
            return None
        res = self.supabase.table("devices").select("*").eq("device_id", str(device_id)).execute()
        if not res.data:
            return None
        return Device(**res.data[0])

    def create(self, device: DeviceCreate) -> Device:
        data = device.model_dump()
        data["device_id"] = str(data.get("device_id")) if data.get("device_id") else str(uuid.uuid4())
        
        if not self.supabase:
            data["created_at"] = datetime.now(timezone.utc).isoformat()
            data["updated_at"] = data["created_at"]
            MOCK_DB["devices"].append(data)
            return Device(**data)
            
        res = self.supabase.table("devices").insert(data).execute()
        return Device(**res.data[0])

    def update(self, device_id: UUID, device: DeviceUpdate) -> Optional[Device]:
        data = device.model_dump(exclude_unset=True)
        data["updated_at"] = datetime.now(timezone.utc).isoformat()
        if not self.supabase:
            for d in MOCK_DB["devices"]:
                if str(d.get("device_id")) == str(device_id):
                    d.update(data)
                    return Device(**d)
            return None
        res = self.supabase.table("devices").update(data).eq("device_id", str(device_id)).execute()
        if not res.data:
            return None
        return Device(**res.data[0])

class TelemetryRepository(BaseRepository):
    def get_by_device(self, device_id: UUID, limit: int = 100) -> List[Telemetry]:
        if not self.supabase:
            records = [r for r in MOCK_DB["telemetry_records"] if str(r.get("device_id")) == str(device_id)]
            records.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            return [Telemetry(**data) for data in records[:limit]]
        res = self.supabase.table("telemetry_records").select("*").eq("device_id", str(device_id)).order("timestamp", desc=True).limit(limit).execute()
        return [Telemetry(**data) for data in res.data]

    def create(self, telemetry: TelemetryCreate) -> Telemetry:
        data = telemetry.model_dump()
        data["device_id"] = str(data["device_id"])
        if not self.supabase:
            data["id"] = str(uuid.uuid4())
            data["timestamp"] = data.get("timestamp") or datetime.now(timezone.utc).isoformat()
            MOCK_DB["telemetry_records"].append(data)
            return Telemetry(**data)
        res = self.supabase.table("telemetry_records").insert(data).execute()
        return Telemetry(**res.data[0])

class PredictionRepository(BaseRepository):
    def create(self, prediction: PredictionCreate, explanations: List[Dict[str, Any]]) -> Prediction:
        data = prediction.model_dump()
        data["device_id"] = str(data["device_id"])
        
        if not self.supabase:
            data["id"] = str(uuid.uuid4())
            data["prediction_time"] = datetime.now(timezone.utc).isoformat()
            MOCK_DB["predictions"].append(data)
            pred_obj = Prediction(**data)
            
            if explanations:
                for expl in explanations:
                    MOCK_DB["explanation_factors"].append({
                        "id": str(uuid.uuid4()),
                        "prediction_id": str(pred_obj.prediction_id), # wait, pred_obj.prediction_id or pred_obj.id?
                        "feature_name": expl.get("feature_name"),
                        "shap_value": expl.get("shap_value"),
                        "impact": expl.get("impact"),
                        "human_explanation": expl.get("human_explanation")
                    })
            return pred_obj
            
        res = self.supabase.table("predictions").insert(data).execute()
        pred_obj = Prediction(**res.data[0])
        
        # Insert explanations
        if explanations:
            expl_data = []
            for expl in explanations:
                expl_data.append({
                    "prediction_id": str(pred_obj.prediction_id) if hasattr(pred_obj, 'prediction_id') and getattr(pred_obj, 'prediction_id') else str(pred_obj.id),
                    "feature_name": expl.get("feature_name"),
                    "shap_value": expl.get("shap_value"),
                    "impact": expl.get("impact"),
                    "human_explanation": expl.get("human_explanation")
                })
            self.supabase.table("explanation_factors").insert(expl_data).execute()
            
        return pred_obj

class AlertRepository(BaseRepository):
    def get_all(self) -> List[Alert]:
        if not self.supabase:
            return [Alert(**data) for data in MOCK_DB["alerts"]]
        res = self.supabase.table("alerts").select("*").execute()
        return [Alert(**data) for data in res.data]

    def create(self, alert: AlertCreate) -> Alert:
        data = alert.model_dump()
        data["device_id"] = str(data["device_id"])
        if not self.supabase:
            data["id"] = str(uuid.uuid4())
            data["created_at"] = datetime.now(timezone.utc).isoformat()
            data["status"] = data.get("status") or "Open"
            MOCK_DB["alerts"].append(data)
            return Alert(**data)
        res = self.supabase.table("alerts").insert(data).execute()
        return Alert(**res.data[0])

    def update_status(self, alert_id: UUID, status: str) -> Optional[Alert]:
        update_data = {"status": status}
        if status == "Resolved":
            update_data["resolved_at"] = datetime.now(timezone.utc).isoformat()
            
        if not self.supabase:
            for a in MOCK_DB["alerts"]:
                if str(a.get("id")) == str(alert_id):
                    a.update(update_data)
                    return Alert(**a)
            return None
            
        res = self.supabase.table("alerts").update(update_data).eq("id", str(alert_id)).execute()
        if not res.data:
            return None
        return Alert(**res.data[0])

class RecommendationRepository(BaseRepository):
    def create(self, rec: RecommendationCreate) -> Recommendation:
        data = rec.model_dump()
        data["device_id"] = str(data["device_id"])
        if not self.supabase:
            data["id"] = str(uuid.uuid4())
            data["created_at"] = datetime.now(timezone.utc).isoformat()
            MOCK_DB["recommendations"].append(data)
            return Recommendation(**data)
        res = self.supabase.table("recommendations").insert(data).execute()
        return Recommendation(**res.data[0])
        
class AnomalyRepository(BaseRepository):
    def create(self, anomaly: AnomalyCreate) -> Anomaly:
        data = anomaly.model_dump()
        data["device_id"] = str(data["device_id"])
        if not self.supabase:
            data["id"] = str(uuid.uuid4())
            data["detected_at"] = datetime.now(timezone.utc).isoformat()
            MOCK_DB["anomalies"].append(data)
            return Anomaly(**data)
        res = self.supabase.table("anomalies").insert(data).execute()
        return Anomaly(**res.data[0])

