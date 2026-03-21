"""任务分配记录 API"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from ..api.deps import get_db, get_current_user
from ..services.task_assignment_service import TaskAssignmentService

router = APIRouter(prefix="/api/task-assignments", tags=["任务分配记录"])


@router.get("/task/{task_id}")
def get_task_assignments(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """获取任务的分配历史"""
    service = TaskAssignmentService(db)
    assignments = service.get_task_assignments(task_id)

    return {
        "code": 200,
        "data": {
            "items": [
                {
                    "id": a.id,
                    "task_id": a.task_id,
                    "assignee_id": a.assignee_id,
                    "assigned_by": a.assigned_by,
                    "action": a.action,
                    "reason": a.reason,
                    "created_at": a.created_at.isoformat() if a.created_at else None
                }
                for a in assignments
            ]
        }
    }


@router.get("/agent/{agent_id}")
def get_agent_assignments(
    agent_id: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """获取 Agent 的任务分配记录"""
    service = TaskAssignmentService(db)
    assignments = service.get_agent_assignments(agent_id, limit)

    return {
        "code": 200,
        "data": {
            "items": [
                {
                    "id": a.id,
                    "task_id": a.task_id,
                    "assignee_id": a.assignee_id,
                    "assigned_by": a.assigned_by,
                    "action": a.action,
                    "reason": a.reason,
                    "created_at": a.created_at.isoformat() if a.created_at else None
                }
                for a in assignments
            ]
        }
    }
