<template>
  <div class="blank-page">
    <div class="container-box">
      <Space>
        <Button
          style="width: 300px; height: 200px; font-size: 36px"
          type="primary"
          @click="areAddGraph"
        >
          <Icon size="36px" icon="material-symbols:add" />
          新建</Button
        >
        <Button
          style="width: 300px; height: 200px; font-size: 36px"
          type="primary"
          @click="areOpenGraph"
        >
          <Icon size="36px" icon="uil:edit" />
          打开</Button
        >
      </Space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { Layout, Button, SubMenu, Menu, Space } from 'ant-design-vue';

  const emits = defineEmits(['addGraph', 'openGraph']);

  const areAddGraph = () => {
    emits('addGraph');
  };

  const areOpenGraph = () => {
    emits('openGraph');
  };
</script>

<style lang="less" scoped>
  .blank-page {
    width: 100%;
    height: 100%;
    padding: 10px;

    .container-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgb(255 255 255);
    }
  }
</style>
