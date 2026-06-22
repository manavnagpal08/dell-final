from pysnmp.hlapi import *
from typing import Dict, Any, List

class SnmpClient:
    def __init__(self, target: str, community: str, version: str = "2c", timeout: int = 3, retries: int = 2):
        self.target = target
        self.community = community
        self.version = 1 if version == "2c" else 0  # mpModel=1 is SNMPv2c
        self.timeout = timeout
        self.retries = retries

    def get(self, oids: List[str]) -> Dict[str, Any]:
        object_types = [ObjectType(ObjectIdentity(oid)) for oid in oids]
        
        iterator = getCmd(
            SnmpEngine(),
            CommunityData(self.community, mpModel=self.version),
            UdpTransportTarget((self.target, 161), timeout=self.timeout, retries=self.retries),
            ContextData(),
            *object_types
        )

        errorIndication, errorStatus, errorIndex, varBinds = next(iterator)

        if errorIndication:
            raise Exception(f"SNMP Error: {errorIndication}")
        elif errorStatus:
            raise Exception(f"SNMP Error: {errorStatus.prettyPrint()} at {errorIndex and varBinds[int(errorIndex) - 1][0] or '?'}")
        
        result = {}
        for name, val in varBinds:
            result[name.prettyPrint()] = val.prettyPrint()
            
        return result
