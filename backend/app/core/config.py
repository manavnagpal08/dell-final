from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "VyomAi Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Gemini AI
    GEMINI_API_KEY: str = ""
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = "your-secret-key-for-jwt"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
