<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <div class="w-100% h-100% flex justify-between">
          <div
            >服务器列表
            <Tooltip placement="right">
              <template #title>
                <span>虚IP:{{ xuIP }}</span>
              </template>
              <ExclamationCircleOutlined />
            </Tooltip>
          </div>
          <div>
            <!-- <span class="text-14px">当前服务器：{{ currentIP }}</span> -->
            <Dropdown>
              <a-button type="link" :size="'small'">
                <Icon icon="ant-design:sync-outlined" :size="16"
              /></a-button>
              <template #overlay>
                <Menu>
                  <MenuItem v-for="item in IPList" :key="item">
                    <a-button type="link" :size="'small'" @click="changeIP(item)">{{
                      item
                    }}</a-button>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
            <!-- <a-button type="link" :size="'small'"><span class="text-14px">更多</span></a-button> -->
          </div>
        </div>
      </template>
      <!-- 卡片具体内容 -->
      <div class="w-100% h-100% ml-2 mr-2" ref="divRef">
        <div style="margin-top: -2%">当前服务器: {{ currentIP }}</div>
        <Table
          style="width: 98%"
          :columns="columns"
          :data-source="currentData"
          :pagination="false"
          :scroll="{ y: tableHeight }"
          size="small"
          class="tableClass"
        >
          <template #bodyCell="{ column, text, index }">
            <!-- 当前列是序号列时，显示序号 -->
            <span v-if="column.dataIndex === 'serialNumber'">{{ index + 1 }}</span>
            <!-- 其他列正常显示 -->
            <span v-if="column.dataIndex === 'status'">
              <div v-if="text == 'active'">
                <div class="flex justify-between items-baseline pr-1">
                  <span class=" ">运行 </span>
                  <span class="color-green">
                    <!-- <Icon icon="ant-design:check-circle-filled" :size="16" /> -->
                    <Icon icon="ant-design:check-circle-twotone" :size="16" />
                  </span>
                </div>
              </div>
              <div v-if="text == 'inactive'">
                <div class="flex justify-between items-baseline pr-1">
                  <span class="">未运行 </span>
                  <span class="color-#666666">
                    <!-- <Icon icon="ant-design:clock-circle-filled" :size="16" /> -->
                    <Icon icon="ant-design:clock-circle-twotone" :size="16" />
                  </span> </div
              ></div>

              <div v-if="text == 'failed'">
                <div class="flex justify-between items-baseline pr-1">
                  <span class="">错误 </span>
                  <span class="color-red">
                    <!-- <Icon icon="ant-design:close-circle-filled" :size="16" /> -->
                    <Icon icon="ant-design:close-circle-twotone" :size="16" />
                  </span> </div
              ></div>
              <div v-if="text == 'unknown'">
                <div class="flex justify-between items-baseline pr-1">
                  <span class="">未知 </span>
                  <span class="color-#666666">
                    <Icon icon="ant-design:question-circle-outlined" :size="16" />
                    <!-- <Icon icon="ant-design:minus-circle-twotone" :size="16" /> -->
                  </span>
                </div>
              </div>
              <div v-if="text == 'activating'">
                <div class="flex justify-between items-baseline pr-1">
                  <span class="">启动中 </span>
                  <span class="color-blue">
                    <Icon icon="ant-design:caret-up-outlined" :size="16" />
                  </span> </div
              ></div>
              <div v-if="text == 'deactivating'"
                ><div class="flex justify-between items-baseline pr-1">
                  <span class="">停止中 </span>
                  <span class="color-orange">
                    <Icon icon="ant-design:caret-down-filled" :size="16"
                  /></span> </div
              ></div>
            </span>

            <span v-else>{{ text }}</span>
          </template>
        </Table>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';

  import { Tooltip, Card, Dropdown, Menu, MenuItem, Table } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { GetServiceStatus } from '@/api/systemHealthMonitoring/serverHealth';
  import { useGlobSetting } from '@/hooks/setting';

  const { ipList, virtualIp } = useGlobSetting();
  const server = ipList?.split(';');
  const IPList = ref(server);
  const currentIP = ref(server?.[0]);
  const divRef = ref<any>(null);
  const xuIP = ref(virtualIp);

  const currentData = ref<any>([
    //状态颜色图标测试数据
    // {
    //   serviceName: 'JrjMdc',
    //   port: '5154',
    //   status: 'active',
    // },
    // {
    //   serviceName: 'redis',
    //   port: '26379',
    //   status: 'inactive',
    // },
    // {
    //   serviceName: 'ldirectord',
    //   port: '无',
    //   status: 'failed',
    // },
    // {
    //   serviceName: 'etcd',
    //   port: '2379',
    //   status: 'unknown',
    // },
    // {
    //   serviceName: 'mongod',
    //   port: '27017',
    //   status: 'activating',
    // },
    // {
    //   serviceName: 'keepalived',
    //   port: 'MASTER',
    //   status: 'deactivating',
    // },
  ]);
  const tableHeight = ref(0);
  const AllData = ref<any>([]);
  const resizeObserver = new ResizeObserver((entries) => {
    tableHeight.value = divRef.value.offsetHeight - 60;
  });
  const changeIP = (item: string) => {
    currentIP.value = item;
    getCurrentData();
  };
  const getAllData = () => {
    GetServiceStatus()
      .then((res) => {
        AllData.value = res;
        getCurrentData();
        console.log(res, 'res');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCurrentData = () => {
    AllData.value.forEach((item) => {
      if (item.nodeIp == currentIP.value) {
        if (item.serviceHealthInfos.length > 0) {
          currentData.value = item.serviceHealthInfos;
        } else {
          currentData.value = [];
        }
      }
    });
  };
  getAllData();
  onMounted(() => {
    resizeObserver.observe(divRef.value);
  });
  onBeforeUnmount(() => {
    // 离开该页面需要移除这个监听的事件，不然会报错
    resizeObserver.unobserve(divRef.value);
  });
  const columns = [
    {
      title: '',
      dataIndex: 'serialNumber', // 这个dataIndex仅作为标识，不对应实际数据字段
      width: '50px', // 可以自定义宽度
      scopedSlots: { customRender: 'bodyCell' }, // 对应模板中的具名插槽
    },

    {
      title: '服务监控',
      dataIndex: 'serviceName',
      // className:
    },
    {
      title: '端口',
      dataIndex: 'port',
    },
    {
      title: '健康检查',
      dataIndex: 'status',
    },
  ];
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
  // .tableClass {
  //   :deep(.ant-table-header-column) {
  //     font-size: 12px!important;
  //      // 字体加粗
  //     color: red;
  //   }
  // }
</style>
