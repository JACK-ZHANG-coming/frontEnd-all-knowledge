<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps(['header', 'isOpen'])

const postionRight = ref<string | number>('100%')
const toContract = () => {
  postionRight.value = '100%'
}
const toExpand = () => {
  postionRight.value = 0
}

watch(props, () => {
  postionRight.value === '100%' ? (postionRight.value = 0) : (postionRight.value = '100%')
})
</script>

<template>
  <Container :header="props.header" class="box_postion inner">
    <template #Top>
      <div @click="toContract" class="expand_button box_shadow">
        <el-icon><ArrowRightBold /></el-icon>
      </div>
      <div @click="toExpand" class="contract_button box_shadow">
        <el-icon><ArrowLeftBold /></el-icon>
      </div>
      <slot name="Top"> </slot>
    </template>
    <template #Aside>
      <slot name="Aside"></slot>
    </template>
    <template #Header>
      <slot name="Header"> </slot>
    </template>
    <template #Main>
      <slot name="Main"> </slot>
    </template>
    <template #Bottom>
      <slot name="Bottom"> </slot>
    </template>
  </Container>
</template>

<style scoped lang="scss">
.box_postion {
  background-color: $color-background;
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.265, 1);
  position: fixed;
  width: 100%;
  height: calc(100% - $header-bar-height);
  left: v-bind(postionRight);
  z-index: 99;
  .expand_button,
  .contract_button {
    cursor: pointer;
    border-radius: 0 5px 5px 0;
    padding: 24px 5px;
    position: absolute;
    left: 0;
    margin-top: 20%;
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    background-color: $color-box-background;
    z-index: 100;
    font-size: 18px;
  }
  .contract_button {
    cursor: pointer;
    position: absolute;
    left: -28px;
    border-radius: 5px 0 0 5px;
  }
  .expand_button:hover,
  .contract_button:hover {
    color: $color-white;
    background-color: $color-primary;
  }
}
</style>
