import request from './request'

// 获取 Agent 列表
export function getAgents(params) {
  return request({
    url: '/agents',
    method: 'get',
    params
  })
}

// 获取 Agent 详情
export function getAgentDetail(id) {
  return request({
    url: `/agents/${id}`,
    method: 'get'
  })
}

// 注册 Agent
export function registerAgent(data) {
  return request({
    url: '/agents/register',
    method: 'post',
    data
  })
}

// Agent 心跳
export function agentHeartbeat(id, data) {
  return request({
    url: `/agents/${id}/heartbeat`,
    method: 'post',
    data
  })
}

// 获取待处理任务
export function getPendingTasks(id) {
  return request({
    url: `/agents/${id}/tasks/pending`,
    method: 'get'
  })
}

// 领取任务
export function claimTask(taskId, agentId) {
  const formData = new FormData()
  formData.append('agent_id', agentId)
  return request({
    url: `/agents/tasks/${taskId}/claim`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
