from pydantic import BaseModel
from typing import List, Optional

class SnmpConfig(BaseModel):
    targets: str
    community: str
    version: str = "2c"
    timeout: int = 3
    retries: int = 2
