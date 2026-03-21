"""审计日志 API 路由"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from typing import Optional

from ..api.deps import get_db, get_current_user
from ..services.audit_log_service import AuditLogService

router = APIRouter(prefix="/audit-logs", tags=["审计日志"])


@router.get("")
def get_audit_logs(
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """获取审计日志列表"""
    service = AuditLogService(db)
    logs, total = service.get_logs(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        page=page,
        page_size=page_size
    )

    return {
        "code": 200,
        "data": {
            "total": total,
            "items": [
                {
                    "id": log.id,
                    "user_id": log.user_id,
                    "action": log.action,
                    "resource_type": log.resource_type,
                    "resource_id": log.resource_id,
                    "details": log.details,
                    "ip_address": log.ip_address,
                    "created_at": log.created_at.isoformat() if log.created_at else None
                }
                for log in logs
            ]
        }
    }
