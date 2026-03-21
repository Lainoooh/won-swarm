from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..database import get_db
from ..models.task import Task
from ..models.requirement import Requirement

router = APIRouter(prefix="/api/tasks", tags=["任务管理"])


@router.get("", response_model=dict)
async def get_tasks(
    status_param: str = None,
    project_id: str = None,
    assignee_id: str = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取任务列表
    """
    query = db.query(Task)

    if status_param:
        query = query.filter(Task.status == status_param)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)

    total = query.count()
    tasks = query.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for task in tasks:
        items.append({
            "id": task.id,
            "title": task.title,
            "type": task.type,
            "status": task.status,
            "project_id": task.project_id,
            "requirement_id": task.requirement_id,
            "assignee_id": task.assignee_id,
            "created_at": task.created_at.isoformat() if task.created_at else None
        })

    return {
        "code": 200,
        "data": {
            "total": total,
            "items": items
        }
    }


@router.post("", response_model=dict)
async def create_task(task_data: dict, db: Session = Depends(get_db)):
    """
    创建任务
    """
    task = Task(
        id=str(uuid.uuid4()),
        requirement_id=task_data.get("requirement_id"),
        project_id=task_data.get("project_id"),
        title=task_data.get("title"),
        description=task_data.get("description"),
        type=task_data.get("type"),
        status=task_data.get("status", "todo"),
        assignee_id=task_data.get("assignee_id"),
        required_roles=task_data.get("required_roles"),
        estimated_hours=task_data.get("estimated_hours"),
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "code": 200,
        "message": "任务创建成功",
        "data": {"id": task.id}
    }


@router.get("/{task_id}", response_model=dict)
async def get_task(task_id: str, db: Session = Depends(get_db)):
    """
    获取任务详情
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    return {
        "code": 200,
        "data": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "type": task.type,
            "status": task.status,
            "project_id": task.project_id,
            "requirement_id": task.requirement_id,
            "assignee_id": task.assignee_id,
            "required_roles": task.required_roles,
            "start_date": task.start_date.isoformat() if task.start_date else None,
            "end_date": task.end_date.isoformat() if task.end_date else None,
            "estimated_hours": task.estimated_hours,
            "actual_hours": task.actual_hours,
            "created_at": task.created_at.isoformat() if task.created_at else None
        }
    }


@router.post("/{task_id}/assign", response_model=dict)
async def assign_task(task_id: str, assign_data: dict, db: Session = Depends(get_db)):
    """
    分配任务给 Agent
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    task.assignee_id = assign_data.get("agent_id")
    task.assigned_at = datetime.utcnow()
    task.status = "todo"  # 待领取

    db.commit()

    # TODO: 通过 WebSocket 通知 Agent

    return {
        "code": 200,
        "message": "任务分配成功"
    }


@router.post("/{task_id}/status", response_model=dict)
async def update_task_status(task_id: str, status_data: dict, db: Session = Depends(get_db)):
    """
    上报任务状态
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    if "status" in status_data:
        task.status = status_data["status"]
    if "progress" in status_data:
        # 可以在这里记录进度
        pass
    if "message" in status_data:
        # 可以在这里记录状态消息
        pass

    task.updated_at = datetime.utcnow()

    db.commit()

    return {
        "code": 200,
        "message": "状态已更新"
    }


@router.post("/{task_id}/complete", response_model=dict)
async def complete_task(task_id: str, complete_data: dict, db: Session = Depends(get_db)):
    """
    完成任务
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    task.status = "completed"
    task.completed_at = datetime.utcnow()
    task.result = complete_data.get("result", {})

    db.commit()

    return {
        "code": 200,
        "message": "任务已完成"
    }


@router.get("/kanban/view", response_model=dict)
async def get_kanban(
    project_id: str = None,
    assignee_id: str = None,
    db: Session = Depends(get_db)
):
    """
    获取看板视图数据
    """
    query = db.query(Task)

    if project_id:
        query = query.filter(Task.project_id == project_id)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)

    tasks = query.all()

    # 按状态分组
    columns = {
        "todo": {"label": "待处理", "tasks": []},
        "in_progress": {"label": "执行中", "tasks": []},
        "blocked": {"label": "已阻塞", "tasks": []},
        "review": {"label": "评审中", "tasks": []},
        "completed": {"label": "已完成", "tasks": []}
    }

    for task in tasks:
        if task.status in columns:
            columns[task.status]["tasks"].append({
                "id": task.id,
                "title": task.title,
                "type": task.type,
                "assignee_id": task.assignee_id
            })

    return {
        "code": 200,
        "data": {
            "columns": list(columns.values())
        }
    }
