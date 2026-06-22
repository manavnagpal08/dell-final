from typing import Dict, Any, List
import random
from datetime import datetime, timezone

class MockIntegrationAdapter:
    def __init__(self, name: str):
        self.name = name

    def sync(self) -> Dict[str, Any]:
        # Simulate syncing data from external enterprise system
        success = random.choice([True, True, True, False]) # 75% success rate
        
        return {
            "name": self.name,
            "status": "Connected" if success else "Error",
            "last_sync": datetime.now(timezone.utc).isoformat(),
            "device_count": random.randint(50, 500) if success else 0,
            "health_status": random.choice(["Optimal", "Warning", "Critical"]) if success else "Unknown",
            "details": "Successfully synchronized devices." if success else "Connection timeout during sync."
        }

class DellOpenManageAdapter(MockIntegrationAdapter):
    def __init__(self):
        super().__init__("Dell OpenManage")

class HPiLOAdapter(MockIntegrationAdapter):
    def __init__(self):
        super().__init__("HP iLO")

class LenovoXClarityAdapter(MockIntegrationAdapter):
    def __init__(self):
        super().__init__("Lenovo XClarity")

class NagiosAdapter(MockIntegrationAdapter):
    def __init__(self):
        super().__init__("Nagios")

def get_all_adapters() -> List[MockIntegrationAdapter]:
    return [
        DellOpenManageAdapter(),
        HPiLOAdapter(),
        LenovoXClarityAdapter(),
        NagiosAdapter()
    ]
