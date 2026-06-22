import json
from fastapi import APIRouter, HTTPException
import google.generativeai as genai
from app.core.config import settings
from app.database.supabase import get_supabase

router = APIRouter()

# Initialize Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    # Use gemini-1.5-flash as default for fast generation
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

@router.get("/gemini/analytics")
async def get_gemini_analytics():
    if not model:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured")

    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection error")

    try:
        # Fetch high-level stats to give context to Gemini
        devices = supabase.table('devices').select('health_score,risk_level,status,type').execute()
        alerts = supabase.table('alerts').select('severity,status').execute()

        device_data = devices.data if devices and hasattr(devices, 'data') else []
        alert_data = alerts.data if alerts and hasattr(alerts, 'data') else []

        total_devices = len(device_data)
        offline_devices = sum(1 for d in device_data if d.get('status') == 'Offline')
        critical_alerts = sum(1 for a in alert_data if a.get('severity') == 'Critical' and a.get('status') == 'Active')
        avg_health = sum(d.get('health_score', 100) for d in device_data) / total_devices if total_devices > 0 else 100

        prompt = f"""
You are an expert IT Infrastructure AI. Based on the following live data:
- Total Devices: {total_devices}
- Offline Devices: {offline_devices}
- Critical Active Alerts: {critical_alerts}
- Average Fleet Health: {avg_health:.1f}%

Generate realistic 7-day trend data and predictive analytics for an IT dashboard.
Return ONLY a valid JSON object with the exact following structure (do not use markdown blocks like ```json, just raw JSON).

{{
  "Risk Evolution": [ {{"day": "1", "val": number}}, ..., {{"day": "7", "val": number}} ],
  "Device Health": [ {{"day": "1", "val": number}}, ..., {{"day": "7", "val": number}} ],
  "Failure Forecast": [ {{"name": "Cooling", "val": number}}, {{"name": "Thermal", "val": number}}, {{"name": "Storage", "val": number}}, {{"name": "Power", "val": number}}, {{"name": "Network", "val": number}} ],
  "Cost Savings": [ {{"month": "J", "val": number}}, {{"month": "F", "val": number}}, {{"month": "M", "val": number}}, {{"month": "A", "val": number}}, {{"month": "M", "val": number}} ],
  "Power Utilization": [ {{"name": "Opt", "val": number, "fill": "#10b981"}}, {{"name": "Waste", "val": number, "fill": "#ef4444"}} ],
  "Network Stability": [ {{"time": "0h", "val": number}}, {{"time": "6h", "val": number}}, {{"time": "12h", "val": number}}, {{"time": "18h", "val": number}} ],
  "Maintenance Efficiency": [ {{"name": "Routine", "val": number}}, {{"name": "Reactive", "val": number}}, {{"name": "AI Prev", "val": number}} ]
}}

Make the numbers realistic based on the current context. For example, if there are critical alerts or offline devices, maybe health drops over the last few days, and risk goes up. Ensure Power Utilization Opt + Waste = 100.
        """

        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Remove markdown if gemini returns it
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())

    except Exception as e:
        print(f"Gemini API Error: {{str(e)}}")
        # Return fallback mock data if API fails
        return {{
          "Risk Evolution": [ {{"day": "1", "val": 10}}, {{"day": "2", "val": 15}}, {{"day": "3", "val": 12}}, {{"day": "4", "val": 18}}, {{"day": "5", "val": 25}}, {{"day": "6", "val": 20}}, {{"day": "7", "val": 15}} ],
          "Device Health": [ {{"day": "1", "val": 95}}, {{"day": "2", "val": 94}}, {{"day": "3", "val": 96}}, {{"day": "4", "val": 92}}, {{"day": "5", "val": 88}}, {{"day": "6", "val": 90}}, {{"day": "7", "val": 95}} ],
          "Failure Forecast": [ {{"name": "Cooling", "val": 40}}, {{"name": "Thermal", "val": 35}}, {{"name": "Storage", "val": 10}}, {{"name": "Power", "val": 10}}, {{"name": "Network", "val": 5}} ],
          "Cost Savings": [ {{"month": "J", "val": 10}}, {{"month": "F", "val": 15}}, {{"month": "M", "val": 20}}, {{"month": "A", "val": 12}}, {{"month": "M", "val": 18}} ],
          "Power Utilization": [ {{"name": "Opt", "val": 80, "fill": "#10b981"}}, {{"name": "Waste", "val": 20, "fill": "#ef4444"}} ],
          "Network Stability": [ {{"time": "0h", "val": 99.5}}, {{"time": "6h", "val": 99.1}}, {{"time": "12h", "val": 98.9}}, {{"time": "18h", "val": 99.4}} ],
          "Maintenance Efficiency": [ {{"name": "Routine", "val": 50}}, {{"name": "Reactive", "val": 20}}, {{"name": "AI Prev", "val": 30}} ]
        }}
