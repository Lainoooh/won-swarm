"""
数据种子脚本 - 生成测试数据
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.base import Base
from app.models.user import User
from app.models.agent import Agent
from app.models.project import Project
from app.models.requirement import Requirement
from app.models.task import Task
from app.utils.security import hash_password
import uuid

# 创建所有表
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # 1. 创建管理员
    admin = User(
        id=str(uuid.uuid4()),
        username="admin",
        password_hash=hash_password("123456"),
        is_active=True
    )
    db.add(admin)
    print("✅ 创建管理员账号：admin / 123456")

    # 2. 创建 Agent
    agents = [
        Agent(
            id=str(uuid.uuid4()),
            name="产品经理 Agent",
            platform_ak_hash=f"sk_{uuid.uuid4().hex[:16]}",
            roles=["product_manager"],
            status="online"
        ),
        Agent(
            id=str(uuid.uuid4()),
            name="UI 设计师 Agent",
            platform_ak_hash=f"sk_{uuid.uuid4().hex[:16]}",
            roles=["ui_designer"],
            status="online"
        ),
        Agent(
            id=str(uuid.uuid4()),
            name="前端开发 Agent",
            platform_ak_hash=f"sk_{uuid.uuid4().hex[:16]}",
            roles=["frontend_developer"],
            status="online"
        ),
        Agent(
            id=str(uuid.uuid4()),
            name="后端开发 Agent",
            platform_ak_hash=f"sk_{uuid.uuid4().hex[:16]}",
            roles=["backend_developer"],
            status="online"
        ),
        Agent(
            id=str(uuid.uuid4()),
            name="测试工程师 Agent",
            platform_ak_hash=f"sk_{uuid.uuid4().hex[:16]}",
            roles=["qa_engineer"],
            status="online"
        )
    ]
    for agent in agents:
        db.add(agent)
    print(f"✅ 创建 {len(agents)} 个 Agent")

    # 3. 创建项目
    project = Project(
        id=str(uuid.uuid4()),
        name="电商平台重构",
        description="新一代电商平台系统重构项目",
        manager_id=admin.id,
        status="in_progress"
    )
    db.add(project)
    db.commit()  # 获取项目 ID
    print(f"✅ 创建项目：{project.name}")

    # 4. 创建需求（3 级结构）
    # L1 - Epic (大需求)
    epics = [
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="epic",
            title="项目管理模块",
            description="项目管理相关的所有功能",
            type="new_feature",
            priority="P0",
            status="in_development",
            document_ids=[
                {"doc_id": "doc1", "doc_name": "项目管理需求设计.md", "type": "requirement_design"},
                {"doc_id": "doc2", "doc_name": "项目管理概要设计.pdf", "type": "high_design"}
            ]
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="epic",
            title="用户中心模块",
            description="用户管理、权限控制相关功能",
            type="new_feature",
            priority="P0",
            status="in_design",
            document_ids=[
                {"doc_id": "doc3", "doc_name": "用户中心需求设计.md", "type": "requirement_design"}
            ]
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="epic",
            title="订单管理模块",
            description="订单处理、支付相关功能",
            type="new_feature",
            priority="P1",
            status="pending"
        )
    ]
    for epic in epics:
        db.add(epic)
    db.commit()  # 获取 Epic ID
    print(f"✅ 创建 {len(epics)} 个大需求 (Epic)")

    # L2 - Feature (子需求) - 属于项目管理模块
    features = [
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="feature",
            parent_id=epics[0].id,
            epic_id=epics[0].id,
            title="项目列表查询",
            description="支持多条件筛选的项目列表查询功能",
            type="new_feature",
            priority="P1",
            status="in_development"
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="feature",
            parent_id=epics[0].id,
            epic_id=epics[0].id,
            title="项目创建与编辑",
            description="支持创建新项目，编辑项目信息",
            type="new_feature",
            priority="P1",
            status="completed"
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="feature",
            parent_id=epics[0].id,
            epic_id=epics[0].id,
            title="项目成员管理",
            description="添加/移除项目成员，分配角色",
            type="new_feature",
            priority="P2",
            status="in_design"
        ),
        # 用户中心模块的子需求
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="feature",
            parent_id=epics[1].id,
            epic_id=epics[1].id,
            title="用户登录注册",
            description="支持账号密码登录、注册、找回密码",
            type="new_feature",
            priority="P0",
            status="in_development"
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="feature",
            parent_id=epics[1].id,
            epic_id=epics[1].id,
            title="权限管理",
            description="RBAC 权限控制，角色管理",
            type="new_feature",
            priority="P1",
            status="pending"
        )
    ]
    for feature in features:
        db.add(feature)
    db.commit()
    print(f"✅ 创建 {len(features)} 个子需求 (Feature)")

    # L3 - Task (任务级) - 属于项目列表查询子需求
    tasks_requirements = [
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="task",
            parent_id=features[0].id,
            epic_id=epics[0].id,
            title="列表查询前端开发",
            description="实现项目列表查询页面，支持筛选、分页",
            type="new_feature",
            priority="P1",
            status="in_development",
            assignee_id=agents[2].id  # 前端开发 Agent
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="task",
            parent_id=features[0].id,
            epic_id=epics[0].id,
            title="列表查询后端开发",
            description="实现项目列表查询 API，支持多条件筛选",
            type="new_feature",
            priority="P1",
            status="completed",
            assignee_id=agents[3].id  # 后端开发 Agent
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="task",
            parent_id=features[0].id,
            epic_id=epics[0].id,
            title="联调自测试",
            description="前后端联调，完成自测试",
            type="new_feature",
            priority="P2",
            status="pending"
        ),
        Requirement(
            id=str(uuid.uuid4()),
            project_id=project.id,
            level="task",
            parent_id=features[0].id,
            epic_id=epics[0].id,
            title="集成测试",
            description="测试人员进行集成测试，输出测试报告",
            type="new_feature",
            priority="P2",
            status="pending",
            assignee_id=agents[4].id  # 测试工程师 Agent
        )
    ]
    for task in tasks_requirements:
        db.add(task)
    db.commit()
    print(f"✅ 创建 {len(tasks_requirements)} 个任务级需求 (Task)")

    # 5. 创建任务（关联到需求）
    task = Task(
        id=str(uuid.uuid4()),
        requirement_id=tasks_requirements[0].id,
        project_id=project.id,
        title="项目列表查询 - 前端页面开发",
        description="使用 Vue3 + Element Plus 实现项目列表查询页面",
        type="frontend",
        status="in_progress",
        assignee_id=agents[2].id,
        estimated_hours=8
    )
    db.add(task)
    db.commit()
    print(f"✅ 创建 {1} 个执行任务")

    print("\n" + "="*50)
    print("🎉 测试数据创建完成！")
    print("="*50)
    print(f"\n登录信息：")
    print(f"  账号：admin")
    print(f"  密码：123456")
    print(f"\n项目信息：")
    print(f"  项目名称：{project.name}")
    print(f"  大需求数：{len(epics)}")
    print(f"  子需求数：{len(features)}")
    print(f"  任务级需求：{len(tasks_requirements)}")

except Exception as e:
    db.rollback()
    print(f"❌ 创建测试数据失败：{e}")
    raise
finally:
    db.close()
