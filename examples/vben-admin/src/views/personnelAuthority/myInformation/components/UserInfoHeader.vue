<template>
  <div class="header">
    <Space :size="12" direction="vertical" align="center">
      <div class="avatar">
        <Avatar :size="64" :src="userAvatar" />
        <!-- <div class="camera">
          <CameraOutlined :style="{ fontSize: '12px', color: 'rgb(22,93,255)' }" />
        </div> -->
      </div>
      <TypographyTitle :level="5" style="margin: 0">
        {{ userInfo.userName }}
      </TypographyTitle>
      <div class="user-introduction">
        <TypographyText>{{ userInfo.introduction }}</TypographyText>
      </div>
      <div class="user-msg">
        <Space :size="18">
          <div>
            <UserOutlined style="margin-right: 2px" />
            <TypographyText strong>{{ userInfo.roleName }}</TypographyText>
          </div>
          <div>
            <ManOutlined v-if="userInfo.isMale" style="margin-right: 2px" />
            <WomanOutlined v-else style="margin-right: 2px" />
            <TypographyText strong>
              {{ userInfo.isMale ? '男' : '女' }}
            </TypographyText>
          </div>
        </Space>
      </div>
    </Space>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { computed } from 'vue';
  import { Space, Avatar, TypographyTitle, TypographyText } from 'ant-design-vue';
  import { CameraOutlined, UserOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons-vue';

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.getUserInfo || {};
  });
  const userAvatar = computed(() => {
    return userStore.getUserAvatar || '';
  });
</script>

<style scoped lang="less">
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 204px;
    border-radius: 4px;
    background: url('@/assets/images/personnelAuthority/个人信息bg.png') no-repeat;
    background-size: cover;
    color: var(--gray-10);

    .avatar {
      position: relative;

      .camera {
        display: flex;
        position: absolute;
        right: 2px;
        bottom: -2px;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgb(255 255 255 / 91.8%);
      }
    }
  }
</style>
