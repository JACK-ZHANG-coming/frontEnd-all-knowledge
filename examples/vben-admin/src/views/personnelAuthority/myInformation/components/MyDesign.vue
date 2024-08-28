<template>
  <Card :title="'我的设计'">
    <div class="MyDesign">
      <Empty style="margin-top: 120px" :image="simpleImage" />
    </div>
  </Card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { computed } from 'vue';
  import { Empty, Card, Row, Col } from 'ant-design-vue';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.getUserInfo || {};
  });
</script>

<style scoped lang="less">
  .MyDesign {
    height: 420px;
    overflow: auto;
  }
</style>
