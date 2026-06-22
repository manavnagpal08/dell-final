from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class AnomalyBase(BaseModel):
    anomaly_score: float
    confidence: float
    reason: str

class AnomalyCreate(AnomalyBase):
    device_id: UUID

class Anomaly(AnomalyBase):
    id: UUID
    device_id: UUID
    detected_at: datetime

    class Config:
        from_attributes = True
