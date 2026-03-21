"""通知模型"""
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Boolean
from datetime import datetime
from .base import Base


class Notification(Base):
    """系统通知表"""
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    agent_id = Column(String(36), ForeignKey("agents.id"), nullable=True, index=True)
    type = Column(String(50), nullable=False)  # task_assigned, task_completed, project_updated, etc.
    title = Column(String(200), nullable=False)
    content = Column(String(1000), nullable=True)
    data = Column(JSON, nullable=True)  # 附加数据
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    read_at = Column(DateTime, nullable=True)
