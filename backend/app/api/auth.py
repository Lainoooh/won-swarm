from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import bcrypt

from ..database import get_db
from ..models.user import User
from ..schemas import AdminLogin, AdminLoginResponse, CommonResponse
from ..utils.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["认证"])


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLogin, db: Session = Depends(get_db)):
    """
    管理员登录
    """
    user = db.query(User).filter(User.username == login_data.username).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )

    # 生成 Token
    access_token = create_access_token(
        data={"sub": user.id, "username": user.username}
    )

    return AdminLoginResponse(
        code=200,
        data={
            "token": access_token,
            "expires_in": 86400,
            "user": {
                "id": user.id,
                "username": user.username
            }
        }
    )


@router.post("/logout", response_model=CommonResponse)
async def admin_logout():
    """
    管理员登出（前端清除 Token 即可）
    """
    return CommonResponse(code=200, message="登出成功")
