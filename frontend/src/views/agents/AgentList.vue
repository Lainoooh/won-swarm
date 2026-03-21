<template>
  <div class="agent-list-page">
    <div class="page-header">
      <h2>Agent 管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          新增 Agent
        </el-button>
        <el-button @click="refreshList">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- Agent 列表 -->
    <el-row :gutter="20" class="agent-grid">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="agent in agentStore.agentList" :key="agent.id">
        <el-card class="agent-card" :class="`status-${agent.status}`" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="agent-info">
                <el-avatar :size="40" :icon="User" :class="`avatar-${agent.status}`" />
                <div class="agent-details">
                  <div class="agent-name">{{ agent.name }}</div>
                  <div class="agent-status">
                    <el-tag :type="getStatusType(agent.status)" size="small">
                      {{ getStatusText(agent.status) }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div class="card-content">
            <div class="roles">
              <el-tag
                v-for="role in agent.roles"
                :key="role"
                size="small"
                class="role-tag"
              >
                {{ getRoleName(role) }}
              </el-tag>
            </div>

            <div class="current-task" v-if="agent.current_task_id">
              <el-divider border-style="dashed" />
              <div class="task-info">
                <el-icon><Document /></el-icon>
                <span>当前任务：{{ agent.current_task_id }}</span>
              </div>
            </div>

            <div class="last-heartbeat" v-if="agent.last_heartbeat">
              <el-icon><Clock /></el-icon>
              <span>最后心跳：{{ formatTime(agent.last_heartbeat) }}</span>
            </div>
          </div>

          <template #footer>
            <div class="card-footer">
              <el-button link type="primary" @click="viewDetail(agent.id)">
                查看详情
              </el-button>
              <el-button link type="primary" @click="copySK(agent)">
                复制 SK
              </el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty v-if="agentStore.agentList.length === 0" description="暂无 Agent" />

    <!-- 新增 Agent 对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新增 Agent"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="Agent 名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入 Agent 名称" />
        </el-form-item>

        <el-form-item label="角色选择" prop="roles" required>
          <el-checkbox-group v-model="form.roles">
            <el-checkbox label="project-manager">项目经理</el-checkbox>
            <el-checkbox label="product-manager">产品经理</el-checkbox>
            <el-checkbox label="ui-designer">UI 设计师</el-checkbox>
            <el-checkbox label="frontend-developer">前端研发</el-checkbox>
            <el-checkbox label="backend-developer">后端研发</el-checkbox>
            <el-checkbox label="qa-engineer">测试工程师</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="能力标签" prop="capabilities">
          <el-select v-model="form.capabilities" multiple placeholder="请选择能力标签">
            <el-option label="任务拆解" value="task-decomposition" />
            <el-option label="进度跟踪" value="progress-tracking" />
            <el-option label="结果汇总" value="result-summary" />
            <el-option label="代码开发" value="coding" />
            <el-option label="测试" value="testing" />
          </el-select>
        </el-form-item>

        <el-form-item label="最大并发任务" prop="max_concurrent_tasks">
          <el-input-number v-model="form.max_concurrent_tasks" :min="1" :max="10" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate" :loading="creating">
          生成 SK 并创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 创建成功提示 -->
    <el-dialog
      v-model="showSuccessDialog"
      title="Agent 创建成功"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-result icon="success" title="创建成功" sub-title="请保存以下信息">
        <template #extra>
          <div class="success-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Agent ID">
                {{ createdAgent.agent_id }}
              </el-descriptions-item>
              <el-descriptions-item label="Platform AK">
                <div class="copy-row">
                  <span>{{ createdAgent.platform_ak }}</span>
                  <el-button link type="primary" @click="copyText(createdAgent.platform_ak)">
                    复制
                  </el-button>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Worker SK">
                <div class="copy-row">
                  <span class="sk-text">{{ createdAgent.worker_sk }}</span>
                  <el-button link type="primary" @click="copyText(createdAgent.worker_sk)">
                    复制
                  </el-button>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="注册地址">
                <div class="copy-row">
                  <span>{{ createdAgent.register_url }}</span>
                  <el-button link type="primary" @click="copyText(createdAgent.register_url)">
                    复制
                  </el-button>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-result>

      <template #footer>
        <el-button type="primary" @click="showSuccessDialog = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAgentStore } from '@/stores/agent'
import { registerAgent } from '@/api/agent'

const router = useRouter()
const agentStore = useAgentStore()

const showCreateDialog = ref(false)
const showSuccessDialog = ref(false)
const creating = ref(false)
const createdAgent = ref({})

const formRef = ref()
const form = reactive({
  name: '',
  roles: [],
  capabilities: [],
  max_concurrent_tasks: 3
})

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

const refreshList = async () => {
  await agentStore.fetchAgentList()
}

const viewDetail = (id) => {
  router.push(`/agents/${id}`)
}

const copySK = (agent) => {
  copyText(agent.worker_sk || '暂无 SK')
}

const copyText = (text) => {
  navigator.clipboard.writeText(text)
  ElMessage.success('复制成功')
}

const resetForm = () => {
  form.name = ''
  form.roles = []
  form.capabilities = []
  form.max_concurrent_tasks = 3
  formRef.value?.clearValidate()
}

const handleCreate = async () => {
  if (!form.name || form.roles.length === 0) {
    ElMessage.warning('请填写完整信息')
    return
  }

  creating.value = true
  try {
    const res = await registerAgent(form)
    createdAgent.value = res.data
    showSuccessDialog.value = true
    showCreateDialog.value = false
    await refreshList()
  } catch (error) {
    console.error('创建失败:', error)
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  refreshList()
})
</script>

<style scoped>
.agent-list-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.agent-grid {
  margin-bottom: 20px;
}

.agent-card {
  margin-bottom: 20px;
  border-left: 4px solid #909399;
}

.agent-card.status-online {
  border-left-color: #67c23a;
}

.agent-card.status-offline {
  border-left-color: #909399;
}

.agent-card.status-idle {
  border-left-color: #e6a23c;
}

.agent-card.status-busy {
  border-left-color: #f56c6c;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.agent-status {
  margin-top: 4px;
}

.avatar-online {
  background-color: #67c23a;
}

.avatar-offline {
  background-color: #909399;
}

.avatar-idle {
  background-color: #e6a23c;
}

.avatar-busy {
  background-color: #f56c6c;
}

.card-content {
  padding: 10px 0;
}

.roles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.role-tag {
  background-color: #ecf5ff;
  color: #409eff;
}

.current-task {
  margin: 10px 0;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

.last-heartbeat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-around;
}

.copy-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sk-text {
  font-family: monospace;
  font-size: 12px;
}

.success-info {
  margin-top: 20px;
}
</style>
