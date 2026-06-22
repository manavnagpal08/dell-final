from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID

class AlertBase(BaseModel):
    device_id: UUID
    severity: str = "Warning"
    failure_probability: float = 0.0
    failure_type: str = "Unknown"
    recommended_action: str = ""
    status: str = "Active"

class AlertCreate(AlertBase):
    time_generated: Optional[datetime] = None

class Alert(AlertBase):
    id: UUID
    time_generated: datetime

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: str
