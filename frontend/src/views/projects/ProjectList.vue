<template>
  <div class="project-list-page">
    <div class="page-header">
      <h2>项目管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          新建项目
        </el-button>
        <el-button @click="refreshList">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 项目列表 -->
    <el-row :gutter="20" class="project-grid">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="project in projectStore.projectList" :key="project.id">
        <el-card class="project-card" shadow="hover" @click="viewDetail(project.id)">
          <template #header>
            <div class="card-header">
              <span class="project-name">{{ project.name }}</span>
              <el-tag :type="getStatusType(project.status)" size="small">
                {{ getStatusText(project.status) }}
              </el-tag>
            </div>
          </template>

          <div class="card-content">
            <p class="project-desc">{{ project.description || '暂无描述' }}</p>

            <div class="project-progress">
              <div class="progress-info">
                <span>进度</span>
                <span>{{ project.progress || 0 }}%</span>
              </div>
              <el-progress :percentage="project.progress || 0" :stroke-width="8" />
            </div>

            <div class="project-stats">
              <span><el-icon><Document /></el-icon> {{ project.requirement_count || 0 }} 需求</span>
              <span><el-icon><List /></el-icon> {{ project.task_count || 0 }} 任务</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty v-if="projectStore.projectList.length === 0" description="暂无项目" />

    <!-- 新建项目对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建项目"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="项目名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>

        <el-form-item label="项目描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate" :loading="creating">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { createProject } from '@/api/project'

const router = useRouter()
const projectStore = useProjectStore()

const showCreateDialog = ref(false)
const creating = ref(false)

const formRef = ref()
const form = reactive({
  name: '',
  description: ''
})

const statusMap = {
  planning: { type: 'info', text: '规划中' },
  in_progress: { type: 'warning', text: '进行中' },
  completed: { type: 'success', text: '已完成' },
  archived: { type: 'info', text: '已归档' }
}

const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status

const refreshList = async () => {
  await projectStore.fetchProjectList()
}

const viewDetail = (id) => {
  router.push(`/projects/${id}`)
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  formRef.value?.clearValidate()
}

const handleCreate = async () => {
  if (!form.name) {
    ElMessage.warning('请输入项目名称')
    return
  }

  creating.value = true
  try {
    await createProject(form)
    ElMessage.success('项目创建成功')
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
.project-list-page {
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

.project-grid {
  margin-bottom: 20px;
}

.project-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-weight: bold;
  font-size: 16px;
}

.card-content {
  padding: 10px 0;
}

.project-desc {
  color: #666;
  font-size: 13px;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-progress {
  margin-bottom: 15px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #666;
  font-size: 13px;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

.project-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
