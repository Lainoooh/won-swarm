import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProjects } from '@/api/project'

export const useProjectStore = defineStore('project', () => {
  const projectList = ref([])
  const currentProject = ref(null)

  // 获取项目列表
  async function fetchProjectList(params) {
    const res = await getProjects(params)
    projectList.value = res.data.items || []
    return res
  }

  // 设置当前项目
  function setCurrentProject(project) {
    currentProject.value = project
  }

  return {
    projectList,
    currentProject,
    fetchProjectList,
    setCurrentProject
  }
})
