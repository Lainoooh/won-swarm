from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from .base import Base


class Task(Base):
    """任务表"""
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True)
    requirement_id = Column(String(36), ForeignKey("requirements.id"))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String)
    type = Column(String(30), nullable=False)  # requirement/design/ui/frontend/backend/test
    status = Column(String(20), default="todo")  # todo/in_progress/blocked/review/completed
    assignee_id = Column(String(36), ForeignKey("agents.id"))
    required_roles = Column(JSON)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    estimated_hours = Column(Integer)
    actual_hours = Column(Integer)
    parent_task_id = Column(String(36), ForeignKey("tasks.id"))
    dependency_ids = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    assigned_at = Column(DateTime(timezone=True))
    accepted_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    result = Column(JSON)
