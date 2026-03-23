from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from typing import Optional
from datetime import datetime, date
import uuid

from app.database import get_db, async_session_maker
from app.models.project import Project
from app.models.requirement import Requirement
from app.models.task import Task
from app.schemas.project import (
    ProjectCreateSchema,
    ProjectUpdateSchema,
    ProjectSchema,
    ProjectListResponse,
)
from app.schemas.requirement import (
    RequirementCreateSchema,
    RequirementUpdateSchema,
    RequirementSchema,
    RequirementTreeResponse,
    BatchUpdateRequirementSchema,
)

router = APIRouter(prefix="/api/projects", tags=["Projects"])


def generate_project_id() -> str:
    return f"PROJ-{uuid.uuid4().hex[:4].upper()}"


def generate_requirement_id(req_type: str = "module") -> str:
    prefix = "MOD" if req_type == "module" else "FEAT"
    return f"{prefix}-{uuid.uuid4().hex[:3].upper()}"


@router.get("", response_model=ProjectListResponse)
async def get_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
):
    async with async_session_maker() as session:
        query = select(Project)

        if status:
            query = query.where(Project.status == status)

        query = query.order_by(Project.created_at.desc())

        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await session.execute(query)
        projects = result.scalars().all()

        count_query = select(func.count(Project.id))
        if status:
            count_query = count_query.where(Project.status == status)
        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        return ProjectListResponse(
            items=[ProjectSchema.model_validate(p) for p in projects],
            total=total,
            page=page,
            page_size=page_size,
        )


@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectSchema.model_validate(project)


@router.post("", response_model=ProjectSchema)
async def create_project(data: ProjectCreateSchema, db: AsyncSession = Depends(get_db)):
    project_id = generate_project_id()

    project = Project(
        id=project_id,
        name=data.name,
        description=data.description,
        manager_id=data.manager_id,
        manager_name=data.manager_name,
        start_date=data.start_date,
        end_date=data.end_date,
        status="planning",
        progress=0,
        req_count=0,
        task_count=0,
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    return ProjectSchema.model_validate(project)


@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(project_id: str, data: ProjectUpdateSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)

    return ProjectSchema.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()

    return {"success": True}


@router.get("/{project_id}/requirements", response_model=RequirementTreeResponse)
async def get_requirements_tree(project_id: str, db: AsyncSession = Depends(get_db)):
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    modules_result = await db.execute(
        select(Requirement)
        .where(Requirement.project_id == project_id, Requirement.parent_id.is_(None))
        .order_by(Requirement.sort_order)
    )
    modules = modules_result.scalars().all()

    result = []
    for module in modules:
        module_dict = {
            "id": module.id,
            "project_id": module.project_id,
            "parent_id": module.parent_id,
            "type": module.type,
            "title": module.title,
            "creator": module.creator,
            "docs": module.docs_count,
            "expanded": module.expanded,
            "children": [],
        }

        features_result = await db.execute(
            select(Requirement)
            .where(Requirement.parent_id == module.id)
            .order_by(Requirement.sort_order)
        )
        features = features_result.scalars().all()

        for feature in features:
            module_dict["children"].append({
                "id": feature.id,
                "project_id": feature.project_id,
                "parent_id": feature.parent_id,
                "type": feature.type,
                "title": feature.title,
                "creator": feature.creator,
                "docs": feature.docs_count,
                "req_type": feature.req_type,
                "priority": feature.priority,
                "status": feature.status,
                "current_step": feature.current_step,
            })

        result.append(module_dict)

    return RequirementTreeResponse(items=result)


@router.post("/{project_id}/requirements", response_model=RequirementSchema)
async def create_requirement(project_id: str, data: RequirementCreateSchema, db: AsyncSession = Depends(get_db)):
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if data.parent_id:
        parent_result = await db.execute(select(Requirement).where(Requirement.id == data.parent_id))
        parent = parent_result.scalar_one_or_none()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent module not found")

    req_id = generate_requirement_id(data.type)

    requirement = Requirement(
        id=req_id,
        project_id=project_id,
        parent_id=data.parent_id,
        type=data.type,
        title=data.title,
        description=data.description,
        req_type=data.req_type,
        priority=data.priority,
        status="pending" if data.type == "feature" else None,
        current_step=0 if data.type == "feature" else None,
        sort_order=0,
    )

    db.add(requirement)
    project.req_count = project.req_count + 1

    # 创建需求大纲（module）后，自动推进项目流程到 UI 设计阶段（阶段 2）
    # 流程：1=需求设计 -> 2=UI 设计 -> 3=概要设计 -> 4=详细设计 -> 5=系统研发 -> 6=系统测试 -> 7=项目验收
    if data.type == "module" and project.current_step == 1:
        project.current_step = 2  # 推进到 UI 设计阶段

    await db.commit()
    await db.refresh(requirement)

    # 手动构建响应，映射 docs_count -> docs
    return RequirementSchema(
        id=requirement.id,
        project_id=requirement.project_id,
        parent_id=requirement.parent_id,
        type=requirement.type,
        title=requirement.title,
        creator=requirement.creator,
        docs=requirement.docs_count,
        expanded=requirement.expanded,
        req_type=requirement.req_type,
        priority=requirement.priority,
        status=requirement.status,
        current_step=requirement.current_step,
    )


@router.put("/{project_id}/requirements", response_model=dict)
async def update_requirements_tree(
    project_id: str,
    data: BatchUpdateRequirementSchema,
    db: AsyncSession = Depends(get_db)
):
    for req_data in data.requirements:
        result = await db.execute(select(Requirement).where(Requirement.id == req_data.id))
        requirement = result.scalar_one_or_none()
        if requirement:
            update_data = req_data.model_dump(exclude_unset=True, exclude={"children", "project_id", "parent_id", "type", "creator", "docs"})
            for field, value in update_data.items():
                setattr(requirement, field, value)

    await db.commit()
    return {"success": True}


@router.put("/requirements/{req_id}", response_model=RequirementSchema)
async def update_requirement(req_id: str, data: RequirementUpdateSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Requirement).where(Requirement.id == req_id))
    requirement = result.scalar_one_or_none()

    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(requirement, field, value)

    await db.commit()
    await db.refresh(requirement)

    return RequirementSchema.model_validate(requirement)


@router.delete("/requirements/{req_id}")
async def delete_requirement(req_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Requirement).where(Requirement.id == req_id))
    requirement = result.scalar_one_or_none()

    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    if requirement.type == "module":
        await db.execute(delete(Requirement).where(Requirement.parent_id == req_id))

    project_result = await db.execute(select(Project).where(Project.id == requirement.project_id))
    project = project_result.scalar_one_or_none()
    if project:
        project.req_count = max(0, project.req_count - 1)

    await db.delete(requirement)
    await db.commit()

    return {"success": True}


@router.post("/requirements/{req_id}/action", response_model=RequirementSchema)
async def requirement_action(req_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Requirement).where(Requirement.id == req_id))
    requirement = result.scalar_one_or_none()

    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    action = data.get("action")

    if action == "cancel":
        requirement.status = "pending"
        requirement.current_step = 0
    elif action == "pause":
        pass
    elif action == "advance":
        status_order = ["pending", "planning", "in_development", "reviewing", "testing", "completed"]
        if requirement.status in status_order:
            current_idx = status_order.index(requirement.status)
            if current_idx < len(status_order) - 1:
                requirement.status = status_order[current_idx + 1]
                requirement.current_step = current_idx + 1
    elif action == "complete":
        requirement.status = "completed"

    await db.commit()
    await db.refresh(requirement)

    return RequirementSchema.model_validate(requirement)


@router.get("/{project_id}/tasks")
async def get_project_tasks(
    project_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    assignee_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    async with async_session_maker() as session:
        query = select(Task).where(Task.project_id == project_id)

        if status:
            query = query.where(Task.status == status)
        if assignee_id:
            query = query.where(Task.assignee_id == assignee_id)

        query = query.order_by(Task.created_at.desc())

        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await session.execute(query)
        tasks = result.scalars().all()

        count_query = select(func.count(Task.id)).where(Task.project_id == project_id)
        if status:
            count_query = count_query.where(Task.status == status)
        if assignee_id:
            count_query = count_query.where(Task.assignee_id == assignee_id)
        total_result = await session.execute(count_query)
        total = total_result.scalar() or 0

        return {
            "items": [{
                "id": t.id,
                "req_id": t.req_id,
                "step_idx": t.step_idx,
                "title": t.title,
                "project": t.project_id,
                "feature": t.feature_id,
                "status": t.status,
                "assignee": t.assignee_name,
                "assignee_id": t.assignee_id,
                "priority": t.priority,
                "due_date": t.due_date,
                "comments": t.comments_count,
            } for t in tasks],
            "total": total,
            "page": page,
            "page_size": page_size,
        }
