<template>
  <div class="agent-detail-page">
    <el-page-header @back="$router.back()" :title="'Agent 详情'">
      <template #content>
        <div class="header-content">
          <span class="header-name">{{ agentDetail.name }}</span>
          <el-tag :type="getStatusType(agentDetail.status)" class="header-status">
            {{ getStatusText(agentDetail.status) }}
          </el-tag>
        </div>
      </template>
    </el-page-header>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Agent ID">{{ agentDetail.id }}</el-descriptions-item>
            <el-descriptions-item label="名称">{{ agentDetail.name }}</el-descriptions-item>
            <el-descriptions-item label="角色" :span="2">
              <el-tag
                v-for="role in agentDetail.roles"
                :key="role"
                size="small"
                class="mr-1"
              >
                {{ getRoleName(role) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(agentDetail.status)">
                {{ getStatusText(agentDetail.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatTime(agentDetail.created_at) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后心跳" :span="2">
              {{ formatTime(agentDetail.last_heartbeat) || '无' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>任务统计</span>
          </template>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">完成任务</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAgentDetail } from '@/api/agent'

const route = useRoute()
const agentDetail = ref({})

const roleNames = {
  'project-manager': '项目经理',
  'product-manager': '产品经理',
  'ui-designer': 'UI 设计师',
  'frontend-developer': '前端研发',
  'backend-developer': '后端研发',
  'qa-engineer': '测试工程师'
}

const getStatusType = (status) => {
  const map = { online: 'success', offline: 'info', idle: 'warning', busy: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { online: '在线', offline: '离线', idle: '空闲', busy: '忙碌' }
  return map[status] || '未知'
}

const getRoleName = (role) => roleNames[role] || role

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const fetchDetail = async () => {
  try {
    const res = await getAgentDetail(route.params.id)
    agentDetail.value = res.data
  } catch (error) {
    console.error('获取详情失败:', error)
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.agent-detail-page {
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

.mt-4 {
  margin-top: 20px;
}

.mr-1 {
  margin-right: 8px;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
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
</style>
