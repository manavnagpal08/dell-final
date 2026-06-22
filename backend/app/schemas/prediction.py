from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class PredictionBase(BaseModel):
    failure_probability: float
    risk_score: float
    health_score: float
    failure_type: str
    days_remaining: int
    confidence: float
    model_version: str

class PredictionCreate(PredictionBase):
    device_id: UUID

class Prediction(PredictionBase):
    prediction_id: UUID
    device_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ExplanationFactor(BaseModel):
    feature_name: str
    shap_value: float
    impact: str
    human_explanation: str

class PredictionResponse(Prediction):
    explanations: Optional[List[ExplanationFactor]] = []
