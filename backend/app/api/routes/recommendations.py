from fastapi import APIRouter
from typing import List, Dict, Any
from uuid import UUID
import uuid
from datetime import datetime, timezone

from app.schemas.recommendation import Recommendation, RecommendationCreate
from app.services.MaintenanceAdvisor import MaintenanceAdvisor

router = APIRouter()
advisor = MaintenanceAdvisor()

MOCK_RECS = {}

@router.get("/", response_model=List[Recommendation])
def get_recommendations():
    return list(MOCK_RECS.values())

@router.get("/{device_id}", response_model=List[Recommendation])
def get_device_recommendations(device_id: UUID):
    return [r for r in MOCK_RECS.values() if r.device_id == device_id]

@router.post("/generate", response_model=Recommendation)
def generate_recommendation(device_id: UUID, failure_type: str, prediction_data: Dict[str, Any]):
    rec_data = advisor.generate_recommendation(failure_type, prediction_data)
    
    new_rec = Recommendation(
        id=uuid.uuid4(),
        device_id=device_id,
        created_at=datetime.now(timezone.utc),
        **rec_data
    )
    MOCK_RECS[new_rec.id] = new_rec
    return new_rec
