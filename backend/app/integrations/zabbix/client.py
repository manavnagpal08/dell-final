import httpx
import json
from typing import Dict, Any, List

class ZabbixClient:
    def __init__(self, base_url: str, username: str, password: str):
        # Ensure url ends with api_jsonrpc.php
        if not base_url.endswith("api_jsonrpc.php"):
            self.url = f"{base_url.rstrip('/')}/api_jsonrpc.php"
        else:
            self.url = base_url
        self.username = username
        self.password = password
        self.auth_token = None
        self.id_counter = 1

    def _rpc_call(self, method: str, params: Dict[str, Any]) -> Any:
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": self.id_counter
        }
        if self.auth_token and method != "user.login":
            payload["auth"] = self.auth_token
            
        self.id_counter += 1
        
        try:
            response = httpx.post(self.url, json=payload, timeout=10.0, verify=False)
            response.raise_for_status()
            data = response.json()
            if "error" in data:
                raise Exception(f"Zabbix API Error: {data['error'].get('data', data['error'])}")
            return data.get("result")
        except httpx.RequestError as e:
            raise Exception(f"Zabbix Connection Error: {str(e)}")

    def authenticate(self):
        result = self._rpc_call("user.login", {
            "user": self.username,
            "password": self.password
        })
        if not result:
            raise Exception("Authentication failed")
        self.auth_token = result

    def get_hosts(self) -> List[Dict[str, Any]]:
        return self._rpc_call("host.get", {
            "output": ["hostid", "host", "name", "status", "error"],
            "selectInventory": ["vendor", "model", "location"]
        })

    def get_items(self, hostids: List[str] = None) -> List[Dict[str, Any]]:
        params = {
            "output": ["itemid", "hostid", "name", "key_", "lastvalue", "lastclock"],
            "filter": {
                "status": "0" # Active items
            }
        }
        if hostids:
            params["hostids"] = hostids
        return self._rpc_call("item.get", params)

    def get_problems(self) -> List[Dict[str, Any]]:
        return self._rpc_call("problem.get", {
            "output": ["eventid", "objectid", "name", "severity", "acknowledged", "clock"],
            "recent": "true",
            "sortfield": ["eventid"],
            "sortorder": "DESC"
        })
