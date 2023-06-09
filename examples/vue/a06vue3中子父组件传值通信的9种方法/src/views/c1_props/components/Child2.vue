<script setup lang="ts">
import { ref, onMounted } from 'vue'

const lifebar = ref(100)

/**减血 */
const subLifebar = () => {
  lifebar.value--
}

onMounted(() => {
  console.log('Child2加载完毕')
})
</script>

<template>
  <div>
    <b>我是子组件2敌方云樱</b>&nbsp;&nbsp;
    <span v-if="lifebar >= 60">过来打我呀~</span>
    <span v-else-if="lifebar > 30">保持沉默ing</span>
    <span v-else-if="lifebar > 10">艾玛，血量危险！</span>
    <span v-else-if="lifebar > 0">要挂了，不要打了~</span>
    <span v-else>已经挂了</span>
  </div>
  <br />
  <div>
    当前血量:<b>{{ lifebar }}</b>
  </div>
  <el-button>3-云樱登场，攻击父组件蔡文姬一下~(子组件调用调用父组件函数)</el-button>
</template>

<style scoped></style>
