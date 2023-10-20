<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const props = defineProps(['tableData', 'selectData'])
//表格页数
const tablePage = ref({ total: 0, currentPage: 1, pageSize: 10 })
//当前页面数据
const currentData = ref<any>([])
const tableData = computed(() => props.tableData)
const selectDataLength = computed(() => {
  if (props.selectData) {
    return props.selectData.selectData.length
  } else {
    return 0
  }
})
//修改页面页数和每页数据数量
const emit = defineEmits(['getCurrentData'])
const getCurrentData = (currentPage: number = 1, pageSize: number = 10) => {
  currentData.value = []
  setTimeout(() => {
    //获取指定数量和页数的人员数据
    for (
      let i = (currentPage - 1) * pageSize;
      i < currentPage * pageSize && i < tableData.value.length;
      i++
    ) {
      currentData.value.push(tableData.value[i])
    }
    tablePage.value.total = tableData.value.length
    emit('getCurrentData', currentData.value)
  }, 0)
}
const changePage = ({ currentPage, pageSize }: any) => {
  tablePage.value.currentPage = currentPage
  tablePage.value.pageSize = pageSize
  getCurrentData(currentPage, pageSize)
}
watch(
  tableData,
  () => {
    getCurrentData(tablePage.value.currentPage, tablePage.value.pageSize)
  },
  {
    immediate: true
  }
)
</script>
<template>
  <div class="pager">
    <vxe-pager
      :layouts="[
        'Sizes',
        'PrevJump',
        'PrevPage',
        'Number',
        'NextPage',
        'NextJump',
        'FullJump',
        'Total'
      ]"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      @page-change="changePage"
    >
      <template #left>
        <span class="page_left">
          <span>已选中 {{ selectDataLength }} 条</span>
        </span>
      </template>
    </vxe-pager>
  </div>
</template>
<style scoped lang="scss">
.pager {
  margin-top: 10px;
  margin-bottom: -10px;
  .page_left {
    margin-right: 20px;
  }
}
</style>
