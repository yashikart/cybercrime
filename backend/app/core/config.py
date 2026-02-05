"""
Application configuration settings
"""

import json
import os
from pydantic_settings import BaseSettings, SettingsConfigDict, EnvSettingsSource
from pydantic import field_validator
from typing import List, Optional, Any


class CORSEnvSettingsSource(EnvSettingsSource):
    """Custom settings source that handles CORS_ORIGINS specially"""
    def __call__(self) -> dict[str, Any]:
        d: dict[str, Any] = {}
        
        # Handle CORS_ORIGINS first, before Pydantic tries to parse it as JSON
        cors_env = os.getenv('CORS_ORIGINS')
        if cors_env:
            cors_env = cors_env.strip()
            if cors_env:
                # Try parsing as JSON first
                try:
                    parsed = json.loads(cors_env)
                    if isinstance(parsed, list):
                        d['CORS_ORIGINS'] = parsed
                    else:
                        # If not a list, treat as comma-separated
                        d['CORS_ORIGINS'] = [origin.strip() for origin in cors_env.split(',') if origin.strip()]
                except (json.JSONDecodeError, ValueError, TypeError):
                    # If not JSON, treat as comma-separated string
                    d['CORS_ORIGINS'] = [origin.strip() for origin in cors_env.split(',') if origin.strip()]
        
        # Temporarily remove CORS_ORIGINS from env to prevent super() from trying to parse it
        cors_backup = os.environ.pop('CORS_ORIGINS', None)
        try:
            # Get other env settings
            other_settings = super().__call__()
            d.update(other_settings)
        finally:
            # Restore CORS_ORIGINS to env
            if cors_backup is not None:
                os.environ['CORS_ORIGINS'] = cors_backup
        
        # Ensure our CORS_ORIGINS value is used
        if 'CORS_ORIGINS' in d:
            pass  # Already set above
        
        return d


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 3000
    DEBUG: bool = True
    
    @field_validator('DEBUG', mode='before')
    @classmethod
    def parse_debug(cls, v):
        """Handle DEBUG=WARN and other string values"""
        if isinstance(v, str):
            v_upper = v.upper()
            if v_upper in ("TRUE", "1", "YES", "ON"):
                return True
            elif v_upper in ("FALSE", "0", "NO", "OFF", "WARN"):
                return False
        return v
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-use-env-variable"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    # Use a local SQLite file by default so it works without any external DB server.
    # Can be overridden via environment variable DATABASE_URL if you later install PostgreSQL.
    DATABASE_URL: str = "sqlite:///./investigation.db"
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "cybercrime_investigation"
    
    # File Storage
    EVIDENCE_STORAGE_PATH: str = "./evidence_storage"  # Directory to store evidence files
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # AI (OpenRouter)
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "qwen/qwen-2.5-72b-instruct"  # Free model

    # External AI Orchestrator (e.g. Primary_Bucket_Owner)
    # If configured, certain AI flows can delegate to this orchestrator service.
    AI_ORCHESTRATOR_INCIDENT_URL: Optional[str] = None  # Full URL for incident-analysis basket endpoint
    AI_ORCHESTRATOR_API_KEY: Optional[str] = None       # Optional auth key/token for the orchestrator
    
    # Email Configuration (SMTP - Brevo)
    MAIL_SERVER: str = "smtp-relay.brevo.com"
    MAIL_PORT: int = 587
    MAIL_USERNAME: str = "9fcd20001@smtp-brevo.com"
    MAIL_PASSWORD: str = ""  # Legacy Brevo SMTP API key (used only if you enable SMTP)
    MAIL_FROM: str = "blackholeinfiverse48@gmail.com"
    MAIL_FROM_NAME: str = "Cybercrime Investigation System"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    # Brevo HTTP API (recommended for Render and environments that block SMTP)
    # Set BREVO_API_KEY to your "xkeysib-..." key from Brevo. When present,
    # the app will use the HTTPS API instead of SMTP to send emails.
    BREVO_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )
    
    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls,
        init_settings,
        env_settings,
        dotenv_settings,
        file_secret_settings,
    ):
        """Use custom env settings source for CORS_ORIGINS"""
        return (
            init_settings,
            CORSEnvSettingsSource(settings_cls=settings_cls),
            dotenv_settings,
            file_secret_settings,
        )
        


settings = Settings()
