<!-- 数据定义总览 -->
<template>
  <BaseContainer>
    <div class="tableHeader customDiv">
      <BasicForm
        @register="register"
        @advanced-change="handleToggleAdvancedChange"
        @submit="submitQuery"
        :submitOnReset="true"
      />
    </div>
    <div class="bg-white" :style="{ margin: '0 16px', padding: '0 6px' }">
      <Table
        class="ant-table-striped"
        :style="{
          borderRadius: 0,
          '--table-height': `${tableHeight}px`,
          '--table-width': `${tableWidth}px`,
        }"
        :columns="columns"
        :data-source="tableData"
        :expandedRowKeys="expandedRowKeys"
        :loading="tableLoading"
        :scroll="{ x: tableWidth, y: tableHeight }"
        @expand="areExpand"
        :pagination="{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          size: 'small',
          total: total,
        }"
        @change="submitQuery"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : '')"
      />
    </div>
  </BaseContainer>
</template>
<script lang="tsx" setup>
  import { ref, onMounted, nextTick, onActivated, onBeforeUnmount, h } from 'vue';
  import { Table, Pagination, Button } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm, baseFormConfig } from '@/components/Form';
  import BaseContainer from '@/components/BaseContainer.vue';
  import {
    GetDataDefineNoFatherList,
    GetDataDefineChildList,
  } from '@/api/dataDefinition/dataDefinitionsOverview';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  const tableData = ref<any[]>([]);
  const total = ref(0);
  const expandedRowKeys = ref<string[]>([]);
  const tableLoading = ref(false);
  const tableHeight = ref(300);
  const tableWidth = ref(1660);

  const getSchamas = (): FormSchema[] => {
    // 描述，数据类型，次级类型，数据帧唯一标识
    return [
      {
        // field: 'defName',
        field: 'dataName',
        component: 'Input',
        label: '名称',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'dataTypeBase',
        component: 'Select',
        label: '数据类型',
        colProps: {
          span: 8,
        },
        componentProps: {
          options: [
            {
              label: 'Root',
              value: 0,
              key: 0,
            },
            {
              label: 'RootArray',
              value: 1,
              key: 1,
            },
            {
              label: 'IntData',
              value: 2,
              key: 2,
            },
            {
              label: 'FloatData',
              value: 3,
              key: 3,
            },
            {
              label: 'BoolData',
              value: 4,
              key: 4,
            },
            {
              label: 'ByteData',
              value: 5,
              key: 5,
            },
            {
              label: 'StringData',
              value: 6,
              key: 6,
            },
            {
              label: 'TimeStampSData',
              value: 7,
              key: 7,
            },
            {
              label: 'TimeStampMsData',
              value: 8,
              key: 8,
            },
            // {
            //   label: 'InnerData',
            //   value: 9,
            //   key: 9,
            // },
            // {
            //   label: 'RangeData',
            //   value: 10,
            //   key: 10,
            // },
            // {
            //   label: 'NullData',
            //   value: 11,
            //   key: 11,
            // },
          ],
        },
      },
      {
        field: 'typeSub',
        component: 'Input',
        label: '次级类型',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'isIdField',
        component: 'Select',
        label: '唯一标识字段',
        colProps: {
          span: 8,
        },
        componentProps: {
          options: [
            {
              label: '是',
              value: true as any,
              key: true as any,
            },
            {
              label: '否',
              value: false as any,
              key: false as any,
            },
          ],
        },
      },
    ];
  };

  const [register] = useForm({
    ...baseFormConfig,
    schemas: getSchamas(),
    // baseColProps: {
    //   pull: 2,
    // },
    actionColOptions: {
      span: 24,
    },
  });

  const columns = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
      width: 200,
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
    {
      title: '名称',
      dataIndex: 'dataName',
      key: 'dataName',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 120,
    },
    {
      title: '数据类型',
      dataIndex: 'dataTypeBase',
      key: 'dataTypeBase',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 80,
    },
    {
      title: '次级类型',
      dataIndex: 'typeSub',
      key: 'typeSub',
      width: 90,
    },
    {
      title: '父级定义UUID',
      dataIndex: 'fatherUUID',
      key: 'fatherUUID',
      width: 180,
      customRender: ({ value, text, record }) => {
        if (!record?.fatherUUID) {
          return <span>-</span>;
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
          uuid: record?.fatherUUID,
          record: record,
        });
      },
    },
    {
      title: '子级定义UUID列表',
      dataIndex: 'childUUID',
      key: 'childUUID',
      width: 110,
      customRender: ({ text, record }) => {
        if (text && text.length > 0) {
          let dom: any = [];
          text.map((item, index) => {
            if (index === text.length - 1) {
              dom.push(
                <>
                  {/* <span>{item}</span> */}
                  <UUIDDiv
                    uuidType={UUIDTypeEnum.DataDefMemSync}
                    uuid={item}
                    record={record}
                  ></UUIDDiv>
                </>,
              );
            } else {
              dom.push(
                <>
                  <UUIDDiv
                    style={{ margin: '4px 0' }}
                    uuidType={UUIDTypeEnum.DataDefMemSync}
                    uuid={item}
                    record={record}
                  ></UUIDDiv>
                  <br />
                </>,
              );
            }
          });
          return <>{dom.map((item, index) => item)}</>;
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      title: '被引用次数',
      width: 80,
      dataIndex: 'bindCounter',
      key: 'bindCounter',
    },
    {
      title: '唯一标识字段',
      dataIndex: 'isIdField',
      key: 'isIdField',
      width: 90,
      customRender: ({ text, record }) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
  ];

  const submitQuery = (values: any) => {
    tableLoading.value = true;
    GetDataDefineNoFatherList(values)
      .then((res) => {
        tableData.value = res.items;
        total.value = res.total;
        expandedRowKeys.value = [];
        tableLoading.value = false;
      })
      .catch((err) => {
        // console.log('err: ', err);
        tableData.value = [];
        total.value = 0;
        expandedRowKeys.value = [];
        tableLoading.value = false;
      });
  };

  const handleToggleAdvancedChange = (a) => {
    nextTick(() => {
      initTableHeightAndWidth();
    });
  };

  const areExpand = (expanded, record) => {
    if (expanded) {
      tableLoading.value = true;
      GetDataDefineChildList({
        UUID: record.uuid,
        record,
      })
        .then((data: any) => {
          areFindTableDataKey(record, tableData.value, data.items);
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

  const initTableHeightAndWidth = () => {
    let customDiv = document.querySelector('.customDiv');
    tableHeight.value = window.innerHeight - (customDiv?.scrollHeight || 0) - 260;
    tableWidth.value = customDiv?.scrollWidth || 1660;
    // console.log('tableHeight: ', tableHeight.value);
    // console.log('tableWidth: ', tableWidth.value);
  };

  onActivated(() => {
    // console.log('onActivated');
    nextTick(() => {
      initTableHeightAndWidth();
    });
  });

  onMounted(() => {
    // console.log('onMounted');
    submitQuery({});
    nextTick(() => {
      initTableHeightAndWidth();
      window.addEventListener('resize', initTableHeightAndWidth);
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', initTableHeightAndWidth);
  });
</script>
<style lang="less" scoped>
  .customDiv {
    width: calc(100% - 32px);
  }

  .tableHeader {
    margin: 16px;
  }

  .ant-table-striped :deep(.ant-table-row-level-0.table-striped) td {
    background-color: #fafafa !important;

    &.ant-table-cell-row-hover {
      background-color: #fafafa !important;
    }
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

    // #region 循环每层table的背景色
    @color-arr: #fafad2, #ffe1ff, #ccffff, #ccccff, #ffccff, #ffcccc, #ff99ff, #ff99cc, #ff66ff,
      #ff33ff, #ff33cc, #ff00ff, #cc00ff, #9900ff, #6600ff, #3300ff, #0000ff;
    each(@color-arr, {
        @num:extract(@color-arr, @index);
        :deep(.ant-table-row-level-@{index}) {
          background-color: @num;
        }
       })
      // #endregion

    :deep(.ant-table-body) {
      // min-width: var(--table-width, 1660px); /* 提供一个默认值以防变量未设置 */
      height: var(--table-height, 300px); /* 提供一个默认值以防变量未设置 */
    }
  }
</style>
