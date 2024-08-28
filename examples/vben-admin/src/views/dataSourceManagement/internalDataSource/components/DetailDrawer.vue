<template>
  <BasicDrawer v-bind="$attrs" :isDetail="true" title="内部数据源详情页" @register="register">
    <template #titleToolbar>
      当前数据源： <span>&nbsp; {{ propsData.uuid }}</span>
    </template>
    <div class="show flex p-4">
      <div class="w-30%">
        <span class="">静态数据类型：</span>
        <Input :size="'small'" style="width: 50%" v-model:value="dataType" :disabled="true" />
      </div>
      <div class="w-70%">
        <div v-show="propsData.innerDefValType == 'RangeData'">
          <span class="">静态数据值：</span>
          <div class="w-99% flex mt-1" v-for="item in rangeDataList" :key="item">
            <div v-show="item[0] !== item[1]" class="w-30% mt-1">
              <span class="">左区间：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[0]" :disabled="true" />
            </div>
            <div v-show="item[0] !== item[1]" class="w-30% mt-1">
              <span class="">右区间：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[1]" :disabled="true" />
            </div>
            <div v-show="item[0] == item[1]" class="w-30% mt-1">
              <span class="">数据值：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[0]" :disabled="true"
            /></div>
          </div>
        </div>
        <div v-show="propsData.innerDefValType == 'MapData'">
          <span class="">静态数据值：</span>
          <div class="w-99% flex mt-1" v-for="item in mapDataList" :key="item">
            <div v-show="item[0] !== item[1]" class="w-30% mt-1">
              <span class="">左区间：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[0]" :disabled="true" />
            </div>
            <div v-show="item[0] !== item[1]" class="w-30% mt-1">
              <span class="">右区间：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[1]" :disabled="true" />
            </div>
            <div v-show="item[0] == item[1]" class="w-30% mt-1">
              <span class="">数据值：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[0]" :disabled="true" />
            </div>

            <div class="w-30% mt-1">
              <span class="">映射值：</span>
              <Input style="width: 60%" :size="'small'" v-model:value="item[2]" :disabled="true"
            /></div>
          </div>
        </div>
        <div
          v-show="
            propsData.innerDefValType !== 'RangeData' && propsData.innerDefValType !== 'MapData'
          "
        >
          <span class="">静态数据值：</span>
          <Input
            style="width: 24%"
            :size="'small'"
            v-model:value="propsData.staticVal"
            :disabled="true"
        /></div>
      </div>
    </div>

    <Table
      class="ant-table-striped"
      style="margin-top: 10px; border-radius: 0"
      :columns="bindColumns"
      :data-source="bindTableData"
      :expandedRowKeys="expandedRowKeys"
      :loading="tableLoading"
      :scroll="{ x: 1200, y: tableHeight }"
      @expand="areExpand"
      :pagination="false"
    >
      <template #bodyCell="{ text, column, record }">
        <template v-if="column.key === 'description'">
          {{ text }}
          <Button type="link" @click="editIdField(record)"
            ><template #icon> <EditTwoTone /> </template
          ></Button>
        </template>
      </template>
    </Table>
    <DescriptionModal @register="registerModal" @refresh="refresh" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { Description } from '@/components/Description';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { ref, h, computed, onMounted, nextTick, onActivated, toRaw } from 'vue';
  import { Table, Button, Input, Tabs, TabPane, Transfer, Tree, Divider } from 'ant-design-vue';

  import {
    GetOneInnerDefine,
    GetInnerDefineChildList,
    DeleteOneInnerSource,
  } from '@/api/dataSourceManagement/innerDataSource';

  import { EditTwoTone } from '@ant-design/icons-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import DescriptionModal from './DescriptionModal.vue';

  const dataType = ref('');
  const mapDataList = ref([]);
  const rangeDataList = ref([]);
  const [registerModal, { openModal: descriptionModal }] = useModal();
  //单独编辑描述
  const editIdField = (record) => {
    descriptionModal(true, { record: record });
  };
  const $emit = defineEmits(['refreshTable', 'register']);
  const refresh = () => {
    getBindTableData({ uuid: propsData.value.dataDefUUID });
  };
  const { createMessage } = useMessage();
  const propsData = ref<any>({});
  const bindTableData = ref<any[]>([]);
  const expandedRowKeys = ref<string[]>([]);
  const tableLoading = ref(false);
  const tableHeight = ref(300);
  const [register] = useDrawerInner((data) => {
    data && onDataReceive(data);
  });
  const onDataReceive = (data) => {
    propsData.value = data.record;
    if (propsData.value.innerDefValType == 'IntData') {
      dataType.value = '整型数据';
    } else if (propsData.value.innerDefValType == 'FloatData') {
      dataType.value = '浮点型数据';
    } else if (propsData.value.innerDefValType == 'BoolData') {
      dataType.value = '布尔型数据';
    } else if (propsData.value.innerDefValType == 'StringData') {
      dataType.value = '字符串型数据';
    } else if (propsData.value.innerDefValType == 'RangeData') {
      dataType.value = '范围型数据';
    } else if (propsData.value.innerDefValType == 'MapData') {
      dataType.value = '映射表数据';
    } else if (propsData.value.innerDefValType == 'NullData') {
      dataType.value = '空数据';
    } else {
      dataType.value = '--';
    }
    console.log(propsData.value, 'propsData.value ');
    if (propsData.value.staticVal !== '') {
      formaterStaticVal(propsData.value);
    }
    getBindTableData({ uuid: propsData.value.dataDefUUID });
    nextTick(() => {
      initTableHeight();
    });
  };
  const formaterStaticVal = (record) => {
    if (record.innerDefValType == 'RangeData') {
      let arr2: any = [];
      let arr = record.staticVal.split('&*&');
      // console.log(temp, 'xx');
      for (let i = 0; i < arr.length; i++) {
        let arr1: any = [];
        let temp = arr[i].split('%^%');
        for (let j = 0; j < temp.length; j++) {
          arr1.push(temp[j]);
        }
        arr2.push(arr1);
      }
      rangeDataList.value = arr2;
      // console.log(arr2, 'xx2');
    } else if (record.innerDefValType == 'MapData') {
      let arr2: any = [];
      let arr = record.staticVal.split('&*&');
      // console.log(temp, 'xx');
      for (let i = 0; i < arr.length; i++) {
        let arr1: any = [];
        let temp = arr[i].replace('@#@', '%^%').split('%^%');
        for (let j = 0; j < temp.length; j++) {
          arr1.push(temp[j]);
        }
        arr2.push(arr1);
      }
      mapDataList.value = arr2;
      // console.log(arr2, 'xx2');
    }
  };
  const getBindTableData = (values: any) => {
    tableLoading.value = true;
    GetOneInnerDefine(values)
      .then((res) => {
        bindTableData.value = res.items;
        expandedRowKeys.value = [];
        tableLoading.value = false;
      })
      .catch((err) => {
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

      customRender: ({ value, text, record }) => {
        if (!record?.uuid) {
          return <span></span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.InnerDataDefMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
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

      customRender: ({ text, record }) => {
        if (record.dataTypeBase == 'IntData') {
          return '整型数据';
        } else if (record.dataTypeBase == 'FloatData') {
          return '浮点型数据';
        } else if (record.dataTypeBase == 'BoolData') {
          return '布尔型数据';
        } else if (record.dataTypeBase == 'StringData') {
          return '字符串型数据';
        } else if (record.dataTypeBase == 'RangeData') {
          return '范围型数据';
        } else if (record.dataTypeBase == 'MapData') {
          return '映射表数据';
        } else if (record.dataTypeBase == 'NullData') {
          return '空数据';
        } else {
          return text;
        }
      },
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
          uuidType: UUIDTypeEnum.InnerDataDefMemSync,
          uuid: record?.fatherUUID,
          record: record,
        });
      },
    },

    {
      title: '被引用次数',
      dataIndex: 'bindCounter',
      key: 'bindCounter',
      width: 120,
    },
  ];

  const areExpand = (expanded, record) => {
    console.log('expanded, record: ', expanded, record);
    if (expanded) {
      tableLoading.value = true;
      GetInnerDefineChildList({
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
  .show {
    border-radius: 5px;
    box-shadow: 5px 5px 6px 2px #ccc;
  }
</style>
