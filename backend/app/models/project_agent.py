"""项目-Agent 关联模型"""
from sqlalchemy import Column, String, DateTime, ForeignKey
from datetime import datetime
from .base import Base


class ProjectAgent(Base):
    """项目-Agent 关联表"""
    __tablename__ = "project_agents"

    id = Column(String(36), primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False, index=True)
    agent_id = Column(String(36), ForeignKey("agents.id"), nullable=False, index=True)
    role = Column(String(50), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
