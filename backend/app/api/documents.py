from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import os
import shutil
from typing import Optional

from ..database import get_db
from ..models.document import Document
from ..models.project import Project
from ..schemas import CommonResponse
from ..config import settings

router = APIRouter(prefix="/api/documents", tags=["文档管理"])


# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=CommonResponse)
async def get_documents(
    project_id: str = None,
    requirement_id: str = None,
    task_id: str = None,
    file_type: str = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取文档列表
    """
    query = db.query(Document)

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

    items = []
    for doc in documents:
        items.append({
            "id": doc.id,
            "name": doc.name,
            "original_name": doc.original_name,
            "file_path": doc.file_path,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "project_id": doc.project_id,
            "requirement_id": doc.requirement_id,
            "task_id": doc.task_id,
            "version": doc.version,
            "uploaded_by": doc.uploaded_by,
            "created_at": doc.created_at.isoformat() if doc.created_at else None
        })

    return CommonResponse(
        code=200,
        data={"total": total, "items": items}
    )


@router.post("/upload", response_model=CommonResponse)
async def upload_document(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    requirement_id: Optional[str] = Form(None),
    task_id: Optional[str] = Form(None),
    name: Optional[str] = Form(None),
    uploaded_by: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    上传文档
    """
    # 验证项目是否存在
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # 检查文件大小
    file.file.seek(0, 2)  # 移动到文件末尾
    file_size = file.tell()
    file.file.seek(0)  # 重置到文件开头

    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"文件大小超过限制 ({settings.MAX_FILE_SIZE / 1024 / 1024}MB)"
        )

    # 生成唯一文件名
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # 保存文件
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 创建文档记录
    document = Document(
        id=str(uuid.uuid4()),
        project_id=project_id,
        requirement_id=requirement_id,
        task_id=task_id,
        name=name or file.filename,
        original_name=file.filename,
        file_path=file_path,
        file_type=file_extension.lstrip(".") if file_extension else "",
        file_size=file_size,
        uploaded_by=uploaded_by,
        version=1,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return CommonResponse(
        code=200,
        message="文档上传成功",
        data={
            "id": document.id,
            "name": document.name,
            "file_path": document.file_path,
            "file_size": document.file_size
        }
    )


@router.get("/{document_id}", response_model=CommonResponse)
async def get_document(document_id: str, db: Session = Depends(get_db)):
    """
    获取文档详情
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文档不存在")

    return CommonResponse(
        code=200,
        data={
            "id": doc.id,
            "name": doc.name,
            "original_name": doc.original_name,
            "file_path": doc.file_path,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "project_id": doc.project_id,
            "requirement_id": doc.requirement_id,
            "task_id": doc.task_id,
            "version": doc.version,
            "uploaded_by": doc.uploaded_by,
            "created_at": doc.created_at.isoformat() if doc.created_at else None
        }
    )


@router.delete("/{document_id}", response_model=CommonResponse)
async def delete_document(document_id: str, db: Session = Depends(get_db)):
    """
    删除文档
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文档不存在")

    # 删除物理文件
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    db.delete(doc)
    db.commit()

    return CommonResponse(code=200, message="文档已删除")


@router.post("/{document_id}/version", response_model=CommonResponse)
async def upload_document_version(
    document_id: str,
    file: UploadFile = File(...),
    uploaded_by: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    上传文档新版本
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文档不存在")

    # 检查文件大小
    file.file.seek(0, 2)
    file_size = file.tell()
    file.file.seek(0)

    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"文件大小超过限制 ({settings.MAX_FILE_SIZE / 1024 / 1024}MB)"
        )

    # 删除旧文件
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # 保存新文件
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 更新文档记录
    doc.file_path = file_path
    doc.file_type = file_extension.lstrip(".") if file_extension else ""
    doc.file_size = file_size
    doc.original_name = file.filename
    doc.version += 1
    if uploaded_by:
        doc.uploaded_by = uploaded_by

    db.commit()
    db.refresh(doc)

    return CommonResponse(
        code=200,
        message="版本已更新",
        data={
            "id": doc.id,
            "version": doc.version,
            "file_size": doc.file_size
        }
    )


@router.get("/{document_id}/download", response_model=CommonResponse)
async def download_document(document_id: str, db: Session = Depends(get_db)):
    """
    获取文档下载链接（简化版，直接返回文件路径）
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文档不存在")

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="文件不存在")

    return CommonResponse(
        code=200,
        data={
            "id": doc.id,
            "name": doc.original_name or doc.name,
            "file_path": doc.file_path,
            "file_type": doc.file_type,
            "file_size": doc.file_size
        }
    )
