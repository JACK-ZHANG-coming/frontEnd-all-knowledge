<script setup lang="ts">
import { ref, watch, onBeforeMount, toRefs, h, render, nextTick } from 'vue'
import type Jrjobject from '@/commonTools/baseDataType/Jrjobject'

export interface Props {
  tableData: Jrjobject[]
  loading?: boolean
}
// const props = defineProps(['tableData'])
const props = defineProps<Props>()

type extraType = {
  field: string
  title: string
  render?: (text: string, record?: object, index?: number, rowIndex?: string) => void
}

const extra: extraType[] = [
  {
    field: 'name',
    title: '姓名',
    render: (text: string, record, rowIndex) => {
      nextTick(() => {
        render(
          h('div', { class: 'bar', innerHTML: 'hello777' + text, style: 'color:red' }),
          document.getElementById('rowIndex' + rowIndex)!
        )
      })
    }
  }
]
</script>
<template>
  <div class="tables">
    <vxe-table
      border
      resizable
      height="528"
      :data="tableData"
      :loading="loading"
      :row-config="{ isHover: true }"
    >
      <vxe-column type="seq" width="60" title="序号"></vxe-column>
      <vxe-column
        v-for="(item, index) in extra"
        :field="'properties.' + item.field"
        :title="item.title"
        :key="index"
        sortable
      >
        <template v-if="item.render" #default="{ row, $rowIndex }: any">
          <span :id="'rowIndex' + $rowIndex">
            {{ item.render && item.render(row.properties[item.field], row, $rowIndex) }}
          </span>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<style scoped lang="scss"></style>
