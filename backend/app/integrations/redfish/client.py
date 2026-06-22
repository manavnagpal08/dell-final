import httpx
from typing import Dict, Any, List

class RedfishClient:
    def __init__(self, base_url: str, username: str, password: str, verify_ssl: bool = False):
        self.base_url = base_url.rstrip('/')
        self.username = username
        self.password = password
        self.verify_ssl = verify_ssl

    def _get(self, path: str) -> Dict[str, Any]:
        url = f"{self.base_url}{path}"
        try:
            response = httpx.get(
                url, 
                auth=(self.username, self.password), 
                verify=self.verify_ssl,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            raise Exception(f"Redfish Connection Error: {str(e)}")

    def authenticate(self):
        # Service root fetch verifies credentials basic auth works
        res = self._get("/redfish/v1/")
        if not res:
            raise Exception("Authentication failed")
        return res

    def get_systems(self) -> List[Dict[str, Any]]:
        systems = []
        root = self._get("/redfish/v1/Systems")
        members = root.get('Members', [])
        for member in members:
            path = member.get('@odata.id')
            if path:
                systems.append(self._get(path))
        return systems

    def get_chassis(self) -> List[Dict[str, Any]]:
        chassis = []
        root = self._get("/redfish/v1/Chassis")
        members = root.get('Members', [])
        for member in members:
            path = member.get('@odata.id')
            if path:
                chassis.append(self._get(path))
        return chassis

    def get_thermal(self, chassis_path: str) -> Dict[str, Any]:
        return self._get(f"{chassis_path}/Thermal")

    def get_power(self, chassis_path: str) -> Dict[str, Any]:
        return self._get(f"{chassis_path}/Power")
