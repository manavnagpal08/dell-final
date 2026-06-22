from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import traceback

from app.ml.storage_engine import StorageFailureEngine
from app.ml.operational_engine import OperationalFailureEngine
from app.ml.unified_risk_engine import UnifiedRiskEngine
from app.ai.gemini_explainer import GeminiExplainer
from app.database.supabase import get_supabase

supabase = get_supabase()

router = APIRouter()

unified_engine = UnifiedRiskEngine()
gemini_explainer = GeminiExplainer()

def store_prediction(prediction_data: dict):
    if not supabase:
        print("Supabase client not initialized, skipping DB insert.")
        return
    try:
        # Save prediction
        pred_data = {
            "device_id": str(prediction_data["device_id"]),
            "model_type": prediction_data.get("model_type", "unified"),
            "failure_type": prediction_data.get("predicted_primary_failure", "Unknown"),
            "risk_score": prediction_data.get("overall_risk_score", 0),
            "health_score": prediction_data.get("overall_health_score", 100),
            "days_remaining": prediction_data.get("days_remaining", 365),
            "confidence": prediction_data.get("confidence", 0.0)
        }
        res = supabase.table("predictions").insert(pred_data).execute()
        if not res.data:
            return
            
        pred_id = res.data[0]["id"]
        
        explanation = prediction_data.get("explanation", {})
        if explanation:
            # Store explanation
            exp_data = {
                "prediction_id": pred_id,
                "summary": explanation.get("summary", ""),
                "root_causes": explanation.get("root_causes", []),
                "business_impact": explanation.get("business_impact", "")
            }
            supabase.table("explanations").insert(exp_data).execute()
            
            # Store recommendation
            rec_data = {
                "prediction_id": pred_id,
                "device_id": str(prediction_data["device_id"]),
                "action": explanation.get("recommended_action", ""),
                "priority": prediction_data.get("priority", "Low")
            }
            supabase.table("recommendations").insert(rec_data).execute()
            
    except Exception as e:
        print(f"Error storing prediction: {e}")
        traceback.print_exc()

@router.post("/predict/storage")
def predict_storage(payload: Dict[str, Any]):
    device_id = payload.get("device_id")
    telemetry = payload.get("telemetry", {})
    
    result = unified_engine.storage_engine.predict(telemetry)
    result["device_id"] = device_id
    
    return result

@router.post("/predict/operational")
def predict_operational(payload: Dict[str, Any]):
    device_id = payload.get("device_id")
    telemetry = payload.get("telemetry", {})
    
    result = unified_engine.operational_engine.predict(telemetry)
    result["device_id"] = device_id
    
    return result

@router.post("/predict/unified")
def predict_unified(payload: Dict[str, Any]):
    device_id = payload.get("device_id", "unknown-device")
    telemetry = payload.get("telemetry", {})
    
    response = unified_engine.predict(telemetry)
    response["device_id"] = device_id
    response["model_type"] = "unified"
    # Just grab confidence from operational for now if needed, or max of both
    conf = response["operational_prediction"].get("confidence", 0.0)
    if response["predicted_primary_failure"] == "Storage Failure":
        conf = response["storage_prediction"].get("failure_probability", 0.0)
    response["confidence"] = conf
    
    return response

@router.post("/predict/explain")
def predict_explain(payload: Dict[str, Any]):
    device_id = payload.get("device_id", "unknown-device")
    telemetry = payload.get("telemetry", {})
    prediction_output = payload.get("prediction", {})
    risk_score = prediction_output.get("overall_risk_score", 0)
    
    explanation = gemini_explainer.generate_explanation(
        prediction_output=prediction_output,
        telemetry_data=telemetry,
        risk_score=risk_score
    )
    
    prediction_output["explanation"] = explanation
    prediction_output["device_id"] = device_id
    
    # Store everything to Supabase
    store_prediction(prediction_output)
    
    return explanation

@router.post("/predict/chat")
def chat_assistant(payload: Dict[str, Any]):
    prompt = payload.get("prompt", "")
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    response = gemini_explainer.chat(prompt)
    return {"response": response}

@router.get("/models/status")
def get_models_status():
    from app.ml.model_registry import ModelRegistry
    registry = ModelRegistry()
    storage_loaded = registry.models.get("storage") is not None
    op_loaded = registry.models.get("operational") is not None
    
    return {
        "status": "ready" if storage_loaded and op_loaded else "error",
        "models": {
            "storage": "loaded" if storage_loaded else "missing",
            "operational": "loaded" if op_loaded else "missing"
        }
    }

@router.get("/models/health")
def get_models_health():
    return get_models_status()

@router.get("/analytics")
def get_analytics():
    if not supabase:
        return {"error": "Supabase not configured"}
        
    try:
        # Fetch all predictions
        res = supabase.table("predictions").select("*").execute()
        data = res.data
        
        total = len(data)
        healthy = sum(1 for d in data if d.get("health_score", 0) > 50)
        critical = sum(1 for d in data if d.get("risk_score", 0) > 80)
        
        # Simple failure distribution
        failure_dist = {}
        for d in data:
            ftype = d.get("failure_type", "Healthy")
            if ftype != "Healthy":
                failure_dist[ftype] = failure_dist.get(ftype, 0) + 1
                
        # Time series data (grouping by date)
        # For simplicity, we just aggregate risk scores
        return {
            "total_predictions": total,
            "healthy_predictions": healthy,
            "critical_predictions": critical,
            "failure_distribution": failure_dist,
            "raw_data": data[-100:] # Last 100 for charts
        }
    except Exception as e:
        print(f"Error fetching analytics: {e}")
        return {"error": str(e)}
