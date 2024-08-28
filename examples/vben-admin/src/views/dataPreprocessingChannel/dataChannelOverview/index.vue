<!-- 数据通道总览 -->
<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          @click="addOrEditPersonModal(true, { isEdit: false, record: {} })"
          style="margin-left: 2px"
        >
          <template #icon><PlusOutlined /></template>新增数据通道</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'enable'">
          <Switch :checked="record.enable" @click="(checked) => switchChange(checked, record)" />
        </template>
        <template v-if="column.key === 'ifStore'">
          <Switch
            :checked="record.ifStore === 1"
            @click="(checked) => switchChangeStore(checked, record)"
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Modal @register="registerModal" @refresh-table="refreshTable" />
  </BaseContainer>
</template>
<script lang="ts" setup>
  import { h, ref, computed, unref, toRaw, inject, watch, useAttrs, useSlots } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    TableAction,
    EditRecordRow,
  } from '@/components/Table';
  import Modal from './Modal.vue';
  import { useModal } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import {
    CreateOneDataChannel,
    EnableOneDataChannel,
    DisableOneDataChannel,
    DeleteOneDataChannel,
    ModifyOneDataChannel,
    GetDataChannelList,
    DelStoreStgy,
    AddStoreStgy,
  } from '@/api/dataPreprocessingChannel/dataChannelOverview';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Switch } from 'ant-design-vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { dataCalMethodDic } from '@/utils/commonDic';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  const { createMessage } = useMessage();
  const [registerModal, { openModal: addOrEditPersonModal }] = useModal();
  const refreshTable = () => {
    reload();
  };

  //Form字段配置
  const getSchamas = (): FormSchema[] | any => {
    return [
      {
        field: 'name',
        component: 'Input',
        label: '数据通道名称',
      },
      // {
      //   field: 'description',
      //   component: 'Input',
      //   label: '描述',
      // },
    ];
  };

  //表格配置
  const columns: BasicColumn[] = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      customRender: ({ value, text, record }) => {
        if (!record?.uuid) {
          return h('span', '');
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataChannelMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
    },
    {
      title: '数据通道名称',
      // width: 300,
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '激活状态',
      dataIndex: 'enable',
    },
    {
      title: '计算方法',
      dataIndex: 'method',
      format: (text: any): any => {
        return dataCalMethodDic[text];
      },
    },
    {
      title: '参数1数据源',
      dataIndex: 'inParam1_key',
      // format: (text: string, record: any): any => {
      //   return record?.inParam1?.key;
      // },
      customRender: ({ value, text, record }) => {
        if (!record?.inParam1?.key) {
          return h('span', '');
        }
        if (record?.inParam1Type === 'Outer') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.DataSourceMemSync,
            uuid: record?.inParam1?.key,
            record: record,
          });
        } else if (record?.inParam1Type === 'Inner') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.InnerSourceMemSync,
            uuid: record?.inParam1?.key,
            record: record,
          });
        } else {
          return h('span', record?.inParam1?.key);
        }
      },
    },
    {
      title: '参数1数据定义',
      dataIndex: 'inParam1_value',
      // format: (text: string, record: any): any => {
      //   return record?.inParam1?.value;
      // },
      customRender: ({ value, text, record }) => {
        if (!record?.inParam1?.value) {
          return h('span', '');
        }
        if (record?.inParam1Type === 'Outer') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.DataDefMemSync,
            uuid: record?.inParam1?.value,
            record: record,
          });
        } else if (record?.inParam1Type === 'Inner') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.InnerDataDefMemSync,
            uuid: record?.inParam1?.value,
            record: record,
          });
        } else {
          return h('span', record?.inParam1?.value);
        }
      },
    },
    {
      title: '参数2数据源',
      dataIndex: 'inParam2_key',
      // format: (text: string, record: any): any => {
      //   return record?.inParam2?.key;
      // },
      customRender: ({ value, text, record }) => {
        if (!record?.inParam2?.key) {
          return h('span', '');
        }
        if (record?.inParam2Type === 'Outer') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.DataSourceMemSync,
            uuid: record?.inParam2?.key,
            record: record,
          });
        } else if (record?.inParam2Type === 'Inner') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.InnerSourceMemSync,
            uuid: record?.inParam2?.key,
            record: record,
          });
        } else {
          return h('span', record?.inParam2?.key);
        }
      },
    },
    {
      title: '参数2数据定义',
      dataIndex: 'inParam2_value',
      // format: (text: string, record: any): any => {
      //   return record?.inParam2?.value;
      // },
      customRender: ({ value, text, record }) => {
        if (!record?.inParam2?.value) {
          return h('span', '');
        }
        if (record?.inParam2Type === 'Outer') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.DataDefMemSync,
            uuid: record?.inParam2?.value,
            record: record,
          });
        } else if (record?.inParam2Type === 'Inner') {
          return h(UUIDDiv, {
            uuidType: UUIDTypeEnum.InnerDataDefMemSync,
            uuid: record?.inParam2?.value,
            record: record,
          });
        } else {
          return h('span', record?.inParam2?.value);
        }
      },
    },
    {
      title: '计算结果数据源',
      dataIndex: 'outParam_key',
      // format: (text: string, record: any): any => {
      //   return record?.outParam?.key;
      // },
      customRender: ({ value, text, record }) => {
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.InnerSourceMemSync,
          uuid: record?.outParam?.key,
          record: record,
        });
      },
    },
    {
      title: '计算结果数据定义',
      dataIndex: 'outParam_value',
      // format: (text: string, record: any): any => {
      //   return record?.outParam?.value;
      // },
      customRender: ({ value, text, record }) => {
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.InnerDataDefMemSync,
          uuid: record?.outParam?.value,
          record: record,
        });
      },
    },
    {
      title: '是否存储计算结果',
      dataIndex: 'ifStore',
    },
    // {
    //   title: '结果数据类型',
    //   dataIndex: 'outDataType',
    // },
    // {
    //   title: '结果次级类型',
    //   dataIndex: 'outDataTypeSub',
    // },
    // {
    //   title: '结果单位',
    //   dataIndex: 'outDataUnitName',
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];

  const handleEdit = (record: EditRecordRow) => {
    // console.log('编辑:', record);
    addOrEditPersonModal(true, { isEdit: true, record: record });
  };

  const handleDelete = (record: EditRecordRow) => {
    // console.log('删除：', record);
    let urlParams = {
      uuid: record.uuid,
    };
    DeleteOneDataChannel({}, urlParams)
      .then(() => {
        createMessage.success('删除成功！');
        reload();
      })
      .catch(() => {});
  };

  //修改激活状态
  const switchChange = (checked, record) => {
    const urlParams = {
      DataChannelUUID: record.uuid,
    };
    if (checked) {
      // 激活
      EnableOneDataChannel({}, urlParams)
        .then((res) => {
          createMessage.success('激活成功！');
          refreshTable();
        })
        .catch((err) => {});
    } else {
      // 取消激活
      DisableOneDataChannel({}, urlParams)
        .then((res) => {
          createMessage.success('取消激活成功！');
          refreshTable();
        })
        .catch((err) => {});
    }
  };

  // 修改是否存储结果状态
  const switchChangeStore = (checked, record) => {
    // console.log('Switch changed to:', checked, 'for row:', record);
    const urlParams = {
      innSrcUUID: record.outParam?.key,
      innDefUUID: record.outParam?.value,
    };
    if (checked) {
      // 激活
      AddStoreStgy({}, urlParams)
        .then((res) => {
          createMessage.success('已启用存储计算结果！');
          refreshTable();
        })
        .catch((err) => {});
    } else {
      // 取消激活
      DelStoreStgy({}, urlParams)
        .then((res) => {
          createMessage.success('已取消存储计算结果！');
          refreshTable();
        })
        .catch((err) => {});
    }
  };

  const [registerTable, { reload }] = useTable({
    api: GetDataChannelList,
    columns: columns,
    formConfig: {
      labelWidth: 90,
      schemas: getSchamas(),
      labelAlign: 'left',
      actionColOptions: { span: 24 },
      rowProps: {
        gutter: [60, 10],
      },
    },
    // bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    tableSetting: { fullScreen: true },
    rowKey: 'uuid',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });
</script>
<style lang="less" scoped></style>
