<template>
  <div class="document-center-page">
    <el-page-header @back="$router.back()" :title="'文档中心'">
      <template #content>
        <span class="header-name">{{ projectName }}</span>
      </template>
    </el-page-header>

    <div class="page-header">
      <div class="filter-bar">
        <el-select v-model="filters.file_type" placeholder="文件类型" clearable @change="fetchList">
          <el-option label="Markdown" value="md" />
          <el-option label="PDF" value="pdf" />
          <el-option label="图片" value="png" />
          <el-option label="图片" value="jpg" />
        </el-select>
      </div>
      <el-upload
        :action="uploadUrl"
        :headers="uploadHeaders"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        multiple
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          上传文档
        </el-button>
      </el-upload>
    </div>

    <el-table :data="documents" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="文档名称" min-width="200" />
      <el-table-column prop="file_type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ row.file_type || 'unknown' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="file_size" label="大小" width="100">
        <template #default="{ row }">
          {{ formatFileSize(row.file_size) }}
        </template>
      </el-table-column>
      <el-table-column prop="version" label="版本" width="80" />
      <el-table-column prop="created_at" label="上传时间" width="160">
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDownload(row)">下载</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDocuments, deleteDocument } from '@/api/document'
import { getProjectDetail } from '@/api/project'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const documents = ref([])
const projectName = ref('')

const filters = reactive({
  file_type: ''
})

const uploadUrl = computed(() => '/api/documents/upload')
const uploadHeaders = computed(() => ({
  'Authorization': `Bearer ${userStore.token}`
}))

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const beforeUpload = (file) => {
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 100MB')
    return false
  }
  return true
}

const fetchList = async () => {
  loading.value = true
  try {
    const params = { project_id: route.params.id, ...filters }
    const res = await getDocuments(params)
    documents.value = res.data.items || []

    const projectRes = await getProjectDetail(route.params.id)
    projectName.value = projectRes.data.name
  } catch (error) {
    console.error('获取文档列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleUploadSuccess = (response) => {
  if (response.code === 200) {
    ElMessage.success('文档上传成功')
    fetchList()
  }
}

const handleUploadError = (error) => {
  ElMessage.error('文档上传失败：' + error.message)
}

const handleDownload = (row) => {
  // TODO: 实现下载
  ElMessage.info('下载功能开发中')
}

const handleDelete = async (id) => {
  try {
    await deleteDocument(id)
    ElMessage.success('文档删除成功')
    await fetchList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.document-center-page {
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
  width: 150px;
}
</style>
