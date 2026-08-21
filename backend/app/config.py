import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Deepfake and Fake News Detection System"
    API_V1_STR: str = "/api"
    
    JWT_SECRET: str = "super-secret-key-change-in-production-aegis-shield"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # MongoDB settings
    MONGODB_URL: str = ""
    DATABASE_NAME: str = "deepfake_detector"
    
    # Cloudinary settings (Optional - fallbacks to local files if empty)
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def SECRET_KEY(self) -> str:
        return self.JWT_SECRET

settings = Settings()
