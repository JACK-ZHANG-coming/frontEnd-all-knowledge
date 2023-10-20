<script setup lang="ts">
import AsideItem from './AsideItem.vue'
//侧边栏数据
const props = defineProps(['menuList', 'width'])
//获取被选中的index值,将对应数据传入
const emits = defineEmits(['selectedItem'])
const selectedItem = (value: never) => {
  emits('selectedItem', value)
}
</script>

<template>
  <el-menu default-active="1" class="el-menu-vertical-demo">
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
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu {
  border-right: none;
  width: 208px;
}
.el-sub-menu {
  border-bottom: 2px solid $color-background;
}
.el-sub-menu__title > *,
.el-menu-item {
  font-size: $font-size-small;
}
</style>
