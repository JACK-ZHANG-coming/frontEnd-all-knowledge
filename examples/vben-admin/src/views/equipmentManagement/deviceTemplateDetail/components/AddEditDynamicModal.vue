<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    @ok="validateForm"
    @cancel="reset"
    width="25%"
    :maskClosable="false"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, watch, inject } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import {
    DeviceAddDynamicAttribute,
    DeviceModifyDynamicAttributeLink,
  } from '@/api/equipmentManagement/deviceTemplateDetail';

  import { useMessage } from '@/hooks/web/useMessage';
  import { compareObjects } from '@/utils/simpleTools';

  const $emit = defineEmits(['refreshTable', 'register']);

  const { createMessage } = useMessage();

  const modalTitle = ref('');
  const isEdit = ref(false);
  const propsData = ref<any>({});
  const reload: any = inject('reload');

  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    isEdit.value = data.isEdit;
    if (data.isEdit) {
      modalTitle.value = '编辑';
      setFieldsValue({
        attributeName: data?.record?.attributeName,
        attributeValue: data?.record?.attributeValue,
      });
    } else {
      modalTitle.value = '新增';
      reset();
    }
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'attributeName',
      component: 'Input',
      label: '数据名称',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'attributeValue',
      component: 'Input',
      label: '数据值',
      colProps: {
        span: 24,
      },
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 120,
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
        uuid: propsData.value?.uuid,
        attributeName: res?.attributeName ?? '',
        attributeValue: res?.attributeValue ?? '',
      };

      if (isEdit.value) {
        // 编辑

        DeviceModifyDynamicAttributeLink(params)
          .then((res) => {
            reload();
            createMessage.success('修改成功！');
            $emit('refreshTable');

            changeOkLoading(false);
            closeModal();
          })
          .catch((err) => {
            changeOkLoading(false);
          });
      } else {
        //新增

        DeviceAddDynamicAttribute(params)
          .then((res) => {
            reload();
            createMessage.success('添加成功！');
            $emit('refreshTable');

            changeOkLoading(false);
            closeModal();
          })
          .catch((err) => {
            changeOkLoading(false);
          });
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
