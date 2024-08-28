<!-- 我的信息 -->
<template>
  <div class="p-4">
    <UserInfoHeader />
    <div class="content">
      <div class="content-left">
        <Row :gutter="[16, 16]">
          <Col :span="24"><MyInfo /></Col>
          <Col :span="24">
            <ConcernedDevice />
          </Col>
        </Row>
      </div>
      <!-- 暂时隐藏右侧，目前没有 -->
      <!-- <div class="content-right">
        <Row :cols="24" :gutter="[16, 16]">
          <Col :span="24">
            <MyDesign />
          </Col>
          <Col class="panel" :span="24">
            <SystemNotification />
          </Col>
        </Row>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { Row, Col } from 'ant-design-vue';

  import UserInfoHeader from './components/UserInfoHeader.vue';
  import MyInfo from './components/MyInfo.vue';
  import ConcernedDevice from './components/ConcernedDevice.vue';
  import MyDesign from './components/MyDesign.vue';
  import SystemNotification from './components/SystemNotification.vue';

  const userStore = useUserStore();
  const userAvatar = computed(() => {
    return userStore.getUserAvatar || '';
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
