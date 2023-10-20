import { ref } from 'vue'
import { defineStore } from 'pinia'

// 存储全局用户信息
export const useSystemPersonList = defineStore('useSystemPersonList', () => {
  const systemPersonList = ref<any>([])
  return {
    systemPersonList
  }
})
