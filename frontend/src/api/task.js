import request from './request'

// 获取任务列表
export function getTasks(params) {
  return request({
    url: '/tasks',
    method: 'get',
    params
  })
}

// 获取任务详情
export function getTaskDetail(id) {
  return request({
    url: `/tasks/${id}`,
    method: 'get'
  })
}

// 创建任务
export function createTask(data) {
  return request({
    url: '/tasks',
    method: 'post',
    data
  })
}

// 分配任务
export function assignTask(id, data) {
  return request({
    url: `/tasks/${id}/assign`,
    method: 'post',
    data
  })
}

// 更新任务状态
export function updateTaskStatus(id, data) {
  return request({
    url: `/tasks/${id}/status`,
    method: 'post',
    data
  })
}

// 完成任务
export function completeTask(id, data) {
  return request({
    url: `/tasks/${id}/complete`,
    method: 'post',
    data
  })
}

// 获取看板视图
export function getKanban(params) {
  return request({
    url: '/tasks/kanban/view',
    method: 'get',
    params
  })
}
