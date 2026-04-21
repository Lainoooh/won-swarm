# WonSwarm 后端 API 设计方案

## 一、系统架构

### 技术栈
- **框架**: FastAPI 0.109+
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: SQLAlchemy 2.0 (异步)
- **WebSocket**: 原生 WebSocket 支持
- **认证**: API Key (SK) Hash 认证

### 目录结构
```
backend/
├── app/
│   ├── main.py              # FastAPI 应用入口
│   ├── config.py            # 配置管理
│   ├── database.py          # 数据库连接
│   ├── models/              # SQLAlchemy 模型
│   ├── schemas/             # Pydantic Schema
│   ├── api/                 # API 路由
│   └── services/            # 业务逻辑层
├── scripts/
│   └── init_db.py           # 数据库初始化脚本
└── requirements.txt
```

## 二、API 端点

### Agent 管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/agents | 获取 Agent 列表（分页） |
| POST | /api/agents | 创建 Agent |
| GET | /api/agents/{id} | 获取 Agent 详情 |
| PUT | /api/agents/{id} | 更新 Agent |
| DELETE | /api/agents/{id} | 删除 Agent |
| POST | /api/agents/register | Agent 自主注册 |
| POST | /api/agents/{id}/heartbeat | 心跳上报 |
| POST | /api/agents/{id}/stop | 停止/启动 Agent |
| WS | /api/agents/ws/{id} | WebSocket 连接 |

### 项目管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/projects | 获取项目列表 |
| POST | /api/projects | 创建项目 |
| GET | /api/projects/{id} | 获取项目详情 |
| PUT | /api/projects/{id} | 更新项目 |
| DELETE | /api/projects/{id} | 删除项目 |
| GET | /api/projects/{id}/requirements | 获取需求树 |
| POST | /api/projects/{id}/requirements | 创建需求 |
| GET | /api/projects/{id}/tasks | 获取任务列表 |

## 三、快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python scripts/init_db.py

# 启动服务
uvicorn app.main:app --reload --port 8080
```

访问 http://localhost:8080/docs 查看 API 文档
