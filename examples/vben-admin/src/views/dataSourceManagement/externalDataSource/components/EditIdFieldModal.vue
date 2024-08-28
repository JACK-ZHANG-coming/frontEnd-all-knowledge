<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    @ok="validateForm"
    @cancel="reset"
    :maskClosable="false"
    width="25%"
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
  import { DataSourceModifyIdFieldValue } from '@/api/dataSourceManagement/externalDataSource';
  import { useMessage } from '@/hooks/web/useMessage';

  const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();
  const modalTitle = ref('');
  const propsData = ref<any>({});
  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    modalTitle.value = '编辑唯一识别字段值';
    setFieldsValue({
      idFieldValue: data?.record?.idFieldValue,
    });
  };
  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'idFieldValue',
      component: 'Input',
      label: '唯一识别字段值',
      colProps: {
        span: 24,
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
      const params = {
        uuid: propsData.value?.record?.uuid ?? '',
        idFieldValue: res?.idFieldValue ?? '',
      };
      await DataSourceModifyIdFieldValue(params);
      createMessage.success('修改唯一识别字段值成功！');
      changeOkLoading(false);
      $emit('refreshTable');
      closeModal();
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
