<template>
  <div class="project-detail-page">
    <el-page-header @back="$router.back()" :title="'项目详情'">
      <template #content>
        <div class="header-content">
          <span class="header-name">{{ project.name }}</span>
          <el-tag :type="getStatusType(project.status)" class="header-status">
            {{ getStatusText(project.status) }}
          </el-tag>
        </div>
      </template>
    </el-page-header>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>项目信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="项目名称" :span="2">{{ project.name }}</el-descriptions-item>
            <el-descriptions-item label="项目描述" :span="2">
              {{ project.description || '暂无描述' }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(project.status)">
                {{ getStatusText(project.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="进度">{{ project.progress || 0 }}%</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatTime(project.created_at) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="mt-4">
          <template #header>
            <span>需求列表</span>
            <el-button type="primary" size="small" @click="goToRequirements">
              查看全部
            </el-button>
          </template>
          <el-table :data="requirements" style="width: 100%">
            <el-table-column prop="title" label="需求标题" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="priority" label="优先级" width="80" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>项目统计</span>
          </template>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">{{ project.requirement_count || 0 }}</div>
              <div class="stat-label">总需求</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ project.task_count || 0 }}</div>
              <div class="stat-label">总任务</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ project.completed_count || 0 }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>

        <el-card class="mt-4">
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="goToRequirements">需求管理</el-button>
            <el-button type="success" @click="goToTasks">任务看板</el-button>
            <el-button type="info" @click="goToDocs">文档中心</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectDetail, getProjectRequirements } from '@/api/project'

const route = useRoute()
const router = useRouter()

const project = ref({})
const requirements = ref([])

const statusMap = {
  planning: { type: 'info', text: '规划中' },
  in_progress: { type: 'warning', text: '进行中' },
  completed: { type: 'success', text: '已完成' },
  archived: { type: 'info', text: '已归档' }
}

const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const fetchDetail = async () => {
  try {
    const res = await getProjectDetail(route.params.id)
    project.value = res.data
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
}

const fetchRequirements = async () => {
  try {
    const res = await getProjectRequirements(route.params.id)
    requirements.value = res.data.items?.slice(0, 5) || []
  } catch (error) {
    console.error('获取需求列表失败:', error)
  }
}

const goToRequirements = () => {
  router.push(`/projects/${route.params.id}/reqs`)
}

const goToTasks = () => {
  router.push(`/projects/${route.params.id}/tasks`)
}

const goToDocs = () => {
  router.push(`/projects/${route.params.id}/docs`)
}

onMounted(() => {
  fetchDetail()
  fetchRequirements()
})
</script>

<style scoped>
.project-detail-page {
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-name {
  font-size: 18px;
  font-weight: bold;
}

.header-status {
  margin-left: 8px;
}

.mt-4 {
  margin-top: 20px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  color: #999;
  margin-top: 8px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
