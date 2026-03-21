"""通知服务"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from ..models.notification import Notification


class NotificationService:
    """通知服务类"""

    def __init__(self, db: Session):
        self.db = db

    def create_notification(
        self,
        type: str,
        title: str,
        content: Optional[str] = None,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """创建通知"""
        notification = Notification(
            id=str(uuid.uuid4()),
            type=type,
            title=title,
            content=content,
            user_id=user_id,
            agent_id=agent_id,
            data=data,
            created_at=datetime.utcnow()
        )

        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_user_notifications(
        self,
        user_id: str,
        unread_only: bool = False,
        page: int = 1,
        page_size: int = 20
    ) -> tuple:
        """获取用户的通知列表"""
        query = self.db.query(Notification).filter(
            Notification.user_id == user_id
        )

        if unread_only:
            query = query.filter(Notification.is_read == False)

        total = query.count()
        notifications = query.order_by(Notification.created_at.desc()).offset(
            (page - 1) * page_size
        ).limit(page_size).all()

        return notifications, total

    def mark_as_read(self, notification_id: str, user_id: str) -> bool:
        """标记通知为已读"""
        notification = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()

        if not notification:
            return False

        notification.is_read = True
        notification.read_at = datetime.utcnow()
        self.db.commit()
        return True

    def mark_all_as_read(self, user_id: str) -> int:
        """标记所有通知为已读"""
        count = self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({
            Notification.is_read: True,
            Notification.read_at: datetime.utcnow()
        })
        self.db.commit()
        return count

    def get_unread_count(self, user_id: str) -> int:
        """获取未读通知数量"""
        return self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).count()

    # 便捷方法：创建各种类型的通知
    def notify_task_assigned(
        self,
        user_id: str,
        task_id: str,
        task_title: str
    ) -> Notification:
        """通知任务已分配"""
        return self.create_notification(
            type="task_assigned",
            title="新任务分配",
            content=f"您已被分配任务：{task_title}",
            user_id=user_id,
            data={"task_id": task_id, "task_title": task_title}
        )

    def notify_task_completed(
        self,
        user_id: str,
        task_id: str,
        task_title: str
    ) -> Notification:
        """通知任务已完成"""
        return self.create_notification(
            type="task_completed",
            title="任务完成",
            content=f"任务已完成：{task_title}",
            user_id=user_id,
            data={"task_id": task_id, "task_title": task_title}
        )

    def notify_project_updated(
        self,
        user_id: str,
        project_id: str,
        project_name: str
    ) -> Notification:
        """通知项目已更新"""
        return self.create_notification(
            type="project_updated",
            title="项目更新",
            content=f"项目已更新：{project_name}",
            user_id=user_id,
            data={"project_id": project_id, "project_name": project_name}
        )
