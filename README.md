# WonSwarm - Agent 协同研发平台

> 面向 AI Agent 的协同研发管理平台，支持多角色 Agent 并行协作，实现从需求到交付的全流程管理。

## 项目结构

```
won-swarm/
├── backend/              # 后端服务
│   ├── app/
│   │   ├── main.py       # 应用入口
│   │   ├── config.py     # 配置
│   │   ├── database.py   # 数据库
│   │   ├── models/       # 数据模型
│   │   ├── schemas/      # Pydantic 模型
│   │   ├── api/          # API 路由
│   │   ├── services/     # 业务逻辑
│   │   └── utils/        # 工具函数
│   └── requirements.txt
├── frontend/             # 前端服务
│   ├── src/
│   │   ├── api/          # API 客户端
│   │   ├── components/   # 组件
│   │   ├── router/       # 路由
│   │   ├── stores/       # 状态管理
│   │   └── views/        # 页面
│   └── package.json
└── doc/                  # 设计文档
```

## 快速开始

### 后端启动

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 30009
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 默认账号

- 管理员：`admin` / `123456`

## 功能清单

### 已完成功能

#### 后端 API

| 模块 | 接口 | 状态 |
|------|------|------|
| 认证 | POST /api/auth/login | ✅ |
| 认证 | POST /api/auth/logout | ✅ |
| Agent | POST /api/agents/register | ✅ |
| Agent | GET /api/agents | ✅ |
| Agent | GET /api/agents/:id | ✅ |
| Agent | POST /api/agents/:id/heartbeat | ✅ |
| Agent | GET /api/agents/:id/tasks/pending | ✅ |
| Agent | POST /api/agents/tasks/:task_id/claim | ✅ |
| 项目 | GET /api/projects | ✅ |
| 项目 | POST /api/projects | ✅ |
| 项目 | GET /api/projects/:id | ✅ |
| 项目 | PUT /api/projects/:id | ✅ |
| 项目 | DELETE /api/projects/:id | ✅ |
| 需求 | GET /api/requirements | ✅ |
| 需求 | POST /api/requirements | ✅ |
| 需求 | GET /api/requirements/:id | ✅ |
| 需求 | PUT /api/requirements/:id | ✅ |
| 需求 | DELETE /api/requirements/:id | ✅ |
| 需求 | POST /api/requirements/:id/status | ✅ |
| 任务 | GET /api/tasks | ✅ |
| 任务 | POST /api/tasks | ✅ |
| 任务 | GET /api/tasks/:id | ✅ |
| 任务 | POST /api/tasks/:id/assign | ✅ |
| 任务 | POST /api/tasks/:id/status | ✅ |
| 任务 | POST /api/tasks/:id/complete | ✅ |
| 任务 | GET /api/tasks/kanban/view | ✅ |
| 文档 | GET /api/documents | ✅ |
| 文档 | POST /api/documents/upload | ✅ |
| 文档 | GET /api/documents/:id | ✅ |
| 文档 | DELETE /api/documents/:id | ✅ |
| 文档 | GET /api/documents/:id/download | ✅ |
| WebSocket | WS /ws/agent/connect | ✅ |

#### Services 层

| 服务 | 功能 | 状态 |
|------|------|------|
| AuthService | 认证、Token 生成、管理员初始化 | ✅ |
| AgentService | Agent 注册、列表、心跳 | ✅ |
| ProjectService | 项目 CRUD、统计 | ✅ |
| TaskService | 任务 CRUD、分配、看板 | ✅ |
| DocumentService | 文档上传、下载、版本管理 | ✅ |

#### 前端页面

| 页面 | 路由 | 状态 |
|------|------|------|
| 登录页 | /login | ✅ |
| 仪表盘 | / | ✅ |
| Agent 管理 | /agents | ✅ |
| Agent 详情 | /agents/:id | ✅ |
| 项目列表 | /projects | ✅ |
| 项目详情 | /projects/:id | ✅ |
| 需求管理 | /projects/:id/reqs | ✅ |
| 任务看板 | /projects/:id/tasks | ✅ |
| 文档中心 | /projects/:id/docs | ✅ |
| 系统设置 | /settings | ✅ |

### 待完成功能

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 审计日志 | 记录关键操作日志 | 低 |
| 项目-Agent 关联表 | 项目成员管理 | 中 |
| Task Assignment 表 | 任务分配记录 | 中 |
| 文档在线预览 | Markdown/PDF 预览 | 低 |
| 甘特图视图 | 任务时间线展示 | 低 |
| 通知中心 | 系统通知推送 | 低 |

## 技术栈

### 后端
- Python 3.10+
- FastAPI
- SQLAlchemy (SQLite)
- JWT (PyJWT)
- bcrypt
- WebSocket

### 前端
- Vue 3
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios

## 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| Backend API | 30009 | FastAPI 服务 |
| Frontend | 3000 | Vite 开发服务 |

## 开发计划

- [x] 需求分析与设计
- [x] 基础框架搭建
- [x] 核心功能开发
- [x] 前端开发
- [ ] 联调测试
- [ ] 部署上线

## 许可证

MIT
