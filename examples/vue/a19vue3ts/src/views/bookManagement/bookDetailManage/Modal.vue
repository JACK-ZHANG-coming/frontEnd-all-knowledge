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
      modalTitle.value = '编辑图书';
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
      modalTitle.value = '新增图书';
      reset();
    }
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'bookName',
      component: 'Input',
      label: '图书名称',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'bookStatus',
      component: 'Input',
      label: '在馆状态',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
    },
    {
      field: 'bookType',
      component: 'Select',
      label: '图书类型',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: [
          {
            label: '图书',
            value: '图书',
            key: '图书',
          },
        ],
      },
    },
    {
      field: 'bookLocation',
      component: 'Input',
      label: '图书位置',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'bookAuthor',
      component: 'Input',
      label: '作者',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'bookPrice馆藏数量',
      component: 'Input',
      label: '馆藏数量',
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
          password: res?.password ?? '123', // 不填密码默认123
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
