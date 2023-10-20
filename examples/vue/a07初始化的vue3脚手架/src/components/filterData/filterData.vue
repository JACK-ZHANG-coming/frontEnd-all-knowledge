<script setup lang="tsx">
import { reactive, ref, nextTick, watch } from 'vue'
import type { CompleteTableType } from '../CompleteTable/CompleteTableType'
import { ElMessage } from 'element-plus'
import _ from 'lodash'

const props: any = defineProps(['filterTableConfig'])

//处理每一列配置
const columns = _.cloneDeep(props.filterTableConfig.columns)
columns.forEach((item: any) => {
  item.sortable = true
  if (!item.slots) {
    item.slots = {}
  }
  if (!item.slots.filter && !item.filters) {
    item.filters = [{ data: '' }]
    item.slots.filter = ({ column, $panel }: any) => {
      return [
        <div>
          {column.filters.map((item: any) => {
            return (
              <div style={'padding:10px'}>
                <el-input
                  type="type"
                  v-model={item.data}
                  onInput={($event: any) => filterData($event, item, $panel)}
                />
              </div>
            )
          })}
        </div>
      ]
    }
  }
})
columns.unshift({
  type: props.filterTableConfig.isRadio ? 'radio' : 'checkbox',
  width: props.filterTableConfig.isRadio ? 60 : 100,
  fixed: 'left',
  title: props.filterTableConfig.isRadio ? '单选' : '全选'
})
const filterData = ($event: any, item: any, $panel: any) => {
  $panel.changeOption($event, !!item.data, item)
}

//深拷贝表格数据并转译
let getTableData = _.cloneDeep(props.filterTableConfig.tableData)
let translationTableData: any
if (props.filterTableConfig.translation) {
  getTableData.forEach((item: any) => {
    props.filterTableConfig.translation.forEach((translationField: any) => {
      translationField.options.forEach((options: any) => {
        if (item[translationField.field] === options.value) {
          item[translationField.field] = options.label
        }
      })
    })
  })
}
translationTableData = _.cloneDeep(getTableData)

//配置表格
const tableConfig = reactive<CompleteTableType>({
  id: props.filterTableConfig.id,
  columns: columns,
  height: 600,
  align: 'center',
  toolbarConfig: {
    insert_actived: false,
    mark_cancel: false,
    delete: false,
    save: false
  },
  proxyConfig: {
    props: {
      result: 'res',
      total: 'total'
    },
    ajax: {
      query({ page, sorts, filters }) {
        //处理传递的数据
        let cloneTableData = _.cloneDeep(translationTableData)
        filters.forEach((filterDatas: any) => {
          cloneTableData = cloneTableData.filter((item: any) => {
            if (filterDatas.datas[0]) {
              return item[filterDatas.field]
                .toLocaleLowerCase()
                .includes(filterDatas.datas[0].toLocaleLowerCase())
            } else if (filterDatas.values) {
              let isReturn = false
              for (let index = 0; index < filterDatas.values.length; index++) {
                if (
                  item[filterDatas.field]
                    .toLocaleLowerCase()
                    .includes(filterDatas.values[index].toLocaleLowerCase())
                ) {
                  isReturn = true
                }
              }
              return isReturn
            }
          })
        })

        if (sorts[0]) {
          cloneTableData.sort((a: any, b: any) => {
            const aValue = a[sorts[0].field].toUpperCase()
            const bValue = b[sorts[0].field].toUpperCase()
            if (aValue < bValue) {
              return sorts[0].order === 'asc' ? -1 : 1
            }
            if (aValue > bValue) {
              return sorts[0].order === 'asc' ? 1 : -1
            }
            return 0
          })
        }
        const tableData = {
          res: [],
          total: 0
        }
        tableData.res = cloneTableData.slice(
          (page.currentPage - 1) * page.pageSize,
          page.currentPage * page.pageSize
        )
        tableData.total = cloneTableData.length
        return tableData
      }
    }
  }
})

//模糊查询
const tableMethod = ref()
const fuzzySearchCriteria = ref<string>('')
const fuzzySearch = (reset?: any) => {
  translationTableData = _.cloneDeep(getTableData)
  if (reset) {
    fuzzySearchCriteria.value = ''
  } else {
    translationTableData = translationTableData.filter((item: any) => {
      let isReturn = false
      for (let key in item) {
        if (key !== 'id' && key !== '_X_ROW_KEY') {
          if (
            item[key].toLocaleLowerCase().includes(fuzzySearchCriteria.value.toLocaleLowerCase())
          ) {
            isReturn = true
          }
        }
      }
      return isReturn
    })
  }
  tableMethod.value.tableMethods('commitProxy', 'query')
}

//设置默认选中
if (props.filterTableConfig.defaultSelected) {
  watch(
    props,
    () => {
      nextTick(() => {
        tableMethod.value.tableMethods('setCheckboxRow', [
          props.filterTableConfig.defaultSelected,
          true
        ])
        allCheckedData.value = tableMethod.value
          .tableMethods('getCheckboxReserveRecords')
          .concat(tableMethod.value.tableMethods('getCheckboxRecords'))
        tooltipList.value = ''
        allCheckedData.value.forEach((item: any) => {
          tooltipList.value += `${item[props.filterTableConfig.displayField]} ; `
        })
      })
    },
    { immediate: true }
  )
}
//获取选中数据
const tooltipList = ref<string>('')
const allCheckedData = ref<any>([])
//多选
const getCheckedData = (value: any) => {
  allCheckedData.value = value.reserves.concat(value.records)
  tooltipList.value = ''
  allCheckedData.value.forEach((item: any) => {
    tooltipList.value += `${item[props.filterTableConfig.displayField]} ; `
  })
  if (tooltipList.value === '') {
    tooltipVisible.value = false
  }
} //单选
const getRadioData = (value: any) => {
  allCheckedData.value = [value.newValue]
  tooltipList.value = value.newValue[props.filterTableConfig.displayField]
}
//控制文字提示信息
const tooltipVisible = ref<boolean>(false)
//取消关闭标签
const closeTag = (value: any) => {
  if (props.filterTableConfig.isRadio) {
    tableMethod.value.tableMethods('clearRadioRow')
    tableMethod.value.tableMethods('clearRadioReserve')
    allCheckedData.value = []
    tooltipList.value = ''
    tooltipVisible.value = false
  } else {
    tableMethod.value.tableMethods('setCheckboxRow', [value, false])
    getCheckedData({
      reserves: tableMethod.value.tableMethods('getCheckboxReserveRecords'),
      records: tableMethod.value.tableMethods('getCheckboxRecords')
    })
  }
}

//传递选中数据
const emits = defineEmits(['submitCheckedData'])
const submitCheckedData = (value: boolean) => {
  if (value) {
    if (allCheckedData.value.length === 0) {
      ElMessage({
        message: '未选择数据',
        type: 'warning'
      })
    } else {
      let cloneAllCheckedData = _.cloneDeep(allCheckedData.value)
      cloneAllCheckedData.forEach((item: any, index: number) => {
        if (props.filterTableConfig.translation) {
          props.filterTableConfig.translation.forEach((translationField: any) => {
            translationField.options.forEach((options: any) => {
              if (item[translationField.field] === options.label) {
                item[translationField.field] = options.value
              }
            })
          })
        }
        const exportData = {
          id: item.id,
          type: item.type,
          properties: item
        }
        cloneAllCheckedData[index] = exportData
      })
      emits('submitCheckedData', cloneAllCheckedData)
      tableMethod.value.tableMethods('clearCheckboxRow')
      tableMethod.value.tableMethods('clearCheckboxReserve')
      tableMethod.value.tableMethods('clearRadioRow')
      tableMethod.value.tableMethods('clearRadioReserve')
      allCheckedData.value = []
      tooltipList.value = ''
    }
  } else {
    emits('submitCheckedData', false)
    tableMethod.value.tableMethods('clearCheckboxRow')
    tableMethod.value.tableMethods('clearCheckboxReserve')
    tableMethod.value.tableMethods('clearRadioRow')
    tableMethod.value.tableMethods('clearRadioReserve')
    allCheckedData.value = []
    tooltipList.value = ''
  }
}
</script>
<template>
  <div class="filter_data">
    <div class="show_checked_data_list">
      <p>已选中</p>
      <el-tooltip effect="dark" :visible="tooltipVisible" :content="tooltipList" placement="top">
        <p @mouseenter="tooltipVisible = true" @mouseleave="tooltipVisible = false">
          <el-tag v-for="item in allCheckedData" :key="item.id" closable @close="closeTag(item)">
            {{ item[props.filterTableConfig.displayField] }}
          </el-tag>
        </p>
      </el-tooltip>
      <p>共{{ allCheckedData.length }}条数据</p>
    </div>
    <div class="space_between" style="margin-top: 10px">
      <div class="space_between" style="align-items: center">
        <p style="width: 100px">查询条件:</p>
        <el-input v-model="fuzzySearchCriteria" placeholder="模糊查询" />
      </div>
      <div>
        <el-button @click="fuzzySearch(true)">重置</el-button>
        <el-button type="primary" @click="fuzzySearch(false)">查询</el-button>
      </div>
    </div>
    <CompleteTable
      ref="tableMethod"
      :tableConfig="tableConfig"
      @exportCheckedData="getCheckedData"
      @exportRadioData="getRadioData"
    >
    </CompleteTable>
    <div class="space_between" style="margin-top: 10px">
      <p></p>
      <div>
        <el-button @click="submitCheckedData(false)">取消</el-button>
        <el-button type="primary" @click="submitCheckedData(true)">确认</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter_data {
  .show_checked_data_list {
    display: flex;
    justify-content: flex-start;
    height: 40px;
    > p {
      margin-right: 10px;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .el-tag {
        margin: 0 5px;
      }
    }
  }
}
</style>
