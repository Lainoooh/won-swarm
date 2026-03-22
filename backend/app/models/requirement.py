from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
import enum
from .base import Base


class RequirementLevel(str, enum.Enum):
    """需求层级"""
    EPIC = "epic"       # 大需求/模块级
    FEATURE = "feature" # 子需求/功能级
    TASK = "task"       # 执行任务级


class RequirementType(str, enum.Enum):
    """需求类型"""
    NEW_FEATURE = "new_feature"
    CHANGE_REQUEST = "change_request"
    FIX_REQUEST = "fix_request"
    BUG_FIX = "bug_fix"
    OPTIMIZATION = "optimization"


class RequirementStatus(str, enum.Enum):
    """需求状态"""
    PENDING = "pending"           # 待评审
    REVIEWING = "reviewing"       # 已评审
    IN_DESIGN = "in_design"       # 设计中
    IN_DEVELOPMENT = "in_development"  # 开发中
    TESTING = "testing"           # 测试中
    COMPLETED = "completed"       # 已完成


class Requirement(Base):
    """需求表"""
    __tablename__ = "requirements"

    id = Column(String(36), primary_key=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)

    # 基本信息
    title = Column(String(200), nullable=False)
    description = Column(String)

    # 层级关系
    level = Column(String(10), default="epic")  # epic/feature/task
    parent_id = Column(String(36), ForeignKey("requirements.id"))  # 父需求 ID
    epic_id = Column(String(36), ForeignKey("requirements.id"))  # 所属大需求 ID（顶层需求）

    # 分类和状态
    type = Column(String(30), default="new_feature")
    priority = Column(String(10), default="P2")  # P0/P1/P2/P3
    status = Column(String(20), default="pending")

    # 人员关联
    creator_id = Column(String(36), ForeignKey("users.id"))
    assignee_id = Column(String(36), ForeignKey("agents.id"))

    # 文档关联 - 存储文档 ID 和类型
    # [{"doc_id": "xxx", "doc_name": "xxx", "type": "requirement_design"},
    #  {"doc_id": "yyy", "doc_name": "xxx", "type": "high_design"},
    #  {"doc_id": "zzz", "doc_name": "xxx", "type": "detail_design"}]
    document_ids = Column(JSON, default=list)

    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
