<!-- 人员管理 -->
<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          @click="addOrEditPersonModal(true, { isEdit: false, record: {} })"
          style="margin-left: 2px"
        >
          <template #icon><PlusOutlined /></template>新增画布</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '编辑画布',
                onClick: handleEditCanvas.bind(null, record),
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

    <ModalAddOrEditGraph @register="registerModal" @refresh-table="refreshTable" />
  </BaseContainer>
</template>
<script lang="ts" setup>
  // import { h, ref, computed, unref, toRaw, inject, watch, useAttrs, useSlots } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    TableAction,
    EditRecordRow,
  } from '@/components/Table';
  import ModalAddOrEditGraph from './ModalAddOrEditGraph.vue';
  import { useModal } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { GetCanvasLis, DeleteOneCanvas } from '@/api/dataDefinition/dataDefinitionEditing';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { getIp } from '@/utils/simpleTools';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useGo } from '@/hooks/web/usePage';

  const { createMessage } = useMessage();
  const [registerModal, { openModal: addOrEditPersonModal }] = useModal();
  const refreshTable = () => {
    reload();
  };
  const go = useGo();
  //Form字段配置
  const getSchamas = (): FormSchema[] | any => {
    return [
      {
        field: 'uuid',
        component: 'Input',
        label: '画布唯一标识',
      },
      {
        field: 'canvasName',
        component: 'Input',
        label: '画布名称',
      },
    ];
  };

  //表格配置
  const columns: BasicColumn[] = [
    {
      title: '画布唯一标识',
      width: 300,
      dataIndex: 'uuid',
    },
    {
      title: '画布名称',
      dataIndex: 'canvasName',
    },
    {
      title: '描述',
      dataIndex: 'canvasDescription',
    },
    {
      title: '创建人',
      dataIndex: 'createPerson',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '上次更新时间',
      dataIndex: 'updateTime',
    },
  ];

  const handleEdit = (record: EditRecordRow) => {
    addOrEditPersonModal(true, { isEdit: true, record: record });
  };

  const handleEditCanvas = (record: EditRecordRow) => {
    if (import.meta.env.DEV) {
      go(`http://192.168.88.222:5173/#/dataDefinitionEditingConsole?uuid=${record.uuid}`);
    } else {
      go(`${getIp(0, true)}#/dataDefinitionEditingConsole?uuid=${record.uuid}`);
    }
  };

  const handleDelete = (record: EditRecordRow) => {
    const params = {};
    const urlParams = `?UUID=${record.uuid}`;
    DeleteOneCanvas(params, urlParams).then(() => {
      createMessage.success('删除成功！');
      reload();
    });
  };

  const [registerTable, { reload }] = useTable({
    api: GetCanvasLis,
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
      width: 200,
      title: '操作',
      dataIndex: 'action',
    },
  });
</script>
<style lang="less" scoped></style>
