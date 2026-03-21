from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from .base import Base


class User(Base):
    """管理员用户表"""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
