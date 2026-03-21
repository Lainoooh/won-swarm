from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
import jwt

from ..config import settings
from ..database import get_db
from ..models.user import User
from ..models.agent import Agent
from ..utils.security import decode_access_token

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """获取当前管理员用户"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="未提供认证凭证"
        )

    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 无效或已过期"
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 无效"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在或已禁用"
        )

    return user


def get_agent_by_sk(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Agent:
    """通过 Worker SK 获取 Agent"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="未提供认证凭证"
        )

    token = credentials.credentials

    # 支持两种格式：Bearer sk_xxx 或直接 sk_xxx
    if token.startswith("Bearer "):
        token = token[7:]

    agent = db.query(Agent).filter(Agent.worker_sk == token).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Agent 不存在或 SK 无效"
        )

    return agent


def verify_platform_ak(ak: str, db: Session) -> Optional[Agent]:
    """验证平台 AK 并返回对应 Agent"""
    import bcrypt
    agent = db.query(Agent).filter(Agent.platform_ak_hash.like(f"%{ak[-8:]}%")).first()
    if agent:
        # 验证完整 AK
        try:
            if bcrypt.checkpw(ak.encode('utf-8'), agent.platform_ak_hash.encode('utf-8')):
                return agent
        except Exception:
            pass
    return None
