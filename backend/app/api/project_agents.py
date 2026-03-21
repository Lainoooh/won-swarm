"""项目 Agent 管理 API"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..api.deps import get_db
from ..services.project_agent_service import ProjectAgentService

router = APIRouter(prefix="/api/projects", tags=["项目 Agent 管理"])


class ProjectAgentCreate(BaseModel):
    agent_id: str
    role: str


class ProjectAgentResponse(BaseModel):
    id: str
    project_id: str
    agent_id: str
    role: str
    joined_at: str


@router.get("/{project_id}/agents")
def get_project_agents(
    project_id: str,
    db: Session = Depends(get_db)
):
    """获取项目的所有 Agent 成员"""
    service = ProjectAgentService(db)
    agents = service.get_project_agents(project_id)

    return {
        "code": 200,
        "data": {
            "items": [
                {
                    "id": pa.id,
                    "project_id": pa.project_id,
                    "agent_id": pa.agent_id,
                    "role": pa.role,
                    "joined_at": pa.joined_at.isoformat() if pa.joined_at else None
                }
                for pa in agents
            ]
        }
    }


@router.post("/{project_id}/agents")
def add_agent_to_project(
    project_id: str,
    agent_data: ProjectAgentCreate,
    db: Session = Depends(get_db)
):
    """添加 Agent 到项目"""
    service = ProjectAgentService(db)

    try:
        project_agent = service.add_agent_to_project(
            project_id=project_id,
            agent_id=agent_data.agent_id,
            role=agent_data.role
        )

        return {
            "code": 200,
            "data": {
                "id": project_agent.id,
                "project_id": project_agent.project_id,
                "agent_id": project_agent.agent_id,
                "role": project_agent.role,
                "joined_at": project_agent.joined_at.isoformat() if project_agent.joined_at else None
            }
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{project_id}/agents/{agent_id}")
def remove_agent_from_project(
    project_id: str,
    agent_id: str,
    db: Session = Depends(get_db)
):
    """从项目中移除 Agent"""
    service = ProjectAgentService(db)
    success = service.remove_agent_from_project(project_id, agent_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目与 Agent 的关联不存在"
        )

    return {"code": 200, "message": "移除成功"}


@router.get("/{project_id}/agents/{agent_id}/role")
def get_agent_role(
    project_id: str,
    agent_id: str,
    db: Session = Depends(get_db)
):
    """获取 Agent 在项目中的角色"""
    service = ProjectAgentService(db)
    role = service.get_agent_role_in_project(project_id, agent_id)

    if role is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent 不在该项目中"
        )

    return {
        "code": 200,
        "data": {
            "role": role
        }
    }
