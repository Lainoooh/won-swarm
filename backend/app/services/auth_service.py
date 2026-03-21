"""认证服务"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Optional

from ..models.user import User
from ..utils.security import hash_password, verify_password, create_access_token
from ..config import settings


class AuthService:
    """认证服务类"""

    def __init__(self, db: Session):
        self.db = db

    def authenticate(self, username: str, password: str) -> Optional[User]:
        """验证用户密码"""
        user = self.db.query(User).filter(User.username == username).first()
        if not user or not user.is_active:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def create_token(self, user: User) -> str:
        """创建访问令牌"""
        return create_access_token(
            data={"sub": user.id, "username": user.username}
        )

    def init_admin_user(self, username: str = None, password: str = None):
        """初始化管理员账号"""
        username = username or settings.ADMIN_USERNAME
        password = password or settings.ADMIN_PASSWORD

        existing = self.db.query(User).filter(User.username == username).first()
        if existing:
            return existing

        admin = User(
            id=str(__import__('uuid').uuid4()),
            username=username,
            password_hash=hash_password(password),
            is_active=True
        )
        self.db.add(admin)
        self.db.commit()
        return admin
