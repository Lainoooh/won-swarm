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
    project: str
    feature: Optional[str] = None
    status: str
    assignee: Optional[str] = None
    assignee_id: Optional[str] = None
    priority: str
    due_date: Optional[date] = None
    comments: int

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    items: List[TaskSchema]
    total: int
