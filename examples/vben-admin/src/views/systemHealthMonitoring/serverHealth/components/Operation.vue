<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <div class="w-100% h-100% flex justify-between">
          快捷操作
          <!-- <a-button type="link" :size="'small'">更多</a-button> -->
        </div>
      </template>
      <div class="main-box">
        <div class="row mb-2">
          <div class="box" @click="routerTo('/equipmentManagement/deviceTemplate')">
            <div> <Icon icon="ant-design:control-outlined" :size="25" /></div>
            <div class="text-12px">设备管理</div>
          </div>
          <div class="box" @click="routerTo('/dataDefinition/dataDefinitionsOverview')">
            <div> <Icon icon="ant-design:container-outlined" :size="25" /></div>
            <div class="text-12px">数据定义</div>
          </div>
          <div class="box" @click="routerTo('/dataPreprocessingChannel/dataChannelOverview')">
            <div> <Icon icon="ion:settings-outline" :size="25" /></div>
            <div class="text-12px">数据通道</div>
          </div>
        </div>
        <div class="row" @click="routerTo('/dataSourceManagement/externalDataSource')">
          <div class="box">
            <div> <Icon icon="ant-design:copy-outlined" :size="25" /></div>
            <div class="text-12px">数据源</div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Space, Card, Empty, Image, Popconfirm } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useGo } from '@/hooks/web/usePage';

  const go = useGo();

  // const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const routerTo = (route: string) => {
    console.log(route, 'routerTo');
    go(route);
  };
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

  .main-box {
    width: 100%;
    height: 100%;
    padding: 0 1rem;

    .row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 35%;

      .box {
        width: 32%;
        height: 100%;
        // background: #dfd9d9;
        text-align: center;
      }

      .box:hover {
        // background: #dfd9d9;
        color: #1c92ff;
      }
    }
  }
</style>
