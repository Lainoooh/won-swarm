from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..database import get_db
from ..models.project import Project
from ..models.requirement import Requirement
from ..models.task import Task
from ..schemas import CommonResponse, ProjectListResponse

router = APIRouter(prefix="/api/projects", tags=["项目管理"])


@router.get("", response_model=ProjectListResponse)
async def get_projects(
    status_param: str = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取项目列表
    """
    query = db.query(Project)

    if status_param:
        query = query.filter(Project.status == status_param)

    total = query.count()
    projects = query.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for project in projects:
        # 统计任务
        task_count = db.query(Task).filter(Task.project_id == project.id).count()
        completed_count = db.query(Task).filter(
            Task.project_id == project.id,
            Task.status == "completed"
        ).count()

        items.append({
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "manager_id": project.manager_id,
            "task_count": task_count,
            "completed_count": completed_count,
            "progress": int((completed_count / task_count * 100) if task_count > 0 else 0),
            "created_at": project.created_at.isoformat() if project.created_at else None
        })

    return ProjectListResponse(
        code=200,
        data={
            "total": total,
            "items": items
        }
    )


@router.post("", response_model=CommonResponse)
async def create_project(project_data: dict, db: Session = Depends(get_db)):
    """
    创建项目
    """
    project = Project(
        id=str(uuid.uuid4()),
        name=project_data.get("name"),
        description=project_data.get("description"),
        manager_id=project_data.get("manager_id"),
        status=project_data.get("status", "planning"),
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return CommonResponse(
        code=200,
        message="项目创建成功",
        data={"id": project.id}
    )


@router.get("/{project_id}", response_model=CommonResponse)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """
    获取项目详情
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # 统计信息
    task_count = db.query(Task).filter(Task.project_id == project_id).count()
    completed_count = db.query(Task).filter(
        Task.project_id == project_id,
        Task.status == "completed"
    ).count()
    requirement_count = db.query(Requirement).filter(
        Requirement.project_id == project_id
    ).count()

    return CommonResponse(
        code=200,
        data={
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "manager_id": project.manager_id,
            "task_count": task_count,
            "completed_count": completed_count,
            "requirement_count": requirement_count,
            "progress": int((completed_count / task_count * 100) if task_count > 0 else 0),
            "created_at": project.created_at.isoformat() if project.created_at else None
        }
    )


@router.put("/{project_id}", response_model=CommonResponse)
async def update_project(project_id: str, project_data: dict, db: Session = Depends(get_db)):
    """
    更新项目
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # 更新字段
    for key, value in project_data.items():
        if hasattr(project, key) and value is not None:
            setattr(project, key, value)

    db.commit()
    db.refresh(project)

    return CommonResponse(code=200, message="项目已更新")


@router.delete("/{project_id}", response_model=CommonResponse)
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    """
    删除项目
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    db.delete(project)
    db.commit()

    return CommonResponse(code=200, message="项目已删除")


@router.get("/{project_id}/requirements", response_model=CommonResponse)
async def get_project_requirements(project_id: str, db: Session = Depends(get_db)):
    """
    获取项目需求列表
    """
    requirements = db.query(Requirement).filter(
        Requirement.project_id == project_id
    ).order_by(Requirement.created_at.desc()).all()

    items = []
    for req in requirements:
        items.append({
            "id": req.id,
            "title": req.title,
            "type": req.type,
            "priority": req.priority,
            "status": req.status,
            "created_at": req.created_at.isoformat() if req.created_at else None
        })

    return CommonResponse(
        code=200,
        data={"total": len(items), "items": items}
    )


@router.get("/{project_id}/tasks", response_model=CommonResponse)
async def get_project_tasks(project_id: str, db: Session = Depends(get_db)):
    """
    获取项目任务列表
    """
    tasks = db.query(Task).filter(
        Task.project_id == project_id
    ).order_by(Task.created_at.desc()).all()

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
