from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime


class TaskCreateSchema(BaseModel):
    req_id: str
    step_idx: int = 0
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = ""
    project_id: str
    feature_id: Optional[str] = None
    assignee_id: Optional[str] = None
    assignee_name: Optional[str] = None
    priority: str = Field(default="P2", pattern="^(P0|P1|P2|P3)$")
    due_date: Optional[date] = None


class TaskUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignee_id: Optional[str] = None
    assignee_name: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None
    comments_count: Optional[int] = None


class TaskAssignSchema(BaseModel):
    agent_id: str


class TaskSchema(BaseModel):
    id: str
    req_id: str
    step_idx: int
    title: str
    description: Optional[str] = ""
    project_id: str
    feature_id: Optional[str] = None
    status: str
    assignee: Optional[str] = None
    assignee_id: Optional[str] = None
    assignee_name: Optional[str] = None
    priority: str
    due_date: Optional[date] = None
    comments: int = 0

    class Config:
        from_attributes = True
        extra = "ignore"

    @classmethod
    def model_validate(cls, obj):
        # 手动映射 comments_count -> comments
        data = {key: getattr(obj, key) for key in cls.model_fields.keys() if hasattr(obj, key)}
        if hasattr(obj, 'comments_count'):
            data['comments'] = obj.comments_count
        # 处理 assignee_name -> assignee 映射
        if not data.get('assignee') and data.get('assignee_name'):
            data['assignee'] = data['assignee_name']
        return cls(**data)


class TaskListResponse(BaseModel):
    items: List[TaskSchema]
    total: int
