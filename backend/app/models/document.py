from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from .base import Base


class Document(Base):
    """文档表"""
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    requirement_id = Column(String(36), ForeignKey("requirements.id"))
    task_id = Column(String(36), ForeignKey("tasks.id"))
    name = Column(String(200), nullable=False)
    original_name = Column(String(200))
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)
    uploaded_by = Column(String(36), ForeignKey("users.id"))
    version = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
