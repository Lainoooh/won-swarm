"""审计日志模型"""
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from datetime import datetime
from .base import Base


class AuditLog(Base):
    """审计日志表"""
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(50), nullable=False, index=True)
    resource_type = Column(String(30), nullable=True, index=True)
    resource_id = Column(String(36), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
