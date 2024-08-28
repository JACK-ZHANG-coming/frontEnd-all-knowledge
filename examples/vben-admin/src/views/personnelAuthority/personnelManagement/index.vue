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
          <template #icon><PlusOutlined /></template>新增人员</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <TableImg
            :size="30"
            :simpleShow="true"
            :imgList="[`${getIp(0)}/api/Person/GetAvatarByUUID?UUID=${record.uuid}`]"
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
            :dropDownActions="[
              {
                label: '账号继承',
                onClick: accountInheritance.bind(null, record),
              },
              {
                label: '重置密码',
                popConfirm: {
                  title: '是否重置密码',
                  confirm: resetPassword.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <Modal @register="registerModal" @refresh-table="refreshTable" />
    <ModalAccount @register="registerModalAccount" @refresh-table="refreshTable" />
  </BaseContainer>
</template>
<script lang="ts" setup>
  // import { h, ref, computed, unref, toRaw, inject, watch, useAttrs, useSlots } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    TableImg,
    TableAction,
    EditRecordRow,
    // ActionItem,
  } from '@/components/Table';
  import Modal from './Modal.vue';
  import ModalAccount from './ModalAccount.vue';
  import { useModal } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import {
    queryPersonList,
    deletePerson,
    updatePerson,
  } from '@/api/personnelAuthority/personnelManagement';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { RoleEnum } from '@/enums/roleEnum';
  import { getIp } from '@/utils/simpleTools';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const [registerModal, { openModal: addOrEditPersonModal }] = useModal();
  const [registerModalAccount, { openModal: openAccountModal }] = useModal();
  const refreshTable = () => {
    reload();
  };
  //Form字段配置
  const getSchamas = (): FormSchema[] | any => {
    return [
      // {
      //   field: 'uuid',
      //   component: 'Input',
      //   label: '人员唯一编码',
      // },
      {
        field: 'account',
        component: 'Input',
        label: '账号',
      },
      {
        field: 'isMale',
        component: 'Select',
        label: '性别',
        componentProps: {
          options: [
            {
              label: '男',
              value: true as any,
              key: true as any,
            },
            {
              label: '女',
              value: false as any,
              key: false as any,
            },
          ],
        },
      },
      {
        field: 'userName',
        component: 'Input',
        label: '用户名称',
      },
      {
        field: 'roleId',
        component: 'Select',
        label: '人员权限',
        componentProps: {
          options: [
            {
              label: '超级管理员',
              value: RoleEnum.SUPER_ADMIN,
              key: RoleEnum.SUPER_ADMIN,
            },
            {
              label: '普通管理员',
              value: RoleEnum.ADMINISTRATOR_ADMIN,
              key: RoleEnum.ADMINISTRATOR_ADMIN,
            },
            {
              label: '普通用户',
              value: RoleEnum.ADMIN,
              key: RoleEnum.ADMIN,
            },
          ],
        },
      },
      {
        field: 'jobNumber',
        component: 'Input',
        label: '工号',
      },
      {
        field: 'phone',
        component: 'Input',
        label: '电话',
      },
      {
        field: 'email',
        component: 'Input',
        label: '电子邮箱',
      },
      {
        field: 'company',
        component: 'Input',
        label: '公司名称',
      },
      {
        field: 'department',
        component: 'Input',
        label: '部门名称',
      },
      {
        field: 'createTime',
        component: 'RangePicker',
        label: '注册时间',
      },
    ];
  };

  //表格配置
  const columns: BasicColumn[] = [
    // {
    //   title: '人员唯一编码',
    //   width: 300,
    //   dataIndex: 'uuid',
    // },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '性别',
      dataIndex: 'isMale',
      format: (text: any): any => {
        if (text === true) {
          return '男';
        } else if (text === false) {
          return '女';
        }
      },
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '人员权限',
      dataIndex: 'roleId',
      format: (roleId: any): any => {
        switch (roleId) {
          case RoleEnum.SUPER_ADMIN:
            return '超级管理员';
          case RoleEnum.ADMINISTRATOR_ADMIN:
            return '普通管理员';
          case RoleEnum.ADMIN:
            return '普通用户';
          default:
            return '未知';
        }
      },
    },
    {
      title: '人员角色',
      dataIndex: 'roleName',
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
    },
    {
      title: '公司名称',
      dataIndex: 'company',
    },
    {
      title: '部门名称',
      dataIndex: 'department',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
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
    api: queryPersonList,
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
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const resetPassword = async (record: any) => {
    const params = {
      options: ['password'],
      uuid: record?.uuid ?? '',
      // account: record.account,
      userName: record?.userName ?? '',
      isMale: record?.isMale ?? '',
      password: record?.account ?? '', // 重置密码时，账号和密码一致
      roleId: record?.roleId ?? '',
      roleName: record?.roleName ?? '',
      jobNumber: record?.jobNumber ?? '',
      phone: record?.phone ?? '',
      email: record?.email ?? '',
      introduction: record?.introduction ?? '',
      company: record?.company ?? '',
      department: record?.department ?? '',
    };
    await updatePerson(params);
    createMessage.success('密码重置成功，密码与当前账号一致！');
    refreshTable();
  };

  const accountInheritance = (record: any) => {
    openAccountModal(true, { isEdit: true, record: record });
  };
</script>
<style lang="less" scoped></style>
