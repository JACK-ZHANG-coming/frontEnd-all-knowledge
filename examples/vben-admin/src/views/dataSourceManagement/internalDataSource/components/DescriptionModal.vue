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
  import { ModifyOneInnerDef } from '@/api/dataSourceManagement/innerDataSource';
  import { useMessage } from '@/hooks/web/useMessage';
  import { compareObjects } from '@/utils/simpleTools';

  const $emit = defineEmits(['refresh', 'register']);
  const { createMessage } = useMessage();
  const modalTitle = ref('');
  const propsData = ref<any>({});
  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    modalTitle.value = '编辑描述';
    setFieldsValue({
      description: data?.record?.description,
    });
  };
  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'description',
      component: 'InputTextArea',
      label: '',
      colProps: {
        span: 24,
      },
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 0,
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
      // changeOkLoading(true);
      delete res.name;
      const params = {
        options: compareObjects(res, propsData.value.record),
        uuid: propsData.value?.record?.uuid ?? '',
        name: res?.name ?? '',
        description: res?.description ?? '',
      };
      console.log(params, 'params');
      await ModifyOneInnerDef(params);
      createMessage.success('修改描述成功！');
      changeOkLoading(false);
      $emit('refresh');
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
