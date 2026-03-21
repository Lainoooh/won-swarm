"""项目 Agent 服务"""
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.project_agent import ProjectAgent
from ..models.agent import Agent


class ProjectAgentService:
    """项目 Agent 服务类"""

    def __init__(self, db: Session):
        self.db = db

    def add_agent_to_project(
        self,
        project_id: str,
        agent_id: str,
        role: str
    ) -> ProjectAgent:
        """添加 Agent 到项目"""
        # 检查是否已存在
        existing = self.db.query(ProjectAgent).filter(
            ProjectAgent.project_id == project_id,
            ProjectAgent.agent_id == agent_id
        ).first()

        if existing:
            raise ValueError("Agent 已在项目中")

        # 验证 Agent 存在
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        if not agent:
            raise ValueError("Agent 不存在")

        project_agent = ProjectAgent(
            id=str(uuid.uuid4()),
            project_id=project_id,
            agent_id=agent_id,
            role=role,
            joined_at=datetime.utcnow()
        )

        self.db.add(project_agent)
        self.db.commit()
        self.db.refresh(project_agent)
        return project_agent

    def remove_agent_from_project(
        self,
        project_id: str,
        agent_id: str
    ) -> bool:
        """从项目中移除 Agent"""
        project_agent = self.db.query(ProjectAgent).filter(
            ProjectAgent.project_id == project_id,
            ProjectAgent.agent_id == agent_id
        ).first()

        if not project_agent:
            return False

        self.db.delete(project_agent)
        self.db.commit()
        return True

    def get_project_agents(
        self,
        project_id: str
    ) -> List[ProjectAgent]:
        """获取项目的所有 Agent 成员"""
        return self.db.query(ProjectAgent).filter(
            ProjectAgent.project_id == project_id
        ).all()

    def get_agent_projects(
        self,
        agent_id: str
    ) -> List[ProjectAgent]:
        """获取 Agent 参与的所有项目"""
        return self.db.query(ProjectAgent).filter(
            ProjectAgent.agent_id == agent_id
        ).all()

    def get_agent_role_in_project(
        self,
        project_id: str,
        agent_id: str
    ) -> Optional[str]:
        """获取 Agent 在项目中的角色"""
        project_agent = self.db.query(ProjectAgent).filter(
            ProjectAgent.project_id == project_id,
            ProjectAgent.agent_id == agent_id
        ).first()

        return project_agent.role if project_agent else None
