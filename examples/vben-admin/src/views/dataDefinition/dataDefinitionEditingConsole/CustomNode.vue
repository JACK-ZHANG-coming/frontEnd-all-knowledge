<template>
  <div :class="`custom-node node-bg-${data.nodeType}`">
    <div class="titleName"> {{ data.dataName }}</div>
    <div class="description">
      <p>{{ data.dataType }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref } from 'vue';

  const node: any = inject('getNode', () => {
    return { data: {} };
  });
  const data = ref<any>({});
  data.value = node().data;
  node().on('change:data', ({ current }) => {
    data.value = node().data;
  });
  // console.log('data.value', data.value);
</script>

<style scoped lang="less">
  .custom-node {
    width: calc(204px * 0.75);
    height: calc(116px * 0.75);
    background-color: rgb(255 255 255 / 0%);
    background-size: 100%;

    .titleName {
      width: 100%;
      padding: 10px 3px 0 40px;
      overflow: hidden;
      font-size: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .description {
      /* 将p标签变成弹性盒子 */
      display: -webkit-box;
      width: 100%;
      padding: 5px 10px 0;
      overflow: hidden;
      color: #747474;
      font-size: 14px;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }

  .node-bg-0 {
    background-image: url('@/assets/images/dataDefinition/node_root.png');
  }

  .node-bg-1 {
    background-image: url('@/assets/images/dataDefinition/node_ary.png');
  }

  .node-bg-2 {
    background-image: url('@/assets/images/dataDefinition/node_int.png');
  }

  .node-bg-3 {
    background-image: url('@/assets/images/dataDefinition/node_flt.png');
  }

  .node-bg-4 {
    background-image: url('@/assets/images/dataDefinition/node_bool.png');
  }

  .node-bg-5 {
    background-image: url('@/assets/images/dataDefinition/node__byte.png');
  }

  .node-bg-6 {
    background-image: url('@/assets/images/dataDefinition/node_str.png');
  }

  .node-bg-7 {
    background-image: url('@/assets/images/dataDefinition/node_stp.png');
  }

  .node-bg-8 {
    background-image: url('@/assets/images/dataDefinition/node_mstp.png');
  }
</style>
