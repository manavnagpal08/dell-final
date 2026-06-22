from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TelemetryBase(BaseModel):
    temperature: Optional[float] = None
    fan_rpm: Optional[float] = None
    voltage: Optional[float] = None
    power_usage: Optional[float] = None
    smart_5_raw: Optional[float] = None
    smart_187_raw: Optional[float] = None
    smart_188_raw: Optional[float] = None
    smart_194_raw: Optional[float] = None
    smart_197_raw: Optional[float] = None
    smart_198_raw: Optional[float] = None
    smart_199_raw: Optional[float] = None
    smart_health: Optional[float] = None

class TelemetryCreate(TelemetryBase):
    device_id: Optional[UUID] = None
    timestamp: Optional[datetime] = None

class Telemetry(TelemetryBase):
    id: UUID
    device_id: UUID
    timestamp: datetime

    class Config:
        from_attributes = True
