<template>
  <BasicDrawer
    v-bind="$attrs"
    :isDetail="true"
    title="外部数据源详情页"
    @register="register"
    @close="refresh"
  >
    <template #titleToolbar>
      当前数据源： <span>&nbsp; {{ propsData.uuid }}</span>
    </template>
    <Tabs v-model:activeKey="activeKey" type="card">
      <TabPane key="1">
        <template #tab>
          <span>
            <DisconnectOutlined />

            数据-时间戳 映射表
          </span>
        </template>
        <div class="m-2 flex flex-wrap">
          <div class="mr-4 flex w-30% items-center">
            数据定义
            <Input
              v-model:value="jiedianC"
              :readonly="true"
              :size="'small'"
              style="width: 65%; margin-left: 5px"
            />
          </div>

          <div class="flex">
            <Button v-show="jiedianC !== ''" type="link" @click="submitUnBind" :size="'small'">
              删除映射关系
            </Button>
          </div>
        </div>
        <div class="bg-white">
          <Table
            style="border-radius: 0"
            :columns="unBindColumns"
            :data-source="unBindTableData"
            :loading="tableLoading2"
            :hideDefaultSelections="true"
            :hideSelectAll="true"
            :rowKey="'dataUuid'"
            :rowSelection="{
              // columnTitle: ' ',
              type: 'radio',
              selectedRowKeys: selectedRowKeysList2,
              onChange: rowSelectedChange2,
              onSelect: handlerRowChange,
            }"
            :pagination="false"
          />
        </div>
      </TabPane>
      <TabPane key="2">
        <template #tab>
          <span>
            <LinkOutlined />
            新增数据-时间戳映射
          </span>
        </template>
        <div class="m-2 flex flex-wrap">
          <div class="mr-4 flex w-30% items-center">
            数据定义<span v-show="current == 'B'">&nbsp; {{ jiedianA }}</span>
            <Input
              v-model:value="jiedianA"
              :readonly="true"
              :size="'small'"
              v-show="current == 'A'"
              style="width: 65%; margin-left: 5px"
            />
            <Button type="link" @click="clickButton('A')">
              <template #icon>
                <EditTwoTone />
              </template>
            </Button>
          </div>
          <div class="flex items-center w-30%">
            时间戳<span v-show="current == 'A'">&nbsp; {{ jiedianB }}</span>
            <Input
              v-model:value="jiedianB"
              :readonly="true"
              :size="'small'"
              v-show="current == 'B'"
              style="width: 65%; margin-left: 5px"
            />
            <Button type="link" @click="clickButton('B')">
              <template #icon>
                <EditTwoTone />
              </template>
            </Button>
          </div>
          <div class="flex">
            <Button
              v-show="jiedianA !== '' && jiedianB !== ''"
              type="link"
              @click="submitBind"
              :size="'small'"
            >
              新增映射关系
            </Button>
          </div>
        </div>
        <div class="bg-white">
          <Table
            class="ant-table-striped"
            style="border-radius: 0"
            :columns="bindColumns"
            :data-source="bindTableData"
            :expandedRowKeys="expandedRowKeys"
            :loading="tableLoading"
            :rowClassName="setRowClassName"
            :scroll="{ x: 1200, y: tableHeight }"
            @expand="areExpand"
            :rowSelection="{
              type: 'radio',
              selectedRowKeys: selectedRowKeysList,
              onChange: rowSelectedChange,
              preserveSelectedRowKeys: true,
            }"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'uuid'">
                <div class="inline-block"
                  ><UUIDDiv
                    :uuidType="UUIDTypeEnum.DataDefMemSync"
                    :uuid="record?.uuid"
                    :record="record"
                /></div>
                <span v-show="bindData.includes(record.uuid)">
                  <Icon icon="ant-design:link-outlined" />
                </span>
              </template>
            </template>
          </Table>
        </div>
      </TabPane>

      <TabPane key="3">
        <template #tab>
          <span>
            <SettingOutlined />

            存储规则
          </span>
        </template>

        <div class="w-100% flex justify-center">
          <div class="w-60% mt-2">
            <Transfer
              :titles="['    数据源-数据定义列表', '    持久化存储列表']"
              :operations="['设置为持久化存储', '取消持久化存储']"
              v-model:target-keys="targetKeys"
              v-model:selected-keys="selectedKeys"
              class="tree-transfer"
              :data-source="dataSource"
              :show-select-all="false"
              @change="transferChange"
            >
              <template
                #children="{
                  direction,
                  filteredItems,
                  selectedKeys,
                  disabled: listDisabled,
                  onItemSelectAll,
                  onItemSelect,
                }"
              >
                <Table
                  :row-selection="
                    getRowSelection({
                      disabled: listDisabled,
                      selectedKeys,
                      onItemSelectAll,
                      onItemSelect,
                    })
                  "
                  :columns="direction === 'left' ? leftColumns : rightColumns"
                  :data-source="filteredItems"
                  size="small"
                  :pagination="false"
                  :style="{ pointerEvents: listDisabled ? 'none' : null }"
                />
                <!-- :custom-row="
                    ({ key, disabled: itemDisabled }) => ({
                      onClick: () => {
                        if (itemDisabled || listDisabled) return;
                        onItemSelect(key, !selectedKeys.includes(key));
                      },
                    })
                  " -->
              </template>
            </Transfer>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { ref, reactive, computed, h, nextTick, onActivated, toRaw } from 'vue';
  import { Table, Button, Input, Tabs, TabPane, Transfer, Tree } from 'ant-design-vue';
  import type { TransferProps, TreeProps } from 'ant-design-vue';
  import {
    GetOneDataSource,
    GetOneDataDefine,
    GetDataDefineChildList,
    LinkDataTimeStamp,
    UnLinkDataTimeStamp,
    DataSourceAddStoreStgy,
    DataSourceDelStoreStgy,
  } from '@/api/dataSourceManagement/externalDataSource';
  import {
    LinkOutlined,
    DisconnectOutlined,
    SettingOutlined,
    EditTwoTone,
  } from '@ant-design/icons-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import Icon from '@/components/Icon/Icon.vue';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  const $emit = defineEmits(['refreshTable', 'register']);
  const refresh = () => {
    selectedKeys.value = [];
    // getRowSelection({ , [], onItemSelectAll, onItemSelect});
    activeKey.value = '1';
    $emit('refreshTable');
  };
  const { createMessage } = useMessage();
  const activeKey = ref('1');
  const propsData = ref<any>({});
  const current = ref('A');
  const jiedianA = ref('');
  const jiedianB = ref('');
  const jiedianC = ref('');
  const selectedRowKeysList = reactive<any>([]);
  const selectedRowKeysList2 = reactive<any>([]);

  const bindTableData = ref<any[]>([]);
  const bindData = ref<any>([]);
  const unBindTableData = ref<any[]>([]);

  const expandedRowKeys = ref<string[]>([]);
  const tableLoading = ref(false);
  const tableLoading2 = ref(false);

  const tableHeight = ref(300);
  const [register] = useDrawerInner((data) => {
    data && onDataReceive(data);
  });
  const onDataReceive = (data) => {
    propsData.value = data.record;
    getUnBindTableData({ uuid: propsData.value.uuid });
    getBindTableData({ uuid: propsData.value.dataDefUUID });

    getTransferData();

    nextTick(() => {
      initTableHeight();
    });
  };

  const clickButton = (val: any) => {
    current.value = val;
    selectedRowKeysList[0] = null;
  };
  //绑定界面
  const setRowClassName = (record, index) => {
    //判断并返回行的样式名称

    if (record.dataTypeBase == 'TimeStampSData' || record.dataTypeBase == 'TimeStampMsData') {
      return 'bg-blue';
    }
  };

  const getBindTableData = (values: any) => {
    current.value = 'A';
    jiedianA.value = '';
    jiedianB.value = '';
    selectedRowKeysList[0] = null;

    tableLoading.value = true;
    GetOneDataDefine(values)
      .then((res) => {
        console.log(res.items, 'res.items');
        bindTableData.value = res.items;
        expandedRowKeys.value = [];

        tableLoading.value = false;
      })
      .catch((err) => {
        console.log('err: ', err);
        bindTableData.value = [];
        expandedRowKeys.value = [];
        tableLoading.value = false;
      });
  };
  const bindColumns = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: '名称',
      dataIndex: 'dataName',
      key: 'dataName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '数据类型',
      dataIndex: 'dataTypeBase',
      key: 'dataTypeBase',
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
    },
    // {
    //   title: '次级类型',
    //   dataIndex: 'typeSub',
    //   key: 'typeSub',
    // },
    {
      title: '父级定义UUID',
      dataIndex: 'fatherUUID',
      key: 'fatherUUID',
      customRender: ({ value, text, record }) => {
        if (!record?.fatherUUID) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
          uuid: record?.fatherUUID,
          record: record,
        });
      },
    },

    {
      title: '被引用次数',
      dataIndex: 'bindCounter',
      key: 'bindCounter',
    },
  ];
  const rowSelectedChange = (selectedRowKeys: any, selectedRows: any) => {
    if (current.value == 'A') {
      jiedianA.value = selectedRowKeys[0];
    } else if (current.value == 'B') {
      jiedianB.value = selectedRowKeys[0];
    }
    selectedRowKeysList[0] = selectedRowKeys[0];
  };

  const areExpand = (expanded, record) => {
    console.log('expanded, record: ', expanded, record);
    if (expanded) {
      tableLoading.value = true;
      GetDataDefineChildList({
        UUID: record.uuid,
      })
        .then((data: any) => {
          areFindTableDataKey(record, bindTableData.value, data.items);
          nextTick(() => {
            expandedRowKeys.value = [...expandedRowKeys.value, record.key];
          });
          tableLoading.value = false;
        })
        .catch((err) => {
          tableLoading.value = false;
        });
    } else {
      expandedRowKeys.value = expandedRowKeys.value.filter((item) => item !== record.key);
    }
  };

  const areFindTableDataKey = (record, dataList, children) => {
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].key === record.key) {
        dataList[i].children = children;
        record.children = children;
        return;
      } else if (dataList[i].children) {
        areFindTableDataKey(record, dataList[i].children, children);
      }
    }
  };

  const initTableHeight = () => {
    let customDiv = document.querySelector('.customDiv');
    tableHeight.value = window.innerHeight - (customDiv?.scrollHeight || 0) - 320;
  };
  const submitBind = () => {
    const params = {
      dataSourceUUID: propsData.value.uuid,
      dataDefineUUID: jiedianA.value,
      timeStampUUID: jiedianB.value,
    };
    LinkDataTimeStamp(params)
      .then((res) => {
        createMessage.success('绑定DataTimeStamp成功！');

        setTimeout(() => {
          getUnBindTableData({ uuid: propsData.value.uuid });
          current.value = 'A';
          jiedianA.value = '';
          jiedianB.value = '';
          selectedRowKeysList[0] = null;
          // getBindTableData({ uuid: propsData.value.dataDefUUID });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //解绑界面
  const unBindColumns = [
    {
      title: '数据节点',
      dataIndex: 'dataUuid',
      key: 'dataUuid',
      customRender: ({ value, text, record }) => {
        if (!record?.dataUuid) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
          uuid: record?.dataUuid,
          record: record,
        });
      },
    },
    {
      title: '时间戳节点',
      dataIndex: 'timeUuid',
      key: 'timeUuid',
      customRender: ({ value, text, record }) => {
        if (!record?.timeUuid) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
          uuid: record?.timeUuid,
          record: record,
        });
      },
    },
  ];
  //解绑表格单选选择变化时调用方法
  const rowSelectedChange2 = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys, selectedRows, 'selectedRowKeys');
    jiedianC.value =
      selectedRowKeys.length > 0 ? selectedRowKeys[selectedRowKeys.length - 1] : selectedRowKeys[0];

    selectedRowKeysList2[0] =
      selectedRowKeys.length > 0 ? selectedRowKeys[selectedRowKeys.length - 1] : selectedRowKeys[0];
  };
  const handlerRowChange = (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
    console.log(record, 'record');
    console.log(selected, 'selected');

    console.log(selectedRows, 'selectedRows');

    console.log(nativeEvent, 'nativeEvent');

    // jiedianC.value = selectedRowKeys[0];
    // selectedRowKeysList2[0] = selectedRowKeys[0];
  };
  //获取解绑可选表格
  const getUnBindTableData = (values: any) => {
    jiedianC.value = '';
    selectedRowKeysList2[0] = null;
    tableLoading2.value = true;
    GetOneDataSource(values)
      .then((res) => {
        let temp: any = [];
        let temp2: any = [];
        for (let key in res.def2TimestampTable) {
          temp.push({ dataUuid: key, timeUuid: res.def2TimestampTable[key] });
          temp2.push(key);
          // temp2.push(res.def2TimestampTable[key]);
        }
        console.log('temp2', temp2);
        bindData.value = temp2;
        unBindTableData.value = temp;
        tableLoading2.value = false;
      })
      .catch((err) => {
        unBindTableData.value = [];
        bindData.value = [];
        tableLoading2.value = false;
      });
  };
  //
  const submitUnBind = () => {
    const params = {
      dataSourceUUID: propsData.value.uuid,
      dataDefineUUID: jiedianC.value,
    };
    UnLinkDataTimeStamp(params)
      .then((res) => {
        createMessage.success('解除绑定DataTimeStamp成功！');
        setTimeout(() => {
          getUnBindTableData({ uuid: propsData.value.uuid });
          // getBindTableData({ uuid: propsData.value.dataDefUUID });
        }, 1000);
      })
      .catch((err) => {});
  };

  const leftTableColumns = [
    {
      dataIndex: 'title',
      title: '数据名称',
    },
    {
      dataIndex: 'uuid',
      title: 'UUID',
      customRender: ({ value, text, record }) => {
        if (!record?.uuid) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: 'title',
      title: '数据名称',
    },
    {
      dataIndex: 'uuid',
      title: 'UUID',
      customRender: ({ value, text, record }) => {
        if (!record?.uuid) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
    },
  ];
  const targetKeys = ref<any>([]);
  const leftColumns = ref(leftTableColumns);
  const rightColumns = ref(rightTableColumns);
  const dataSource = ref<any>([]);
  const selectedKeys = ref<any>([]);
  //存储规则
  const getTransferData = () => {
    let obj = propsData.value.formatJson;
    let temp: any = [];
    for (let key in obj) {
      temp.push({ key: obj[key], title: key, uuid: obj[key] });
    }

    dataSource.value = temp;
    targetKeys.value = propsData.value.storeStgy;
  };
  const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => {
    console.log(disabled, '11111', selectedKeys, '11112', onItemSelectAll, '1141', onItemSelect);
    return {
      getCheckboxProps: (item) => ({
        disabled: disabled || item.disabled,
      }),
      onSelectAll(selected, selectedRows) {
        const treeSelectedKeys = selectedRows
          .filter((item) => !item.disabled)
          .map(({ key }) => key);
        onItemSelectAll(treeSelectedKeys, selected);
      },
      onSelect({ key }, selected) {
        onItemSelect(key, selected);
      },
      selectedRowKeys: selectedKeys,
    };
  };
  const transferChange = (target, direction, move) => {
    console.log(target, 'target');
    console.log(direction, 'direction');
    console.log(move, 'move');

    const params = {
      uuid: propsData.value.uuid,
      dataDefUUIDs: move,
    };
    if (direction == 'left') {
      //删除接口
      DataSourceDelStoreStgy(params)
        .then((res) => {
          createMessage.success('删除成功！');
        })
        .catch((err) => {
          const combArray = target.concat(move);
          targetKeys.value = combArray;
        });
    } else if (direction == 'right') {
      //添加接口
      DataSourceAddStoreStgy(params)
        .then((res) => {
          createMessage.success('添加成功！');
        })
        .catch((err) => {
          targetKeys.value = target.filter((item) => !move.includes(item));
        });
    }
  };

  onActivated(() => {
    nextTick(() => {
      initTableHeight();
      window.onresize = () => {
        initTableHeight();
      };
    });
  });
</script>
<style lang="less" scoped>
  ::v-deep .bg-blue {
    background-color: #d9f7be;
  }

  .ant-table-striped :deep(.ant-table-row-level-0.table-striped) td {
    background-color: #fafafa !important;

    &.ant-table-cell-row-hover {
      background-color: #fafafa !important;
    }
  }

  ::v-deep .ant-btn-sm {
    height: 30px;
    margin-bottom: 10px !important;
  }

  .ant-table-striped {
    :deep(.ant-table-cell-row-hover) {
      background-color: rgb(255 255 255 / 0%) !important;
    }

    :deep(.ant-table-row) {
      &:hover {
        font-weight: bold;

        td {
          background-color: rgb(255 255 255 / 0%) !important;
        }
      }
    }
  }

  ::v-deep .ant-transfer .ant-transfer-list-body {
    overflow-y: scroll;
  }

  .tree-transfer {
    height: 550px;
  }
</style>
