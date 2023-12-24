<script setup lang="ts">
import AsideItem from './AsideItem.vue'
const props = defineProps(['menuList'])
//获取被选中的index值,将对应数据传入
const emits = defineEmits(['selectedItem'])
const selectedItem = (value: never) => {
  emits('selectedItem', value)
}
</script>
<template>
  <template v-for="(item, index) in props.menuList" :key="index">
    <template v-if="item.items">
      <el-sub-menu :index="item.index">
        <template #title>
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </template>
        <AsideItem :menuList="item.items"></AsideItem>
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item @click="selectedItem(item.index as never)" :index="item.index">
        <template #title>
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>
<style scoped lang="scss">
.el-sub-menu__title > *,
.el-menu-item {
  font-size: $font-size-small;
}
</style>
