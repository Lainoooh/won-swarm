from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import bcrypt
import json
from typing import Dict, Optional

from ..database import get_db
from ..models.agent import Agent
from ..models.task import Task
from ..schemas import (
    AgentRegister, AgentCreateResponse, AgentListResponse,
    TaskListResponse, CommonResponse
)
from ..utils.security import generate_sk, hash_password

router = APIRouter(prefix="/api/agents", tags=["Agent 管理"])

# WebSocket 连接管理器
class WebSocketManager:
    def __init__(self):
        # agent_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        # agent_id -> session_id
        self.sessions: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, agent_id: str) -> str:
        """建立 WebSocket 连接"""
        await websocket.accept()
        session_id = str(uuid.uuid4())
        self.active_connections[agent_id] = websocket
        self.sessions[agent_id] = session_id
        return session_id

    def disconnect(self, agent_id: str):
        """断开 WebSocket 连接"""
        if agent_id in self.active_connections:
            del self.active_connections[agent_id]
        if agent_id in self.sessions:
            del self.sessions[agent_id]

    async def send_to_agent(self, agent_id: str, message: dict):
        """发送消息给指定 Agent"""
        websocket = self.active_connections.get(agent_id)
        if websocket:
            try:
                await websocket.send_json(message)
            except Exception as e:
                print(f"发送消息失败：{e}")
                self.disconnect(agent_id)

    async def broadcast(self, message: dict):
        """广播消息给所有在线 Agent"""
        for agent_id in list(self.active_connections.keys()):
            await self.send_to_agent(agent_id, message)

    def get_connected_agents(self) -> list:
        """获取所有在线 Agent ID"""
        return list(self.active_connections.keys())


# 全局 WebSocket 管理器
ws_manager = WebSocketManager()


@router.post("/register", response_model=CommonResponse)
async def register_agent(agent_data: AgentRegister, db: Session = Depends(get_db)):
    """
    Agent 注册（使用平台 AK）

    返回 Worker SK 用于后续 WebSocket 连接和 API 调用
    """
    # 生成平台 AK（一次性使用）和 Worker SK（运行态凭证）
    platform_ak = generate_sk()  # 用于注册
    worker_sk = generate_sk()    # 用于运行

    # 哈希存储
    platform_ak_hash = hash_password(platform_ak)
    worker_sk_hash = hash_password(worker_sk)

    # 创建 Agent
    agent_id = agent_data.agent_id or str(uuid.uuid4())

    agent = Agent(
        id=agent_id,
        name=agent_data.name,
        platform_ak_hash=platform_ak_hash,
        worker_sk_hash=worker_sk_hash,
        worker_sk=worker_sk,  # 明文存储（简化起见，生产环境应加密）
        roles=agent_data.roles,
        capabilities=agent_data.capabilities,
        max_concurrent_tasks=agent_data.max_concurrent_tasks,
        status="offline",
    )

    db.add(agent)
    db.commit()
    db.refresh(agent)

    return CommonResponse(
        code=200,
        message="注册成功",
        data={
            "agent_id": agent.id,
            "platform_ak": platform_ak,
            "worker_sk": worker_sk,
            "register_url": f"ws://localhost:30009/ws/agent/connect"
        }
    )


@router.get("", response_model=AgentListResponse)
async def get_agents(
    status: Optional[str] = None,
    role: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取 Agent 列表
    """
    query = db.query(Agent)

    if status:
        query = query.filter(Agent.status == status)

    if role:
        # JSON 字段查询
        query = query.filter(Agent.roles.like(f'%"{role}"%'))

    total = query.count()
    agents = query.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for agent in agents:
        items.append({
            "id": agent.id,
            "name": agent.name,
            "roles": agent.roles,
            "status": agent.status,
            "current_task_id": agent.current_task_id,
            "last_heartbeat": agent.last_heartbeat.isoformat() if agent.last_heartbeat else None,
            "created_at": agent.created_at.isoformat() if agent.created_at else None
        })

    return AgentListResponse(
        code=200,
        data={
            "total": total,
            "items": items
        }
    )


@router.get("/{agent_id}", response_model=CommonResponse)
async def get_agent(agent_id: str, db: Session = Depends(get_db)):
    """
    获取 Agent 详情
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent 不存在")

    return CommonResponse(
        code=200,
        data={
            "id": agent.id,
            "name": agent.name,
            "roles": agent.roles,
            "status": agent.status,
            "current_task_id": agent.current_task_id,
            "last_heartbeat": agent.last_heartbeat.isoformat() if agent.last_heartbeat else None,
            "created_at": agent.created_at.isoformat() if agent.created_at else None
        }
    )


@router.post("/{agent_id}/heartbeat", response_model=CommonResponse)
async def agent_heartbeat(
    agent_id: str,
    heartbeat_data: dict,
    db: Session = Depends(get_db)
):
    """
    Agent 心跳上报
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent 不存在")

    # 更新状态
    agent.status = heartbeat_data.get("status", "idle")
    agent.current_task_id = heartbeat_data.get("current_task_id")
    agent.last_heartbeat = datetime.utcnow()

    db.commit()

    return CommonResponse(code=200, message="心跳已接收")


@router.get("/{agent_id}/tasks/pending", response_model=TaskListResponse)
async def get_pending_tasks(agent_id: str, db: Session = Depends(get_db)):
    """
    获取 Agent 待处理任务（HTTP 轮询备用方案）
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent 不存在")

    tasks = db.query(Task).filter(
        Task.assignee_id == agent_id,
        Task.status == "todo"
    ).all()

    items = []
    for task in tasks:
        items.append({
            "id": task.id,
            "title": task.title,
            "type": task.type,
            "project_id": task.project_id,
            "requirement_id": task.requirement_id,
            "priority": "P2",
            "created_at": task.created_at.isoformat() if task.created_at else None
        })

    return TaskListResponse(
        code=200,
        data={"tasks": items}
    )


@router.post("/{task_id}/claim", response_model=CommonResponse)
async def claim_task(task_id: str, agent: Agent = Depends(lambda: None)):
    """
    领取任务
    """
    # TODO: 实现任务领取逻辑
    return CommonResponse(code=200, message="任务领取成功")


@router.post("/{task_id}/status", response_model=CommonResponse)
async def update_task_status(task_id: str, status_data: dict):
    """
    上报任务状态
    """
    # TODO: 实现任务状态更新逻辑
    return CommonResponse(code=200, message="状态已更新")


@router.post("/{task_id}/complete", response_model=CommonResponse)
async def complete_task(task_id: str, complete_data: dict):
    """
    完成任务
    """
    # TODO: 实现任务完成逻辑
    return CommonResponse(code=200, message="任务已完成")


# ============== WebSocket 连接 ==============

@router.websocket("/ws/connect")
async def websocket_connect(websocket: WebSocket):
    """
    Agent WebSocket 连接入口

    查询参数：sk=worker_sk
    """
    # 获取 SK 参数
    sk = websocket.query_params.get("sk")
    if not sk:
        await websocket.close(code=4001, reason="缺少 SK 参数")
        return

    # 验证 SK（简化版，实际应从数据库查询）
    # 这里先接受连接，后续在消息处理时验证

    try:
        # 建立连接（需要 agent_id，从 SK 关联或首次消息获取）
        # 简化处理：等待 Agent 发送第一条消息包含 agent_id
        await websocket.accept()

        # 等待第一条消息获取 agent_id
        data = await websocket.receive_json()
        agent_id = data.get("agent_id")

        if not agent_id:
            await websocket.close(code=4002, reason="缺少 agent_id")
            return

        # 建立连接
        session_id = await ws_manager.connect(websocket, agent_id)

        # 发送连接成功消息
        await websocket.send_json({
            "type": "connected",
            "agent_id": agent_id,
            "session_id": session_id,
            "server_time": datetime.utcnow().isoformat()
        })

        # 保持连接，处理消息
        while True:
            try:
                data = await websocket.receive_json()
                msg_type = data.get("type")

                if msg_type == "heartbeat":
                    # 心跳处理
                    await websocket.send_json({
                        "type": "heartbeat_ack",
                        "server_time": datetime.utcnow().isoformat()
                    })

                elif msg_type == "task_ack":
                    # 任务确认
                    print(f"任务确认：{data}")

                elif msg_type == "task_progress":
                    # 任务进度上报
                    print(f"任务进度：{data}")

                elif msg_type == "task_completed":
                    # 任务完成上报
                    print(f"任务完成：{data}")

            except WebSocketDisconnect:
                ws_manager.disconnect(agent_id)
                break
            except Exception as e:
                print(f"WebSocket 消息处理错误：{e}")
                break

    except WebSocketDisconnect:
        print("WebSocket 断开连接")
    except Exception as e:
        print(f"WebSocket 连接错误：{e}")
        try:
            await websocket.close()
        except Exception:
            pass
