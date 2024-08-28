<!-- 内部数据源总览 -->
<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" style="margin-left: 2px" @click="addModal">
          <template #icon><PlusOutlined /></template>新增静态数据</a-button
        >
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'idFieldUUID'">
          {{ flitterUUID(text) }}
        </template>
        <template v-if="column.key === 'isStatic'">
          <Switch :checked="record.isStatic" />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleDetail.bind(null, record),
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否删除？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <EditModal @register="registerEditModal" @refresh-table="refreshTable" />
    <AddModal @register="registerAddModal" @refresh-table="refreshTable" />

    <DetailDrawer @register="registerDetailDrawer" @refresh-table="refreshTable" />
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
    // ActionItem,
  } from '@/components/Table';
  import { FormSchema } from '@/components/Form';
  import {
    GetInnerSourceList,
    DeleteOneInnerSource,
  } from '@/api/dataSourceManagement/innerDataSource';
  // import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Button, Switch, Modal } from 'ant-design-vue';
  import { PlusOutlined, EditTwoTone } from '@ant-design/icons-vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import EditModal from './components/EditModal.vue';
  import AddModal from './components/AddModal.vue';
  import DetailDrawer from './components/DetailDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { flitterUUID } from '@/utils/simpleTools';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  const { createMessage } = useMessage();
  const [registerEditModal, { openModal: editModal }] = useModal();
  const [registerAddModal, { openModal: addModal }] = useModal();
  // const [registerBindModal, { openModal: bindModal }] = useModal();
  const [registerDetailDrawer, { openDrawer: detailDrawer }] = useDrawer();

  const refreshTable = () => {
    reload();
  };

  //编辑
  const handleEdit = (record: EditRecordRow) => {
    editModal(true, { record: record });
  };

  //删除
  const handleDelete = (record: EditRecordRow) => {
    const params = {};
    const urlParams = `?uuid=${record.uuid}`;
    DeleteOneInnerSource(params, urlParams).then(() => {
      createMessage.success('删除成功！');
      reload();
    });
  };
  //详情
  const handleDetail = (record: EditRecordRow) => {
    detailDrawer(true, { record: record });
  };

  //Form字段配置
  const getSchamas = (): FormSchema[] | any => {
    return [
      {
        field: 'Name',
        component: 'Input',
        label: '数据源名称',
      },
      {
        field: 'Description',
        component: 'Input',
        label: '数据源描述',
      },
      {
        field: 'IsStatic',
        component: 'Select',
        label: '是否静态',
        componentProps: {
          options: [
            {
              label: '静态',
              value: true,
              key: 0,
            },
            {
              label: '非静态',
              value: false,
              key: 1,
            },
          ],
        },
      },
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
          uuidType: UUIDTypeEnum.InnerSourceMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
    },
    {
      title: '数据源名称',
      dataIndex: 'name',
    },
    {
      title: '数据源描述',
      dataIndex: 'description',
    },
    {
      title: '数据类型',
      dataIndex: 'innerDefValType',
      key: 'innerDefValType',

      customRender: ({ text, record }) => {
        if (record.innerDefValType == 'IntData') {
          return '整型数据';
        } else if (record.innerDefValType == 'FloatData') {
          return '浮点型数据';
        } else if (record.innerDefValType == 'BoolData') {
          return '布尔型数据';
        } else if (record.innerDefValType == 'StringData') {
          return '字符串型数据';
        } else if (record.innerDefValType == 'RangeData') {
          return '范围型数据';
        } else if (record.innerDefValType == 'MapData') {
          return '映射表数据';
        } else if (record.innerDefValType == 'NullData') {
          return '空数据';
        } else {
          return text;
        }
      },
    },
    {
      title: '绑定数据定义根节点',
      dataIndex: 'dataDefUUID',
      customRender: ({ value, text, record }) => {
        if (!record?.dataDefUUID) {
          return h('span', '');
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.InnerDataDefMemSync,
          uuid: record?.dataDefUUID,
          record: record,
        });
      },
    },
    {
      title: '唯一识别字段',
      dataIndex: 'idFieldUUID',
      customRender: ({ value, text, record }) => {
        if (!record?.idFieldUUID) {
          return h('span', '');
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.InnerDataDefMemSync,
          uuid: record?.idFieldUUID,
          record: record,
        });
      },
    },
    {
      title: '唯一识别字段值',
      dataIndex: 'idFieldValue',
    },
    {
      title: '是否静态',
      dataIndex: 'isStatic',
      width: 100,
    },
  ];
  const [registerTable, { reload }] = useTable({
    api: GetInnerSourceList,
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
      width: 150,

      title: '操作',
      dataIndex: 'action',
    },
  });
</script>
<style lang="less" scoped></style>
