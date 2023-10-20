<script setup lang="ts">
import { useRoute, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useTabsStore } from '@/stores/modules/tabsPages'
import { storeToRefs } from 'pinia'
import { computed, ref, onUpdated } from 'vue'
const { currentTabsList } = storeToRefs(useTabsStore())
const getCurrentTabsList = computed(() => {
  let array: any = []
  currentTabsList.value.forEach((item) => {
    array.push(item.name)
  })
  return array
})

const route = useRoute()

const isRefresh = ref('static')

onUpdated(() => {
  setTimeout(() => {
    isRefresh.value = 'fixed'
  }, 1000)
})
</script>

<template>
  <Transition name="fade_title" mode="out-in">
    <Header v-if="route.meta.showHeader"></Header>
  </Transition>
  <div class="main_box">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <keep-alive :include="getCurrentTabsList">
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </Transition>
    </RouterView>
  </div>
  <Transition name="fade_footer" mode="out-in">
    <Footer v-if="route.meta.showFooter"></Footer>
  </Transition>
</template>
<style scoped lang="scss">
.main_box {
  height: calc(100% - $header-bar-height);
}

.fade_title-enter-active,
.fade_title-leave-active,
.fade_footer-enter-active,
.fade_footer-leave-active,
.fade-enter-active,
.fade-leave-active {
  overflow: hidden;
  transition: all 0.25s ease;
}
.fade_title-enter-active {
  position: v-bind(isRefresh);
}

.fade-enter-active .inner,
.fade-leave-active .inner {
  height: 100% !important;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.fade_footer-enter-from,
.fade_footer-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.fade_title-enter-from,
.fade_title-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
