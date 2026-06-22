from fastapi import APIRouter

from .system import router as system_router
from .devices import router as devices_router
from .telemetry import router as telemetry_router
from .predictions import router as predictions_router
from .alerts import router as alerts_router
from .recommendations import router as recommendations_router
from .anomalies import router as anomalies_router
from .copilot import router as copilot_router
from .integrations import router as integrations_router

api_router = APIRouter()

api_router.include_router(system_router, tags=["system"])
api_router.include_router(devices_router, prefix="/devices", tags=["devices"])
api_router.include_router(telemetry_router, prefix="/devices", tags=["telemetry"])
api_router.include_router(predictions_router, prefix="/predictions", tags=["predictions"])
api_router.include_router(alerts_router, prefix="/alerts", tags=["alerts"])
api_router.include_router(recommendations_router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(anomalies_router, prefix="/anomalies", tags=["anomalies"])
api_router.include_router(copilot_router, prefix="/copilot", tags=["copilot"])
api_router.include_router(integrations_router, prefix="/integrations", tags=["integrations"])

from .analytics import router as analytics_router
api_router.include_router(analytics_router, tags=["analytics"])
