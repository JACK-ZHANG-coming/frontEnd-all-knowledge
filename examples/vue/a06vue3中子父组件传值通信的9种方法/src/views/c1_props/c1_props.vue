<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Child1 from './components/Child1.vue'
import Child2 from './components/Child2.vue'
import Child3 from './components/Child3.vue'

const data = reactive({
  lifebar: 100,
  child1_lifebar: 0
})

const child1ref: {
  value: {
    /**生命值 */
    lifebar: number
    /**加血 */
    addLifebar: () => void
  }
} = ref<T>()
const child2ref = ref()

/**自身加血 */
const addLifebar = () => {
  data.lifebar++
}

/**给队友加血 */
const addTeammateLifebar = () => {
  console.log(child1ref.value)
  console.log(child1ref.value.lifebar)
  child1ref.value?.addLifebar()
}

onMounted(() => {
  console.log('父组件加载完毕')
  console.log(child1ref.value.lifebar)
  data.child1_lifebar = child1ref.value.lifebar
})
</script>

<template>
  <div class="main">
    <div style="height: 60px; display: flex; align-items: center; justify-content: center">
      我是父组件蔡文姬
      <el-space style="margin-left: 5px">
        <el-button @click="addLifebar">给自身增加1点血量</el-button>
        <el-button @click="addTeammateLifebar">1-给子组件1马可波罗加1点血(父组件调用子组件函数)</el-button>
      </el-space>
    </div>
    <div style="height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: start">
      <div><b>父组件蔡文姬信息</b></div>
      <div>
        当前血量:<b>{{ data.lifebar }}</b>
      </div>
      <div>
        <!-- 这里没有自动刷新，暂时没有找到原因 -->
        2-探测到的子组件1马可波罗当前气值(父组件调用子组件参数):<b>{{ data.child1_lifebar }}</b>
      </div>
    </div>
    <div class="box-content">
      <div class="left-box">
        <Child1 ref="child1ref" :lifebar="data.lifebar"></Child1>
        <Child3></Child3>
      </div>
      <div class="right-box"><Child2></Child2></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 80%;
  height: 800px;
  margin: auto;
  border: 2px solid yellowgreen;
  .box-content {
    width: 100%;
    height: calc(100% - 200px);
    display: flex;
    justify-content: space-around;
    align-items: center;
    .left-box {
      width: 45%;
      height: 100%;
      border: 2px solid hotpink;
      position: relative;
    }
    .right-box {
      width: 45%;
      height: 100%;
      border: 2px solid hotpink;
    }
  }
}
</style>
