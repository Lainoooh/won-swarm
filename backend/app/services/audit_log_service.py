"""审计日志服务"""
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from ..models.audit_log import AuditLog


class AuditLogService:
    """审计日志服务类"""

    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        user_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """记录审计日志"""
        audit_log = AuditLog(
            id=str(uuid.uuid4()),
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            created_at=datetime.utcnow()
        )

        self.db.add(audit_log)
        self.db.commit()
        return audit_log

    def get_logs(
        self,
        user_id: Optional[str] = None,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple:
        """获取审计日志列表"""
        query = self.db.query(AuditLog)

        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        if action:
            query = query.filter(AuditLog.action == action)
        if resource_type:
            query = query.filter(AuditLog.resource_type == resource_type)

        total = query.count()
        logs = query.order_by(AuditLog.created_at.desc()).offset(
            (page - 1) * page_size
        ).limit(page_size).all()

        return logs, total
