from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(String, ForeignKey("requirements.id", ondelete="CASCADE"), nullable=True, index=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True, default="")
    creator = Column(String, nullable=False, default="Admin")
    docs_count = Column(Integer, nullable=False, default=0)
    sort_order = Column(Integer, nullable=False, default=0)
    expanded = Column(Boolean, nullable=True, default=True)

    req_type = Column(String, nullable=True)
    priority = Column(String, nullable=True)
    status = Column(String, nullable=True)
    current_step = Column(Integer, nullable=True, default=0)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    children = relationship("Requirement", backref="parent_module", remote_side=[id])
