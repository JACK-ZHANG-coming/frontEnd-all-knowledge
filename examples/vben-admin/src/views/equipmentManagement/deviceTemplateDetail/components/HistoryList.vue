<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <a-button
          class="ml-3"
          @click="addOrEditModal(true, { isEdit: false, uuid: props.deviceUUId, record: {} })"
          >添加</a-button
        >
      </template>
      <!-- 卡片具体内容 -->
      <div class="w-100% h-100% ml-5" ref="divRef">
        <Table
          style="width: 98%"
          :columns="bindColumns"
          :data-source="dynDefineLinkList"
          :pagination="false"
          :scroll="{ y: tableHeight }"
          size="small"
          class="tableClass"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <a-button type="link" @click="editRow(record)">编辑</a-button>
              <a-button type="link" @click="openRow(record)">历史曲线</a-button>
              <Popconfirm
                title="确认删除?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="delRow(record)"
              >
                <a-button type="link">删除</a-button>
              </Popconfirm>
              <!-- <a-button type="link">删除</a-button> -->
            </template>
          </template>
        </Table>
      </div>
    </Card>
    <AddEditModal @register="registerAddEditModal" />
    <HistoryDrawer @register="registerHistoryDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { Ref, ref, watch, h, onMounted, nextTick, onActivated, inject } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import AddEditModal from './AddEditModal.vue';
  import { useModal } from '@/components/Modal';
  import HistoryDrawer from './HistoryDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';
  import { DeviceDelDynamicDefineLink } from '@/api/equipmentManagement/deviceTemplateDetail';
  import { Card, Popconfirm, MenuItem, Table, message } from 'ant-design-vue';

  const props = defineProps({
    deviceUUId: String,
    dynamicDefineLinkList: Array,
    realTimeList: Array,
  });
  const dynDefineLinkList = ref<any>([]);
  const divRef = ref<any>(null);
  const [registerAddEditModal, { openModal: addOrEditModal }] = useModal();
  const [registerHistoryDrawer, { openDrawer: historyDrawer }] = useDrawer();

  const reload: any = inject('reload');

  const tableHeight = ref(450);

  const bindColumns = [
    {
      title: '数据名称',
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: 100,
      // className:
    },
    {
      title: '对应数据源',
      dataIndex: 'srcUUID',
      key: 'srcUUID',

      width: 150,
      customRender: ({ value, text, record }) => {
        if (!record?.srcUUID) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType:
            record?.type == 'Inner'
              ? UUIDTypeEnum.InnerSourceMemSync
              : UUIDTypeEnum.DataSourceMemSync,
          uuid: record?.srcUUID,
          record: record,
        });
      },
    },
    {
      title: '对应数据定义',
      dataIndex: 'defUUID',
      key: 'defUUID',

      width: 150,
      customRender: ({ value, text, record }) => {
        if (!record?.defUUID) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType:
            record?.type == 'Inner'
              ? UUIDTypeEnum.InnerDataDefMemSync
              : UUIDTypeEnum.DataDefMemSync,
          uuid: record?.defUUID,
          record: record,
        });
      },
    },
    {
      title: '实时数据',
      dataIndex: 'realTime',
      key: 'realTime',

      width: 150,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 230,
    },
  ];
  const editRow = (record) => {
    addOrEditModal(true, { isEdit: true, uuid: props.deviceUUId, record: record });
  };

  const delRow = (record) => {
    const params = {
      uuid: props.deviceUUId,
      attribute: [record.attributeName],
    };
    DeviceDelDynamicDefineLink(params)
      .then((result) => {
        message.success('删除成功！');
        reload();
      })
      .catch((err) => {});
  };
  const openRow = (record) => {
    if (record?.srcUUID !== '' && record?.defUUID !== '') {
      historyDrawer(true, {
        lineType: [
          { name: record?.attributeName, srcUUID: record?.srcUUID, defUUID: record?.defUUID },
        ],
      });
    } else {
      message.warning('请先绑定数据源和数据定义！');
    }
  };
  const initTableHeight = () => {
    let customDiv = document.querySelector('.customDiv');
    console.log(window.innerHeight, ' window.innerHeight');
    tableHeight.value = window.innerHeight - (customDiv?.scrollHeight || 0) - 700;
    console.log(tableHeight.value, 'tableHeight.value');
  };
  onMounted(() => {
    nextTick(() => {
      initTableHeight();
      window.onresize = () => {
        initTableHeight();
      };
    });
  });
  watch(
    () => props.dynamicDefineLinkList,
    () => {
      if (props.dynamicDefineLinkList?.length && props.dynamicDefineLinkList?.length > 0) {
        dynDefineLinkList.value = props.dynamicDefineLinkList;
      } else {
        dynDefineLinkList.value = [];
        // realTimeData.value = {};
      }
      // if (newVal !== oldVal) openRef.value = newVal;
    },
    { deep: true },
  );
  watch(
    () => props.realTimeList,
    () => {
      if (props.realTimeList?.length && props.realTimeList?.length > 0) {
        props.realTimeList?.forEach((item: any) => {
          for (let i = 0; i < dynDefineLinkList.value.length; i++) {
            if (item[0] == dynDefineLinkList.value[i].attributeName) {
              dynDefineLinkList.value[i].realTime = item[1];
            }
          }
        });
      }
    },
    { deep: true },
  );
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
