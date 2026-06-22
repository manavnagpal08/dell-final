class OIDs:
    sysDescr = '1.3.6.1.2.1.1.1.0'
    sysObjectID = '1.3.6.1.2.1.1.2.0'
    sysUpTime = '1.3.6.1.2.1.1.3.0'
    sysContact = '1.3.6.1.2.1.1.4.0'
    sysName = '1.3.6.1.2.1.1.5.0'
    sysLocation = '1.3.6.1.2.1.1.6.0'

    # Common metrics (often require specific vendor MIBs, using UCD-SNMP-MIB for standard Linux as default fallback)
    memTotalReal = '1.3.6.1.4.1.2021.4.5.0'
    memAvailReal = '1.3.6.1.4.1.2021.4.6.0'
    
    ssCpuUser = '1.3.6.1.4.1.2021.11.9.0'
    ssCpuSystem = '1.3.6.1.4.1.2021.11.10.0'
    ssCpuIdle = '1.3.6.1.4.1.2021.11.11.0'
