<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="新增静态数据"
    width="50%"
    @ok="validateForm"
    @cancel="reset"
    :maskClosable="false"
  >
    <div class="pt-3px pr-3px">
      <Form ref="formRef" name="dynamic_form_nest_item" :label-col="{ span: 6 }" :model="modelRef">
        <Row :gutter="24">
          <Col :span="12">
            <FormItem
              name="innerSourceName"
              label="名称"
              :rules="[{ required: true, message: '请填写数据源名称！' }]"
            >
              <Input v-model:value="modelRef.innerSourceName" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem name="outDataDescription" label="描述">
              <Input v-model:value="modelRef.outDataDescription" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem name="outDataUnitName" label="单位">
              <Input v-model:value="modelRef.outDataUnitName" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem name="outDataTypeSub" label="次级类型">
              <Input v-model:value="modelRef.outDataTypeSub" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem
              name="outDataType"
              label="数据类型"
              :rules="[{ required: true, message: '数据类型' }]"
            >
              <Select v-model:value="modelRef.outDataType" :options="outDataTypeList" />
            </FormItem>
          </Col>

          <Col
            v-show="
              modelRef.outDataType !== 'RangeData' &&
              modelRef.outDataType !== 'NullData' &&
              modelRef.outDataType !== 'MapData'
            "
            :span="12"
          >
            <FormItem
              name="staticVal"
              label="数据值"
              :rules="
                modelRef.outDataType !== 'RangeData' &&
                modelRef.outDataType !== 'NullData' &&
                modelRef.outDataType !== 'MapData'
                  ? [{ required: true, message: '请填写数据值！' }]
                  : [{ required: false }]
              "
            >
              <Input v-model:value="modelRef.staticVal" />
            </FormItem>
          </Col>
          <Col
            v-show="modelRef.outDataType == 'RangeData' || modelRef.outDataType == 'MapData'"
            :span="12"
          >
            <Space style="display: flex; justify-content: end">
              <RadioGroup
                v-model:value="rangeType"
                :size="'small'"
                :disabled="modelRef.RangeList.length > 0"
              >
                <Radio :value="'string'">字符串范围型</Radio>
                <Radio :value="'int'">数值范围型</Radio>
              </RadioGroup>
              <a-button type="link" @click="addRange"><PlusOutlined /></a-button>
            </Space>
          </Col>
          <!-- 
          <Col v-show="modelRef.outDataType == 'RangeData'" :span="24">
           
              
              <span class="text-12px text-#666666"
                ><ExclamationCircleOutlined /> 范围数据请不要存在交集</span
              >
            </Space>
          </Col> -->

          <Col :span="24">
            <Space
              v-for="(range, index) in modelRef.RangeList"
              :key="range.id"
              style="display: flex; justify-content: center; margin-bottom: 0"
              align="baseline"
            >
              <FormItem
                :name="['RangeList', index, 'startNumber']"
                :label="rangeType == 'int' ? '左区间' : '数据值'"
                :label-col="{ span: 7 }"
                :rules="{
                  required: true,
                  message: '请填写左区间！',
                }"
              >
                <Input v-model:value="range.startNumber" />
              </FormItem>
              <FormItem
                v-show="rangeType == 'int'"
                label="右区间"
                :label-col="{ span: 7 }"
                :name="['RangeList', index, 'endNumber']"
                :rules="{
                  required: rangeType == 'int' ? true : false,
                  message: '请填写右区间！',
                }"
              >
                <Input v-model:value="range.endNumber" />
              </FormItem>
              <FormItem
                v-show="modelRef.outDataType == 'MapData'"
                label="映射值"
                :label-col="{ span: 7 }"
                :name="['RangeList', index, 'keyName']"
                :rules="{
                  required: modelRef.outDataType == 'MapData' ? true : false,
                  message: '请填写映射值!',
                }"
              >
                <Input v-model:value="range.keyName" />
              </FormItem>
              <MinusCircleOutlined @click="removeRange(range)" />
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import {
    Form,
    FormItem,
    Select,
    Input,
    Space,
    Col,
    Row,
    RadioGroup,
    Radio,
    message,
  } from 'ant-design-vue';
  import { reactive, ref, watch, toRaw } from 'vue';
  import { BasicModal, useModal } from '@/components/Modal';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { CreateOneInnerSource } from '@/api/dataSourceManagement/innerDataSource';

  const $emit = defineEmits(['refreshTable']);
  const [register, { closeModal }] = useModal();
  // const useForm = Form.useForm;
  const rangeType = ref('string');
  const formRef = ref<any>(null);

  interface RangeList {
    startNumber: string;
    endNumber: string;
    id: number;
    keyName: string;
  }
  const outDataTypeList = [
    { label: '整型数据', value: 'IntData' },
    { label: '浮点型数据', value: 'FloatData' },
    { label: '布尔型数据', value: ' BoolData' },
    { label: '字符串型数据', value: 'StringData' },
    { label: '范围型数据', value: 'RangeData' },
    { label: '映射表数据', value: 'MapData' },
    { label: '空数据', value: 'NullData' },
  ];
  const modelRef = reactive<any>({
    RangeList: [],
    outDataType: undefined,
    innerSourceName: undefined,
    outDataDescription: undefined,
    outDataUnitName: undefined,
    outDataTypeSub: undefined,
    staticVal: undefined,
  });

  const removeRange = (item: RangeList) => {
    const index = modelRef.RangeList.indexOf(item);
    if (index !== -1) {
      modelRef.RangeList.splice(index, 1);
    }
  };
  const addRange = () => {
    modelRef.RangeList.push({
      startNumber: undefined,
      endNumber: undefined,
      keyName: undefined,
      id: Date.now(),
    });
  };

  watch(
    () => modelRef.outDataType,
    () => {
      modelRef.RangeList = [];
      modelRef.staticVal = undefined;
      rangeType.value = 'string';
    },
  );
  //保存校验
  const validateForm = async () => {
    formRef.value
      .validate()
      .then(() => {
        let params = {
          innerSourceName: modelRef.innerSourceName,
          outDataType: modelRef.outDataType,
          outDataDescription: modelRef.outDataDescription ? modelRef.outDataDescription : '',
          outDataUnitName: modelRef.outDataUnitName ? modelRef.outDataUnitName : '',
          outDataTypeSub: modelRef.outDataTypeSub ? modelRef.outDataTypeSub : '',
          staticVal: '',
        };
        if (modelRef.outDataType == 'RangeData') {
          Reflect.set(
            params,
            'staticValType',
            rangeType.value == 'int' ? 'FloatData' : 'StringData',
          );
          if (modelRef.RangeList.length > 0) {
            let rangeStr = '';
            modelRef.RangeList.forEach((item) => {
              if (rangeType.value == 'string') {
                rangeStr = rangeStr + item.startNumber + '%^%' + item.startNumber + '&*&';
              } else if (rangeType.value == 'int') {
                rangeStr = rangeStr + item.startNumber + '%^%' + item.endNumber + '&*&';
              }
            });
            params.staticVal = rangeStr == '' ? rangeStr : rangeStr.slice(0, -3);
          }
        } else if (modelRef.outDataType == 'MapData') {
          Reflect.set(
            params,
            'staticValType',
            rangeType.value == 'int' ? 'FloatData' : 'StringData',
          );
          if (modelRef.RangeList.length > 0) {
            let rangeStr = '';
            modelRef.RangeList.forEach((item) => {
              if (rangeType.value == 'string') {
                rangeStr =
                  rangeStr +
                  item.startNumber +
                  '%^%' +
                  item.startNumber +
                  '@#@' +
                  item.keyName +
                  '&*&';
              } else if (rangeType.value == 'int') {
                rangeStr =
                  rangeStr +
                  item.startNumber +
                  '%^%' +
                  item.endNumber +
                  '@#@' +
                  item.keyName +
                  '&*&';
              }
            });
            params.staticVal = rangeStr == '' ? rangeStr : rangeStr.slice(0, -3);
          }
        } else {
          params.staticVal = modelRef.staticVal ? modelRef.staticVal : '';
        }
        console.log(params, 'params');
        if (
          params.staticVal == '' &&
          (params.outDataType == 'MapData' || params.outDataType == 'RangeData')
        ) {
          message.warning('请添加数据值！');
        } else {
          CreateOneInnerSource(params)
            .then((res) => {
              reset();
              message.success('添加数据成功！');
              $emit('refreshTable');

              closeModal();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  //取消重置
  const reset = () => {
    formRef.value.clearValidate();
    formRef.value.resetFields();
    rangeType.value = 'string';
  };
</script>
<style lang="less" scoped></style>
