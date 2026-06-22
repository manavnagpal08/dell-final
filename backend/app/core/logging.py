import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "funcName": record.funcName,
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def setup_logging():
    logger = logging.getLogger("vyom_ai")
    logger.setLevel(logging.INFO)
    
    # Console Handler
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    ch.setFormatter(JSONFormatter())
    
    if not logger.handlers:
        logger.addHandler(ch)
        
    return logger

logger = setup_logging()
