from pydantic import BaseModel
from typing import Optional

class RedfishConfig(BaseModel):
    url: str
    username: str
    password: str
    verify_ssl: bool = False
