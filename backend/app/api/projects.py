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
    RequirementModuleCreateSchema,
    FeatureAssignment,
)
from app.schemas.task import (
    TaskCreateSchema,
    TaskSchema,
)

router = APIRouter(prefix="/api/projects", tags=["Projects"])


def generate_project_id() -> str:
    return f"PROJ-{uuid.uuid4().hex[:4].upper()}"


def generate_requirement_id(req_type: str = "module") -> str:
    prefix = "MOD" if req_type == "module" else "FEAT"
    return f"{prefix}-{uuid.uuid4().hex[:3].upper()}"


def generate_task_id() -> str:
    return f"TSK-{uuid.uuid4().hex[:4].upper()}"


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


@router.post("/{project_id}/requirements/module", response_model=RequirementSchema)
async def create_requirement_module(project_id: str, data: RequirementModuleCreateSchema, db: AsyncSession = Depends(get_db)):
    """
    创建需求大纲（模块）并自动创建功能点和任务
    1. 创建模块（需求大纲）
    2. 为每个功能创建 feature 节点
    3. 为每个功能的各阶段分配创建任务
    """
    # 验证项目
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 获取所有 agents
    from app.models.agent import Agent
    agents_result = await db.execute(select(Agent))
    all_agents = {a.id: a for a in agents_result.scalars().all()}

    # 1. 创建模块
    module_id = generate_requirement_id("module")
    module = Requirement(
        id=module_id,
        project_id=project_id,
        parent_id=None,
        type="module",
        title=data.title,
        description=data.description,
        req_type=None,
        priority=None,
        status=None,
        current_step=None,
        sort_order=0,
    )
    db.add(module)
    project.req_count = project.req_count + 1

    # 创建需求大纲后，自动推进项目流程到 UI 设计阶段（阶段 2）
    if project.current_step == 1:
        project.current_step = 2

    await db.commit()
    await db.refresh(module)

    # 2. 创建功能点和任务
    if data.features:
        phase_order = {"UI 设计": 1, "概要设计": 2, "详细设计": 3, "系统研发": 4, "系统测试": 5}

        for feature_idx, feature_data in enumerate(data.features):
            # 创建功能
            feature_id = generate_requirement_id("feature")
            feature = Requirement(
                id=feature_id,
                project_id=project_id,
                parent_id=module.id,
                type="feature",
                title=feature_data.title,
                description=feature_data.description,
                req_type=feature_data.req_type,
                priority=feature_data.priority,
                status="pending",
                current_step=0,
                sort_order=feature_idx,
            )
            db.add(feature)
            project.req_count = project.req_count + 1

            await db.commit()
            await db.refresh(feature)

            # 创建任务
            for phase, agent_ids in feature_data.phase_assignments.items():
                if agent_ids:
                    for agent_id in agent_ids:
                        agent = all_agents.get(agent_id)
                        if agent:
                            task_id = generate_task_id()
                            task = Task(
                                id=task_id,
                                req_id=feature.id,
                                step_idx=phase_order.get(phase, 0),
                                title=f"{phase} - {feature_data.title}",
                                description=feature_data.description,
                                project_id=project_id,
                                feature_id=feature.id,
                                priority=feature_data.priority,
                                assignee_id=agent_id,
                                assignee_name=agent.name,
                                status="pending",
                                comments_count=0,
                            )
                            db.add(task)
                            project.task_count = project.task_count + 1

        await db.commit()

    # 手动构建响应，映射 docs_count -> docs
    return RequirementSchema(
        id=module.id,
        project_id=module.project_id,
        parent_id=module.parent_id,
        type=module.type,
        title=module.title,
        creator=module.creator,
        docs=module.docs_count,
        expanded=module.expanded,
        req_type=module.req_type,
        priority=module.priority,
        status=module.status,
        current_step=module.current_step,
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


@router.put("/{project_id}/requirements/{req_id}", response_model=RequirementSchema)
async def update_requirement(project_id: str, req_id: str, data: RequirementUpdateSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Requirement).where(Requirement.id == req_id))
    requirement = result.scalar_one_or_none()

    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(requirement, field, value)

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


@router.delete("/{project_id}/requirements/{req_id}")
async def delete_requirement(project_id: str, req_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Requirement).where(Requirement.id == req_id))
    requirement = result.scalar_one_or_none()

    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    if requirement.type == "module":
        # 删除模块下的所有功能
        features_result = await db.execute(select(Requirement.id).where(Requirement.parent_id == req_id))
        feature_ids = [row[0] for row in features_result.all()]

        # 删除所有功能下的任务，并统计任务数量
        deleted_task_count = 0
        if feature_ids:
            from app.models.task import Task
            # 先查询要删除的任务数量
            tasks_count_result = await db.execute(
                select(func.count(Task.id)).where(Task.feature_id.in_(feature_ids))
            )
            deleted_task_count = tasks_count_result.scalar() or 0
            # 删除任务
            await db.execute(delete(Task).where(Task.feature_id.in_(feature_ids)))

        # 删除所有功能
        await db.execute(delete(Requirement).where(Requirement.parent_id == req_id))
        # 更新项目计数
        project_result = await db.execute(select(Project).where(Project.id == requirement.project_id))
        project = project_result.scalar_one_or_none()
        if project:
            project.req_count = max(0, project.req_count - 1 - len(feature_ids))
            project.task_count = max(0, project.task_count - deleted_task_count)
    elif requirement.type == "feature":
        # 删除功能下的任务
        from app.models.task import Task
        # 先查询要删除的任务数量
        tasks_count_result = await db.execute(
            select(func.count(Task.id)).where(Task.feature_id == req_id)
        )
        deleted_task_count = tasks_count_result.scalar() or 0
        # 删除任务
        await db.execute(delete(Task).where(Task.feature_id == req_id))
        # 更新项目计数
        project_result = await db.execute(select(Project).where(Project.id == requirement.project_id))
        project = project_result.scalar_one_or_none()
        if project:
            project.req_count = max(0, project.req_count - 1)
            project.task_count = max(0, project.task_count - deleted_task_count)

    await db.delete(requirement)
    await db.commit()

    return {"success": True}


@router.post("/{project_id}/requirements/{req_id}/action", response_model=RequirementSchema)
async def requirement_action(project_id: str, req_id: str, data: dict, db: AsyncSession = Depends(get_db)):
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
                "description": t.description or "",
                "project_id": t.project_id,
                "feature_id": t.feature_id,
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


@router.post("/{project_id}/tasks", response_model=TaskSchema)
async def create_task(project_id: str, data: TaskCreateSchema, db: AsyncSession = Depends(get_db)):
    # 验证项目是否存在
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 验证需求是否存在
    req_result = await db.execute(select(Requirement).where(Requirement.id == data.req_id))
    requirement = req_result.scalar_one_or_none()
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    # 如果指定了 feature_id，验证功能是否存在
    if data.feature_id:
        feature_result = await db.execute(select(Requirement).where(Requirement.id == data.feature_id))
        feature = feature_result.scalar_one_or_none()
        if not feature:
            raise HTTPException(status_code=404, detail="Feature not found")

    # 如果指定了 assignee_id，验证 agent 是否存在
    if data.assignee_id:
        from app.models.agent import Agent
        agent_result = await db.execute(select(Agent).where(Agent.id == data.assignee_id))
        agent = agent_result.scalar_one_or_none()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

    task_id = generate_task_id()

    task = Task(
        id=task_id,
        req_id=data.req_id,
        step_idx=data.step_idx,
        title=data.title,
        description=data.description,
        project_id=project_id,
        feature_id=data.feature_id,
        priority=data.priority,
        assignee_id=data.assignee_id,
        assignee_name=data.assignee_name if data.assignee_name else (agent.name if agent else None),
        due_date=data.due_date,
        status="pending",
        comments_count=0,
    )

    db.add(task)

    # 更新项目的任务计数
    project.task_count = project.task_count + 1

    await db.commit()
    await db.refresh(task)

    return TaskSchema.model_validate(task)
