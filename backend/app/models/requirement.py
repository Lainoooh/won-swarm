from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from .base import Base


class Requirement(Base):
    """需求表"""
    __tablename__ = "requirements"

    id = Column(String(36), primary_key=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String)
    type = Column(String(30), default="new_feature")  # new_feature/change_request/fix_request/bug_fix/optimization
    priority = Column(String(10), default="P2")  # P0/P1/P2/P3
    status = Column(String(20), default="pending")  # pending/reviewing/approved/in_development/testing/completed
    creator_id = Column(String(36), ForeignKey("users.id"))
    assignee_id = Column(String(36), ForeignKey("agents.id"))
    document_ids = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
