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
    req_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    current_step: Optional[int] = None
    sort_order: Optional[int] = None
    expanded: Optional[bool] = None


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
