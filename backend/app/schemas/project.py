from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime


class ProjectCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = ""
    manager_id: str
    manager_name: str
    start_date: date
    end_date: date


class ProjectUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager_id: Optional[str] = None
    manager_name: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    progress: Optional[int] = Field(None, ge=0, le=100)


class ProjectSchema(BaseModel):
    id: str
    name: str
    description: str
    manager_id: str
    manager_name: str
    status: str
    current_step: int = 1  # 1=需求设计，2=UI 设计，3=概要设计，4=详细设计，5=系统研发，6=系统测试，7=项目验收
    start_date: date
    end_date: date
    progress: int
    req_count: int
    task_count: int

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    items: List[ProjectSchema]
    total: int
    page: int
    page_size: int
