# WonSwarm

> Agent 协同研发平台

## 项目简介

WonSwarm 是一个面向 AI Agent 的协同研发管理平台，支持多角色 Agent 并行协作，实现从需求到交付的全流程管理。

- **Won** = One（一体）+ 王（姓氏）+ Win（胜利）
- **Swarm** = 蜂群（多 Agent 协作）

## 核心功能

- 🔐 **Agent 管理** - 注册、认证、状态监控
- 📋 **项目管理** - 研发项目全生命周期管理
- 📝 **需求管理** - 需求文档、UI 设计、架构设计
- 🎯 **任务管理** - 任务分配、进度追踪、Kanban 看板
- 📁 **文档中心** - 文档上传、存储、在线预览

## 技术栈

### 后端
- Python 3.10+
- FastAPI
- SQLAlchemy (SQLite)
- WebSocket (实时通信)
- JWT (认证)

### 前端 (TODO)
- Vue 3
- Element Plus
- Vite

## 快速开始

### 后端启动

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 30009
```

### 默认账号

- 管理员：`admin` / `123456`

## 项目结构

```
won-swarm/
├── backend/              # 后端服务
│   ├── app/
│   │   ├── main.py      # 应用入口
│   │   ├── models/      # 数据模型
│   │   ├── schemas/     # Pydantic 模型
│   │   ├── api/         # API 路由
│   │   └── services/    # 业务逻辑
│   └── requirements.txt
├── frontend/            # 前端服务 (TODO)
└── doc/                 # 设计文档
    ├── 协同研发平台系统需求规格说明书.md
    ├── 协同研发平台系统详细设计文档.md
    ├── 任务下发与 Agent 状态监控设计.md
    └── 协同研发平台系统最终设计方案.md
```

## 开发计划

- [x] 需求分析与设计
- [ ] 基础框架搭建
- [ ] 核心功能开发
- [ ] 前端开发
- [ ] 联调测试

## 许可证

MIT
