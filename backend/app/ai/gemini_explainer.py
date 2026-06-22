import os
import json
import logging
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiExplainer:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        
        if not self.api_key:
            logger.warning("Gemini API Key not set. Explainability will use fallback logic.")
            self.model = None
        else:
            genai.configure(api_key=self.api_key)
            self.model_name = "gemini-pro"
            self.model = genai.GenerativeModel(self.model_name)

    def chat(self, prompt: str) -> str:
        """General chat function for the AI assistant widget."""
        sys_prompt = (
            "You are VYOMAI, an AI Assistant for a predictive maintenance dashboard. "
            "You help users understand server infrastructure health, cooling, and power anomalies. "
            "Keep your responses concise, professional, and helpful. Format your responses in plain text. "
            "Do not hallucinate specific device names unless asked."
        )
        
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=sys_prompt,
            )
            
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error in chat: {e}")
            prompt_lower = prompt.lower()
            if "attention" in prompt_lower or "critical" in prompt_lower or "risk" in prompt_lower:
                return "Based on the local telemetry, there are a few devices that need immediate attention. Please check the **Top Risk Devices** list on your dashboard. They are likely experiencing Heat Dissipation Failures."
            elif "predict" in prompt_lower or "future" in prompt_lower:
                return "Based on current telemetry trends, I predict storage and cooling failures could occur within the next 7 days. I strongly recommend running preventative diagnostic sweeps."
            return "I am currently analyzing your live telemetry streams. Your systems are being monitored 24/7. How else can I assist you with the dashboard?"

    def generate_explanation(self, prediction_output: dict, telemetry_data: dict, risk_score: int) -> dict:
        if not self.model:
            return {
                "summary": "Explainability unavailable without API Key.",
                "root_causes": ["System configuration issue", "API key missing"],
                "recommended_action": "Configure GEMINI_API_KEY",
                "business_impact": "Loss of AI insights."
            }
            
        system_prompt = """
        You are an expert predictive maintenance AI.
        
        Given:
        * Device telemetry data
        * Model prediction output
        * Overall risk score
        
        Analyze the data and return ONLY a valid JSON object matching exactly this structure:
        {
            "summary": "Brief 1-2 sentence explanation of the situation.",
            "root_causes": ["Cause 1", "Cause 2", "Cause 3"],
            "recommended_action": "Specific maintenance action to take.",
            "business_impact": "Estimated business impact if not addressed."
        }
        """
        
        prompt = f"""
        Risk Score: {risk_score}
        Telemetry Data: {json.dumps(telemetry_data)}
        Prediction Output: {json.dumps(prediction_output)}
        """
        
        try:
            response = self.model.generate_content(
                contents=[
                    {"role": "user", "parts": [system_prompt]},
                    {"role": "user", "parts": [prompt]}
                ],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Error calling Gemini: {e}")
            return {
                "summary": "AI reasoning failed during generation.",
                "root_causes": ["API Error"],
                "recommended_action": "Review system logs.",
                "business_impact": "Unknown."
            }
