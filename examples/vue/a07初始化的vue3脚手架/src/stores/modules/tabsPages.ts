import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTabsStore = defineStore('useTabsStore', () => {
  const currentTabs = ref('index')
  const currentTabsList = ref([{ name: 'index', title: '主页' }])
  return {
    currentTabs,
    currentTabsList
  }
})
