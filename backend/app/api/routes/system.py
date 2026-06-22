from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

from pydantic import BaseModel
from app.services.data_generator import set_data_mode

class ModeUpdate(BaseModel):
    mode: str

@router.get("/health")
def get_health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

@router.post("/mode")
def update_mode(data: ModeUpdate):
    set_data_mode(data.mode)
    return {"status": "success", "mode": data.mode}

@router.get("/version")
def get_version():
    return {"name": settings.PROJECT_NAME, "version": settings.VERSION}
