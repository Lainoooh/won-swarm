from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AgentCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    platform_ak: Optional[str] = None
    worker_sk: str = Field(..., min_length=10)
    roles: List[str] = Field(default_factory=list)
    capabilities: List[str] = Field(default_factory=list)
    model: str = Field(..., min_length=1)


class AgentUpdateSchema(BaseModel):
    name: Optional[str] = None
    roles: Optional[List[str]] = None
    capabilities: Optional[List[str]] = None
    status: Optional[str] = None
    tokens: Optional[int] = None
    linshi: Optional[int] = None


class AgentRegisterRequest(BaseModel):
    name: str
    sk: str
    roles: List[str]
    caps: List[str] = Field(default_factory=list)
    model: str


class AgentSchema(BaseModel):
    id: str
    name: str
    roles: List[str]
    status: str
    model: str
    tokens: int
    linshi: int
    current_task: Optional[str] = None
    last_heartbeat: Optional[datetime] = None
    queued_tasks: List[str] = Field(default_factory=list)

    class Config:
        from_attributes = True


class AgentListResponse(BaseModel):
    items: List[AgentSchema]
    total: int
    page: int
    page_size: int


class AgentHeartbeatRequest(BaseModel):
    status: Optional[str] = None
    task: Optional[str] = None
    progress: Optional[int] = None


class AgentStopRequest(BaseModel):
    stop: bool = True
