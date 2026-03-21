"""任务分配服务"""
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.task_assignment import TaskAssignment
from ..models.task import Task
from ..models.agent import Agent


class TaskAssignmentService:
    """任务分配服务类"""

    def __init__(self, db: Session):
        self.db = db

    def assign_task(
        self,
        task_id: str,
        assignee_id: str,
        assigned_by: Optional[str] = None,
        reason: Optional[str] = None
    ) -> TaskAssignment:
        """分配任务给 Agent"""
        # 验证任务存在
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise ValueError("任务不存在")

        # 验证 Agent 存在
        if assignee_id:
            agent = self.db.query(Agent).filter(Agent.id == assignee_id).first()
            if not agent:
                raise ValueError("Agent 不存在")

        # 确定操作类型
        if task.assignee_id and task.assignee_id != assignee_id:
            action = "reassigned"
        elif assignee_id:
            action = "assigned"
        else:
            action = "unassigned"

        assignment = TaskAssignment(
            id=str(uuid.uuid4()),
            task_id=task_id,
            assignee_id=assignee_id,
            assigned_by=assigned_by,
            action=action,
            reason=reason,
            created_at=datetime.utcnow()
        )

        self.db.add(assignment)
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def get_task_assignments(
        self,
        task_id: str
    ) -> List[TaskAssignment]:
        """获取任务的分配历史"""
        return self.db.query(TaskAssignment).filter(
            TaskAssignment.task_id == task_id
        ).order_by(TaskAssignment.created_at.desc()).all()

    def get_agent_assignments(
        self,
        agent_id: str,
        limit: int = 10
    ) -> List[TaskAssignment]:
        """获取 Agent 的任务分配记录"""
        return self.db.query(TaskAssignment).filter(
            TaskAssignment.assignee_id == agent_id
        ).order_by(TaskAssignment.created_at.desc()).limit(limit).all()
