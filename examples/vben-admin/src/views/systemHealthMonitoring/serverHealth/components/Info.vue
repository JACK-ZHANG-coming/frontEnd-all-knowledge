<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <div class="w-100% h-100% flex justify-between">
          公告
          <a-button type="link" :size="'small'">更多</a-button>
        </div>
      </template>
      <Empty style="margin-top: 5%" :image="simpleImage" />
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Space, Card, Empty, Image, Popconfirm } from 'ant-design-vue';
  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
</script>
<style lang="less" scoped>
  .serverHealth-ServeRate {
    :deep(.ant-card) {
      .ant-card-head {
        height: 56px;
        padding: 0 10px;
        // background-color: yellowgreen;
      }
      .ant-card-body {
        height: calc(100% - 56px);
        padding: 0;
      }
    }
  }
</style>
