<!-- 图书管理 -->
<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          @click="addOrEditPersonModal(true, { isEdit: false, record: {} })"
          style="margin-left: 2px"
        >
          <template #icon><PlusOutlined /></template>
          新增图书
        </a-button>
        <span class="ml-2"></span>
        <!-- <BasicUpload
          :maxSize="20"
          :maxNumber="10"
          @change="handleChange"
          :api="uploadApi"
          class="my-5"
        /> -->
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
    queryBookList,
    deletePerson,
    updatePerson,
  } from '@/api/personnelAuthority/personnelManagement';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { RoleEnum } from '@/enums/roleEnum';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicUpload } from '@/components/Upload';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();
  const [registerModal, { openModal: addOrEditPersonModal }] = useModal();
  const refreshTable = () => {
    reload();
  };
  //Form字段配置
  const getSchamas = (): FormSchema[] | any => {
    return [
      {
        field: 'bookName',
        component: 'Input',
        label: '图书名称',
      },
      {
        field: 'bookAuthor',
        component: 'Input',
        label: '作者',
      },
    ];
  };

  //表格配置
  const columns: BasicColumn[] = [
    {
      title: '图书名称',
      dataIndex: 'bookName',
    },
    {
      title: '在馆状态',
      dataIndex: 'bookStatus',
    },
    {
      title: '图书类型',
      dataIndex: 'bookType',
    },
    {
      title: '图书位置',
      dataIndex: 'bookLocation',
    },
    {
      title: '作者',
      dataIndex: 'bookAuthor',
    },
    {
      title: '馆藏数量',
      dataIndex: 'bookPrice',
    },
  ];

  const handleEdit = (record: EditRecordRow) => {
    // console.log('编辑:', record);
    addOrEditPersonModal(true, { isEdit: true, record: record });
  };

  const handleDelete = (record: EditRecordRow) => {
    // console.log('删除：', record);
    const params = {};
    const urlParams = `?UUID=${record.uuid}`;
    deletePerson(params, urlParams).then(() => {
      createMessage.success('删除成功！');
      reload();
    });
  };

  const [registerTable, { reload }] = useTable({
    api: queryBookList,
    columns: columns,
    formConfig: {
      labelWidth: 90,
      schemas: getSchamas(),
      labelAlign: 'left',
      actionColOptions: { span: 24 },
      rowProps: {
        gutter: [40, 5],
      },
    },
    // bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    tableSetting: { fullScreen: true },
    rowKey: 'uuid',
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
  });

  //#region 文件上传
  const handleChange = (list: string[]) => {
    if (list.length <= 0) {
      return;
    }
    createMessage.info(`已上传文件${JSON.stringify(list)}`);
  };
  //#endregion
</script>
<style lang="less" scoped></style>
