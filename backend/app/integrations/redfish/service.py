from typing import Dict, Any, List
from app.integrations.redfish.client import RedfishClient
from app.database.supabase import get_supabase
from datetime import datetime, timezone
import uuid

class RedfishService:
    def __init__(self, base_url: str, username: str, password: str, verify_ssl: bool = False):
        self.client = RedfishClient(base_url, username, password, verify_ssl)
        self.base_url = base_url

    def test_connection(self) -> Dict[str, Any]:
        try:
            self.client.authenticate()
            return {
                "integration": "Redfish",
                "status": "connected",
                "success": True,
                "message": "Connected successfully",
                "records_processed": 0,
                "records_failed": 0,
                "error": None
            }
        except Exception as e:
            return {
                "integration": "Redfish",
                "status": "connection_failed",
                "success": False,
                "message": "Authentication failed",
                "records_processed": 0,
                "records_failed": 0,
                "error": str(e)
            }

    def sync_systems(self) -> Dict[str, Any]:
        supabase = get_supabase()
        if not supabase:
            raise Exception("Database connection not available")

        self.client.authenticate()
        systems = self.client.get_systems()
        
        processed = 0
        failed = 0
        
        for sys in systems:
            try:
                sys_id = sys.get('Id', 'unknown')
                status = sys.get('Status', {})
                health = status.get('Health', 'OK')
                
                device_data = {
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"redfish-{self.base_url}-{sys_id}")),
                    "name": sys.get('Name', f"Redfish System {sys_id}"),
                    "vendor": sys.get('Manufacturer', 'Unknown Vendor'),
                    "model": sys.get('Model', 'Unknown Model'),
                    "location": "Datacenter",
                    "type": "Server",
                    "health_score": 100 if health == 'OK' else (50 if health == 'Warning' else 10),
                    "risk_score": 0 if health == 'OK' else (50 if health == 'Warning' else 90),
                    "risk_level": "Healthy" if health == 'OK' else "Critical",
                    "status": "Online" if status.get('State') == 'Enabled' else "Offline",
                    "last_telemetry_timestamp": datetime.now(timezone.utc).isoformat()
                }
                
                supabase.table("devices").upsert(device_data).execute()
                processed += 1
            except Exception as e:
                failed += 1
                
        return {
            "integration": "Redfish",
            "status": "sync_complete",
            "success": True,
            "message": "System sync completed",
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
        chassis_list = self.client.get_chassis()
        
        processed = 0
        failed = 0
        
        for ch in chassis_list:
            try:
                ch_path = ch.get('@odata.id')
                if not ch_path: continue
                
                # We need a generic mapping. Often Chassis maps 1:1 to System or System contains Chassis links.
                # Here we just use a hash of chassis id to map to device id if not linked.
                device_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"redfish-{self.base_url}-{ch.get('Id')}"))
                
                try:
                    thermal = self.client.get_thermal(ch_path)
                    temps = thermal.get('Temperatures', [])
                    fans = thermal.get('Fans', [])
                    
                    avg_temp = sum(t.get('ReadingCelsius', 0) for t in temps if t.get('ReadingCelsius')) / max(len(temps), 1)
                    avg_fan = sum(f.get('Reading', 0) for f in fans if f.get('Reading')) / max(len(fans), 1)
                except:
                    avg_temp = 40.0
                    avg_fan = 3000.0
                    
                try:
                    power = self.client.get_power(ch_path)
                    p_control = power.get('PowerControl', [])
                    power_usage = sum(p.get('PowerConsumedWatts', 0) for p in p_control)
                    # Simplified voltage reading
                    voltage = 12.0
                except:
                    power_usage = 150.0
                    voltage = 12.0

                record = {
                    "device_id": device_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "temperature": float(avg_temp),
                    "fan_rpm": float(avg_fan),
                    "voltage": float(voltage),
                    "power_usage": float(power_usage),
                    "smart_health": 100.0
                }
                
                # Make sure fallback device exists for chassis if it didn't match a system
                supabase.table("devices").upsert({
                    "id": device_id,
                    "name": ch.get('Name', 'Redfish Chassis'),
                    "vendor": ch.get('Manufacturer', 'Unknown'),
                    "model": ch.get('Model', 'Unknown'),
                    "type": "Chassis",
                    "health_score": 100,
                    "risk_score": 0,
                    "risk_level": "Healthy",
                    "status": "Online"
                }).execute()
                
                supabase.table("telemetry_records").insert(record).execute()
                processed += 1
            except Exception as e:
                failed += 1

        return {
            "integration": "Redfish",
            "status": "sync_complete",
            "success": True,
            "message": "Telemetry sync completed",
            "records_processed": processed,
            "records_failed": failed,
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
            "error": None
        }

    def sync_alerts(self) -> Dict[str, Any]:
        # Redfish alerts are typically retrieved via EventService subscriptions or LogServices.
        # We will scan Systems/Chassis for non-OK health to create alerts.
        supabase = get_supabase()
        if not supabase:
            raise Exception("Database connection not available")

        self.client.authenticate()
        systems = self.client.get_systems()
        
        processed = 0
        failed = 0
        
        for sys in systems:
            sys_id = sys.get('Id', 'unknown')
            status = sys.get('Status', {})
            health = status.get('Health', 'OK')
            
            if health != 'OK':
                try:
                    device_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"redfish-{self.base_url}-{sys_id}"))
                    
                    alert_data = {
                        "device_id": device_id,
                        "severity": "Critical" if health == 'Critical' else "Warning",
                        "failure_probability": 0.85,
                        "failure_type": f"Redfish Health: {health}",
                        "recommended_action": "Check iDRAC/iLO for hardware failure details",
                        "time_generated": datetime.now(timezone.utc).isoformat(),
                        "status": "Active"
                    }
                    supabase.table("alerts").insert(alert_data).execute()
                    processed += 1
                except Exception as e:
                    failed += 1

        return {
            "integration": "Redfish",
            "status": "sync_complete",
            "success": True,
            "message": "Alert sync completed",
            "records_processed": processed,
            "records_failed": failed,
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
            "error": None
        }
