from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..database import get_db
from ..models.requirement import Requirement
from ..models.project import Project
from ..schemas import CommonResponse

router = APIRouter(prefix="/api/requirements", tags=["需求管理"])


@router.get("", response_model=CommonResponse)
async def get_requirements(
    status_param: str = None,
    project_id: str = None,
    type_param: str = None,
    priority: str = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取需求列表
    """
    query = db.query(Requirement)

    if status_param:
        query = query.filter(Requirement.status == status_param)
    if project_id:
        query = query.filter(Requirement.project_id == project_id)
    if type_param:
        query = query.filter(Requirement.type == type_param)
    if priority:
        query = query.filter(Requirement.priority == priority)

    total = query.count()
    requirements = query.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for req in requirements:
        items.append({
            "id": req.id,
            "title": req.title,
            "description": req.description,
            "type": req.type,
            "priority": req.priority,
            "status": req.status,
            "project_id": req.project_id,
            "creator_id": req.creator_id,
            "assignee_id": req.assignee_id,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None
        })

    return CommonResponse(
        code=200,
        data={"total": total, "items": items}
    )


@router.post("", response_model=CommonResponse)
async def create_requirement(req_data: dict, db: Session = Depends(get_db)):
    """
    创建需求
    """
    # 验证项目是否存在
    project = db.query(Project).filter(Project.id == req_data.get("project_id")).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    requirement = Requirement(
        id=str(uuid.uuid4()),
        project_id=req_data.get("project_id"),
        title=req_data.get("title"),
        description=req_data.get("description"),
        type=req_data.get("type", "new_feature"),
        priority=req_data.get("priority", "P2"),
        status=req_data.get("status", "pending"),
        creator_id=req_data.get("creator_id"),
        assignee_id=req_data.get("assignee_id"),
        document_ids=req_data.get("document_ids", []),
    )

    db.add(requirement)
    db.commit()
    db.refresh(requirement)

    return CommonResponse(
        code=200,
        message="需求创建成功",
        data={"id": requirement.id}
    )


@router.get("/{requirement_id}", response_model=CommonResponse)
async def get_requirement(requirement_id: str, db: Session = Depends(get_db)):
    """
    获取需求详情
    """
    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    return CommonResponse(
        code=200,
        data={
            "id": req.id,
            "title": req.title,
            "description": req.description,
            "type": req.type,
            "priority": req.priority,
            "status": req.status,
            "project_id": req.project_id,
            "creator_id": req.creator_id,
            "assignee_id": req.assignee_id,
            "document_ids": req.document_ids,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None
        }
    )


@router.put("/{requirement_id}", response_model=CommonResponse)
async def update_requirement(requirement_id: str, req_data: dict, db: Session = Depends(get_db)):
    """
    更新需求
    """
    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    # 更新字段
    for key, value in req_data.items():
        if hasattr(req, key) and value is not None:
            setattr(req, key, value)

    req.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(req)

    return CommonResponse(code=200, message="需求已更新")


@router.delete("/{requirement_id}", response_model=CommonResponse)
async def delete_requirement(requirement_id: str, db: Session = Depends(get_db)):
    """
    删除需求
    """
    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    db.delete(req)
    db.commit()

    return CommonResponse(code=200, message="需求已删除")


@router.post("/{requirement_id}/status", response_model=CommonResponse)
async def update_requirement_status(
    requirement_id: str,
    status_data: dict,
    db: Session = Depends(get_db)
):
    """
    更新需求状态
    """
    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    if "status" in status_data:
        req.status = status_data["status"]

    req.updated_at = datetime.utcnow()

    db.commit()

    return CommonResponse(code=200, message="状态已更新")


@router.get("/{requirement_id}/tasks", response_model=CommonResponse)
async def get_requirement_tasks(requirement_id: str, db: Session = Depends(get_db)):
    """
    获取需求关联的任务列表
    """
    from ..models.task import Task

    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    tasks = db.query(Task).filter(Task.requirement_id == requirement_id).all()

    items = []
    for task in tasks:
        items.append({
            "id": task.id,
            "title": task.title,
            "type": task.type,
            "status": task.status,
            "assignee_id": task.assignee_id,
            "created_at": task.created_at.isoformat() if task.created_at else None
        })

    return CommonResponse(
        code=200,
        data={"total": len(items), "items": items}
    )
