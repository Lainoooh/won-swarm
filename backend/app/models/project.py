from sqlalchemy import Column, String, Integer, Date, DateTime, func
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True, default="")
    manager_id = Column(String, nullable=False)
    manager_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="planning", index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    progress = Column(Integer, nullable=False, default=0)
    req_count = Column(Integer, nullable=False, default=0)
    task_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
