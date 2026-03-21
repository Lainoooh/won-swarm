"""任务分配记录模型"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from datetime import datetime
from .base import Base


class TaskAssignment(Base):
    """任务分配记录表"""
    __tablename__ = "task_assignments"

    id = Column(String(36), primary_key=True, index=True)
    task_id = Column(String(36), ForeignKey("tasks.id"), nullable=False, index=True)
    assignee_id = Column(String(36), ForeignKey("agents.id"), nullable=True)
    assigned_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(50), nullable=False)  # assigned, reassigned, unassigned
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
