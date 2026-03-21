import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAgents } from '@/api/agent'

export const useAgentStore = defineStore('agent', () => {
  const agentList = ref([])
  const currentAgent = ref(null)

  // 获取 Agent 列表
  async function fetchAgentList(params) {
    const res = await getAgents(params)
    agentList.value = res.data.items || []
    return res
  }

  // 设置当前 Agent
  function setCurrentAgent(agent) {
    currentAgent.value = agent
  }

  return {
    agentList,
    currentAgent,
    fetchAgentList,
    setCurrentAgent
  }
})
