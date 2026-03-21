import request from './request'

// 获取需求列表
export function getRequirements(params) {
  return request({
    url: '/requirements',
    method: 'get',
    params
  })
}

// 获取需求详情
export function getRequirementDetail(id) {
  return request({
    url: `/requirements/${id}`,
    method: 'get'
  })
}

// 创建需求
export function createRequirement(data) {
  return request({
    url: '/requirements',
    method: 'post',
    data
  })
}

// 更新需求
export function updateRequirement(id, data) {
  return request({
    url: `/requirements/${id}`,
    method: 'put',
    data
  })
}

// 删除需求
export function deleteRequirement(id) {
  return request({
    url: `/requirements/${id}`,
    method: 'delete'
  })
}

// 更新需求状态
export function updateRequirementStatus(id, data) {
  return request({
    url: `/requirements/${id}/status`,
    method: 'post',
    data
  })
}

// 获取需求任务列表
export function getRequirementTasks(id) {
  return request({
    url: `/requirements/${id}/tasks`,
    method: 'get'
  })
}
