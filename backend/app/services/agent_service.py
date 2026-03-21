"""Agent 服务"""
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from ..models.agent import Agent
from ..models.task import Task
from ..utils.security import generate_sk, hash_password


class AgentService:
    """Agent 服务类"""

    def __init__(self, db: Session):
        self.db = db

    def register_agent(
        self,
        name: str,
        roles: List[str],
        capabilities: Optional[List[str]] = None,
        max_concurrent_tasks: int = 3,
        agent_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """注册 Agent"""
        import uuid

        # 生成凭证
        platform_ak = generate_sk()
        worker_sk = generate_sk()

        # 创建 Agent
        agent = Agent(
            id=agent_id or str(uuid.uuid4()),
            name=name,
            platform_ak_hash=hash_password(platform_ak),
            worker_sk_hash=hash_password(worker_sk),
            worker_sk=worker_sk,
            roles=roles,
            capabilities=capabilities or [],
            max_concurrent_tasks=max_concurrent_tasks,
            status="offline"
        )

        self.db.add(agent)
        self.db.commit()
        self.db.refresh(agent)

        return {
            "agent": agent,
            "platform_ak": platform_ak,
            "worker_sk": worker_sk
        }

    def get_agent_by_id(self, agent_id: str) -> Optional[Agent]:
        """根据 ID 获取 Agent"""
        return self.db.query(Agent).filter(Agent.id == agent_id).first()

    def get_agents(
        self,
        status: Optional[str] = None,
        role: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple:
        """获取 Agent 列表"""
        query = self.db.query(Agent)

        if status:
            query = query.filter(Agent.status == status)
        if role:
            query = query.filter(Agent.roles.like(f'%"{role}"%'))

        total = query.count()
        agents = query.offset((page - 1) * page_size).limit(page_size).all()

        return agents, total

    def update_heartbeat(self, agent_id: str, status: str, current_task_id: Optional[str] = None) -> bool:
        """更新心跳"""
        agent = self.get_agent_by_id(agent_id)
        if not agent:
            return False

        agent.status = status
        agent.current_task_id = current_task_id
        agent.last_heartbeat = datetime.utcnow()
        self.db.commit()
        return True

    def get_pending_tasks(self, agent_id: str) -> List[Task]:
        """获取 Agent 待处理任务"""
        return self.db.query(Task).filter(
            Task.assignee_id == agent_id,
            Task.status == "todo"
        ).all()
