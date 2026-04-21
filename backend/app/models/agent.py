from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.dialects.sqlite import JSON
from app.database import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    platform_ak_hash = Column(String, nullable=True)
    worker_sk_hash = Column(String, nullable=False, unique=True, index=True)
    roles = Column(JSON, nullable=False, default=list)
    capabilities = Column(JSON, nullable=True, default=list)
    status = Column(String, nullable=False, default="offline", index=True)
    model = Column(String, nullable=False)
    tokens = Column(Integer, nullable=False, default=0)
    linshi = Column(Integer, nullable=False, default=0)
    current_task_id = Column(String, nullable=True)
    queued_tasks = Column(JSON, nullable=True, default=list)
    websocket_session_id = Column(String, nullable=True)
    last_heartbeat = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
