// --- Mock Data ---

export const mockAgents = [
  { id: 'ag-101', name: 'PC2-项目经理', roles: ['project-manager'], status: 'online', task: 'TASK-001', progress: 85, lastPing: '2s ago', sk: 'sk_x8f...2a', caps: ['task-decomposition'] },
  { id: 'ag-102', name: 'PC2-前端开发', roles: ['frontend-developer'], status: 'idle', task: null, progress: 0, lastPing: '5s ago', sk: 'sk_v2m...9p', caps: ['vue3', 'react'] },
  { id: 'ag-103', name: 'PC2-后端开发', roles: ['backend-developer'], status: 'busy', task: 'TASK-002', progress: 42, lastPing: '1s ago', sk: 'sk_q1l...5c', caps: ['fastapi', 'python'] },
  { id: 'ag-104', name: 'MAC-UI 设计', roles: ['ui-designer'], status: 'offline', task: null, progress: 0, lastPing: '2h ago', sk: 'sk_p9k...1z', caps: ['figma'] },
  { id: 'ag-105', name: 'Server-测试专家', roles: ['qa-engineer'], status: 'online', task: 'TASK-003', progress: 10, lastPing: '1s ago', sk: 'sk_t5b...8r', caps: ['pytest', 'selenium'] },
];

export const mockProjects = [
  { id: 'PROJ-001', name: '电商平台重构', status: 'in_progress', manager: 'PC2-项目经理', startDate: '2026-03-01', endDate: '2026-06-30', progress: 45, reqCount: 24, taskCount: 86 },
  { id: 'PROJ-002', name: '内部协同 ERP 系统', status: 'planning', manager: 'Admin', startDate: '2026-04-15', endDate: '2026-10-01', progress: 0, reqCount: 12, taskCount: 0 },
  { id: 'PROJ-003', name: 'OneSwarm 官网开发', status: 'completed', manager: 'PC2-项目经理', startDate: '2026-01-10', endDate: '2026-03-15', progress: 100, reqCount: 8, taskCount: 32 },
];

export const mockReqTree = [
  {
    id: 'MOD-01', type: 'module', title: '用户认证中心', creator: 'Admin', docs: 2, expanded: true,
    children: [
      { id: 'FEAT-010', type: 'feature', reqType: 'new', title: '标准账号密码登录与注册', priority: 'P0', status: 'testing', creator: '产品经理', docs: 3, currentStep: 4 },
      { id: 'FEAT-011', type: 'feature', reqType: 'change', title: '第三方 OAuth 授权登录', priority: 'P1', status: 'in_development', creator: '产品经理', docs: 2, currentStep: 2 },
      { id: 'FEAT-012', type: 'feature', reqType: 'bug', title: '多因素认证 (MFA)', priority: 'P2', status: 'planning', creator: '安全专员', docs: 1, currentStep: 0 },
    ]
  },
  {
    id: 'MOD-02', type: 'module', title: '购物车与交易核心', creator: '架构师', docs: 1, expanded: true,
    children: [
      { id: 'FEAT-020', type: 'feature', reqType: 'new', title: '购物车性能优化 (缓存重构)', priority: 'P0', status: 'reviewing', creator: '产品经理', docs: 4, currentStep: 2 },
      { id: 'FEAT-021', type: 'feature', reqType: 'bug', title: '支付回调偶发失败修复', priority: 'P0', status: 'in_development', creator: '测试团队', docs: 2, currentStep: 4 },
    ]
  }
];

export const mockTasks = [
  { id: 'TASK-001', reqId: 'FEAT-010', stepIdx: 0, title: '需求分析与用例拆解', project: '电商平台重构', feature: '标准账号密码登录与注册', status: 'completed', assignee: 'PC2-项目经理', priority: 'P1', dueDate: '2026-03-20', comments: 3 },
  { id: 'TASK-002', reqId: 'FEAT-011', stepIdx: 2, title: '第三方登录 API 开发', project: '电商平台重构', feature: '第三方 OAuth 授权登录', status: 'in_progress', assignee: 'PC2-后端开发', priority: 'P0', dueDate: '2026-03-25', comments: 5 },
  { id: 'TASK-003', reqId: 'FEAT-010', stepIdx: 5, title: '登录页面自动化测试脚本', project: '电商平台重构', feature: '标准账号密码登录与注册', status: 'pending', assignee: 'Server-测试专家', priority: 'P2', dueDate: '2026-03-28', comments: 0 },
  { id: 'TASK-004', reqId: 'FEAT-020', stepIdx: 1, title: '商品详情页 UI 设计', project: '电商平台重构', feature: '购物车性能优化', status: 'completed', assignee: 'MAC-UI 设计', priority: 'P1', dueDate: '2026-03-18', comments: 2 },
  { id: 'TASK-005', reqId: 'FEAT-010', stepIdx: 4, title: '用户登录注册核心逻辑研发', project: '电商平台重构', feature: '标准账号密码登录与注册', status: 'blocked', assignee: 'PC2-后端开发', priority: 'P0', dueDate: '2026-03-22', comments: 8 },
];

export const mockLogs = [
  "[10:00:01] WS CONNECTED: session-xyz agent: ag-101",
  "[10:00:05] TASK ASSIGNED: ag-103 -> TASK-002",
  "[10:00:12] HEARTBEAT ACK: ag-102 status: idle",
  "[10:00:15] PROGRESS UPDATE: ag-101 (85%)",
  "[10:00:22] HEARTBEAT ACK: ag-105 status: online",
];
