<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/modules/tabsPages'
import { storeToRefs } from 'pinia'

const router = useRouter()
const getCurrentTabs = computed(() => useTabsStore().currentTabs)
const getCurrentTabsList = computed(() => useTabsStore().currentTabsList)
const { currentTabs, currentTabsList } = storeToRefs(useTabsStore())
watch(currentTabs, () => {
  sessionStorage.setItem('CURRENT_TABS', JSON.stringify(currentTabs.value))
})
const getStorageCurrentTabs = sessionStorage.getItem('CURRENT_TABS')
if (getStorageCurrentTabs) {
  currentTabs.value = JSON.parse(getStorageCurrentTabs)
}

const changeTab = (targetName: string) => {
  router.push({ name: targetName })
}
const removeTab = (targetName: string) => {
  const tabs = getCurrentTabsList.value
  let activeName = getCurrentTabs.value
  if (activeName === targetName) {
    tabs.forEach((tab: any, index: number) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  currentTabs.value = activeName
  currentTabsList.value = tabs.filter((tab) => tab.name !== targetName)
  sessionStorage.setItem('TABS_LIST', JSON.stringify(currentTabsList.value))
}
</script>
<template>
  <div class="component_tabs_pages">
    <div class="drawer_icon box_shadow">
      <el-icon><ArrowLeftBold /></el-icon>
    </div>
    <el-tabs
      tab-position="left"
      v-model="useTabsStore().currentTabs"
      type="card"
      class="demo-tabs box_shadow"
      @tab-change="changeTab"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="(item, index) in getCurrentTabsList"
        :closable="index !== 0"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      />
    </el-tabs>
  </div>
</template>
<style lang="scss">
.component_tabs_pages {
  width: 10px;
  z-index: 100;
  right: 0;
  top: calc($header-bar-height + 10px);
  position: fixed;
  .drawer_icon {
    position: absolute;
    right: 10px;
    width: 30px;
    height: 30px;
    background-color: $color-box-background;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .el-tabs {
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    margin-left: 100%;
    .el-tabs__header.is-left {
      margin-right: 0;
      border-bottom: none;
      .el-tabs__nav {
        background-color: $color-box-background;
      }
    }
  }
}
.component_tabs_pages:hover {
  width: auto;
  .drawer_icon {
    right: -20px;
  }
  .el-tabs {
    margin-left: 0;
  }
}
</style>
