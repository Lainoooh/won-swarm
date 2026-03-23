import asyncio
from typing import Dict, Set, Optional
from fastapi import WebSocket
from datetime import datetime


class ConnectionManager:
    def __init__(self):
        self.agent_connections: Dict[str, WebSocket] = {}
        self.client_connections: Dict[str, WebSocket] = {}
        self.agent_subscribers: Dict[str, Set[str]] = {}

    async def connect_agent(self, websocket: WebSocket, agent_id: str) -> bool:
        await websocket.accept()
        self.agent_connections[agent_id] = websocket
        print(f"[WS] Agent {agent_id} connected")
        return True

    def disconnect_agent(self, agent_id: str):
        if agent_id in self.agent_connections:
            del self.agent_connections[agent_id]
        print(f"[WS] Agent {agent_id} disconnected")

    async def connect_client(self, websocket: WebSocket, session_id: str) -> bool:
        await websocket.accept()
        self.client_connections[session_id] = websocket
        print(f"[WS] Client {session_id} connected")
        return True

    def disconnect_client(self, session_id: str):
        if session_id in self.client_connections:
            del self.client_connections[session_id]
        for agent_id in self.agent_subscribers:
            if session_id in self.agent_subscribers[agent_id]:
                self.agent_subscribers[agent_id].discard(session_id)
        print(f"[WS] Client {session_id} disconnected")

    async def send_to_agent(self, agent_id: str, data: dict) -> bool:
        if agent_id in self.agent_connections:
            try:
                await self.agent_connections[agent_id].send_json(data)
                return True
            except Exception as e:
                print(f"[WS] Error sending to agent {agent_id}: {e}")
                self.disconnect_agent(agent_id)
        return False

    async def broadcast_to_clients(self, data: dict):
        disconnected = []
        for session_id, websocket in self.client_connections.items():
            try:
                await websocket.send_json(data)
            except Exception as e:
                print(f"[WS] Error broadcasting to client {session_id}: {e}")
                disconnected.append(session_id)
        for session_id in disconnected:
            self.disconnect_client(session_id)

    async def broadcast_agent_status(self, agent_id: str, status: str, extra: Optional[dict] = None):
        data = {
            "type": "agent_status_update",
            "agent_id": agent_id,
            "status": status,
            "timestamp": datetime.now().isoformat(),
            **(extra or {})
        }
        await self.broadcast_to_clients(data)

    async def broadcast_task_update(self, task_data: dict):
        data = {
            "type": "task_update",
            "task": task_data,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast_to_clients(data)

    async def broadcast_progress_update(self, agent_id: str, task_id: str, progress: int):
        data = {
            "type": "progress_update",
            "agent_id": agent_id,
            "task_id": task_id,
            "progress": progress,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast_to_clients(data)

    def get_agent_status(self, agent_id: str) -> bool:
        return agent_id in self.agent_connections

    async def send_task_to_agent(self, agent_id: str, task: dict) -> bool:
        return await self.send_to_agent(agent_id, {
            "type": "task_assigned",
            "task": task
        })


manager = ConnectionManager()
