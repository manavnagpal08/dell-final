import google.generativeai as genai
from app.core.config import settings
from typing import Dict, Any, List

from app.database.repositories import DeviceRepository, AlertRepository

class CopilotEngine:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_mock = False
        self.device_repo = DeviceRepository()
        self.alert_repo = AlertRepository()
        
        if not self.api_key:
            print("Warning: Gemini API Key not set. Using mock copilot responses.")
            self.is_mock = True
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')

    def generate_response(self, prompt: str, user_context: str = "") -> str:
        if self.is_mock:
            return self._generate_mock_response(prompt)
            
        # Fetch real DB context
        devices = self.device_repo.get_all()
        alerts = self.alert_repo.get_all()
        
        db_context = f"Total Devices: {len(devices)}\n"
        db_context += f"Total Alerts: {len(alerts)}\n"
        db_context += f"Recent Alerts: {[a.title for a in alerts[:5]]}\n"
        
        system_prompt = (
            "You are VyomAi Copilot, an AI assistant for IT infrastructure monitoring. "
            "You only explain existing data and answer questions about devices, alerts, and maintenance. "
            "Never predict failures directly; rely on the provided context. "
            "Context:\n"
        )
        
        full_prompt = system_prompt + db_context + "\n" + user_context + "\n\nUser: " + prompt
        
        try:
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return "I'm sorry, I encountered an error while processing your request with the AI service."

    def _generate_mock_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "critical" in prompt_lower or "server-101" in prompt_lower:
            return "Server-101 is critical because it is exhibiting signs of thermal overload and SSD degradation, leading to a high failure probability in the next 3 days."
        elif "maintenance" in prompt_lower:
            return "Based on the current alerts, the database cluster and edge nodes require immediate maintenance due to high temperatures and fan failures."
        elif "failures" in prompt_lower or "next month" in prompt_lower:
            return "I expect 3 minor failures related to cooling fans and 1 critical failure related to SSD wear in the storage array next month."
        elif "summary" in prompt_lower:
            return "Executive Summary: Overall system health is at 85%. There are 2 critical alerts open. Predictive models indicate a 15% increase in thermal issues. Cost optimization recommendations could save $1,200 this month."
        
        return "I am a mock AI copilot. For full functionality, please configure the GEMINI_API_KEY."
