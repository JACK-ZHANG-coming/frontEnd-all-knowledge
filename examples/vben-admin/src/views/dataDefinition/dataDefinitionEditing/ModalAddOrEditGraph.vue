<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    @ok="validateForm"
    @cancel="reset"
    width="40%"
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
  import { CreateOneCanvas, UpdateOneCanvas } from '@/api/dataDefinition/dataDefinitionEditing';
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
      modalTitle.value = '编辑画布';
      setFieldsValue({
        canvasContent: data?.record?.canvasContent,
        canvasDescription: data?.record?.canvasDescription,
        canvasName: data?.record?.canvasName,
        createPerson: data?.record?.createPerson,
        createTime: data?.record?.createTime,
        updateTime: data?.record?.updateTime,
        uuid: data?.record?.uuid,
      });
    } else {
      modalTitle.value = '新增画布';
      reset();
    }
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'canvasName',
      component: 'Input',
      label: '画布名称',
      colProps: {
        span: 20,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
      // dynamicDisabled: computed(() => !isEdit.value) as any,
    },
    {
      field: 'canvasDescription',
      component: 'InputTextArea',
      label: '描述',
      colProps: {
        span: 20,
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
          canvasName: res?.canvasName ?? '',
          canvasDescription: res?.canvasDescription ?? '',
          uuid: propsData.value.record?.uuid ?? '',
          canvasContent: propsData.value.record?.canvasDescription ?? '',
        };
        await UpdateOneCanvas(params);
        createMessage.success('修改成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      } else {
        // 新增
        const params = {
          canvasName: res?.canvasName ?? '',
          canvasDescription: res?.canvasDescription ?? '',
        };
        await CreateOneCanvas(params);
        createMessage.success('新增成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      }
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
