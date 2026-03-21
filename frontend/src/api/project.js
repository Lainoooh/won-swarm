import request from './request'

// 获取项目列表
export function getProjects(params) {
  return request({
    url: '/projects',
    method: 'get',
    params
  })
}

// 获取项目详情
export function getProjectDetail(id) {
  return request({
    url: `/projects/${id}`,
    method: 'get'
  })
}

// 创建项目
export function createProject(data) {
  return request({
    url: '/projects',
    method: 'post',
    data
  })
}

// 更新项目
export function updateProject(id, data) {
  return request({
    url: `/projects/${id}`,
    method: 'put',
    data
  })
}

// 删除项目
export function deleteProject(id) {
  return request({
    url: `/projects/${id}`,
    method: 'delete'
  })
}

// 获取项目需求列表
export function getProjectRequirements(id) {
  return request({
    url: `/projects/${id}/requirements`,
    method: 'get'
  })
}

// 获取项目任务列表
export function getProjectTasks(id) {
  return request({
    url: `/projects/${id}/tasks`,
    method: 'get'
  })
}
