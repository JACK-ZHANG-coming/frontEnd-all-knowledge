<template>
  <Card :title="'系统通知'">
    <div class="SystemNotification">
      <div class="empty">
        <Empty style="margin-top: 40px" :image="simpleImage" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { computed } from 'vue';
  import { Empty, Card, Row, Col } from 'ant-design-vue';
  import { CameraOutlined, UserOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons-vue';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.getUserInfo || {};
  });
</script>

<style scoped lang="less">
  .SystemNotification {
    min-height: 160px;

    .empty {
      overflow: hidden;
    }
  }
</style>
