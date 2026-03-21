"""文档服务"""
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from ..models.document import Document
from ..config import settings


class DocumentService:
    """文档服务类"""

    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def upload_document(
        self,
        file,
        project_id: str,
        name: str,
        original_name: str,
        requirement_id: Optional[str] = None,
        task_id: Optional[str] = None,
        uploaded_by: Optional[str] = None
    ) -> Document:
        """上传文档"""
        # 生成唯一文件名
        file_extension = os.path.splitext(original_name)[1] if original_name else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(self.upload_dir, unique_filename)

        # 保存文件
        with open(file_path, "wb") as buffer:
            file.seek(0, 2)
            file_size = file.tell()
            file.seek(0)
            file.seek(0)
            buffer.write(file.read())

        # 创建文档记录
        document = Document(
            id=str(uuid.uuid4()),
            project_id=project_id,
            requirement_id=requirement_id,
            task_id=task_id,
            name=name or original_name,
            original_name=original_name,
            file_path=file_path,
            file_type=file_extension.lstrip(".") if file_extension else "",
            file_size=file_size,
            uploaded_by=uploaded_by,
            version=1
        )

        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def get_document_by_id(self, document_id: str) -> Optional[Document]:
        """根据 ID 获取文档"""
        return self.db.query(Document).filter(Document.id == document_id).first()

    def get_documents(
        self,
        project_id: Optional[str] = None,
        requirement_id: Optional[str] = None,
        task_id: Optional[str] = None,
        file_type: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple:
        """获取文档列表"""
        query = self.db.query(Document)

        if project_id:
            query = query.filter(Document.project_id == project_id)
        if requirement_id:
            query = query.filter(Document.requirement_id == requirement_id)
        if task_id:
            query = query.filter(Document.task_id == task_id)
        if file_type:
            query = query.filter(Document.file_type == file_type)

        total = query.count()
        documents = query.offset((page - 1) * page_size).limit(page_size).all()

        return documents, total

    def delete_document(self, document_id: str) -> bool:
        """删除文档"""
        document = self.get_document_by_id(document_id)
        if not document:
            return False

        # 删除物理文件
        if os.path.exists(document.file_path):
            os.remove(document.file_path)

        self.db.delete(document)
        self.db.commit()
        return True

    def upload_new_version(
        self,
        document_id: str,
        file,
        uploaded_by: Optional[str] = None
    ) -> Optional[Document]:
        """上传新版本"""
        document = self.get_document_by_id(document_id)
        if not document:
            return None

        # 删除旧文件
        if os.path.exists(document.file_path):
            os.remove(document.file_path)

        # 保存新文件
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(self.upload_dir, unique_filename)

        file.file.seek(0, 2)
        file_size = file.tell()
        file.file.seek(0)

        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        # 更新文档
        document.file_path = file_path
        document.file_type = file_extension.lstrip(".") if file_extension else ""
        document.file_size = file_size
        document.original_name = file.filename
        document.version += 1
        if uploaded_by:
            document.uploaded_by = uploaded_by

        self.db.commit()
        self.db.refresh(document)
        return document
