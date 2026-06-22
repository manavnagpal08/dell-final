from typing import Dict, Any

class MaintenanceAdvisor:
    def __init__(self):
        pass

    def generate_recommendation(self, failure_type: str, prediction_data: Dict[str, Any]) -> Dict[str, Any]:
        recommendation = {
            "action": "Schedule standard inspection",
            "priority": "Low",
            "estimated_cost": 150.0,
            "downtime_saved": 4.0,
            "maintenance_window": "Next scheduled maintenance",
            "business_impact": "Minimal impact on current operations."
        }

        if failure_type == "Thermal Overload":
            recommendation.update({
                "action": "Immediate cooling system inspection and thermal paste replacement.",
                "priority": "Critical",
                "estimated_cost": 300.0,
                "downtime_saved": 24.0,
                "maintenance_window": "Within 24 hours",
                "business_impact": "High risk of sudden shutdown and data corruption."
            })
        elif failure_type == "Fan Failure":
            recommendation.update({
                "action": "Replace chassis fan assembly.",
                "priority": "High",
                "estimated_cost": 100.0,
                "downtime_saved": 12.0,
                "maintenance_window": "Within 48 hours",
                "business_impact": "Moderate risk of thermal throttling affecting performance."
            })
        elif failure_type == "SSD Degradation":
            recommendation.update({
                "action": "Backup data immediately and schedule drive replacement.",
                "priority": "Critical",
                "estimated_cost": 500.0,
                "downtime_saved": 48.0,
                "maintenance_window": "ASAP",
                "business_impact": "Extreme risk of permanent data loss."
            })

        return recommendation
