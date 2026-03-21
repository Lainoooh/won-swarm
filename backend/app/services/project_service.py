"""项目服务"""
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from ..models.project import Project
from ..models.task import Task
from ..models.requirement import Requirement


class ProjectService:
    """项目服务类"""

    def __init__(self, db: Session):
        self.db = db

    def create_project(
        self,
        name: str,
        description: Optional[str] = None,
        manager_id: Optional[str] = None,
        status: str = "planning"
    ) -> Project:
        """创建项目"""
        import uuid

        project = Project(
            id=str(uuid.uuid4()),
            name=name,
            description=description,
            manager_id=manager_id,
            status=status
        )

        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def get_project_by_id(self, project_id: str) -> Optional[Project]:
        """根据 ID 获取项目"""
        return self.db.query(Project).filter(Project.id == project_id).first()

    def get_projects(
        self,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple:
        """获取项目列表"""
        query = self.db.query(Project)

        if status:
            query = query.filter(Project.status == status)

        total = query.count()
        projects = query.offset((page - 1) * page_size).limit(page_size).all()

        return projects, total

    def get_project_statistics(self, project_id: str) -> Dict[str, Any]:
        """获取项目统计信息"""
        task_count = self.db.query(Task).filter(Task.project_id == project_id).count()
        completed_count = self.db.query(Task).filter(
            Task.project_id == project_id,
            Task.status == "completed"
        ).count()
        requirement_count = self.db.query(Requirement).filter(
            Requirement.project_id == project_id
        ).count()

        return {
            "task_count": task_count,
            "completed_tasks": completed_count,
            "requirement_count": requirement_count,
            "progress": int((completed_count / task_count * 100) if task_count > 0 else 0)
        }

    def update_project(self, project_id: str, **kwargs) -> Optional[Project]:
        """更新项目"""
        project = self.get_project_by_id(project_id)
        if not project:
            return None

        for key, value in kwargs.items():
            if hasattr(project, key) and value is not None:
                setattr(project, key, value)

        project.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(project)
        return project

    def delete_project(self, project_id: str) -> bool:
        """删除项目"""
        project = self.get_project_by_id(project_id)
        if not project:
            return False

        self.db.delete(project)
        self.db.commit()
        return True
