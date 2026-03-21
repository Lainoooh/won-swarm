from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid

from .config import settings
from .database import engine, SessionLocal
from .models.base import Base
from .models.user import User
from .api import auth, agents, projects, tasks, requirements, documents, audit_logs, project_agents, task_assignments, notifications
from .utils.security import hash_password

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建 FastAPI 应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Agent 协同研发平台"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(requirements.router)
app.include_router(documents.router)
app.include_router(audit_logs.router)
app.include_router(project_agents.router)
app.include_router(task_assignments.router)
app.include_router(notifications.router)


@app.on_event("startup")
async def startup_event():
    """应用启动事件"""
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 启动中...")
    print(f"📡 监听地址：http://{settings.HOST}:{settings.PORT}")
    print(f"🔧 调试模式：{'开启' if settings.DEBUG else '关闭'}")

    # 创建默认管理员账号
    db = SessionLocal()
    try:
        # 检查是否已存在管理员
        admin = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
        if not admin:
            # 创建管理员账号
            admin_user = User(
                id=str(uuid.uuid4()),
                username=settings.ADMIN_USERNAME,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print(f"🔐 默认管理员账号已创建：{settings.ADMIN_USERNAME}")
        else:
            print(f"🔐 管理员账号已存在：{settings.ADMIN_USERNAME}")
    except Exception as e:
        print(f"⚠️ 创建管理员账号失败：{e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    print(f"\n👋 {settings.APP_NAME} 已关闭")


@app.get("/")
async def root():
    """根路径"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
