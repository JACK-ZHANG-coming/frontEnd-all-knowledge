<!-- 外部数据源总览 -->

<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          @click="addOrEditModal(true, { isEdit: false, record: {} })"
          style="margin-left: 2px"
        >
          <template #icon><PlusOutlined /></template>新增数据源</a-button
        >
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'idFieldUUID'">
          {{ flitterUUID(text) }}
        </template>
        <template v-if="column.key === 'idFieldValue'">
          {{ text }}
          <Button type="link" @click="editIdField(record)"
            ><template #icon> <EditTwoTone /> </template
          ></Button>
        </template>
        <template v-if="column.key === 'enable'">
          <Switch :checked="record.enable" @click="(checked) => switchChange(checked, record)" />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleDetail.bind(null, record),
              },
              {
                label: '绑定数据定义',
                icon: 'ant-design:link-outlined',
                onClick: handleBind.bind(null, record),
                ifShow: () => {
                  return record.dataDefUUID === ''; //dataDefUUID无值显示
                },
              },
              {
                label: '解绑数据定义',
                icon: 'ant-design:disconnect-outlined',

                // onClick: handleUnBind.bind(null, record),
                popConfirm: {
                  title: '是否解除绑定？',
                  confirm: handleUnBind.bind(null, record),
                },
                ifShow: () => {
                  return record.dataDefUUID !== ''; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
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
    <AddEditModal @register="registerAddEditModal" @refresh-table="refreshTable" />
    <EditIdFieldModal @register="registerIdFieldModal" @refresh-table="refreshTable" />
    <BindModal @register="registerBindModal" @refresh-table="refreshTable" />
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
    GetDataSourceList,
    DeleteOneDataSource,
    DataSourceEnable,
    UnbindDataDefine,
  } from '@/api/dataSourceManagement/externalDataSource';
  // import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Button, Switch, Modal } from 'ant-design-vue';
  import { PlusOutlined, EditTwoTone } from '@ant-design/icons-vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import AddEditModal from './components/AddEditModal.vue';
  import EditIdFieldModal from './components/EditIdFieldModal.vue';
  import BindModal from './components/BindModal.vue';
  import DetailDrawer from './components/DetailDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { flitterUUID } from '@/utils/simpleTools';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  const { createMessage } = useMessage();
  const [registerAddEditModal, { openModal: addOrEditModal }] = useModal();
  const [registerIdFieldModal, { openModal: idFieldModal }] = useModal();
  const [registerBindModal, { openModal: bindModal }] = useModal();
  const [registerDetailDrawer, { openDrawer: detailDrawer }] = useDrawer();

  const refreshTable = () => {
    reload();
  };

  //单独编辑数据定义绑定的值
  const editIdField = (record: EditRecordRow) => {
    idFieldModal(true, { record: record });
  };
  //绑定
  const handleBind = (record: EditRecordRow) => {
    bindModal(true, { record: record });
  };
  //解除绑定（直接调接口）
  const handleUnBind = (record: EditRecordRow) => {
    const params = {
      dataSourceUUID: record?.uuid ?? '',
      dataDefineUUID: record?.dataDefUUID ?? '',
    };
    UnbindDataDefine(params)
      .then((res) => {
        // console.log(res, 'res');
        setTimeout(() => {
          refreshTable();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //编辑
  const handleEdit = (record: EditRecordRow) => {
    addOrEditModal(true, { isEdit: true, record: record });
  };
  //详情
  const handleDetail = (record: EditRecordRow) => {
    if (record.dataDefUUID !== '') {
      detailDrawer(true, { record: record });
    } else {
      createMessage.warning('请先绑定数据定义！');
    }
  };
  //删除
  const handleDelete = (record: EditRecordRow) => {
    // console.log('删除：', record);
    const params = {};
    const urlParams = `?uuid=${record.uuid}`;
    DeleteOneDataSource(params, urlParams).then(() => {
      createMessage.success('删除成功！');
      reload();
    });
  };
  //修改激活状态
  const switchChange = (checked, record) => {
    console.log('Switch changed to:', checked, 'for row:', record);
    const params = {
      uuid: record.uuid,
      state: checked,
    };
    DataSourceEnable(params)
      .then((res) => {
        // console.log(res, 'res');
        refreshTable();
      })
      .catch((err) => {
        console.log(err);
      });
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
        field: 'Enable',
        component: 'Select',
        label: '是否激活',
        componentProps: {
          options: [
            {
              label: '激活',
              value: true,
              key: 0,
            },
            {
              label: '未激活',
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
          uuidType: UUIDTypeEnum.DataSourceMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
      // defaultHidden: true,
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
      title: '绑定数据定义根节点',
      dataIndex: 'dataDefUUID',
      customRender: ({ value, text, record }) => {
        if (!record?.dataDefUUID) {
          return h('span', '');
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DataDefMemSync,
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
          uuidType: UUIDTypeEnum.DataDefMemSync,
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
      title: '是否激活',
      dataIndex: 'enable',
      width: 100,
    },
  ];
  const [registerTable, { reload }] = useTable({
    api: GetDataSourceList,
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
      width: 300,
      title: '操作',
      dataIndex: 'action',
    },
  });
</script>
<style lang="less" scoped></style>
