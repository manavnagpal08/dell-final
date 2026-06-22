from typing import Dict, Any, List
from app.integrations.zabbix.client import ZabbixClient
from app.database.supabase import get_supabase
from datetime import datetime, timezone
import uuid

class ZabbixService:
    def __init__(self, base_url: str, username: str, password: str):
        self.client = ZabbixClient(base_url, username, password)

    def test_connection(self) -> Dict[str, Any]:
        try:
            self.client.authenticate()
            return {
                "integration": "Zabbix",
                "status": "connected",
                "success": True,
                "message": "Connected successfully",
                "records_processed": 0,
                "records_failed": 0,
                "error": None
            }
        except Exception as e:
            return {
                "integration": "Zabbix",
                "status": "connection_failed",
                "success": False,
                "message": "Authentication failed",
                "records_processed": 0,
                "records_failed": 0,
                "error": str(e)
            }

    def sync_hosts(self) -> Dict[str, Any]:
        supabase = get_supabase()
        if not supabase:
            raise Exception("Database connection not available")

        self.client.authenticate()
        hosts = self.client.get_hosts()
        
        processed = 0
        failed = 0
        
        for host in hosts:
            try:
                inventory = host.get('inventory') or {}
                # Zabbix mapping
                device_data = {
                    # Create a deterministic UUID based on Zabbix hostid to avoid duplicates
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"zabbix-{host['hostid']}")),
                    "name": host.get('name', host['host']),
                    "vendor": inventory.get('vendor', 'Unknown Zabbix Host'),
                    "model": inventory.get('model', 'Unknown Model'),
                    "location": inventory.get('location', 'Zabbix Discovered'),
                    "type": "Server",
                    "health_score": 100 if host['status'] == '0' else 0, # status 0 is monitored
                    "risk_score": 0 if host['status'] == '0' else 100,
                    "risk_level": "Healthy" if host['status'] == '0' else "Critical",
                    "status": "Online" if host['status'] == '0' else "Offline",
                    "last_telemetry_timestamp": datetime.now(timezone.utc).isoformat()
                }
                
                # Upsert device
                supabase.table("devices").upsert(device_data).execute()
                processed += 1
            except Exception as e:
                failed += 1
                
        return {
            "integration": "Zabbix",
            "status": "sync_complete",
            "success": True,
            "message": "Host sync completed",
            "records_processed": processed,
            "records_failed": failed,
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
            "error": None
        }

    def sync_telemetry(self) -> Dict[str, Any]:
        supabase = get_supabase()
        if not supabase:
            raise Exception("Database connection not available")

        self.client.authenticate()
        hosts = self.client.get_hosts()
        items = self.client.get_items()
        
        processed = 0
        failed = 0
        
        # Group items by host
        host_items = {}
        for item in items:
            hid = item['hostid']
            if hid not in host_items:
                host_items[hid] = {}
            # simple matching by key
            key = item['key_'].lower()
            val = item.get('lastvalue', '0')
            try:
                val_float = float(val)
            except:
                val_float = 0.0

            if 'cpu' in key and ('util' in key or 'load' in key):
                host_items[hid]['cpu_usage'] = val_float
            elif 'memory' in key and 'util' in key:
                host_items[hid]['memory_usage'] = val_float
            elif 'vfs.fs.size' in key and 'pused' in key:
                host_items[hid]['disk_usage'] = val_float
            elif 'temp' in key:
                host_items[hid]['temperature'] = val_float
            elif 'fan' in key:
                host_items[hid]['fan_rpm'] = val_float
            elif 'volt' in key:
                host_items[hid]['voltage'] = val_float
            elif 'power' in key:
                host_items[hid]['power_usage'] = val_float

        for host in hosts:
            hid = host['hostid']
            if hid in host_items:
                metrics = host_items[hid]
                if not metrics:
                    continue
                try:
                    device_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"zabbix-{hid}"))
                    record = {
                        "device_id": device_id,
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "temperature": metrics.get('temperature', 45.0),
                        "fan_rpm": metrics.get('fan_rpm', 3000.0),
                        "voltage": metrics.get('voltage', 12.0),
                        "power_usage": metrics.get('power_usage', 200.0),
                        "smart_health": 100.0
                    }
                    supabase.table("telemetry_records").insert(record).execute()
                    processed += 1
                except Exception as e:
                    failed += 1

        return {
            "integration": "Zabbix",
            "status": "sync_complete",
            "success": True,
            "message": "Telemetry sync completed",
            "records_processed": processed,
            "records_failed": failed,
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
            "error": None
        }

    def sync_alerts(self) -> Dict[str, Any]:
        supabase = get_supabase()
        if not supabase:
            raise Exception("Database connection not available")

        self.client.authenticate()
        problems = self.client.get_problems()
        
        processed = 0
        failed = 0
        
        for prob in problems:
            try:
                # Need host mapping, Zabbix problems often attach to triggers not directly hosts in problem.get
                # But objectid is trigger id. We would need to resolve trigger -> host.
                # For hackathon complexity, we use a generic placeholder or skip if not perfectly mapped.
                # Since problem.get returns events, let's map loosely.
                
                # Severity mapping
                severity_map = {
                    "0": "Info",
                    "1": "Info",
                    "2": "Warning",
                    "3": "Warning",
                    "4": "High",
                    "5": "Critical"
                }
                
                alert_data = {
                    # For a true enterprise sync, we'd look up the device_id from trigger -> item -> host
                    # Here we might not have it in one call, so we mock the device link or leave it null if allowed.
                    # Since device_id is required in Supabase schema, we create a fallback "Zabbix System" device.
                    "device_id": str(uuid.uuid5(uuid.NAMESPACE_DNS, "zabbix-fallback")),
                    "severity": severity_map.get(str(prob.get('severity', '2')), 'Warning'),
                    "failure_probability": 0.9,
                    "failure_type": prob.get('name', 'Unknown Problem'),
                    "recommended_action": "Investigate Zabbix Trigger",
                    "time_generated": datetime.fromtimestamp(int(prob.get('clock', 0)), timezone.utc).isoformat(),
                    "status": "Active" if str(prob.get('acknowledged')) == "0" else "Acknowledged"
                }
                
                # Make sure fallback device exists
                supabase.table("devices").upsert({
                    "id": alert_data["device_id"],
                    "name": "Zabbix Active Alerts",
                    "vendor": "Zabbix",
                    "model": "Monitoring Node",
                    "type": "Network",
                    "health_score": 50,
                    "risk_score": 50,
                    "risk_level": "Warning",
                    "status": "Online"
                }).execute()

                supabase.table("alerts").insert(alert_data).execute()
                processed += 1
            except Exception as e:
                failed += 1

        return {
            "integration": "Zabbix",
            "status": "sync_complete",
            "success": True,
            "message": "Alert sync completed",
            "records_processed": processed,
            "records_failed": failed,
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
            "error": None
        }
