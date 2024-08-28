<template>
  <div class="edit_board">
    <div class="space_between">
      <div style="font-weight: bold"> 编辑 </div>
      <Space>
        <Button title="收起编辑框" style="width: 50px" type="primary" @click="changeEditBoard">
          <Icon :icon="'ant-design:right-outlined'" />
        </Button>
      </Space>
    </div>
    <div class="el-scrollbar__view" max-height="800px">
      <div class="edit_board_content">
        <BasicForm ref="formElRef" @register="register" />
        <div class="edit_board_footer">
          <Space>
            <Button :disabled="currentNodeData?.nodeType == undefined" @click="areReset"
              >重置</Button
            >
            <Button
              :disabled="currentNodeData?.nodeType == undefined"
              @click="areSave"
              type="primary"
              >保存</Button
            >
          </Space>
        </div>
        <div class="one-key-field">
          <Row>
            <Col :span="8"> 唯一标识字段 </Col>
            <Col :span="12">
              <Switch
                v-model:checked="isIdFieldValue"
                :disabled="currentNodeData?.nodeType == undefined"
                @click="
                  (checked: any, e: Event) => {
                    isIdFieldValueClick(checked);
                  }
                "
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
  <Button
    title="展开编辑框"
    style="width: 50px"
    class="to_expand_button"
    @click="toExpand"
    type="primary"
  >
    <Icon :icon="'ant-design:left-outlined'" />
  </Button>
</template>
<script setup lang="ts">
  import { Button, Input, Space, Switch, Row, Col } from 'ant-design-vue';
  import { computed, h, ref, watch } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { compareObjects, oneCopyText } from '@/utils/simpleTools';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { line } from '@antv/x6/lib/registry/port-layout/line';

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue', 'areUpdateSaveGraph']);
  const currentNodeData = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });
  const isIdFieldValue = ref(false);

  const baseSetschemas: FormSchema[] | any = ref([
    {
      field: 'uuid',
      component: 'Input',
      label: 'UUID',
      colProps: { span: 24 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (model[field]) {
          return h('span', { style: { color: 'gray' } }, [
            model[field],
            h(
              Button,
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '25px',
                  textAlign: 'center',
                  width: '25px',
                  height: '25px',
                  position: 'absolute',
                  top: '1px',
                  right: '-10px',
                  type: 'text',
                },
                title: '一键复制',
                onClick: () => {
                  oneCopyText(model[field]);
                },
              },
              {
                icon: () => h(CopyOutlined, { style: { fontSize: '12px' } }),
              },
            ),
          ]);
        } else {
          return h('span', { style: { color: 'gray' } }, '请选择节点');
        }
      },
    },
    {
      field: 'dataName',
      component: 'Input',
      label: '名称',
      helpMessage: ['避免在同一层级下创建同名节点，同名节点会导致格式解析错误'],
      colProps: { span: 24 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        return h(Input, {
          placeholder: '请输入',
          allowClear: true,
          disabled: currentNodeData.value?.nodeType == undefined,
          value: model[field],
          onChange: (e: any) => {
            model[field] = e.target.value;
          },
        });
      },
    },
    {
      field: 'typeSub',
      component: 'Input',
      label: '次级类型',
      colProps: { span: 24 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        return h(Input, {
          placeholder: '请输入',
          allowClear: true,
          disabled: currentNodeData.value?.nodeType == undefined,
          value: model[field],
          onChange: (e: any) => {
            model[field] = e.target.value;
          },
        });
      },
    },
    {
      field: 'unitName',
      component: 'Input',
      label: '单位',
      colProps: { span: 24 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        return h(Input, {
          placeholder: '请输入',
          allowClear: true,
          disabled: currentNodeData.value?.nodeType == undefined,
          value: model[field],
          onChange: (e: any) => {
            model[field] = e.target.value;
          },
        });
      },
    },
    {
      field: 'description',
      component: 'Input',
      label: '描述',
      colProps: { span: 24 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        return h(Input, {
          placeholder: '请输入',
          allowClear: true,
          disabled: currentNodeData.value?.nodeType == undefined,
          value: model[field],
          onChange: (e: any) => {
            model[field] = e.target.value;
          },
        });
      },
    },
    // {
    //   field: 'isIdField',
    //   component: 'Switch',
    //   label: '唯一标识字段',
    //   colProps: { span: 24 },
    //   dynamicDisabled: true,
    //   render: ({ model, field }) => {
    //     return h(Switch, {
    //       disabled: currentNodeData.value?.nodeType == undefined,
    //       checked: model[field],
    //       onChange: (e: any) => {
    //         model[field] = e;
    //       },
    //     });
    //   },
    // },
  ]);

  const formElRef = ref();
  const [register, { setFieldsValue }] = useForm({
    labelAlign: 'left',
    labelWidth: 80,
    schemas: computed(() => baseSetschemas.value),
    showActionButtonGroup: false,
    rowProps: { gutter: [40, 0] },
  });

  // 初始化
  // setTimeout(() => {
  //   currentNodeData.value.properties = {};
  // }, 0);
  const boardpositionright = ref('10px');
  const toexpandbuttonright = ref('-100px');
  const changeEditBoard = () => {
    boardpositionright.value = '-900px';
    toexpandbuttonright.value = '10px';
  };
  const toExpand = () => {
    boardpositionright.value = '10px';
    toexpandbuttonright.value = '-100px';
  };

  const areReset = () => {
    setFieldsValue({
      dataName: currentNodeData.value.dataName,
      typeSub: currentNodeData.value.typeSub,
      unitName: currentNodeData.value.unitName,
      description: currentNodeData.value.description,
      // isIdField: currentNodeData.value.isIdField,
    });
  };

  const areSave = () => {
    let tempObj = formElRef.value.getFieldsValue();
    // console.log('tempObj', tempObj);
    // console.log('currentNodeData.value:', currentNodeData.value);
    const params = {
      options: compareObjects(tempObj, currentNodeData.value),
      uuid: currentNodeData.value.uuid,
      dataName: tempObj.dataName || '',
      description: tempObj.description || '',
      type: currentNodeData.value.typeKey,
      typeSub: tempObj.typeSub || '',
      unitName: tempObj.unitName,
      // isIdField: tempObj.isIdField || false,
    };
    // updateCurrentNodeData(tempObj);
    emit('areUpdateSaveGraph', 'updateNode', {}, params);
  };

  const isIdFieldValueClick = (checked: boolean) => {
    console.log('checked', checked);
    const params = {
      uuid: currentNodeData.value.uuid,
      isIdField: isIdFieldValue.value,
    };
    emit('areUpdateSaveGraph', 'updateIsIdField', {}, params);
  };

  const changeFieldValue = (value: boolean) => {
    isIdFieldValue.value = value;
  };

  // const updateCurrentNodeData = (data: any) => {
  //   currentNodeData.value['dataName'] = data['dataName'];
  //   currentNodeData.value['typeSub'] = data['typeSub'];
  //   currentNodeData.value['description'] = data['description'];
  //   currentNodeData.value['isIdField'] = data['isIdField'];
  //   // console.log('currentNodeData.value--->', currentNodeData.value);
  // };

  defineExpose({
    changeFieldValue,
  });
  watch(
    currentNodeData,
    (newVal, oldVal) => {
      console.log('currentNodeData---==>', currentNodeData);
      if (newVal?.nodeType != undefined) {
        setFieldsValue({
          dataName: newVal.dataName,
          typeSub: newVal.typeSub,
          unitName: newVal.unitName,
          description: newVal.description,
          uuid: newVal.uuid,
          // isIdField: newVal.isIdField,
        });
        isIdFieldValue.value = currentNodeData.value.isIdField;
      }
    },
    // {
    //   deep: true,
    // },
  );
</script>
<style scoped lang="less">
  .edit_board {
    position: absolute;
    z-index: 10;
    top: 10px;
    right: v-bind(boardpositionright);
    min-width: 400px;
    transition: all 0.3s ease;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 5px 8px 5px rgba(#000, 0.12);

    .space_between {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      padding-bottom: 0;
      font-size: 16px;
    }

    .el-scrollbar__view {
      width: 400px;

      .edit_board_content {
        width: 100%;
        padding: 30px 20px 20px;
      }

      .edit_board_footer {
        display: flex;
        justify-content: flex-end;
      }

      .one-key-field {
        height: 32px;
        margin-top: 10px;
        margin-bottom: -15px;
        color: rgb(0 0 0 / 88%);
        font-size: 14px;
      }
    }
  }

  .to_expand_button {
    position: absolute;
    top: 300px;
    right: v-bind(toexpandbuttonright);
    width: 20px;
    height: 40px;
    transition: all 0.5s ease;
  }

  .color_disabled {
    color: #d4d4d4;
  }
</style>
