from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class DeviceBase(BaseModel):
    device_name: str
    vendor: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    device_type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "Active"

class DeviceCreate(DeviceBase):
    organization_id: Optional[UUID] = None

class DeviceUpdate(DeviceBase):
    device_name: Optional[str] = None

class Device(DeviceBase):
    device_id: UUID
    organization_id: Optional[UUID] = None
    health_score: Optional[float] = None
    risk_score: Optional[float] = None
    last_seen: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
