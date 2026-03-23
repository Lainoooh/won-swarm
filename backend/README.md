# WonSwarm Backend

协同调度系统后端 API

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 初始化数据库

```bash
cd backend
python scripts/init_db.py
```

### 3. 启动服务

```bash
uvicorn app.main:app --reload --port 8080
```

访问 http://localhost:8080/docs 查看 API 文档

## 项目结构

```
backend/
├── app/
│   ├── main.py              # 应用入口
│   ├── config.py            # 配置
│   ├── database.py          # 数据库连接
│   ├── models/              # SQLAlchemy 模型
│   ├── schemas/             # Pydantic Schema
│   ├── api/                 # API 路由
│   └── services/            # 业务逻辑
├── scripts/
│   └── init_db.py           # 数据库初始化脚本
└── requirements.txt
```

## API 端点

### Agents
- GET /api/agents - 获取 Agent 列表
- POST /api/agents - 创建 Agent
- GET /api/agents/{id} - 获取 Agent 详情
- PUT /api/agents/{id} - 更新 Agent
- DELETE /api/agents/{id} - 删除 Agent
- POST /api/agents/register - Agent 注册
- POST /api/agents/{id}/heartbeat - 心跳上报
- WS /api/agents/ws/{id} - WebSocket 连接

### Projects
- GET /api/projects - 获取项目列表
- POST /api/projects - 创建项目
- GET /api/projects/{id} - 获取项目详情
- PUT /api/projects/{id} - 更新项目
- DELETE /api/projects/{id} - 删除项目
- GET /api/projects/{id}/requirements - 获取需求树
- POST /api/projects/{id}/requirements - 创建需求

## WebSocket

### Agent 连接
```
WS /api/agents/ws/{agent_id}
```

### 客户端连接
```
WS /ws/clients?session_id={session_id}
```
