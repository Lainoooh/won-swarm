# 协同研发平台 - 任务下发与 Agent 状态监控设计

## 一、Agent 状态监控增强设计

### 1.1 Agent 状态字段设计

```python
class AgentStatus(str, Enum):
    OFFLINE = "offline"          # 离线
    IDLE = "idle"                # 空闲
    BUSY = "busy"                # 执行中
    AWAY = "away"                # 暂时离开

class AgentModel(Base):
    id: str
    name: str
    secret_key: str
    roles: List[str]
    status: AgentStatus          # 在线状态
    current_task: Optional[TaskInfo]  # 当前任务信息
    last_heartbeat: datetime     # 最后心跳时间
    websocket_session_id: Optional[str]  # WebSocket 会话 ID
    registered_at: datetime
```

### 1.2 当前任务信息结构

```python
class TaskInfo(BaseModel):
    task_id: str              # 任务 ID
    task_title: str           # 任务标题
    task_type: str            # 任务类型
    project_id: str           # 所属项目
    project_name: str         # 项目名称
    started_at: datetime      # 开始时间
    estimated_end: datetime   # 预计结束时间
    detail_url: str           # 任务详情 URL（前端可跳转）
```

### 1.3 Agent 状态监控 API

```
GET /api/agents
├── 返回 Agent 列表，包含：
│   ├── 基本信息（id, name, roles）
│   ├── 状态（status）
│   ├── current_task（任务信息，带 task_id 和跳转链接）
│   └── last_heartbeat（最后心跳）

GET /api/agents/:id/status
└── 获取单个 Agent 详细状态

GET /api/agents/online
└── 获取所有在线 Agent

WS /ws/agents/:agent_id
└── WebSocket 连接，实时推送状态变更
```

### 1.4 前端展示设计

```
┌─────────────────────────────────────────────────────────────────┐
│ Agent 列表                                    [+ 新增 Agent]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟢 Agent-001    产品经理 | UI 设计                           │ │
│ │                                                            │ │
│ │ 当前任务：需求文档评审                                       │ │
│ │          📋 TASK-20260321-001  [查看详情 →]                 │ │
│ │          项目：电商平台重构                                  │ │
│ │          开始：10:00 | 预计结束：18:00                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟢 Agent-002    前端开发                                     │ │
│ │                                                            │ │
│ │ 当前任务：登录页面开发                                       │ │
│ │          📋 TASK-20260321-005  [查看详情 →]                 │ │
│ │          项目：电商平台重构                                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔴 Agent-003    后端开发                                     │ │
│ │                                                            │ │
│ │ 状态：离线                                                   │ │
│ │ 最后在线：2 小时前                                           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟡 Agent-004    测试工程师                                   │ │
│ │                                                            │ │
│ │ 空闲中 - 可分配任务                                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、任务下发方案分析与设计

### 2.1 场景分析

**网络环境**：
- 协同研发平台：部署在公网，有固定外网 IP 和端口
- Agent 执行节点：位于局域网内，可主动访问外网
- 防火墙策略：允许出站连接，阻止入站连接

```
┌─────────────────┐
│   局域网内       │
│  ┌───────────┐  │
│  │   Agent   │  │  可主动访问外网
│  │  (Client) │  │  但无法被外网直接访问
│  └─────┬─────┘  │
│        │        │
│        │ 出站连接  │
│        ▼        │
│  ┌───────────┐  │
│  │  防火墙   │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         │ 互联网
         │
         ▼
┌─────────────────┐
│  协同研发平台    │
│   (公网 IP)     │
└─────────────────┘
```

### 2.2 方案对比

| 方案 | WebSocket | 长轮询 | 消息队列 + 客户端拉取 | 反向连接 |
|------|-----------|--------|----------------------|---------|
| **实时性** | ⭐⭐⭐⭐⭐ 即时 | ⭐⭐⭐ 秒级延迟 | ⭐⭐ 依赖轮询间隔 | ⭐⭐⭐⭐ 秒级 |
| **网络兼容性** | ⭐⭐⭐⭐⭐ 出站即可 | ⭐⭐⭐⭐⭐ 出站即可 | ⭐⭐⭐⭐⭐ 出站即可 | ⭐⭐⭐⭐⭐ 出站即可 |
| **实现复杂度** | ⭐⭐⭐ 中等 | ⭐⭐ 简单 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| **资源消耗** | ⭐⭐⭐ 长连接 | ⭐⭐ 频繁请求 | ⭐⭐⭐⭐ 按需拉取 | ⭐⭐⭐ 长连接 |
| **断线恢复** | ⭐⭐⭐⭐ 自动重连 | ⭐⭐⭐⭐⭐ 天然支持 | ⭐⭐⭐⭐⭐ 天然支持 | ⭐⭐⭐⭐ 重连机制 |
| **双向通信** | ⭐⭐⭐⭐⭐ 天然支持 | ⭐⭐ 单向为主 | ⭐ 单向 | ⭐⭐⭐⭐ 支持 |
| **任务推送** | ⭐⭐⭐⭐⭐ 即时推送 | ⭐⭐ 延迟推送 | ⭐⭐ 延迟推送 | ⭐⭐⭐⭐ 即时推送 |

### 2.3 推荐方案：WebSocket + 消息队列（混合架构）

#### 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                    协同研发平台 (Server Side)                     │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │  Task API   │───▶│ Message Queue│───▶│ WebSocket Manager   │ │
│  │  (HTTP)     │    │   (Redis)   │    │  (连接管理 + 路由)    │ │
│  └─────────────┘    └──────┬──────┘    └──────────┬──────────┘ │
│                            │                       │           │
└────────────────────────────┼───────────────────────┼───────────┘
                             │                       │
                             │                       │
                    ┌────────▼────────┐      ┌───────▼────────┐
                    │   消息队列订阅   │      │  WebSocket 连接  │
                    │   (备用拉取)    │      │   (实时推送)    │
                    └────────┬────────┘      └───────┬────────┘
                             │                       │
                    ┌────────▼───────────────────────▼────────┐
                    │            Agent Client                  │
                    │   (局域网内，主动建立 WebSocket 连接)       │
                    └─────────────────────────────────────────┘
```

#### 工作流程

```
1. Agent 启动 → 主动连接平台 WebSocket 服务
                ↓
2. 平台验证 Agent 身份 → 建立长连接 → 记录 session_id
                ↓
3. 用户在平台创建任务 → 任务存入数据库
                ↓
4. 平台发送消息到 Redis Queue → WebSocket Manager 推送给 Agent
                ↓
5. Agent 确认接收 → 更新任务状态为 "已接收"
                ↓
6. Agent 执行任务 → 定期上报进度
                ↓
7. 任务完成 → Agent 上报结果 → 平台更新状态

【异常处理】
- WebSocket 断线 → Agent 自动重连
- 重连失败 → 降级为 HTTP 轮询模式
- 消息超时未确认 → 平台重新推送或标记异常
```

### 2.4 WebSocket 方案详细设计

#### 2.4.1 连接建立

```python
# Agent 端连接
WS /ws/agent/connect
Headers:
  - X-Agent-Secret: sk-xxxxx
  - X-Agent-Id: agent-uuid

# 服务端响应
{
  "type": "connected",
  "agent_id": "agent-uuid",
  "session_id": "session-xxxxx",
  "server_time": "2026-03-21T10:00:00Z"
}
```

#### 2.4.2 消息格式

```python
# 平台 → Agent 任务下发
{
  "type": "task_assigned",
  "message_id": "msg-uuid",
  "timestamp": "2026-03-21T10:00:00Z",
  "data": {
    "task_id": "task-uuid",
    "task_title": "登录页面开发",
    "task_type": "frontend_development",
    "project_id": "proj-uuid",
    "project_name": "电商平台重构",
    "requirement_id": "req-uuid",
    "priority": "P1",
    "deadline": "2026-03-22T18:00:00Z",
    "description": "...",
    "attachments": [...]
  }
}

# Agent → 平台 确认接收
{
  "type": "task_ack",
  "message_id": "msg-uuid",  # 对应平台消息 ID
  "task_id": "task-uuid",
  "status": "accepted",  # accepted / rejected
  "agent_id": "agent-uuid",
  "timestamp": "2026-03-21T10:00:01Z"
}

# Agent → 平台 进度上报
{
  "type": "task_progress",
  "task_id": "task-uuid",
  "progress": 50,  # 0-100
  "status": "in_progress",
  "message": "已完成页面布局开发",
  "timestamp": "2026-03-21T14:00:00Z"
}

# Agent → 平台 任务完成
{
  "type": "task_completed",
  "task_id": "task-uuid",
  "status": "completed",
  "result": {
    "code_repository": "https://github.com/...",
    "artifacts": [...],
    "test_report": {...}
  },
  "message": "任务已完成，代码已提交",
  "timestamp": "2026-03-21T18:00:00Z"
}
```

#### 2.4.3 心跳机制

```python
# Agent → 平台 心跳
{
  "type": "heartbeat",
  "agent_id": "agent-uuid",
  "status": "idle",  # idle / busy / away
  "current_task_id": "task-uuid",  # 可选，忙碌时填写
  "timestamp": "2026-03-21T10:00:00Z"
}

# 平台 → Agent 心跳响应
{
  "type": "heartbeat_ack",
  "server_time": "2026-03-21T10:00:00Z"
}

# 心跳间隔：30 秒
# 超时判定：90 秒无心跳标记为离线
```

### 2.5 降级方案：HTTP 轮询

当 WebSocket 不可用时，Agent 降级为 HTTP 轮询：

```python
# Agent 定期拉取任务
GET /api/agents/:agent_id/tasks/pending
Headers:
  - X-Agent-Secret: sk-xxxxx

# 响应
{
  "code": 200,
  "data": {
    "pending_tasks": [
      {
        "task_id": "task-uuid",
        "task_title": "...",
        "task_type": "...",
        "priority": "P1",
        "created_at": "..."
      }
    ],
    "pending_messages": [...]
  }
}

# 轮询间隔：5 秒（可配置）
```

### 2.6 方案总结

| 特性 | 实现方式 |
|------|---------|
| **连接建立** | Agent 主动连接平台 WebSocket |
| **任务推送** | WebSocket 实时推送 + Redis 队列缓冲 |
| **状态同步** | WebSocket 心跳 + 定期全量同步 |
| **断线恢复** | 自动重连 + 消息补发 |
| **降级方案** | HTTP 轮询（5 秒间隔） |
| **消息确认** | ACK 机制 + 超时重发 |

---

## 三、API 接口补充设计

### 3.1 Agent 相关

```
# Agent 状态上报
POST /api/agents/:agent_id/heartbeat
{
  "status": "idle",
  "current_task_id": null
}

# Agent 连接 WebSocket
WS /ws/agent/connect?secret=sk-xxxxx&agent_id=agent-uuid
```

### 3.2 任务相关

```
# 给 Agent 分配任务
POST /api/tasks/:task_id/assign
{
  "agent_id": "agent-uuid"
}

# Agent 拉取待处理任务（降级方案）
GET /api/agents/:agent_id/tasks/pending

# Agent 上报任务进度
POST /api/tasks/:task_id/progress
{
  "progress": 50,
  "status": "in_progress",
  "message": "开发中..."
}

# Agent 上报任务完成
POST /api/tasks/:task_id/complete
{
  "status": "completed",
  "result": {...},
  "message": "任务完成"
}
```

---

## 四、数据库变更

### 4.1 agents 表新增字段

```sql
ALTER TABLE agents ADD COLUMN websocket_session_id VARCHAR(64);
ALTER TABLE agents ADD COLUMN last_heartbeat DATETIME;
ALTER TABLE agents ADD COLUMN status VARCHAR(20) DEFAULT 'offline';
```

### 4.2 tasks 表新增字段

```sql
ALTER TABLE tasks ADD COLUMN assigned_at DATETIME;
ALTER TABLE agents ADD COLUMN current_task_id VARCHAR(36);
```

### 4.3 新增 task_assignments 表

```sql
CREATE TABLE task_assignments (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    agent_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',  -- pending/accepted/rejected/completed
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    completed_at DATETIME,
    result JSON,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);
```

---

## 五、前端交互设计

### 5.1 Agent 列表页增强

```
┌─────────────────────────────────────────────────────────────────┐
│ Agent 列表                           筛选：[全部] [在线] [忙碌] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟢 前端 Agent-01    [前端开发][UI 设计]            10:00 在线  │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ 📌 当前任务：TASK-20260321-005                              │ │
│ │    标题：登录页面开发                                        │ │
│ │    项目：电商平台重构           [查看任务详情 →]             │ │
│ │    进度：████████░░░░ 80%                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟡 后端 Agent-01    [后端开发]                     10:00 在线  │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ 空闲中 - 可以分配任务                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔴 测试 Agent-01    [测试工程师]                   离线      │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ 最后在线：2 小时前                                           │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 任务分配弹窗

```
┌─────────────────────────────────────────────────┐
│ 分配任务                              [×]       │
├─────────────────────────────────────────────────┤
│ 任务：登录页面开发                               │
│ 项目：电商平台重构                               │
│                                                │
│ 选择执行 Agent:                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ 🟢 前端 Agent-01    空闲      [选择]        ││
│ │ 🟢 前端 Agent-02    执行中    [选择]        ││
│ │ 🟡 后端 Agent-01    空闲      [选择]        ││
│ │ 🔴 测试 Agent-01    离线      [禁用]        ││
│ └─────────────────────────────────────────────┘│
│                                                │
│ 优先级：[P1 高 ▼]                              │
│ 截止时间：[2026-03-22 18:00]                   │
│                                                │
│            [取消]      [确认分配]               │
└─────────────────────────────────────────────────┘
```

---

*文档结束*
