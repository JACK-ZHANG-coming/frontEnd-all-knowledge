<script lang="ts" setup>
import { WorkbenchHeader } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Button } from 'ant-design-vue';

const userStore = useUserStore();

const recordVideo = () => {
  console.log('recordVideo');
};
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName }}, 开始您一天的工作吧！
      </template>
      <template #description> 今日晴，20℃ - 32℃！ </template>
    </WorkbenchHeader>
    <div class="mt-5"><Button @click="recordVideo">录屏</Button></div>
  </div>
</template>
