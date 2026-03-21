from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============== Agent Schemas ==============

class AgentBase(BaseModel):
    """Agent 基础模型"""
    name: str
    roles: List[str]
    capabilities: Optional[List[str]] = None
    max_concurrent_tasks: int = 3


class AgentRegister(BaseModel):
    """Agent 注册请求"""
    agent_id: Optional[str] = None
    name: str
    roles: List[str]
    capabilities: Optional[List[str]] = None
    max_concurrent_tasks: int = 3


class AgentInfo(BaseModel):
    """Agent 信息响应"""
    id: str
    name: str
    roles: List[str]
    status: str
    current_task_id: Optional[str] = None
    last_heartbeat: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AgentCreateResponse(BaseModel):
    """Agent 创建响应"""
    id: str
    name: str
    platform_ak: str
    worker_sk: str
    roles: List[str]
    register_url: str
    created_at: datetime


class AgentDetailResponse(BaseModel):
    """Agent 详情响应"""
    code: int = 200
    data: AgentInfo


class AgentListResponse(BaseModel):
    """Agent 列表响应"""
    code: int = 200
    data: dict


# ============== Auth Schemas ==============

class AdminLogin(BaseModel):
    """管理员登录请求"""
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    """管理员登录响应"""
    code: int = 200
    data: dict


# ============== Task Schemas ==============

class TaskBase(BaseModel):
    """任务基础模型"""
    title: str
    description: Optional[str] = None
    type: str
    priority: str = "P2"


class TaskCreate(TaskBase):
    """任务创建请求"""
    project_id: str
    requirement_id: Optional[str] = None
    assignee_id: Optional[str] = None
    estimated_hours: Optional[int] = None


class TaskStatusUpdate(BaseModel):
    """任务状态更新请求"""
    status: str
    progress: Optional[int] = None
    message: Optional[str] = None


class TaskComplete(BaseModel):
    """任务完成请求"""
    status: str = "completed"
    result: Optional[dict] = None
    message: Optional[str] = None


class TaskInfo(BaseModel):
    """任务信息"""
    id: str
    title: str
    type: str
    status: str
    project_id: str
    requirement_id: Optional[str] = None
    assignee_id: Optional[str] = None
    created_at: datetime


class TaskListResponse(BaseModel):
    """任务列表响应"""
    code: int = 200
    data: dict


# ============== Project Schemas ==============

class ProjectBase(BaseModel):
    """项目基础模型"""
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """项目创建请求"""
    manager_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class ProjectInfo(BaseModel):
    """项目信息"""
    id: str
    name: str
    description: Optional[str]
    status: str
    manager_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """项目列表响应"""
    code: int = 200
    data: dict


# ============== Requirement Schemas ==============

class RequirementBase(BaseModel):
    """需求基础模型"""
    title: str
    description: Optional[str] = None
    type: str = "new_feature"
    priority: str = "P2"


class RequirementCreate(RequirementBase):
    """需求创建请求"""
    project_id: str


class RequirementInfo(BaseModel):
    """需求信息"""
    id: str
    title: str
    type: str
    priority: str
    status: str
    project_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Common Response ==============

class CommonResponse(BaseModel):
    """通用响应"""
    code: int = 200
    message: str = "success"
    data: Optional[dict] = None


# ============== WebSocket Messages ==============

class WSMessage(BaseModel):
    """WebSocket 消息基础模型"""
    type: str
    message_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    data: Optional[dict] = None


class WSTaskAssigned(WSMessage):
    """任务下发消息"""
    type: str = "task_assigned"


class WSTaskAck(WSMessage):
    """任务确认消息"""
    type: str = "task_ack"


class WSHeartbeat(WSMessage):
    """心跳消息"""
    type: str = "heartbeat"


class WSHeartbeatAck(WSMessage):
    """心跳响应消息"""
    type: str = "heartbeat_ack"


class WSTaskProgress(WSMessage):
    """任务进度上报消息"""
    type: str = "task_progress"


class WSTaskCompleted(WSMessage):
    """任务完成消息"""
    type: str = "task_completed"
