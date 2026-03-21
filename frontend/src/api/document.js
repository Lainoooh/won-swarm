import request from './request'

// 获取文档列表
export function getDocuments(params) {
  return request({
    url: '/documents',
    method: 'get',
    params
  })
}

// 上传文档
export function uploadDocument(data) {
  return request({
    url: '/documents/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 获取文档详情
export function getDocumentDetail(id) {
  return request({
    url: `/documents/${id}`,
    method: 'get'
  })
}

// 删除文档
export function deleteDocument(id) {
  return request({
    url: `/documents/${id}`,
    method: 'delete'
  })
}

// 获取文档下载链接
export function getDocumentDownload(id) {
  return request({
    url: `/documents/${id}/download`,
    method: 'get'
  })
}
