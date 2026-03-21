from sqlalchemy import Column, String, Integer, Date, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from .base import Base


class Project(Base):
    """项目表"""
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String)
    manager_id = Column(String(36), ForeignKey("users.id"))
    status = Column(String(20), default="planning")  # planning/in_progress/completed/archived
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
