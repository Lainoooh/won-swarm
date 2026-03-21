"""任务服务"""
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from ..models.task import Task
from ..models.agent import Agent


class TaskService:
    """任务服务类"""

    def __init__(self, db: Session):
        self.db = db

    def create_task(
        self,
        title: str,
        type: str,
        project_id: str,
        requirement_id: Optional[str] = None,
        description: Optional[str] = None,
        assignee_id: Optional[str] = None,
        estimated_hours: Optional[int] = None,
        priority: str = "P2"
    ) -> Task:
        """创建任务"""
        import uuid

        task = Task(
            id=str(uuid.uuid4()),
            title=title,
            type=type,
            project_id=project_id,
            requirement_id=requirement_id,
            description=description,
            assignee_id=assignee_id,
            estimated_hours=estimated_hours,
            status="todo"
        )

        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_task_by_id(self, task_id: str) -> Optional[Task]:
        """根据 ID 获取任务"""
        return self.db.query(Task).filter(Task.id == task_id).first()

    def assign_task(self, task_id: str, assignee_id: str) -> Optional[Task]:
        """分配任务"""
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        task.assignee_id = assignee_id
        task.assigned_at = datetime.utcnow()
        task.status = "todo"
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task_status(self, task_id: str, status: str, **kwargs) -> Optional[Task]:
        """更新任务状态"""
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        task.status = status
        if "progress" in kwargs:
            if task.result is None:
                task.result = {}
            task.result["progress"] = kwargs["progress"]
        if "message" in kwargs:
            if task.result is None:
                task.result = {}
            task.result["status_message"] = kwargs["message"]

        task.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(task)
        return task

    def complete_task(self, task_id: str, result: Optional[Dict] = None) -> Optional[Task]:
        """完成任务"""
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        task.status = "completed"
        task.completed_at = datetime.utcnow()
        if result:
            task.result = result

        # 释放 Agent
        if task.assignee_id:
            agent = self.db.query(Agent).filter(Agent.id == task.assignee_id).first()
            if agent:
                agent.status = "idle"
                agent.current_task_id = None

        self.db.commit()
        return task

    def get_tasks(
        self,
        status: Optional[str] = None,
        project_id: Optional[str] = None,
        assignee_id: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple:
        """获取任务列表"""
        query = self.db.query(Task)

        if status:
            query = query.filter(Task.status == status)
        if project_id:
            query = query.filter(Task.project_id == project_id)
        if assignee_id:
            query = query.filter(Task.assignee_id == assignee_id)

        total = query.count()
        tasks = query.offset((page - 1) * page_size).limit(page_size).all()

        return tasks, total

    def get_kanban_data(
        self,
        project_id: Optional[str] = None,
        assignee_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """获取看板数据"""
        query = self.db.query(Task)

        if project_id:
            query = query.filter(Task.project_id == project_id)
        if assignee_id:
            query = query.filter(Task.assignee_id == assignee_id)

        tasks = query.all()

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
                    "assignee_id": task.assignee_id,
                    "priority": getattr(task, 'priority', 'P2')
                })

        return {"columns": list(columns.values())}
