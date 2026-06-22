from app.ml.storage_engine import StorageFailureEngine
from app.ml.operational_engine import OperationalFailureEngine

class UnifiedRiskEngine:
    def __init__(self):
        self.storage_engine = StorageFailureEngine()
        self.operational_engine = OperationalFailureEngine()
        
    def predict(self, telemetry_data: dict) -> dict:
        storage_pred = self.storage_engine.predict(telemetry_data)
        operational_pred = self.operational_engine.predict(telemetry_data)
        
        overall_risk = max(storage_pred["risk_score"], operational_pred["risk_score"])
        overall_health = min(storage_pred["health_score"], operational_pred["health_score"])
        
        if operational_pred["failure_type"] != "Healthy":
            primary_failure = operational_pred["failure_type"]
        elif storage_pred["risk_score"] > 50:
            primary_failure = "Storage Failure"
        else:
            primary_failure = "Healthy"
            
        days_rem = min(storage_pred["days_remaining"], operational_pred["days_remaining"])
        
        if overall_risk > 80:
            priority = "Critical"
        elif overall_risk > 50:
            priority = "Warning"
        else:
            priority = "Healthy"
        
        return {
            "overall_risk_score": overall_risk,
            "overall_health_score": overall_health,
            "predicted_primary_failure": primary_failure,
            "priority": priority,
            "days_remaining": days_rem,
            "storage_prediction": storage_pred,
            "operational_prediction": operational_pred
        }
