import os
import joblib
import logging
import sys

logger = logging.getLogger(__name__)

class ModelRegistry:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
        
    def _initialize(self):
        self.models = {}
        self.features = {}
        self.encoders = {}
        self.model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "saved_models")
        self.load_all()
        
    def load_all(self):
        required_files = {
            "storage": {
                "model": "disk_failure_model.pkl",
                "features": "features.pkl"
            },
            "operational": {
                "model": "ai4i_failure_model.pkl",
                "features": "ai4i_features.pkl",
                "encoder": "ai4i_label_encoder.pkl"
            }
        }
        
        # 1. Storage Model
        storage_model_path = os.path.join(self.model_dir, required_files["storage"]["model"])
        storage_features_path = os.path.join(self.model_dir, required_files["storage"]["features"])
        
        if not os.path.exists(storage_model_path) or not os.path.exists(storage_features_path):
            logger.warning(f"Storage Model files missing in {self.model_dir}. Storage predictions will be disabled.")
            self.models["storage"] = None
            self.features["storage"] = None
        else:
            try:
                self.models["storage"] = joblib.load(storage_model_path)
                self.features["storage"] = joblib.load(storage_features_path)
                logger.info("Storage model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load storage model: {e}")
                self.models["storage"] = None
                self.features["storage"] = None

        # 2. Operational Model
        op_model_path = os.path.join(self.model_dir, required_files["operational"]["model"])
        op_features_path = os.path.join(self.model_dir, required_files["operational"]["features"])
        op_encoder_path = os.path.join(self.model_dir, required_files["operational"]["encoder"])
        
        if not os.path.exists(op_model_path) or not os.path.exists(op_features_path) or not os.path.exists(op_encoder_path):
            logger.warning(f"Operational Model files missing in {self.model_dir}. Operational predictions will be disabled.")
            self.models["operational"] = None
            self.features["operational"] = None
            self.encoders["operational"] = None
        else:
            try:
                self.models["operational"] = joblib.load(op_model_path)
                self.features["operational"] = joblib.load(op_features_path)
                self.encoders["operational"] = joblib.load(op_encoder_path)
                logger.info("Operational model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load operational model: {e}")
                self.models["operational"] = None
                self.features["operational"] = None
                self.encoders["operational"] = None
        
    def get_storage_model(self):
        return {
            "model": self.models.get("storage"),
            "features": self.features.get("storage")
        }
        
    def get_operational_model(self):
        return {
            "model": self.models.get("operational"),
            "features": self.features.get("operational"),
            "encoder": self.encoders.get("operational")
        }
