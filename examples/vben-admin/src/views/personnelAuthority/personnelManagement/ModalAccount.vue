<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    @ok="validateForm"
    @cancel="reset"
    width="40%"
    :minHeight="80"
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
  import {
    createOnePerson,
    updatePerson,
    updatePersonAccount,
  } from '@/api/personnelAuthority/personnelManagement';
  import { RoleEnum } from '@/enums/roleEnum';
  import { useMessage } from '@/hooks/web/useMessage';

  const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();

  const modalTitle = ref('账号继承');
  const isEdit = ref(false);
  const propsData = ref<any>({});

  const onDataReceive = (data) => {
    console.log('接收到的data:', data);
    propsData.value = data;
    isEdit.value = data.isEdit;
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'account',
      component: 'Input',
      label: '继承账号',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
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
      // console.log('res:', res);
      changeOkLoading(true);
      const params = {
        OldAccount: propsData.value?.record?.account,
        NewAccount: res?.account ?? '',
      };
      await updatePersonAccount(params);
      createMessage.success('账号继承成功！');
      changeOkLoading(false);
      $emit('refreshTable');
      closeModal();
    } catch (error) {
      changeOkLoading(false);
    }
  };
  //取消重置
  async function reset() {
    clearValidate();
    resetFields();
  }
</script>
