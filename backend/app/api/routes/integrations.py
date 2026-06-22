from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import os

from app.integrations.zabbix.service import ZabbixService
from app.integrations.redfish.service import RedfishService
from app.integrations.snmp.service import SnmpService

router = APIRouter()

# --- Zabbix Endpoints ---
def get_zabbix_service():
    url = os.getenv("ZABBIX_URL") or "http://mock-zabbix.local"
    user = os.getenv("ZABBIX_USERNAME") or "admin"
    pwd = os.getenv("ZABBIX_PASSWORD") or "zabbix"
    return ZabbixService(url, user, pwd)

def mock_success(integration: str, message: str, count: int = 5):
    from datetime import datetime, timezone
    return {
        "integration": integration,
        "status": "sync_complete",
        "success": True,
        "message": message,
        "records_processed": count,
        "records_failed": 0,
        "last_sync_at": datetime.now(timezone.utc).isoformat(),
        "error": None
    }

@router.get("/zabbix/status")
def zabbix_status():
    return {"integration": "Zabbix", "status": "Configured"}

@router.post("/zabbix/test-connection")
def zabbix_test(service: ZabbixService = Depends(get_zabbix_service)):
    return service.test_connection()

@router.post("/zabbix/sync-hosts")
def zabbix_sync_hosts(service: ZabbixService = Depends(get_zabbix_service)):
    try:
        return service.sync_hosts()
    except Exception as e:
        return {"integration": "Zabbix", "success": False, "message": "Connection to Zabbix API Refused.", "error": f"Details: {str(e)}\n\nHOW TO FIX: To successfully sync, you must provide a valid enterprise Zabbix instance. Open your backend/.env file and set ZABBIX_URL, ZABBIX_USERNAME, and ZABBIX_PASSWORD. Ensure you are connected to the corporate VPN if the server is internal."}

@router.post("/zabbix/sync-telemetry")
def zabbix_sync_telemetry(service: ZabbixService = Depends(get_zabbix_service)):
    try:
        return service.sync_telemetry()
    except Exception as e:
        return {"integration": "Zabbix", "success": False, "message": "Telemetry Sync Failed.", "error": f"Details: {str(e)}\n\nHOW TO FIX: To successfully sync, you must provide a valid enterprise Zabbix instance. Open your backend/.env file and set ZABBIX_URL, ZABBIX_USERNAME, and ZABBIX_PASSWORD. Ensure you are connected to the corporate VPN if the server is internal."}

@router.post("/zabbix/sync-alerts")
def zabbix_sync_alerts(service: ZabbixService = Depends(get_zabbix_service)):
    try:
        return service.sync_alerts()
    except Exception as e:
        return {"integration": "Zabbix", "success": False, "message": "Alert Sync Failed.", "error": f"Details: {str(e)}\n\nHOW TO FIX: To successfully sync, you must provide a valid enterprise Zabbix instance. Open your backend/.env file and set ZABBIX_URL, ZABBIX_USERNAME, and ZABBIX_PASSWORD. Ensure you are connected to the corporate VPN if the server is internal."}


# --- Redfish Endpoints ---
def get_redfish_service():
    url = os.getenv("REDFISH_BASE_URL") or "https://mock-idrac.local"
    user = os.getenv("REDFISH_USERNAME") or "root"
    pwd = os.getenv("REDFISH_PASSWORD") or "calvin"
    verify = os.getenv("REDFISH_VERIFY_SSL", "false").lower() == "true"
    return RedfishService(url, user, pwd, verify)

@router.get("/redfish/status")
def redfish_status():
    return {"integration": "Redfish", "status": "Configured"}

@router.post("/redfish/test-connection")
def redfish_test(service: RedfishService = Depends(get_redfish_service)):
    return service.test_connection()

@router.post("/redfish/sync-systems")
def redfish_sync_systems(service: RedfishService = Depends(get_redfish_service)):
    try:
        return service.sync_systems()
    except Exception as e:
        return {"integration": "Redfish", "success": False, "message": "Redfish BMC Connection Refused.", "error": f"Details: {str(e)}\n\nHOW TO FIX: Redfish requires an active iDRAC/iLO endpoint. Configure REDFISH_BASE_URL, REDFISH_USERNAME, and REDFISH_PASSWORD in your backend/.env file. Set REDFISH_VERIFY_SSL=false if using self-signed certs."}

@router.post("/redfish/sync-telemetry")
def redfish_sync_telemetry(service: RedfishService = Depends(get_redfish_service)):
    try:
        return service.sync_telemetry()
    except Exception as e:
        return {"integration": "Redfish", "success": False, "message": "Telemetry Sync Failed.", "error": f"Details: {str(e)}\n\nHOW TO FIX: Redfish requires an active iDRAC/iLO endpoint. Configure REDFISH_BASE_URL, REDFISH_USERNAME, and REDFISH_PASSWORD in your backend/.env file. Set REDFISH_VERIFY_SSL=false if using self-signed certs."}

@router.post("/redfish/sync-alerts")
def redfish_sync_alerts(service: RedfishService = Depends(get_redfish_service)):
    try:
        return service.sync_alerts()
    except Exception as e:
        return {"integration": "Redfish", "success": False, "message": "Alert Sync Failed.", "error": f"Details: {str(e)}\n\nHOW TO FIX: Redfish requires an active iDRAC/iLO endpoint. Configure REDFISH_BASE_URL, REDFISH_USERNAME, and REDFISH_PASSWORD in your backend/.env file. Set REDFISH_VERIFY_SSL=false if using self-signed certs."}


# --- SNMP Endpoints ---
def get_snmp_service():
    targets_str = os.getenv("SNMP_TARGETS") or "192.168.1.100,192.168.1.101"
    community = os.getenv("SNMP_COMMUNITY") or "public"
    
    targets = [t.strip() for t in targets_str.split(',')]
    version = os.getenv("SNMP_VERSION", "2c")
    timeout = int(os.getenv("SNMP_TIMEOUT", "3"))
    retries = int(os.getenv("SNMP_RETRIES", "2"))
    
    return SnmpService(targets, community, version, timeout, retries)

@router.get("/snmp/status")
def snmp_status():
    return {"integration": "SNMP", "status": "Configured"}

@router.post("/snmp/test-connection")
def snmp_test(service: SnmpService = Depends(get_snmp_service)):
    return service.test_connection()

@router.post("/snmp/poll")
def snmp_poll(service: SnmpService = Depends(get_snmp_service)):
    try:
        return service.test_connection()
    except Exception as e:
        return {"integration": "SNMP", "success": False, "message": "SNMP Timeout.", "error": f"Details: {str(e)}\n\nHOW TO FIX: The agent could not reach the SNMP targets. Ensure SNMP_TARGETS and SNMP_COMMUNITY are configured in backend/.env. Confirm that UDP Port 161 is open on the target devices."}

@router.post("/snmp/sync-telemetry")
def snmp_sync_telemetry(service: SnmpService = Depends(get_snmp_service)):
    try:
        return service.sync_telemetry()
    except Exception as e:
        return {"integration": "SNMP", "success": False, "message": "Telemetry Sync Failed.", "error": f"Details: {str(e)}\n\nHOW TO FIX: The agent could not reach the SNMP targets. Ensure SNMP_TARGETS and SNMP_COMMUNITY are configured in backend/.env. Confirm that UDP Port 161 is open on the target devices."}
