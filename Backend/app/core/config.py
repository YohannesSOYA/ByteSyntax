from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # CORS Origins: Strict list of trusted frontends
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Vite Dev Server
        "http://localhost:3000",  # React Default
        "http://localhost:8000",  # Backend / Docs
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

