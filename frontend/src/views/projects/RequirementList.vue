<template>
  <div class="requirement-list-page">
    <el-page-header @back="$router.back()" :title="'需求管理'">
      <template #content>
        <span class="header-name">{{ projectName }}</span>
      </template>
    </el-page-header>

    <div class="page-header">
      <div class="filter-bar">
        <el-select v-model="filters.level" placeholder="需求层级" clearable @change="fetchList">
          <el-option label="大需求 (Epic)" value="epic" />
          <el-option label="子需求 (Feature)" value="feature" />
          <el-option label="任务级 (Task)" value="task" />
        </el-select>
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
      <div class="action-bar">
        <el-button @click="toggleTreeView" :icon="isTreeView ? 'List' : 'Grid'">
          {{ isTreeView ? '列表视图' : '树形视图' }}
        </el-button>
        <el-button type="primary" @click="openCreateDialog('epic')">
          <el-icon><Plus /></el-icon>
          新建大需求
        </el-button>
      </div>
    </div>

    <!-- 需求列表/树形视图 -->
    <div class="table-container" v-loading="loading">
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'has_children' }"
        v-if="isTreeView"
      >
        <el-table-column prop="title" label="需求标题" min-width="250">
          <template #default="{ row }">
            <div class="requirement-title">
              <el-tag
                :type="getLevelType(row.level)"
                size="small"
                class="level-tag"
              >
                {{ getLevelText(row.level) }}
              </el-tag>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
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
        <el-table-column label="文档" width="100">
          <template #default="{ row }">
            <el-badge :value="row.document_ids?.length || 0" :max="99" type="info">
              <el-button link type="primary" @click="showDocuments(row)">文档</el-button>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showAddChild(row)">
              添加{{ row.level === 'epic' ? '子需求' : '任务' }}
            </el-button>
            <el-button link type="primary" size="small" @click="addTask(row)">
              关联任务
            </el-button>
            <el-button link type="primary" size="small" @click="editRequirement(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRequirement(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 列表视图 -->
      <el-table
        :data="requirements"
        style="width: 100%"
        v-else
      >
        <el-table-column prop="title" label="需求标题" min-width="250">
          <template #default="{ row }">
            <div class="requirement-title">
              <el-tag
                :type="getLevelType(row.level)"
                size="small"
                class="level-tag"
              >
                {{ getLevelText(row.level) }}
              </el-tag>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
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
        <el-table-column label="文档" width="100">
          <template #default="{ row }">
            <el-badge :value="row.document_ids?.length || 0" :max="99" type="info">
              <el-button link type="primary" @click="showDocuments(row)">文档</el-button>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showAddChild(row)">
              添加{{ row.level === 'epic' ? '子需求' : '任务' }}
            </el-button>
            <el-button link type="primary" size="small" @click="addTask(row)">
              关联任务
            </el-button>
            <el-button link type="primary" size="small" @click="editRequirement(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRequirement(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新建/编辑需求对话框 -->
    <el-dialog
      v-model="showCreateDialogFlag"
      :title="isEdit ? '编辑需求' : '新建需求'"
      width="700px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="需求标题" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入需求标题" />
        </el-form-item>
        <el-form-item label="需求描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入需求描述"
          />
        </el-form-item>
        <el-form-item label="需求层级" prop="level" required>
          <el-select v-model="form.level" placeholder="请选择需求层级" :disabled="isEdit">
            <el-option label="大需求 (Epic)" value="epic" />
            <el-option label="子需求 (Feature)" value="feature" />
            <el-option label="任务级 (Task)" value="task" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.level !== 'epic'"
          label="父级需求"
          prop="parent_id"
        >
          <el-select
            v-model="form.parent_id"
            placeholder="请选择父级需求"
            filterable
          >
            <el-option
              v-for="item in parentOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
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
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="待评审" value="pending" />
            <el-option label="已评审" value="reviewing" />
            <el-option label="设计中" value="in_design" />
            <el-option label="开发中" value="in_development" />
            <el-option label="测试中" value="testing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialogFlag = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="creating">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 文档关联对话框 -->
    <el-dialog v-model="showDocDialog" title="关联文档" width="600px" @opened="fetchAvailableDocs">
      <div class="doc-list">
        <div v-if="currentRequirement?.document_ids?.length > 0" class="doc-items">
          <div
            v-for="(doc, index) in currentRequirement.document_ids"
            :key="index"
            class="doc-item"
          >
            <el-icon><Document /></el-icon>
            <span class="doc-name">{{ doc.doc_name || '文档' }}</span>
            <el-tag size="small" type="info">{{ getDocTypeText(doc.type) }}</el-tag>
            <el-button link type="danger" @click="removeDocument(doc.doc_id)">移除</el-button>
          </div>
        </div>
        <el-empty v-else description="暂无关联文档" />
      </div>

      <div class="add-doc-section">
        <el-divider>添加文档</el-divider>
        <el-form :inline="true">
          <el-form-item label="文档类型">
            <el-select v-model="newDoc.type" placeholder="选择类型">
              <el-option label="需求设计" value="requirement_design" />
              <el-option label="概要设计" value="high_design" />
              <el-option label="详细设计" value="detail_design" />
              <el-option label="其他文档" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文档">
            <el-select v-model="newDoc.doc_id" placeholder="选择文档" filterable>
              <el-option
                v-for="doc in availableDocs"
                :key="doc.id"
                :label="doc.name"
                :value="doc.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addDocument">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 关联任务对话框 -->
    <el-dialog v-model="showTaskDialog" title="关联任务" width="600px">
      <div class="task-list">
        <div v-if="linkedTasks?.length > 0" class="task-items">
          <div
            v-for="task in linkedTasks"
            :key="task.id"
            class="task-item"
          >
            <el-icon><Checked /></el-icon>
            <span class="task-name">{{ task.title }}</span>
            <el-tag size="small" :type="getTaskStatusType(task.status)">{{ getTaskStatusText(task.status) }}</el-tag>
          </div>
        </div>
        <el-empty v-else description="暂无关联任务" />
      </div>

      <div class="add-task-section">
        <el-divider>创建并关联任务</el-divider>
        <el-form :inline="true">
          <el-form-item label="任务标题">
            <el-input v-model="newTask.title" placeholder="输入任务标题" style="width: 200px" />
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="newTask.type" placeholder="选择类型">
              <el-option label="需求分析" value="requirement" />
              <el-option label="UI 设计" value="ui" />
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
              <el-option label="测试" value="test" />
              <el-option label="集成测试" value="integration" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createAndLinkTask">创建并关联</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement as deleteRequirementApi,
  getRequirementTasks
} from '@/api/requirement'
import { getProjectDetail } from '@/api/project'
import { createTask } from '@/api/task'

const route = useRoute()

const loading = ref(false)
const creating = ref(false)
const showCreateDialogFlag = ref(false)
const isEdit = ref(false)
const isTreeView = ref(true)
const requirements = ref([])
const tableData = ref([])
const project = ref({})
const parentOptions = ref([])
const availableDocs = ref([])
const currentRequirement = ref(null)
const showDocDialog = ref(false)
const showTaskDialog = ref(false)
const linkedTasks = ref([])
const newDoc = reactive({
  doc_id: '',
  type: 'requirement_design'
})
const newTask = reactive({
  title: '',
  type: 'frontend'
})

const filters = reactive({
  level: '',
  type: '',
  priority: '',
  status: ''
})

const formRef = ref()
const form = reactive({
  title: '',
  description: '',
  level: 'epic',
  parent_id: '',
  epic_id: '',
  type: 'new_feature',
  priority: 'P2',
  status: 'pending',
  document_ids: []
})

const projectName = computed(() => project.value.name || '项目详情')

const levelMap = {
  epic: { type: 'primary', text: '大需求' },
  feature: { type: 'success', text: '子需求' },
  task: { type: 'warning', text: '任务级' }
}

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

const taskStatusMap = {
  todo: { type: 'info', text: '待处理' },
  in_progress: { type: 'warning', text: '进行中' },
  blocked: { type: 'danger', text: '已阻塞' },
  review: { type: 'primary', text: '评审中' },
  completed: { type: 'success', text: '已完成' }
}

const getLevelText = (level) => levelMap[level]?.text || level
const getLevelType = (level) => levelMap[level]?.type || 'info'
const getTypeText = (type) => typeMap[type] || type
const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status
const getPriorityType = (priority) => priorityMap[priority] || 'info'
const getTaskStatusType = (status) => taskStatusMap[status]?.type || 'info'
const getTaskStatusText = (status) => taskStatusMap[status]?.text || status

const getDocTypeText = (type) => {
  const docTypeMap = {
    requirement_design: '需求设计',
    high_design: '概要设计',
    detail_design: '详细设计',
    other: '其他'
  }
  return docTypeMap[type] || type
}

const toggleTreeView = () => {
  isTreeView.value = !isTreeView.value
}

const fetchList = async () => {
  loading.value = true
  try {
    const params = { project_id: route.params.id, tree: true, ...filters }
    const res = await getRequirements(params)
    const data = res.data

    tableData.value = data.items || []
    requirements.value = data.items || []

    // 获取父级需求选项（用于创建子需求）
    const allReqsRes = await getRequirements({ project_id: route.params.id })
    parentOptions.value = allReqsRes.data.items || []

    const projectRes = await getProjectDetail(route.params.id)
    project.value = projectRes.data
  } catch (error) {
    console.error('获取需求列表失败:', error)
    ElMessage.error('获取需求列表失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.level = 'epic'
  form.parent_id = ''
  form.epic_id = ''
  form.type = 'new_feature'
  form.priority = 'P2'
  form.status = 'pending'
  form.document_ids = []
  formRef.value?.clearValidate()
  isEdit.value = false
}

const openCreateDialog = (level) => {
  isEdit.value = false
  form.level = level || 'epic'
  form.parent_id = ''
  form.epic_id = ''
  showCreateDialogFlag.value = true
}

const editRequirement = (row) => {
  isEdit.value = true
  Object.assign(form, {
    title: row.title,
    description: row.description,
    level: row.level,
    parent_id: row.parent_id,
    epic_id: row.epic_id,
    type: row.type,
    priority: row.priority,
    status: row.status,
    document_ids: row.document_ids || []
  })
  currentRequirement.value = row
  showCreateDialogFlag.value = true
}

const handleSubmit = async () => {
  if (!form.title) {
    ElMessage.warning('请输入需求标题')
    return
  }

  creating.value = true
  try {
    const submitData = {
      ...form,
      project_id: route.params.id
    }

    if (isEdit.value && currentRequirement.value?.id) {
      await updateRequirement(currentRequirement.value.id, submitData)
      ElMessage.success('需求已更新')
    } else {
      await createRequirement(submitData)
      ElMessage.success('需求创建成功')
    }

    showCreateDialogFlag.value = false
    await fetchList()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    creating.value = false
  }
}

const showAddChild = (row) => {
  isEdit.value = false
  const childLevel = row.level === 'epic' ? 'feature' : 'task'
  form.level = childLevel
  form.parent_id = row.id
  form.epic_id = row.epic_id || (row.level === 'epic' ? row.id : row.epic_id)
  form.title = ''
  form.description = ''
  form.type = 'new_feature'
  form.priority = 'P2'
  form.status = 'pending'
  form.document_ids = []
  showCreateDialogFlag.value = true
}

const addTask = async (row) => {
  currentRequirement.value = row
  showTaskDialog.value = true
  // 获取已关联的任务
  try {
    const res = await getRequirementTasks(row.id)
    linkedTasks.value = res.data.items || []
  } catch (error) {
    console.error('获取任务列表失败:', error)
    linkedTasks.value = []
  }
}

const createAndLinkTask = async () => {
  if (!newTask.title) {
    ElMessage.warning('请输入任务标题')
    return
  }

  try {
    await createTask({
      title: newTask.title,
      type: newTask.type,
      project_id: route.params.id,
      requirement_id: currentRequirement.value.id,
      status: 'todo'
    })
    ElMessage.success('任务创建并关联成功')
    newTask.title = ''
    // 刷新任务列表
    const res = await getRequirementTasks(currentRequirement.value.id)
    linkedTasks.value = res.data.items || []
  } catch (error) {
    console.error('创建任务失败:', error)
    ElMessage.error('创建任务失败')
  }
}

const deleteRequirement = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除需求"${row.title}"吗？这将同时删除其所有子需求。`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteRequirementApi(row.id)
    ElMessage.success('需求已删除')
    await fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const showDocuments = (row) => {
  currentRequirement.value = row
  showDocDialog.value = true
}

const fetchAvailableDocs = async () => {
  // TODO: 调用文档中心 API 获取文档
  availableDocs.value = [
    { id: 'doc1', name: '需求规格说明书.md' },
    { id: 'doc2', name: '系统架构设计.pdf' },
    { id: 'doc3', name: '接口设计文档.md' }
  ]
}

const addDocument = () => {
  if (!newDoc.doc_id) {
    ElMessage.warning('请选择文档')
    return
  }

  const doc = availableDocs.value.find(d => d.id === newDoc.doc_id)
  const docData = {
    doc_id: newDoc.doc_id,
    doc_name: doc?.name || '文档',
    type: newDoc.type
  }

  if (!currentRequirement.value.document_ids) {
    currentRequirement.value.document_ids = []
  }

  const exists = currentRequirement.value.document_ids.some(
    d => d.doc_id === newDoc.doc_id && d.type === newDoc.type
  )

  if (exists) {
    ElMessage.warning('该文档已关联')
    return
  }

  currentRequirement.value.document_ids.push(docData)
  // TODO: 调用 API 保存文档关联
  ElMessage.success('文档已添加')
  newDoc.doc_id = ''
  newDoc.type = 'requirement_design'
}

const removeDocument = (docId) => {
  currentRequirement.value.document_ids = currentRequirement.value.document_ids.filter(
    d => d.doc_id !== docId
  )
  // TODO: 调用 API 移除文档关联
  ElMessage.success('文档已移除')
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.requirement-list-page {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.header-name {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.filter-bar {
  display: flex;
  gap: 12px;
}

.action-bar {
  display: flex;
  gap: 12px;
}

.filter-bar .el-select {
  width: 140px;
}

.table-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.requirement-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-tag {
  flex-shrink: 0;
}

.doc-list, .task-list {
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
}

.doc-items, .task-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-item, .task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.doc-item:hover, .task-item:hover {
  background: #eef1f6;
  transform: translateX(4px);
}

.doc-name, .task-name {
  flex: 1;
  font-weight: 500;
}

.add-doc-section, .add-task-section {
  margin-top: 20px;
  padding-top: 20px;
}

/* 表格样式优化 */
:deep(.el-table) {
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  border: none;
}

:deep(.el-table td) {
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(102, 126, 234, 0.08);
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>
