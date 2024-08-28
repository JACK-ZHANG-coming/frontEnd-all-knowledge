<template>
  <BasicModal
    v-bind="$attrs"
    :maskClosable="false"
    @register="register"
    @ok="validateForm"
    @cancel="reset"
    width="30%"
  >
    <template #title>
      {{ modalTitle }}
      <div style="display: inline-block"><AppSearch /></div>
    </template>
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BindDataDefine } from '@/api/dataSourceManagement/externalDataSource';
  import { useMessage } from '@/hooks/web/useMessage';
  import { AppSearch } from '@/components/Application/index';

  const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();
  const modalTitle = ref('');
  const propsData = ref<any>({});
  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    modalTitle.value = '绑定数据源';
    setFieldsValue({
      dataDefUUID: data?.record?.dataDefUUID,
    });
  };
  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'dataDefUUID',
      component: 'Input',
      label: '绑定数据定义根节点',
      colProps: {
        span: 24,
      },
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 180,
    layout: 'vertical',
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
      const params = {
        dataSourceUUID: propsData.value?.record?.uuid ?? '',
        dataDefineUUID: res?.dataDefUUID ?? '',
      };
      // console.log(propsData.value.record, 'ccc');
      await BindDataDefine(params);
      changeOkLoading(false);
      closeModal();
      setTimeout(() => {
        $emit('refreshTable');
        createMessage.success('绑定数据成功！');
      }, 1000);
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
