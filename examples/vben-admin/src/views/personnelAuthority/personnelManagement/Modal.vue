<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    @ok="validateForm"
    @cancel="reset"
    width="50%"
    :maskClosable="false"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { createOnePerson, updatePerson } from '@/api/personnelAuthority/personnelManagement';
  import { RoleEnum } from '@/enums/roleEnum';
  import { useMessage } from '@/hooks/web/useMessage';
  import { compareObjects } from '@/utils/simpleTools';

  const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();

  const modalTitle = ref('');
  const isEdit = ref(false);
  const propsData = ref<any>({});

  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    isEdit.value = data.isEdit;
    if (data.isEdit) {
      modalTitle.value = '编辑人员';
      setFieldsValue({
        account: data?.record?.account,
        isMale: data?.record?.isMale,
        userName: data?.record?.userName,
        roleId: data?.record?.roleId,
        roleName: data?.record?.roleName,
        jobNumber: data?.record?.jobNumber,
        phone: data?.record?.phone,
        email: data?.record?.email,
        company: data?.record?.company,
        department: data?.record?.department,
      });
    } else {
      modalTitle.value = '新增人员';
      reset();
    }
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'account',
      component: 'Input',
      label: '账号',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'isMale',
      component: 'Select',
      label: '性别',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: [
          {
            label: '男',
            value: true as any,
            key: true,
          },
          {
            label: '女',
            value: false as any,
            key: false,
          },
        ],
      },
      defaultValue: true,
    },
    {
      field: 'userName',
      component: 'Input',
      label: '用户名称',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
    },
    {
      field: 'roleId',
      component: 'Select',
      label: '人员权限',
      colProps: {
        span: 12,
      },
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
      defaultValue: RoleEnum.ADMIN,
    },
    {
      field: 'roleName',
      component: 'Input',
      label: '人员角色',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'jobNumber',
      component: 'Input',
      label: '工号',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'phone',
      component: 'Input',
      label: '电话',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'email',
      component: 'Input',
      label: '电子邮箱',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'company',
      component: 'Input',
      label: '公司名称',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'department',
      component: 'Input',
      label: '部门名称',
      colProps: {
        span: 12,
      },
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [register, { closeModal, changeOkLoading }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  //保存校验
  const validateForm = async () => {
    try {
      const res = await validateFields();
      changeOkLoading(true);
      if (isEdit.value) {
        // 编辑
        const params = {
          options: compareObjects(res, propsData.value.record),
          uuid: propsData.value?.record?.uuid ?? '',
          userName: res?.userName ?? '',
          isMale: res?.isMale ?? '',
          password: res?.password ?? '',
          roleId: res?.roleId ?? '',
          roleName: res?.roleName ?? '',
          jobNumber: res?.jobNumber ?? '',
          phone: res?.phone ?? '',
          email: res?.email ?? '',
          introduction: res?.introduction ?? '',
          company: res?.company ?? '',
          department: res?.department ?? '',
        };
        await updatePerson(params);
        createMessage.success('修改成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      } else {
        // 新增
        const params = {
          account: res?.account ?? '',
          userName: res?.userName ?? '',
          isMale: res?.isMale ?? '',
          password: res?.password ?? res?.account,
          roleId: res?.roleId ?? '',
          roleName: res?.roleName ?? '',
          jobNumber: res?.jobNumber ?? '',
          phone: res?.phone ?? '',
          email: res?.email ?? '',
          introduction: res?.introduction ?? '',
          company: res?.company ?? '',
          department: res?.department ?? '',
        };
        await createOnePerson(params);
        createMessage.success('新增成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      }
    } catch (error) {
      // console.log('not passing', error);
      changeOkLoading(false);
    }
  };
  //取消重置
  async function reset() {
    clearValidate();
    resetFields();
  }
</script>
