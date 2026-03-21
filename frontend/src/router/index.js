import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: () => import('@/views/projects/ProjectList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/projects/ProjectDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/reqs',
    name: 'RequirementList',
    component: () => import('@/views/projects/RequirementList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/tasks',
    name: 'TaskKanban',
    component: () => import('@/views/projects/TaskKanban.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/docs',
    name: 'DocumentCenter',
    component: () => import('@/views/projects/DocumentCenter.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agents',
    name: 'AgentList',
    component: () => import('@/views/agents/AgentList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agents/:id',
    name: 'AgentDetail',
    component: () => import('@/views/agents/AgentDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'SystemSettings',
    component: () => import('@/views/settings/SystemSettings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
