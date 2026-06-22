from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from uuid import UUID

from app.services.ExplainabilityEngine import ExplainabilityEngine
from app.schemas.prediction import ExplanationFactor

router = APIRouter()
explain_engine = ExplainabilityEngine()

@router.post("/", response_model=Dict[str, Any])
def explain_prediction(telemetry_data: Dict[str, Any]):
    shap_values = explain_engine.generate_shap_values(telemetry_data)
    top_factors = explain_engine.extract_top_factors(shap_values)
    summary = explain_engine.generate_plain_language_summary(top_factors)
    
    return {
        "top_factors": top_factors,
        "confidence": 0.88,
        "human_explanation": summary
    }

@router.get("/{prediction_id}", response_model=Dict[str, Any])
def get_explanation(prediction_id: UUID):
    # Mock retrieval
    return {
        "prediction_id": str(prediction_id),
        "human_explanation": "The model indicates a high risk due to elevated temperatures over the past 24 hours.",
        "top_factors": [
            {"feature_name": "Temperature", "impact": "Negative", "shap_value": 0.45}
        ]
    }
