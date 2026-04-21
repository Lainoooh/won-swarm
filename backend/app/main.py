from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, close_db
from app.api.agents import router as agents_router
from app.api.projects import router as projects_router
from app.services.websocket_manager import manager


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="WonSwarm 协同调度系统后端 API",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(agents_router)
    app.include_router(projects_router)

    @app.on_event("startup")
    async def startup():
        print("[Startup] Initializing database...")
        await init_db()
        print("[Startup] Database initialized")

    @app.on_event("shutdown")
    async def shutdown():
        print("[Shutdown] Closing database connections...")
        await close_db()

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": settings.APP_VERSION}

    @app.websocket("/ws/clients")
    async def websocket_client(websocket, session_id: str = "default"):
        await manager.connect_client(websocket, session_id)
        try:
            while True:
                data = await websocket.receive_json()
                if data.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
        except Exception as e:
            print(f"[WS Client] Error: {e}")
        finally:
            manager.disconnect_client(session_id)

    return app


app = create_app()
