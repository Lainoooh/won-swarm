from sqlalchemy import Column, String, Integer, JSON, DateTime
from sqlalchemy.sql import func
from .base import Base


class Agent(Base):
    """Agent 表"""
    __tablename__ = "agents"

    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    platform_ak_hash = Column(String(64), nullable=False)  # 平台 AK 哈希（注册用）
    worker_sk_hash = Column(String(64))  # Worker SK 哈希（运行用）
    worker_sk = Column(String(255))  # 明文 SK（仅注册时返回，不持久化到数据库）
    roles = Column(JSON, nullable=False)  # 角色列表
    capabilities = Column(JSON)  # 能力列表
    max_concurrent_tasks = Column(Integer, default=3)
    status = Column(String(20), default="offline")  # offline/idle/busy
    current_task_id = Column(String(36))
    websocket_session_id = Column(String(64))
    last_heartbeat = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
