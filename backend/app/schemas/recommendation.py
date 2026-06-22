from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class RecommendationBase(BaseModel):
    action: str
    priority: str
    estimated_cost: float
    downtime_saved: float
    maintenance_window: str
    business_impact: str

class RecommendationCreate(RecommendationBase):
    device_id: UUID

class Recommendation(RecommendationBase):
    id: UUID
    device_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
