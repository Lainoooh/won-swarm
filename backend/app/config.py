import secrets
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """应用配置"""

    # 应用配置
    APP_NAME: str = "WonSwarm"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # 服务配置
    HOST: str = "0.0.0.0"
    PORT: int = 30009

    # 数据库
    DATABASE_URL: str = "sqlite:///./wonswarm.db"

    # 安全配置
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 小时

    # 管理员默认账号
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "123456"

    # WebSocket 配置
    WS_HEARTBEAT_INTERVAL: int = 30  # 心跳间隔（秒）
    WS_HEARTBEAT_TIMEOUT: int = 90   # 超时判定（秒）

    # 文件上传配置
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB

    class Config:
        env_file = ".env"


settings = Settings()
