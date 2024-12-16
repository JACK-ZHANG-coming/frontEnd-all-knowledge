<!-- 工作台 -->
<template>
  <BaseContainer class="p-4">
    欢迎来到工作台页面！~ 当前登录用户： {{ userInfo.userName }}
  </BaseContainer>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import BaseContainer from '@/components/BaseContainer.vue';

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.getUserInfo || {};
  });
</script>
<style lang="less" scoped>
  .content {
    display: flex;
    margin-top: 12px;

    &-left {
      flex: 1;
      margin-right: 16px;
      overflow: hidden;
    }

    &-right {
      width: 332px;
    }
  }
</style>
