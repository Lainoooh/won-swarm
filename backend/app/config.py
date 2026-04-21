from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """应用配置"""

    # 基础配置
    APP_NAME: str = "WonSwarm API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # 数据库配置
    DATABASE_URL: str = "sqlite+aiosqlite:///./wonswarm.db"

    # API Key 配置
    API_KEY_HEADER: str = "X-API-Key"
    MASTER_SK: str = "sk_master_wonswarm_2026"

    # JWT 配置
    SECRET_KEY: str = "wonswarm_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # WebSocket 配置
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_OFFLINE_THRESHOLD: int = 300

    # 分页配置
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
