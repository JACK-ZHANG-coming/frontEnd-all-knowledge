<script setup lang="ts" name="test">
import { ref } from 'vue'
import DynamicForm from '@/components/DynamicForm/DynamicForm.vue'
import type { DynamicFormType } from '@/components/DynamicForm/DynamicFormType'

const dynamicFormConfig = ref<DynamicFormType>({
  labelWidth: '120px',
  addButton: {
    text: '新增',
    top: '10px',
    zIndex: 20
  },
  staticItemsList: [
    {
      label: 'input',
      type: 'input',
      VModel: 'input',
      span: 4,
      itemType: 'textarea',
      minRows: 3,
      maxRows: 3,
      required: true,
      message: '请输入'
    },
    {
      label: 'select',
      type: 'select',
      VModel: 'select',
      multiple: true,
      span: 4,
      options: [
        {
          label: 'test_001',
          value: 'test_001'
        },
        {
          label: 'test_002',
          value: 'test_002'
        },
        {
          label: 'test_003',
          value: 'test_003'
        }
      ]
    },
    {
      label: 'datePicker',
      type: 'datePicker',
      VModel: 'datePicker',
      span: 4
    },
    {
      label: 'radio',
      type: 'radio',
      VModel: 'radio',
      span: 6,
      radios: [
        {
          label: 'test_001',
          value: 1,
          disabled: true
        },
        {
          label: 'test_002',
          value: 2
        },
        {
          label: 'test_003',
          value: 3
        }
      ]
    }
  ],
  dynamicItemsList: [
    {
      label: 'input',
      type: 'input',
      VModel: 'input',
      span: 4,
      required: true,
      message: '请输入'
    },
    {
      label: 'inputNumber',
      type: 'inputNumber',
      VModel: 'inputNumber',
      span: 4
    },
    {
      label: 'select',
      type: 'select',
      VModel: 'select',
      span: 4,
      options: [
        {
          label: 'test_001',
          value: 'test_001'
        },
        {
          label: 'test_002',
          value: 'test_002'
        },
        {
          label: 'test_003',
          value: 'test_003'
        }
      ]
    },
    {
      label: 'datePicker',
      type: 'datePicker',
      VModel: 'datePicker',
      span: 4
    },
    {
      label: 'datePicker',
      type: 'datePicker',
      VModel: 'datePicker',
      itemType: 'datetimerange',
      span: 7,
      rangeSeparator: '至',
      startPlaceholder: '开始',
      endPlaceholder: '结束'
    },
    {
      label: 'switch',
      type: 'switch',
      VModel: 'switch',
      span: 4
    },
    {
      label: 'checkbox',
      type: 'checkbox',
      VModel: 'checkbox',
      checkboxs: [
        {
          label: 'test_001',
          value: 'test_001'
        },
        {
          label: 'test_002',
          value: 'test_002'
        },
        {
          label: 'test_003',
          value: 'test_003'
        }
      ],
      span: 6
    }
  ]
})
</script>
<template>
  <!-- <DynamicForm :dynamicFormConfig="dynamicFormConfig"></DynamicForm> -->
  <div style="height: 100vh; border: 2px solid aqua"></div>
</template>
<style scoped lang="scss"></style>
