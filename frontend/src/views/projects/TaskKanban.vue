<template>
  <div class="task-kanban-page">
    <el-page-header @back="$router.back()" :title="'任务看板'">
      <template #content>
        <span class="header-name">{{ projectName }}</span>
      </template>
    </el-page-header>

    <div class="page-header">
      <div class="filter-bar">
        <el-select v-model="assigneeFilter" placeholder="执行 Agent" clearable @change="fetchKanban">
          <el-option label="全部" value="" />
          <el-option v-for="agent in agents" :key="agent.id" :label="agent.name" :value="agent.id" />
        </el-select>
      </div>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新建任务
      </el-button>
    </div>

    <!-- 看板视图 -->
    <div class="kanban-board" v-loading="loading">
      <div class="kanban-column" v-for="column in kanbanData.columns" :key="column.label">
        <div class="column-header" :class="`status-${column.label}`">
          <span>{{ column.label }}</span>
          <el-tag size="small" type="info">{{ column.tasks.length }}</el-tag>
        </div>
        <div class="column-body">
          <el-card
            v-for="task in column.tasks"
            :key="task.id"
            class="task-card"
            shadow="hover"
            :class="`priority-${getTaskPriority(task)}`"
          >
            <div class="task-title">{{ task.title }}</div>
            <div class="task-meta">
              <el-tag size="small" type="info">{{ getTypeText(task.type) }}</el-tag>
              <span class="task-assignee" v-if="task.assignee_id">
                <el-icon><User /></el-icon>
                {{ task.assignee_id }}
              </span>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 新建任务对话框 -->
    <el-dialog v-model="showCreateDialog" title="新建任务" width="600px" @close="resetForm">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="任务标题" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入任务描述" />
        </el-form-item>
        <el-form-item label="任务类型" prop="type" required>
          <el-select v-model="form.type" placeholder="请选择任务类型">
            <el-option label="需求分析" value="requirement" />
            <el-option label="UI 设计" value="ui" />
            <el-option label="前端设计" value="frontend_design" />
            <el-option label="后端设计" value="backend_design" />
            <el-option label="前端研发" value="frontend" />
            <el-option label="后端研发" value="backend" />
            <el-option label="单元测试" value="test" />
            <el-option label="集成测试" value="integration" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority">
            <el-option label="P0 紧急" value="P0" />
            <el-option label="P1 高" value="P1" />
            <el-option label="P2 中" value="P2" />
            <el-option label="P3 低" value="P3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate" :loading="creating">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getKanban, createTask } from '@/api/task'
import { getProjectDetail } from '@/api/project'
import { getAgents } from '@/api/agent'

const route = useRoute()

const loading = ref(false)
const creating = ref(false)
const showCreateDialog = ref(false)
const projectName = ref('')
const agents = ref([])
const assigneeFilter = ref('')

const kanbanData = ref({
  columns: []
})

const formRef = ref()
const form = reactive({
  title: '',
  description: '',
  type: 'frontend',
  priority: 'P2'
})

const typeMap = {
  requirement: '需求分析',
  ui: 'UI 设计',
  frontend_design: '前端设计',
  backend_design: '后端设计',
  frontend: '前端研发',
  backend: '后端研发',
  test: '单元测试',
  integration: '集成测试'
}

const columnNames = {
  todo: '待处理',
  in_progress: '执行中',
  blocked: '已阻塞',
  review: '评审中',
  completed: '已完成'
}

const getTypeText = (type) => typeMap[type] || type

const getTaskPriority = (task) => {
  return task.priority || 'P2'
}

const fetchKanban = async () => {
  loading.value = true
  try {
    const params = { project_id: route.params.id }
    if (assigneeFilter.value) {
      params.assignee_id = assigneeFilter.value
    }
    const res = await getKanban(params)
    const columns = res.data.columns || []

    // 转换列数据
    kanbanData.value.columns = columns.map(col => ({
      label: columnNames[col.label] || col.label,
      tasks: col.tasks || []
    }))

    const projectRes = await getProjectDetail(route.params.id)
    projectName.value = projectRes.data.name
  } catch (error) {
    console.error('获取看板数据失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchAgents = async () => {
  try {
    const res = await getAgents()
    agents.value = res.data.items || []
  } catch (error) {
    console.error('获取 Agent 列表失败:', error)
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.type = 'frontend'
  form.priority = 'P2'
  formRef.value?.clearValidate()
}

const handleCreate = async () => {
  if (!form.title) {
    ElMessage.warning('请输入任务标题')
    return
  }

  creating.value = true
  try {
    await createTask({ ...form, project_id: route.params.id })
    ElMessage.success('任务创建成功')
    showCreateDialog.value = false
    await fetchKanban()
  } catch (error) {
    console.error('创建失败:', error)
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  fetchKanban()
  fetchAgents()
})
</script>

<style scoped>
.task-kanban-page {
  padding: 20px;
}

.header-name {
  font-size: 16px;
  color: #666;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.filter-bar {
  display: flex;
  gap: 10px;
}

.kanban-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 0;
}

.kanban-column {
  min-width: 280px;
  max-width: 280px;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
  font-weight: bold;
  color: #333;
}

.column-body {
  min-height: 200px;
}

.task-card {
  margin-bottom: 12px;
  cursor: pointer;
  border-left: 3px solid #409EFF;
}

.task-card.priority-P0 {
  border-left-color: #F56C6C;
}

.task-card.priority-P1 {
  border-left-color: #E6A23C;
}

.task-card.priority-P2 {
  border-left-color: #409EFF;
}

.task-card.priority-P3 {
  border-left-color: #67C23A;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
