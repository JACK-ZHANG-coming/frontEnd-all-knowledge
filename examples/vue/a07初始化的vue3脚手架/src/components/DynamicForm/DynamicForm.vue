<script setup lang="ts">
import { ref } from 'vue'
import { cloneDeep } from 'lodash'

const props = defineProps(['dynamicFormConfig'])
// 双向绑定表单数据
const staticFormData = ref<any>({})
const dynamicFormList = ref<any>([])
defineExpose({ staticFormData, dynamicFormList })
// 添加或复制动态表单条目
const addDynamicForm = (item?: any) => {
  let newItem: any = {}
  if (item) {
    newItem = cloneDeep(item)
  }
  newItem.id = new Date().getTime()
  dynamicFormList.value.push(newItem)
}
// 删除动态表单条目
const deleteDynamicForm = (id: any) => {
  for (let index = 0; index < dynamicFormList.value.length; index++) {
    const element = dynamicFormList.value[index]
    if (element.id === id) {
      dynamicFormList.value.splice(index, 1)
    }
  }
}
</script>
<template>
  <div style="position: relative">
    <el-form :label-width="props.dynamicFormConfig.labelWidth" :model="staticFormData">
      <!-- 新增动态部分按钮 -->
      <div
        :style="{
          position: 'absolute',
          top: props.dynamicFormConfig.addButton.top,
          left: props.dynamicFormConfig.addButton.left,
          right: props.dynamicFormConfig.addButton.right,
          bottom: props.dynamicFormConfig.addButton.bottom,
          zIndex: props.dynamicFormConfig.addButton.zIndex
        }"
      >
        <el-button type="primary" @click="addDynamicForm">
          {{ props.dynamicFormConfig.addButton.text }}
        </el-button>
      </div>
      <!-- 表单固定部分 -->
      <el-row :gutter="props.dynamicFormConfig.gutter">
        <el-col
          v-for="(item, index) in props.dynamicFormConfig.staticItemsList"
          :key="index"
          :span="item.span || props.dynamicFormConfig.span"
        >
          <el-form-item
            :prop="[item.VModel]"
            :rules="[{ required: item.required, message: item.message, trigger: 'blur' }]"
            :label="item.label"
            :label-width="item.labelWidth"
          >
            <el-input
              v-if="item.type === 'input'"
              v-model="staticFormData[item.VModel]"
              :placeholder="item.placeholder"
              :type="item.itemType"
              :autosize="{
                minRows: item.minRows,
                maxRows: item.maxRows
              }"
              :disabled="item.disabled"
            />
            <el-input-number
              v-else-if="item.type === 'inputNumber'"
              v-model="staticFormData[item.VModel]"
              :min="item.min"
              :max="item.max"
              :disabled="item.disabled"
            />
            <el-select
              v-else-if="item.type === 'select'"
              v-model="staticFormData[item.VModel]"
              :placeholder="item.placeholder"
              :multiple="item.multiple"
              collapse-tags
              style="width: 100%"
              :disabled="item.disabled"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              />
            </el-select>
            <el-radio-group
              v-else-if="item.type === 'radio'"
              v-model="staticFormData[item.VModel]"
              :disabled="item.disabled"
            >
              <el-radio
                v-for="radio in item.radios"
                :key="radio.value"
                :label="radio.value"
                :disabled="radio.disabled"
              >
                {{ radio.label }}
              </el-radio>
            </el-radio-group>
            <el-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model="staticFormData[item.VModel]"
              :disabled="item.disabled"
            >
              <el-checkbox
                v-for="checkbox in item.checkboxs"
                :key="checkbox.value"
                :label="checkbox.value"
                :disabled="checkbox.disabled"
              >
                {{ checkbox.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-switch
              v-else-if="item.type === 'switch'"
              v-model="staticFormData[item.VModel]"
              :disabled="item.disabled"
            />
            <el-date-picker
              v-else-if="item.type === 'datePicker'"
              v-model="staticFormData[item.VModel]"
              :placeholder="item.placeholder"
              style="width: 100%"
              :type="item.itemType"
              :disabled="item.disabled"
              :range-separator="item.rangeSeparator"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      v-for="group in dynamicFormList"
      :key="group.id"
      :label-width="props.dynamicFormConfig.labelWidth"
      :model="group"
    >
      <!-- 表单动态部分 -->
      <el-divider border-style="dashed" content-position="right" style="margin-bottom: 40px">
        <el-button-group>
          <el-button
            v-if="
              props.dynamicFormConfig.copyButton === undefined
                ? true
                : props.dynamicFormConfig.copyButton
            "
            type="primary"
            icon="CopyDocument"
            style="font-size: 16px"
            @click="addDynamicForm(group)"
          />
          <el-button
            type="danger"
            icon="Delete"
            style="font-size: 16px"
            @click="deleteDynamicForm(group.id)"
          />
        </el-button-group>
      </el-divider>
      <el-row :gutter="props.dynamicFormConfig.gutter">
        <el-col
          v-for="(item, index) in props.dynamicFormConfig.dynamicItemsList"
          :key="index"
          :span="item.span || props.dynamicFormConfig.span"
        >
          <el-form-item
            :label="item.label"
            :label-width="item.labelWidth"
            :prop="[item.VModel]"
            :rules="[{ required: item.required, message: item.message, trigger: 'blur' }]"
          >
            <el-input
              v-if="item.type === 'input'"
              v-model="group[item.VModel]"
              :placeholder="item.placeholder"
              :type="item.itemType"
              :autosize="{
                minRows: item.minRows,
                maxRows: item.maxRows
              }"
              :disabled="item.disabled"
            />
            <el-input-number
              v-else-if="item.type === 'inputNumber'"
              v-model="group[item.VModel]"
              :min="item.min"
              :max="item.max"
              :disabled="item.disabled"
              style="width: 100%"
            />
            <el-select
              v-else-if="item.type === 'select'"
              v-model="group[item.VModel]"
              :placeholder="item.placeholder"
              :multiple="item.multiple"
              collapse-tags
              style="width: 100%"
              :disabled="item.disabled"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              />
            </el-select>
            <el-radio-group
              v-else-if="item.type === 'radio'"
              v-model="group[item.VModel]"
              :disabled="item.disabled"
            >
              <el-radio
                v-for="radio in item.radios"
                :key="radio.value"
                :label="radio.value"
                :disabled="radio.disabled"
              >
                {{ radio.label }}
              </el-radio>
            </el-radio-group>
            <el-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model="group[item.VModel]"
              :disabled="item.disabled"
            >
              <el-checkbox
                v-for="checkbox in item.checkboxs"
                :key="checkbox.value"
                :label="checkbox.value"
                :disabled="checkbox.disabled"
              >
                {{ checkbox.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-switch
              v-else-if="item.type === 'switch'"
              v-model="group[item.VModel]"
              :disabled="item.disabled"
            />
            <el-date-picker
              v-else-if="item.type === 'datePicker'"
              v-model="group[item.VModel]"
              :placeholder="item.placeholder"
              :type="item.itemType"
              style="width: 100%"
              :disabled="item.disabled"
              :range-separator="item.rangeSeparator"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
