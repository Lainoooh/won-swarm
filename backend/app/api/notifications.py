"""通知 API 路由"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from ..api.deps import get_db, get_current_user
from ..services.notification_service import NotificationService

router = APIRouter(prefix="/api/notifications", tags=["通知中心"])


@router.get("")
def get_notifications(
    unread_only: bool = False,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """获取用户的通知列表"""
    service = NotificationService(db)
    notifications, total = service.get_user_notifications(
        user_id=current_user["id"],
        unread_only=unread_only,
        page=page,
        page_size=page_size
    )

    return {
        "code": 200,
        "data": {
            "total": total,
            "items": [
                {
                    "id": n.id,
                    "type": n.type,
                    "title": n.title,
                    "content": n.content,
                    "data": n.data,
                    "is_read": n.is_read,
                    "created_at": n.created_at.isoformat() if n.created_at else None
                }
                for n in notifications
            ]
        }
    }


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """获取未读通知数量"""
    service = NotificationService(db)
    count = service.get_unread_count(current_user["id"])

    return {
        "code": 200,
        "data": {
            "count": count
        }
    }


@router.post("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """标记通知为已读"""
    service = NotificationService(db)
    success = service.mark_as_read(notification_id, current_user["id"])

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知不存在"
        )

    return {"code": 200, "message": "标记成功"}


@router.post("/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """标记所有通知为已读"""
    service = NotificationService(db)
    count = service.mark_all_as_read(current_user["id"])

    return {
        "code": 200,
        "message": f"已标记 {count} 条通知为已读"
    }
