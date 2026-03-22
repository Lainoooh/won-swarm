<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '70px' : '220px'" class="sidebar">
      <div class="logo">
        <div class="logo-icon">
          <el-icon :size="28"><Connection /></el-icon>
        </div>
        <span v-if="!isCollapse" class="logo-text">WonSwarm</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="transparent"
        text-color="#a0aec0"
        active-text-color="#667eea"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>

        <el-menu-item index="/projects">
          <el-icon><Folder /></el-icon>
          <template #title>项目管理</template>
        </el-menu-item>

        <el-menu-item index="/agents">
          <el-icon><User /></el-icon>
          <template #title>Agent 管理</template>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <div class="version-info" v-if="!isCollapse">
          <el-tag size="small" type="warning">Beta</el-tag>
          <span>v1.0.0</span>
        </div>
      </div>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <div class="breadcrumb-placeholder">
            <!-- 预留面包屑位置 -->
          </div>
        </div>

        <div class="header-right">
          <el-badge :value="3" :hidden="true" class="notification-badge">
            <el-icon class="header-icon"><Bell /></el-icon>
          </el-badge>

          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="36" :icon="UserFilled" class="user-avatar" />
              <span class="username">{{ userStore.userInfo?.username || 'Admin' }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

const activeMenu = computed(() => {
  const path = route.path
  // 支持子路径匹配
  if (path.startsWith('/projects/')) {
    return '/projects'
  }
  if (path.startsWith('/agents/')) {
    return '/agents'
  }
  return path
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    await userStore.userLogout()
    router.push('/login')
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.sidebar {
  background: linear-gradient(180deg, #1a1c2c 0%, #2d2f4a 100%);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.logo {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
}

.logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.el-menu {
  border-right: none;
  flex: 1;
  padding-top: 20px;
  background: transparent !important;
}

:deep(.el-menu-item) {
  margin: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover) {
  background: rgba(102, 126, 234, 0.15) !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

:deep(.el-menu-item .el-icon) {
  transition: transform 0.3s ease;
}

:deep(.el-menu-item:hover .el-icon) {
  transform: scale(1.1);
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e6e6e6;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: #4a5568;
  padding: 8px;
  border-radius: 8px;
}

.collapse-icon:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 22px;
  cursor: pointer;
  color: #718096;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 8px;
}

.header-icon:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.1);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.username {
  color: #2d3748;
  font-weight: 500;
}

.arrow-icon {
  font-size: 14px;
  color: #a0aec0;
}

.main-content {
  background: transparent;
  padding: 0;
  overflow: auto;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
