from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class RequirementCreateSchema(BaseModel):
    project_id: str
    parent_id: Optional[str] = None
    type: str = Field(..., pattern="^(module|feature)$")
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = ""
    req_type: Optional[str] = Field(None, pattern="^(new|change|bug)$")
    priority: Optional[str] = Field(None, pattern="^(P0|P1|P2|P3)$")


class RequirementUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    docs_count: Optional[int] = None
    expanded: Optional[bool] = None
    req_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    current_step: Optional[int] = None
    sort_order: Optional[int] = None


class RequirementActionSchema(BaseModel):
    action: str = Field(..., pattern="^(cancel|pause|advance|complete)$")


class RequirementSchema(BaseModel):
    id: str
    project_id: str
    parent_id: Optional[str] = None
    type: str
    title: str
    creator: str
    docs: int
    expanded: Optional[bool] = True
    req_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    current_step: Optional[int] = None
    children: Optional[List["RequirementSchema"]] = None

    class Config:
        from_attributes = True


RequirementSchema.model_rebuild()


class RequirementTreeResponse(BaseModel):
    items: List[RequirementSchema]


class BatchUpdateRequirementSchema(BaseModel):
    requirements: List[RequirementSchema]


class FeatureAssignment(BaseModel):
    """功能点及其阶段分配"""
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = ""
    req_type: str = Field(default="new", pattern="^(new|change|bug)$")
    priority: str = Field(default="P2", pattern="^(P0|P1|P2|P3)$")
    phase_assignments: dict[str, List[str]] = {}  # {"UI 设计": ["ag-001"], ...}


class RequirementModuleCreateSchema(BaseModel):
    """创建需求大纲（模块）带功能点"""
    project_id: str
    type: str = Field(default="module", literal="module")
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = ""
    features: Optional[List[FeatureAssignment]] = None
