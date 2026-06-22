from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ZabbixConfig(BaseModel):
    url: str
    username: str
    password: str

class ZabbixHost(BaseModel):
    hostid: str
    host: str
    name: str
    status: str
    error: Optional[str] = None
    inventory: Optional[Dict[str, str]] = None

class ZabbixItem(BaseModel):
    itemid: str
    hostid: str
    name: str
    key_: str
    lastvalue: str
    lastclock: str

class ZabbixProblem(BaseModel):
    eventid: str
    objectid: str
    name: str
    severity: str
    acknowledged: str
    clock: str

class IntegrationResponse(BaseModel):
    integration: str
    status: str
    success: bool
    message: str
    records_processed: int
    records_failed: int
    last_sync_at: Optional[str] = None
    error: Optional[str] = None
