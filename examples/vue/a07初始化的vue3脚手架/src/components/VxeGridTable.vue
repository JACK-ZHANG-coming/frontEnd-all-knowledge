<script setup lang="tsx">
import { ref, reactive, computed } from 'vue'
import type { VxeGridProps, VxeGridInstance } from 'vxe-table'
interface RowVO {
  id: number
  name: string
  nickname: string
  role: string
  sex: string
  age: number
  address: string
}
const xGrid = ref<VxeGridInstance>()
const props = defineProps(['tableData', 'columnData', 'loading', 'height'])
const selectData = ref([])
const selectChange = (value: any) => {
  selectData.value = value.records
}
defineExpose({ selectData })
const tableData: any = computed(() => props.tableData)
const columnData: any = computed(() => props.columnData)
const loading: any = computed(() => props.loading)
const height: any = computed(() => props.height)
const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  align: 'center',
  height: height,
  loading: loading,
  columnConfig: {
    resizable: true
  },
  rowConfig: {
    isHover: true
  },
  editConfig: {
    trigger: 'click',
    mode: 'cell'
  },
  toolbarConfig: {
    custom: {
      icon: 'vxe-icon-menu'
    }
  },
  data: tableData,
  columns: columnData
})
</script>
<template>
  <div>
    <vxe-grid
      class="vxeGrid"
      ref="xGrid"
      v-bind="gridOptions"
      @checkbox-all="selectChange"
      @checkbox-change="selectChange"
    >
    </vxe-grid>
  </div>
</template>

<style lang="scss">
.vxeGrid {
  .vxe-toolbar {
    height: 0;
    padding: 0;
    background-color: transparent;
    .vxe-custom--wrapper {
      top: 25px;
      left: -1px;
      z-index: 20;
      .vxe-button {
        height: 48px;
        border-radius: 10% !important;
        border: 0px;
        background-color: $color-background;
      }
    }
  }
  //表格标题
  .vxe-cell--title {
    font-size: $font-size-common;
  }
  .vxe-cell--sort {
    margin-top: -4px;
  }
}
</style>
