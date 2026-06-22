from fastapi import APIRouter
from typing import List, Dict, Any
from uuid import UUID
import uuid
import random
from datetime import datetime, timezone

from app.schemas.anomaly import Anomaly

router = APIRouter()

MOCK_ANOMALIES = []

@router.get("/", response_model=List[Anomaly])
def get_anomalies():
    return MOCK_ANOMALIES

@router.post("/run", response_model=Dict[str, Any])
def run_anomaly_detection(telemetry_data: Dict[str, Any]):
    # Mocking Isolation Forest anomaly detection
    score = random.uniform(0, 1)
    is_anomaly = score > 0.8
    
    if is_anomaly:
        return {
            "anomaly_score": score,
            "confidence": random.uniform(0.7, 0.95),
            "reason": "Unusual pattern in temperature vs. fan speed correlation detected."
        }
    return {
        "anomaly_score": score,
        "confidence": 0.99,
        "reason": "Normal operation"
    }
