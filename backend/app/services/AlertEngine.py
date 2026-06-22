from typing import Dict, Any, List
from app.database.repositories import AlertRepository
from app.schemas.alert import AlertCreate
from app.services.email_service import EmailService
from uuid import UUID

class AlertEngine:
    def __init__(self):
        self.repo = AlertRepository()

    def process_telemetry(self, device_id: UUID, telemetry: Dict[str, Any], risk_score: float):
        alerts_to_create = []

        if risk_score > 85.0:
            alerts_to_create.append({
                "title": "Critical Failure Predicted",
                "description": f"Model predicts imminent failure with risk score {risk_score:.1f}%",
                "severity": "Critical"
            })
        elif risk_score > 60.0:
            alerts_to_create.append({
                "title": "High Risk Detected",
                "description": f"Elevated risk score {risk_score:.1f}% detected. Investigation recommended.",
                "severity": "High"
            })

        temp = telemetry.get('temperature', 0)
        if temp > 85.0:
            alerts_to_create.append({
                "title": "Thermal Overload",
                "description": f"Temperature reached critical threshold: {temp:.1f}°C",
                "severity": "Critical"
            })
        elif temp > 75.0:
            alerts_to_create.append({
                "title": "High Temperature Warning",
                "description": f"Temperature is unusually high: {temp:.1f}°C",
                "severity": "Warning"
            })
            
        # Create alerts in DB
        for alert_data in alerts_to_create:
            alert_in = AlertCreate(
                device_id=device_id,
                title=alert_data["title"],
                description=alert_data["description"],
                severity=alert_data["severity"]
            )
            self.repo.create(alert_in)

            # Send automated email for Critical and High severity alerts
            if alert_data["severity"] in ["Critical", "High", "Warning"]:
                EmailService.send_alert_email(
                    title=alert_data["title"],
                    description=alert_data["description"],
                    severity=alert_data["severity"],
                    device_id=str(device_id)
                )

