<template>
  <div class="requirement-list-page">
    <el-page-header @back="$router.back()" :title="'需求管理'">
      <template #content>
        <span class="header-name">{{ projectName }}</span>
      </template>
    </el-page-header>

    <div class="page-header">
      <div class="filter-bar">
        <el-select v-model="filters.type" placeholder="需求类型" clearable @change="fetchList">
          <el-option label="新增需求" value="new_feature" />
          <el-option label="需求变更" value="change_request" />
          <el-option label="需求整改" value="fix_request" />
          <el-option label="Bug 修复" value="bug_fix" />
          <el-option label="技术优化" value="optimization" />
        </el-select>
        <el-select v-model="filters.priority" placeholder="优先级" clearable @change="fetchList">
          <el-option label="P0 紧急" value="P0" />
          <el-option label="P1 高" value="P1" />
          <el-option label="P2 中" value="P2" />
          <el-option label="P3 低" value="P3" />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态" clearable @change="fetchList">
          <el-option label="待评审" value="pending" />
          <el-option label="已评审" value="reviewing" />
          <el-option label="设计中" value="in_design" />
          <el-option label="开发中" value="in_development" />
          <el-option label="测试中" value="testing" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </div>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新建需求
      </el-button>
    </div>

    <el-table :data="requirements" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="需求标题" min-width="200" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <span>{{ getTypeText(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="80">
        <template #default="{ row }">
          <el-tag :type="getPriorityType(row.priority)" size="small">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="160">
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row.id)">详情</el-button>
          <el-button link type="primary" @click="updateStatus(row)">状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建需求对话框 -->
    <el-dialog v-model="showCreateDialog" title="新建需求" width="600px" @close="resetForm">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="需求标题" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入需求标题" />
        </el-form-item>
        <el-form-item label="需求描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入需求描述" />
        </el-form-item>
        <el-form-item label="需求类型" prop="type" required>
          <el-select v-model="form.type" placeholder="请选择需求类型">
            <el-option label="新增需求" value="new_feature" />
            <el-option label="需求变更" value="change_request" />
            <el-option label="需求整改" value="fix_request" />
            <el-option label="Bug 修复" value="bug_fix" />
            <el-option label="技术优化" value="optimization" />
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
import { getRequirements, createRequirement, updateRequirementStatus } from '@/api/requirement'
import { getProjectDetail, getProjectRequirements } from '@/api/project'

const route = useRoute()

const loading = ref(false)
const creating = ref(false)
const showCreateDialog = ref(false)
const requirements = ref([])
const project = ref({})

const filters = reactive({
  type: '',
  priority: '',
  status: ''
})

const formRef = ref()
const form = reactive({
  title: '',
  description: '',
  type: 'new_feature',
  priority: 'P2'
})

const projectName = computed(() => project.value.name || '项目详情')

const typeMap = {
  new_feature: '新增需求',
  change_request: '需求变更',
  fix_request: '需求整改',
  bug_fix: 'Bug 修复',
  optimization: '技术优化'
}

const statusMap = {
  pending: { type: 'info', text: '待评审' },
  reviewing: { type: 'warning', text: '已评审' },
  in_design: { type: 'warning', text: '设计中' },
  in_development: { type: 'primary', text: '开发中' },
  testing: { type: 'success', text: '测试中' },
  completed: { type: 'success', text: '已完成' }
}

const priorityMap = {
  P0: 'danger',
  P1: 'warning',
  P2: 'info',
  P3: 'success'
}

const getTypeText = (type) => typeMap[type] || type
const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status
const getPriorityType = (priority) => priorityMap[priority] || 'info'

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const fetchList = async () => {
  loading.value = true
  try {
    const params = { project_id: route.params.id, ...filters }
    const res = await getProjectRequirements(params)
    requirements.value = res.data.items || []

    const projectRes = await getProjectDetail(route.params.id)
    project.value = projectRes.data
  } catch (error) {
    console.error('获取需求列表失败:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.type = 'new_feature'
  form.priority = 'P2'
  formRef.value?.clearValidate()
}

const handleCreate = async () => {
  if (!form.title) {
    ElMessage.warning('请输入需求标题')
    return
  }

  creating.value = true
  try {
    await createRequirement({ ...form, project_id: route.params.id })
    ElMessage.success('需求创建成功')
    showCreateDialog.value = false
    await fetchList()
  } catch (error) {
    console.error('创建失败:', error)
  } finally {
    creating.value = false
  }
}

const viewDetail = (id) => {
  // TODO: 实现需求详情
  ElMessage.info('需求详情功能开发中')
}

const updateStatus = (row) => {
  // TODO: 实现状态更新
  ElMessage.info('状态更新功能开发中')
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.requirement-list-page {
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

.filter-bar .el-select {
  width: 120px;
}
</style>
