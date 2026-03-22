from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..database import get_db
from ..models.requirement import Requirement
from ..models.project import Project
from ..schemas import CommonResponse

router = APIRouter(prefix="/api/requirements", tags=["需求管理"])


def build_requirement_tree(requirements: list, parent_id: str = None) -> list:
    """构建需求树形结构"""
    tree = []
    for req in requirements:
        if req.get("parent_id") == parent_id:
            children = build_requirement_tree(requirements, req["id"])
            req["children"] = children
            req["has_children"] = len(children) > 0
            tree.append(req)
    return tree


@router.get("", response_model=CommonResponse)
async def get_requirements(
    status_param: str = None,
    project_id: str = None,
    type_param: str = None,
    priority: str = None,
    level: str = None,
    parent_id: str = None,  # 查询指定父需求的子需求
    tree: bool = False,     # 是否返回树形结构
    page: int = 1,
    page_size: int = 100,
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
    if level:
        query = query.filter(Requirement.level == level)
    if parent_id:
        query = query.filter(Requirement.parent_id == parent_id)

    total = query.count()
    requirements = query.order_by(Requirement.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for req in requirements:
        items.append({
            "id": req.id,
            "title": req.title,
            "description": req.description,
            "type": req.type,
            "priority": req.priority,
            "status": req.status,
            "level": req.level,
            "parent_id": req.parent_id,
            "epic_id": req.epic_id,
            "project_id": req.project_id,
            "creator_id": req.creator_id,
            "assignee_id": req.assignee_id,
            "document_ids": req.document_ids or [],
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None
        })

    # 如果请求树形结构，构建树
    if tree:
        tree_data = build_requirement_tree(items, None)
        return CommonResponse(
            code=200,
            data={"total": total, "items": tree_data, "tree": True}
        )

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

    # 如果是子需求，设置 epic_id
    epic_id = req_data.get("epic_id")
    level = req_data.get("level", "epic")
    parent_id = req_data.get("parent_id")

    # 如果没有传入 epic_id，但有 parent_id，查找父需求的 epic_id
    if level != "epic" and not epic_id and parent_id:
        parent = db.query(Requirement).filter(Requirement.id == parent_id).first()
        if parent:
            epic_id = parent.epic_id or parent.id

    requirement = Requirement(
        id=str(uuid.uuid4()),
        project_id=req_data.get("project_id"),
        title=req_data.get("title"),
        description=req_data.get("description"),
        type=req_data.get("type", "new_feature"),
        priority=req_data.get("priority", "P2"),
        status=req_data.get("status", "pending"),
        level=level,
        parent_id=parent_id,
        epic_id=epic_id,
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
            "level": req.level,
            "parent_id": req.parent_id,
            "epic_id": req.epic_id,
            "project_id": req.project_id,
            "creator_id": req.creator_id,
            "assignee_id": req.assignee_id,
            "document_ids": req.document_ids or [],
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None
        }
    )


@router.get("/{requirement_id}/children", response_model=CommonResponse)
async def get_requirement_children(requirement_id: str, db: Session = Depends(get_db)):
    """
    获取需求的子需求列表
    """
    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    children = db.query(Requirement).filter(Requirement.parent_id == requirement_id).all()

    items = []
    for child in children:
        items.append({
            "id": child.id,
            "title": child.title,
            "description": child.description,
            "type": child.type,
            "priority": child.priority,
            "status": child.status,
            "level": child.level,
            "parent_id": child.parent_id,
            "epic_id": child.epic_id,
            "project_id": child.project_id,
            "assignee_id": child.assignee_id,
            "document_ids": child.document_ids or [],
            "created_at": child.created_at.isoformat() if child.created_at else None,
            "updated_at": child.updated_at.isoformat() if child.updated_at else None
        })

    return CommonResponse(
        code=200,
        data={"total": len(items), "items": items}
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
        if hasattr(req, key) and value is not None and key not in ["id", "project_id", "created_at", "updated_at"]:
            setattr(req, key, value)

    req.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(req)

    return CommonResponse(code=200, message="需求已更新")


@router.delete("/{requirement_id}", response_model=CommonResponse)
async def delete_requirement(requirement_id: str, db: Session = Depends(get_db)):
    """
    删除需求（级联删除子需求）
    """
    req = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="需求不存在")

    # 递归删除所有子需求
    def delete_children(parent_id):
        children = db.query(Requirement).filter(Requirement.parent_id == parent_id).all()
        for child in children:
            delete_children(child.id)
            db.delete(child)

    delete_children(requirement_id)
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
