"""
数据库初始化脚本 - 导入 Mock 数据
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from datetime import date, datetime
import hashlib

from app.models.agent import Agent
from app.models.project import Project
from app.models.requirement import Requirement
from app.models.task import Task

DATABASE_URL = "sqlite+aiosqlite:///./wonswarm.db"

engine = create_async_engine(DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


def hash_sk(sk: str) -> str:
    return hashlib.sha256(sk.encode()).hexdigest()[:16]


async def init_tables():
    async with engine.begin() as conn:
        from app.database import Base
        await conn.run_sync(Base.metadata.create_all)
    print("✓ 表创建完成")


async def seed_agents():
    mock_agents = [
        {"id": "ag-101", "name": "PC2-项目经理", "worker_sk_hash": hash_sk("sk_x8f...2a"), "roles": ["project-manager"], "capabilities": ["task-decomposition"], "status": "online", "model": "claude-sonnet-4-6", "tokens": 1250000, "linshi": 850, "current_task_id": "TASK-001"},
        {"id": "ag-102", "name": "PC2-前端开发", "worker_sk_hash": hash_sk("sk_v2m...9p"), "roles": ["frontend-developer"], "capabilities": ["vue3", "react"], "status": "idle", "model": "claude-opus-4-6", "tokens": 890000, "linshi": 420},
        {"id": "ag-103", "name": "PC2-后端开发", "worker_sk_hash": hash_sk("sk_q1l...5c"), "roles": ["backend-developer"], "capabilities": ["fastapi", "python"], "status": "busy", "model": "claude-sonnet-4-6", "tokens": 2100000, "linshi": 1200, "current_task_id": "TASK-002"},
        {"id": "ag-104", "name": "MAC-UI 设计", "worker_sk_hash": hash_sk("sk_p9k...1z"), "roles": ["ui-designer"], "capabilities": ["figma"], "status": "offline", "model": "claude-haiku-4-5-20251001", "tokens": 450000, "linshi": 180},
        {"id": "ag-105", "name": "Server-测试专家", "worker_sk_hash": hash_sk("sk_t5b...8r"), "roles": ["qa-engineer"], "capabilities": ["pytest", "selenium"], "status": "online", "model": "claude-sonnet-4-6", "tokens": 680000, "linshi": 320, "current_task_id": "TASK-003"},
        {"id": "ag-106", "name": "PC2-架构师", "worker_sk_hash": hash_sk("sk_a7c...3d"), "roles": ["architect", "tech-lead"], "capabilities": ["system-design", "code-review"], "status": "idle", "model": "claude-opus-4-6", "tokens": 3200000, "linshi": 1850},
        {"id": "ag-107", "name": "MAC-产品专家", "worker_sk_hash": hash_sk("sk_m4n...6k"), "roles": ["product-manager", "analyst"], "capabilities": ["requirement-analysis", "prd"], "status": "busy", "model": "claude-sonnet-4-6", "tokens": 1580000, "linshi": 920, "current_task_id": "TASK-008"},
    ]

    async with async_session_maker() as session:
        for agent_data in mock_agents:
            agent = Agent(**agent_data)
            session.add(agent)
        await session.commit()

    print(f"✓ 导入 {len(mock_agents)} 个 Agent")


async def seed_projects():
    mock_projects = [
        {"id": "PROJ-001", "name": "电商平台重构", "description": "完整电商平台重构项目", "manager_id": "ag-101", "manager_name": "PC2-项目经理", "status": "in_progress", "start_date": date(2026, 3, 1), "end_date": date(2026, 6, 30), "progress": 45, "req_count": 24, "task_count": 86},
        {"id": "PROJ-002", "name": "内部协同 ERP 系统", "description": "内部协同办公 ERP 系统", "manager_id": "admin", "manager_name": "Admin", "status": "planning", "start_date": date(2026, 4, 15), "end_date": date(2026, 10, 1), "progress": 0, "req_count": 12, "task_count": 0},
        {"id": "PROJ-003", "name": "OneSwarm 官网开发", "description": "OneSwarm 公司官网开发项目", "manager_id": "ag-101", "manager_name": "PC2-项目经理", "status": "completed", "start_date": date(2026, 1, 10), "end_date": date(2026, 3, 15), "progress": 100, "req_count": 8, "task_count": 32},
    ]

    async with async_session_maker() as session:
        for proj_data in mock_projects:
            project = Project(**proj_data)
            session.add(project)
        await session.commit()

    print(f"✓ 导入 {len(mock_projects)} 个项目")


async def seed_requirements():
    modules = [
        {"id": "MOD-01", "project_id": "PROJ-001", "parent_id": None, "type": "module", "title": "用户认证中心", "creator": "Admin", "docs_count": 2, "sort_order": 0, "expanded": True},
        {"id": "MOD-02", "project_id": "PROJ-001", "parent_id": None, "type": "module", "title": "购物车与交易核心", "creator": "架构师", "docs_count": 1, "sort_order": 1, "expanded": True},
    ]

    features = [
        {"id": "FEAT-010", "project_id": "PROJ-001", "parent_id": "MOD-01", "type": "feature", "title": "标准账号密码登录与注册", "creator": "产品经理", "docs_count": 3, "req_type": "new", "priority": "P0", "status": "testing", "current_step": 4, "sort_order": 0},
        {"id": "FEAT-011", "project_id": "PROJ-001", "parent_id": "MOD-01", "type": "feature", "title": "第三方 OAuth 授权登录", "creator": "产品经理", "docs_count": 2, "req_type": "change", "priority": "P1", "status": "in_development", "current_step": 2, "sort_order": 1},
        {"id": "FEAT-012", "project_id": "PROJ-001", "parent_id": "MOD-01", "type": "feature", "title": "多因素认证 (MFA)", "creator": "安全专员", "docs_count": 1, "req_type": "bug", "priority": "P2", "status": "planning", "current_step": 0, "sort_order": 2},
        {"id": "FEAT-020", "project_id": "PROJ-001", "parent_id": "MOD-02", "type": "feature", "title": "购物车性能优化 (缓存重构)", "creator": "产品经理", "docs_count": 4, "req_type": "new", "priority": "P0", "status": "reviewing", "current_step": 2, "sort_order": 0},
        {"id": "FEAT-021", "project_id": "PROJ-001", "parent_id": "MOD-02", "type": "feature", "title": "支付回调偶发失败修复", "creator": "测试团队", "docs_count": 2, "req_type": "bug", "priority": "P0", "status": "in_development", "current_step": 4, "sort_order": 1},
    ]

    async with async_session_maker() as session:
        for mod_data in modules:
            module = Requirement(**mod_data)
            session.add(module)
        for feat_data in features:
            feature = Requirement(**feat_data)
            session.add(feature)
        await session.commit()

    print(f"✓ 导入 {len(modules)} 个模块 + {len(features)} 个功能")


async def seed_tasks():
    mock_tasks = [
        {"id": "TASK-001", "req_id": "FEAT-010", "step_idx": 0, "title": "需求分析与用例拆解", "description": "", "project_id": "PROJ-001", "feature_id": "FEAT-010", "status": "completed", "assignee_id": "ag-101", "assignee_name": "PC2-项目经理", "priority": "P1", "due_date": date(2026, 3, 20), "comments_count": 3},
        {"id": "TASK-002", "req_id": "FEAT-011", "step_idx": 2, "title": "第三方登录 API 开发", "description": "", "project_id": "PROJ-001", "feature_id": "FEAT-011", "status": "in_progress", "assignee_id": "ag-103", "assignee_name": "PC2-后端开发", "priority": "P0", "due_date": date(2026, 3, 25), "comments_count": 5},
        {"id": "TASK-003", "req_id": "FEAT-010", "step_idx": 5, "title": "登录页面自动化测试脚本", "description": "", "project_id": "PROJ-001", "feature_id": "FEAT-010", "status": "pending", "assignee_id": "ag-105", "assignee_name": "Server-测试专家", "priority": "P2", "due_date": date(2026, 3, 28), "comments_count": 0},
        {"id": "TASK-004", "req_id": "FEAT-020", "step_idx": 1, "title": "商品详情页 UI 设计", "description": "", "project_id": "PROJ-001", "feature_id": "FEAT-020", "status": "completed", "assignee_id": "ag-104", "assignee_name": "MAC-UI 设计", "priority": "P1", "due_date": date(2026, 3, 18), "comments_count": 2},
        {"id": "TASK-005", "req_id": "FEAT-010", "step_idx": 4, "title": "用户登录注册核心逻辑研发", "description": "", "project_id": "PROJ-001", "feature_id": "FEAT-010", "status": "blocked", "assignee_id": "ag-103", "assignee_name": "PC2-后端开发", "priority": "P0", "due_date": date(2026, 3, 22), "comments_count": 8},
    ]

    async with async_session_maker() as session:
        for task_data in mock_tasks:
            task = Task(**task_data)
            session.add(task)
        await session.commit()

    print(f"✓ 导入 {len(mock_tasks)} 个任务")


async def main():
    print("=" * 50)
    print("WonSwarm 数据库初始化")
    print("=" * 50)

    try:
        db_path = os.path.join(os.path.dirname(__file__), "..", "wonswarm.db")
        if os.path.exists(db_path):
            os.remove(db_path)
            print("✓ 已删除旧数据库")

        await init_tables()
        await seed_agents()
        await seed_projects()
        await seed_requirements()
        await seed_tasks()

        print("=" * 50)
        print("✓ 数据库初始化完成!")
        print("=" * 50)

    except Exception as e:
        print(f"✗ 初始化失败：{e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
