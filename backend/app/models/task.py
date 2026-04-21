from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, func
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    req_id = Column(String, ForeignKey("requirements.id", ondelete="CASCADE"), nullable=False, index=True)
    step_idx = Column(Integer, nullable=False, default=0)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True, default="")
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    feature_id = Column(String, ForeignKey("requirements.id"), nullable=True)
    status = Column(String, nullable=False, default="pending")
    assignee_id = Column(String, ForeignKey("agents.id"), nullable=True)
    assignee_name = Column(String, nullable=True)
    priority = Column(String, nullable=False, default="P2")
    due_date = Column(Date, nullable=True)
    comments_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
