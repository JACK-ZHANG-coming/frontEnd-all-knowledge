<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'

const value = ref<string>('')
const props = defineProps({
  list: {
    type: Array as () => string[],
    default: () => []
  }
})
const emits = defineEmits(['update:list'])

// 添加操作
const handleAdd = () => {
  const arr = props.list
  arr.push(value.value)
  emits('update:list', arr)
  value.value = ''
}
</script>
<template>
  <div class="child-wrap input-group">
    <input v-model="value" type="text" class="form-control" placeholder="请输入" />
    <div class="input-group-append">
      <button @click="handleAdd" class="btn btn-primary" type="button">添加</button>
    </div>
  </div>
</template>
<style>
/* 父组件样式 */
.parent {
  width: 50%;
  margin: 0 auto 20px;
  border: 2px solid #3498db; /* 浅蓝色边框 */
  background-color: #ecf0f1; /* 浅蓝色背景 */
  padding: 10px;
  border-radius: 10px;
}

.parent li {
  cursor: pointer;
}

.parent li:hover {
  background-color: #d5d8dc; /* 浅蓝色 */
}
</style>
