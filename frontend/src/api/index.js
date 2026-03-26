// API 基础配置
const API_BASE_URL = '/api';

/**
 * 通用 fetch 封装
 */
async function request(url, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ Agent API ============

/**
 * 获取 Agent 列表
 */
export async function getAgents(params = {}) {
  const searchParams = new URLSearchParams(params).toString();
  return request(`/agents?${searchParams}`);
}

/**
 * 获取单个 Agent
 */
export async function getAgent(id) {
  return request(`/agents/${id}`);
}

/**
 * 创建 Agent
 */
export async function createAgent(data) {
  return request('/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 更新 Agent
 */
export async function updateAgent(id, data) {
  return request(`/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 删除 Agent
 */
export async function deleteAgent(id) {
  return request(`/agents/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 停止/启动 Agent
 */
export async function stopAgent(id, stop = true) {
  return request(`/agents/${id}/stop`, {
    method: 'POST',
    body: JSON.stringify({ stop }),
  });
}

/**
 * Agent 注册
 */
export async function registerAgent(data) {
  return request('/agents/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Agent 心跳
 */
export async function sendHeartbeat(id, data) {
  return request(`/agents/${id}/heartbeat`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============ Project API ============

/**
 * 获取项目列表
 */
export async function getProjects(params = {}) {
  const searchParams = new URLSearchParams(params).toString();
  return request(`/projects?${searchParams}`);
}

/**
 * 获取单个项目
 */
export async function getProject(id) {
  return request(`/projects/${id}`);
}

/**
 * 创建项目
 */
export async function createProject(data) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 更新项目
 */
export async function updateProject(id, data) {
  return request(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 删除项目
 */
export async function deleteProject(id) {
  return request(`/projects/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取项目需求树
 */
export async function getRequirementsTree(projectId) {
  return request(`/projects/${projectId}/requirements`);
}

/**
 * 创建需求
 */
export async function createRequirement(projectId, data) {
  return request(`/projects/${projectId}/requirements`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 更新需求
 */
export async function updateRequirement(reqId, projectId, data) {
  return request(`/projects/${projectId}/requirements/${reqId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 删除需求
 */
export async function deleteRequirement(reqId, projectId) {
  return request(`/projects/${projectId}/requirements/${reqId}`, {
    method: 'DELETE',
  });
}

/**
 * 创建需求大纲（模块）带功能点和任务
 */
export async function createRequirementModule(projectId, data) {
  return request(`/projects/${projectId}/requirements/module`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 创建任务
 */
export async function createTask(projectId, data) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**

 * 需求操作 (cancel/pause/advance/complete)
 */
export async function requirementAction(reqId, projectId, action) {
  return request(`/projects/${projectId}/requirements/${reqId}/action`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}

/**
 * 获取项目任务列表
 */
export async function getProjectTasks(projectId, params = {}) {
  const searchParams = new URLSearchParams(params).toString();
  return request(`/projects/${projectId}/tasks?${searchParams}`);
}
