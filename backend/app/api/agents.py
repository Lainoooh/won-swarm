from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import select, func, or_, String
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
import uuid
import hashlib

from app.database import get_db, async_session_maker
from app.models.agent import Agent
from app.models.task import Task
from app.schemas.agent import (
    AgentCreateSchema,
    AgentUpdateSchema,
    AgentRegisterRequest,
    AgentSchema,
    AgentListResponse,
    AgentHeartbeatRequest,
    AgentStopRequest,
)
from app.services.websocket_manager import manager
from app.config import settings

router = APIRouter(prefix="/api/agents", tags=["Agents"])


def generate_agent_id() -> str:
    return f"ag-{uuid.uuid4().hex[:4]}"


def hash_sk(sk: str) -> str:
    return hashlib.sha256(sk.encode()).hexdigest()[:16]


@router.get("", response_model=AgentListResponse)
async def get_agents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
):
    async with async_session_maker() as session:
        query = select(Agent)

        if status:
            query = query.where(Agent.status == status)

        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    Agent.name.like(search_pattern),
                    Agent.roles.cast(String).like(search_pattern),
                )
            )

        query = query.order_by(Agent.last_heartbeat.desc())

        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await session.execute(query)
        agents = result.scalars().all()

        count_query = select(func.count(Agent.id))
        if status:
            count_query = count_query.where(Agent.status == status)
        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        return AgentListResponse(
            items=[AgentSchema.model_validate(a) for a in agents],
            total=total,
            page=page,
            page_size=page_size,
        )


@router.get("/{agent_id}", response_model=AgentSchema)
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return AgentSchema.model_validate(agent)


@router.post("", response_model=AgentSchema)
async def create_agent(data: AgentCreateSchema, db: AsyncSession = Depends(get_db)):
    # 如果没有传入 worker_sk，自动生成一个
    if not data.worker_sk:
        import secrets
        data.worker_sk = f"sk_{secrets.token_hex(8)}"

    sk_hash = hash_sk(data.worker_sk)
    existing = await db.execute(select(Agent).where(Agent.worker_sk_hash == sk_hash))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Worker SK already registered")

    agent_id = generate_agent_id()

    agent = Agent(
        id=agent_id,
        name=data.name,
        platform_ak_hash=hash_sk(data.platform_ak) if data.platform_ak else None,
        worker_sk_hash=sk_hash,
        roles=data.roles,
        capabilities=data.capabilities or [],
        model=data.model,
        status="offline",
        tokens=0,
        linshi=0,
    )

    db.add(agent)
    await db.commit()
    await db.refresh(agent)

    await manager.broadcast_agent_status(agent_id, "offline")

    return AgentSchema.model_validate(agent)


@router.put("/{agent_id}", response_model=AgentSchema)
async def update_agent(agent_id: str, data: AgentUpdateSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    await db.commit()
    await db.refresh(agent)

    if "status" in update_data:
        await manager.broadcast_agent_status(agent_id, agent.status)

    return AgentSchema.model_validate(agent)


@router.delete("/{agent_id}")
async def delete_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    await db.delete(agent)
    await db.commit()

    await manager.broadcast_agent_status(agent_id, "offline")

    return {"success": True}


@router.post("/{agent_id}/stop", response_model=AgentSchema)
async def stop_agent(agent_id: str, data: AgentStopRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.status = "offline" if data.stop else "idle"

    await db.commit()
    await db.refresh(agent)

    await manager.broadcast_agent_status(agent_id, agent.status)

    return AgentSchema.model_validate(agent)


@router.post("/register", response_model=dict)
async def register_agent(data: AgentRegisterRequest, db: AsyncSession = Depends(get_db)):
    if not data.sk.startswith("sk_"):
        raise HTTPException(status_code=400, detail="Invalid SK format")

    sk_hash = hash_sk(data.sk)
    existing = await db.execute(select(Agent).where(Agent.worker_sk_hash == sk_hash))
    if existing.scalar_one_or_none():
        return {"id": existing.scalar_one().id, "sk": data.sk}

    agent_id = generate_agent_id()

    agent = Agent(
        id=agent_id,
        name=data.name,
        worker_sk_hash=sk_hash,
        roles=data.roles,
        capabilities=data.caps,
        model=data.model,
        status="offline",
        tokens=0,
        linshi=0,
    )

    db.add(agent)
    await db.commit()

    return {"id": agent_id, "sk": data.sk}


@router.post("/{agent_id}/heartbeat")
async def heartbeat(agent_id: str, data: AgentHeartbeatRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.last_heartbeat = datetime.now()
    if data.status:
        agent.status = data.status
    if data.task:
        agent.current_task_id = data.task
    if data.progress is not None:
        await manager.broadcast_progress_update(agent_id, data.task or "", data.progress)

    await db.commit()

    await manager.broadcast_agent_status(agent_id, agent.status, {
        "task": data.task,
        "progress": data.progress,
    })

    return {"success": True}


@router.post("/{agent_id}/task/assign")
async def assign_task_to_agent(agent_id: str, task_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if not manager.get_agent_status(agent_id):
        raise HTTPException(status_code=400, detail="Agent is offline")

    agent.current_task_id = task_id
    agent.status = "busy"
    await db.commit()

    task_result = await db.execute(select(Task).where(Task.id == task_id))
    task = task_result.scalar_one_or_none()

    if task:
        task_data = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "req_id": task.req_id,
            "step_idx": task.step_idx,
            "priority": task.priority,
            "due_date": str(task.due_date) if task.due_date else None,
        }
        await manager.send_task_to_agent(agent_id, task_data)

    await manager.broadcast_agent_status(agent_id, "busy", {"task": task_id})

    return {"success": True, "task_id": task_id}


@router.websocket("/ws/{agent_id}")
async def websocket_agent(websocket: WebSocket, agent_id: str):
    async with async_session_maker() as session:
        result = await session.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()

        if not agent:
            await websocket.close(code=4004, reason="Agent not found")
            return

    connected = await manager.connect_agent(websocket, agent_id)
    if not connected:
        return

    try:
        async with async_session_maker() as session:
            result = await session.execute(select(Agent).where(Agent.id == agent_id))
            agent = result.scalar_one_or_none()
            if agent:
                agent.status = "online"
                agent.last_heartbeat = datetime.now()
                agent.websocket_session_id = id(websocket)
                await session.commit()

        await manager.broadcast_agent_status(agent_id, "online")

        while True:
            try:
                data = await websocket.receive_json()
                msg_type = data.get("type")
                if msg_type == "heartbeat":
                    await websocket.send_json({"type": "heartbeat_ack"})
                elif msg_type == "task_complete":
                    task_id = data.get("task_id")
                    print(f"[WS] Agent {agent_id} completed task {task_id}")
                    await manager.broadcast_task_update({"id": task_id, "status": "completed"})
                elif msg_type == "progress":
                    progress = data.get("progress")
                    task_id = data.get("task_id")
                    await manager.broadcast_progress_update(agent_id, task_id, progress)

            except WebSocketDisconnect:
                break
            except Exception as e:
                print(f"[WS] Error processing message from {agent_id}: {e}")
                break

    finally:
        manager.disconnect_agent(agent_id)
        async with async_session_maker() as session:
            result = await session.execute(select(Agent).where(Agent.id == agent_id))
            agent = result.scalar_one_or_none()
            if agent:
                agent.status = "offline"
                agent.websocket_session_id = None
                await session.commit()

        await manager.broadcast_agent_status(agent_id, "offline")
