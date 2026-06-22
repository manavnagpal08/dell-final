import pandas as pd
import numpy as np
from app.ml.model_registry import ModelRegistry

class StorageFailureEngine:
    def __init__(self):
        registry = ModelRegistry()
        storage_data = registry.get_storage_model()
        self.model = storage_data["model"]
        self.features = storage_data["features"]
        
    def predict(self, telemetry_data: dict) -> dict:
        if not self.model or not self.features:
            return {
                "model": "storage",
                "failure_probability": 0.0,
                "risk_score": 0,
                "health_score": 100,
                "risk_level": "Healthy",
                "days_remaining": 365
            }
            
        # Create a dataframe from telemetry with expected feature columns, ensuring all are floats
        input_dict = {f: [float(telemetry_data.get(f) or 0.0)] for f in self.features}
        df = pd.DataFrame(input_dict)
        
        # predict_proba returns [[prob_0, prob_1]]
        probas = self.model.predict_proba(df)
        failure_prob = float(probas[0][1])
            
        # Generate scores and metadata based on probability
        risk_score = int(failure_prob * 100)
        health_score = max(0, 100 - risk_score)
        
        if risk_score > 80:
            risk_level = "Critical"
            days_remaining = int(np.interp(risk_score, [80, 100], [14, 7]))
        elif risk_score > 50:
            risk_level = "Warning"
            days_remaining = int(np.interp(risk_score, [50, 80], [30, 15]))
        else:
            risk_level = "Healthy"
            days_remaining = int(np.interp(risk_score, [0, 50], [365, 30]))
            
        return {
            "model": "storage",
            "failure_probability": failure_prob,
            "risk_score": risk_score,
            "health_score": health_score,
            "risk_level": risk_level,
            "days_remaining": days_remaining
        }
