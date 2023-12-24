<script setup lang="tsx">
import {
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch
} from 'vue'
import { VXETable, type VxeGridInstance, type VxeGridProps, type VxeGridListeners } from 'vxe-table'
import Sortable from 'sortablejs'
import _ from 'lodash'
const props = defineProps(['tableConfig'])
//查询表单数据绑定
const formData = ref<any>({})
//是否修改分页(判断是否需要重新调用接口)
const isQuery = ref<boolean>(true)
const currentOperation = ref<string>('')
const isQueryData = (value: string) => {
  isQuery.value = false
  currentOperation.value = value
  setTimeout(() => {
    isQuery.value = true
    currentOperation.value = ''
  }, 0)
}
//展示模式
const currentMode = ref<string>('span')
interface RowVO {
  [key: string]: any
}
//颜色选择
const showColorSet = ref<boolean>(false)
const fontColor = ref<string>('#606266')
const cellHeaderColor = ref<string>('#f8f8f9')
const cellBodyColor = ref<string>('rgba(255, 255, 255, 1)')
const cellFooterColor = ref<string>('rgba(255, 255, 255, 1)')
const rowCheckedColor = ref<string>('rgba(255, 243, 224, 1)')
//自动生成高亮色
const cellBodyColorHover = computed(() => {
  if (cellBodyColor.value) {
    let rgbaColor: any = cellBodyColor.value.slice(5, -1).split(',')
    for (let i = 0; i < 3; i++) {
      if (rgbaColor[i] * 1 > 127.5) {
        rgbaColor[i] = rgbaColor[i] * 1 - 15
      } else {
        rgbaColor[i] = rgbaColor[i] * 1 + 15
      }
    }
    return `rgba(${rgbaColor.join(',')})`
  } else {
    return 'rgba(248, 248, 248, 1)'
  }
})
const rowCheckedColorHover = computed(() => {
  if (rowCheckedColor.value) {
    let rgbaColor: any = rowCheckedColor.value.slice(5, -1).split(',')
    for (let i = 0; i < 3; i++) {
      if (rgbaColor[i] * 1 > 127.5) {
        rgbaColor[i] = rgbaColor[i] * 1 - 15
      } else {
        rgbaColor[i] = rgbaColor[i] * 1 + 15
      }
    }
    return `rgba(${rgbaColor.join(',')})`
  } else {
    return 'rgba(248, 248, 248, 1)'
  }
})
const resetColor = () => {
  fontColor.value = '#606266'
  cellHeaderColor.value = '#f8f8f9'
  cellBodyColor.value = 'rgba(255, 255, 255, 1)'
  cellFooterColor.value = 'rgba(255, 255, 255, 1)'
  rowCheckedColor.value = 'rgba(255, 243, 224, 1)'
  if (localStorage.getItem('VXE_TABLR_COLOR')) {
    const colorConfig = JSON.parse(localStorage.getItem('VXE_TABLR_COLOR') as string)
    colorConfig[props.tableConfig.id] = {}
    localStorage.setItem('VXE_TABLR_COLOR', JSON.stringify(colorConfig))
  }
  showColorSet.value = false
}
const saveColor = () => {
  if (
    props.tableConfig.customConfig?.storage === undefined ||
    props.tableConfig.customConfig?.storage
  ) {
    const saveColorConfig = {
      [props.tableConfig.id]: {
        fontColor: fontColor.value,
        cellHeaderColor: cellHeaderColor.value,
        cellBodyColor: cellBodyColor.value,
        cellFooterColor: cellFooterColor.value,
        rowCheckedColor: rowCheckedColor.value
      }
    }
    localStorage.setItem('VXE_TABLR_COLOR', JSON.stringify(saveColorConfig))
  }
  showColorSet.value = false
}
//重新排序
const resetSort = () => {
  const $grid: any = xGrid.value
  let Sort: any = localStorage.getItem('VXE_TABLE_SORT_COLUMNS')
  if (Sort) {
    Sort = JSON.parse(Sort)
    Sort[props.tableConfig.id] = []
    localStorage.setItem('VXE_TABLE_SORT_COLUMNS', JSON.stringify(Sort))
  }
  $grid.loadColumn(props.tableConfig.columns)
}
//修改样式
const changStyle = (value: string) => {
  switch (value) {
    case 'span': {
      currentMode.value = 'span'
      break
    }
    case 'tag': {
      currentMode.value = 'tag'
      break
    }
    case 'button': {
      currentMode.value = 'button'
      break
    }
  }
}

const xGrid = ref<VxeGridInstance>()

const gridOptions = reactive<VxeGridProps<RowVO>>({
  align: props.tableConfig.align || 'left',
  border: true,
  showHeaderOverflow: true,
  showOverflow: true,
  keepSource: true,
  id: props.tableConfig.id,
  height: props.tableConfig.height,
  maxHeight: props.tableConfig.maxHeight,
  showFooter: props.tableConfig.showFooter || false,
  rowConfig: {
    keyField: 'id',
    isHover: true
  },
  columnConfig: {
    resizable: true,
    useKey: true
  },
  ...(props.tableConfig.treeConfig ? { treeConfig: { ...props.tableConfig.treeConfig } } : {}),
  customConfig: {
    //是否会保存配置
    storage:
      props.tableConfig.customConfig?.storage !== undefined
        ? props.tableConfig.customConfig?.storage
        : true,
    //设置不可操作的列
    checkMethod({ column }) {
      if (props.tableConfig.customConfig?.disableColumns?.includes(column.field as never)) {
        return false
      }
      return true
    }
  },
  // printConfig: {
  //   columns: [
  //     { field: 'name' },
  //     { field: 'email' },
  //     { field: 'nickname' },
  //     { field: 'age' },
  //     { field: 'amount' }
  //   ]
  // },
  sortConfig: {
    trigger: 'cell',
    //是否重新加载数据（是否全列表排序）
    remote:
      props.tableConfig.sortConfig?.remote !== undefined
        ? props.tableConfig.sortConfig?.remote
        : true
  },
  filterConfig: {
    remote:
      props.tableConfig.filterConfig?.remote !== undefined
        ? props.tableConfig.filterConfig?.remote
        : true
  },
  pagerConfig:
    props.tableConfig.pagerConfig !== undefined
      ? props.tableConfig.pagerConfig === false
        ? undefined
        : props.tableConfig.pagerConfig
      : {
          pageSize: 10,
          pageSizes: [5, 10, 15, 20, 50, 100],
          layouts: [
            'Sizes',
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'FullJump',
            'Total'
          ]
        },
  //输入框查询配置
  formConfig: {
    titleWidth: props.tableConfig.formConfig?.titleWidth,
    titleAlign: props.tableConfig.formConfig?.titleAlign || 'right',
    items: []
  },
  toolbarConfig: {
    perfect: true,
    buttons: props.tableConfig.toolbarConfig?.buttons || [
      { code: 'insert_actived', name: '新增', status: 'perfect', icon: 'vxe-icon-add' },
      { code: 'mark_cancel', name: '预删除/取消', status: 'perfect', icon: 'vxe-icon-fixed' },
      { code: 'delete', name: '直接删除', status: 'perfect', icon: 'vxe-icon-delete' },
      { code: 'save', name: '保存', status: 'perfect', icon: 'vxe-icon-save' }
    ],
    slots: {
      tools: 'toolbar_tools'
    },
    refresh:
      props.tableConfig.toolbarConfig?.refresh !== undefined
        ? props.tableConfig.toolbarConfig.refresh
        : true, // 显示刷新按钮
    import:
      props.tableConfig.toolbarConfig?.import !== undefined
        ? props.tableConfig.toolbarConfig.import
        : false, // 显示导入按钮
    export:
      props.tableConfig.toolbarConfig?.export !== undefined
        ? props.tableConfig.toolbarConfig.export
        : false, // 显示导出按钮
    print:
      props.tableConfig.toolbarConfig?.print !== undefined
        ? props.tableConfig.toolbarConfig.print
        : false, // 显示打印按钮
    zoom:
      props.tableConfig.toolbarConfig?.zoom !== undefined
        ? props.tableConfig.toolbarConfig.zoom
        : true, // 显示全屏按钮
    custom:
      props.tableConfig.toolbarConfig?.custom !== undefined
        ? props.tableConfig.toolbarConfig.custom
        : {
            icon: 'vxe-icon-menu'
          } // 显示自定义列按钮
  },
  proxyConfig: {
    seq: false, // 启用动态序号代理，每一页的序号会根据当前页数变化
    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
    form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
    props: {
      // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
      result: props.tableConfig.proxyConfig?.props?.result, // 配置响应结果列表字段
      total: props.tableConfig.proxyConfig?.props?.total // 配置响应结果总页数字段
    },
    // 只接收Promise，具体实现自由发挥
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query:
        props.tableConfig.pagerConfig !== false
          ? ({ page, sorts, filters }) => {
              return new Promise((resolve) => {
                const value = {
                  page: page,
                  formData: formData.value,
                  filters: filters,
                  sorts: sorts,
                  isQuery: true,
                  currentOperation: ''
                }
                resolve(value)
              }).then((value: any) => {
                value.isQuery = isQuery.value
                value.currentOperation = currentOperation.value
                return props.tableConfig.proxyConfig.ajax.query(value)
              })
            }
          : ({ sorts, filters }) => {
              const value = {
                formData: formData.value,
                filters: filters,
                sorts: sorts
              }
              return props.tableConfig.proxyConfig.ajax.query(value)
            },
      // 当点击工具栏删除按钮或者手动提交指令 delete 时会被触发
      delete: ({ body }) => {
        return props.tableConfig.proxyConfig.ajax.delete(body)
      },
      // 当点击工具栏保存按钮或者手动提交指令 save 时会被触发
      save: ({ body }) => {
        return props.tableConfig.proxyConfig.ajax.save(body)
      }
    }
  },
  columns: [],
  // importConfig: {
  //   remote: true,
  //   types: ['xlsx'],
  //   modes: ['insert'],
  //   // 自定义服务端导入
  //   importMethod({ file }) {
  //     const $grid = xGrid.value
  //     const formBody = new FormData()
  //     formBody.append('file', file)
  //     return fetch(`${serveApiUrl}/api/pub/import`, { method: 'POST', body: formBody })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         VXETable.modal.message({
  //           content: `成功导入 ${data.result.insertRows} 条记录！`,
  //           status: 'success'
  //         })
  //         // 导入完成，刷新表格
  //         if ($grid) {
  //           $grid.commitProxy('query')
  //         }
  //       })
  //       .catch(() => {
  //         VXETable.modal.message({ content: '导入失败，请检查数据是否正确！', status: 'error' })
  //       })
  //   }
  // },
  // exportConfig: {
  //   remote: true,
  //   types: ['xlsx'],
  //   modes: ['current', 'selected', 'all'],
  //   // 自定义服务端导出
  //   exportMethod({ options }) {
  //     const $grid = xGrid.value
  //     if ($grid) {
  //       const proxyInfo = $grid.getProxyInfo()
  //       // 传给服务端的参数
  //       const body = {
  //         filename: options.filename,
  //         sheetName: options.sheetName,
  //         isHeader: options.isHeader,
  //         original: options.original,
  //         mode: options.mode,
  //         pager: proxyInfo ? proxyInfo.pager : null,
  //         ids: options.mode === 'selected' ? options.data.map((item) => item.id) : [],
  //         fields: options.columns.map((column) => {
  //           return {
  //             field: column.field,
  //             title: column.title
  //           }
  //         })
  //       }
  //       // 开始服务端导出
  //       return fetch(`${serveApiUrl}/api/pub/export`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(body)
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (data.id) {
  //             VXETable.modal.message({ content: '导出成功，开始下载', status: 'success' })
  //             // 读取路径，请求文件
  //             fetch(`${serveApiUrl}/api/pub/export/download/${data.id}`).then((response) => {
  //               response.blob().then((blob) => {
  //                 // 开始下载
  //                 VXETable.saveFile({ filename: '导出数据', type: 'xlsx', content: blob })
  //               })
  //             })
  //           }
  //         })
  //         .catch(() => {
  //           VXETable.modal.message({ content: '导出失败！', status: 'error' })
  //         })
  //     }
  //     return Promise.resolve()
  //   }
  // },
  checkboxConfig: {
    reserve: true,
    highlight: true,
    // 有treeConfig时，range配置为false，否则控制报错
    ...(props.tableConfig.checkboxConfig?.range === false
      ? {}
      : {
          range: true
        }),
    showHeader: props.tableConfig.checkboxConfig?.showHeader || false,
    checkStrictly: props.tableConfig.checkboxConfig?.checkStrictly || false,
    checkMethod: props.tableConfig.checkboxConfig?.checkMethod
      ? props.tableConfig.checkboxConfig?.checkMethod
      : ({ row }) => true
  },
  radioConfig: {
    reserve: true,
    highlight: true
  },
  editRules: props.tableConfig.editRules,

  editConfig: {
    trigger: props.tableConfig.editConfig?.trigger || 'manual',
    mode: 'row',
    showStatus: true
  },
  footerMethod: props.tableConfig.footerMethod
    ? ({ columns, data }) => {
        return props.tableConfig.footerMethod(columns, data)
      }
    : undefined
})
//被选择的数据传递
const checkItems = ref<any>([])
const gridEvents: VxeGridListeners = {
  checkboxChange(params: any) {
    checkItems.value = params.records
  },
  checkboxAll(params: any) {
    checkItems.value = params.records
  }
}
//传递表格方法
const tableMethods = (tableMethods: string, value: any) => {
  const $grid: any = xGrid.value
  if (value?.constructor === Array) {
    return $grid[tableMethods](...value)
  } else {
    return $grid[tableMethods](value)
  }
}
// 传递表格方法以及被选的数据
defineExpose({ tableMethods, checkItems })
//判断是否有data?
if (props.tableConfig.data) {
  gridOptions.proxyConfig = undefined
  gridOptions.data = props.tableConfig.data as []
  watch(props.tableConfig.data, () => {
    const $grid: any = xGrid.value
    $grid.reloadData(props.tableConfig.data)
  })
}
//多选单选触发事件
const emits = defineEmits(['exportCheckedData', 'exportRadioData'])
const exportCheckedData = (value: any) => {
  emits('exportCheckedData', value)
}
const exportRadioData = (value: any) => {
  emits('exportRadioData', value)
}
//#region 拖拽方法
let sortable: any
const columnDrop = () => {
  nextTick(() => {
    const $grid: any = xGrid.value
    sortable = Sortable.create(
      $grid?.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
      {
        handle: '.vxe-header--column',
        filter: '.col--fixed',
        animation: 150,
        ghostClass: 'drop_background_color',
        onFilter: function (event: any) {
          event.target.onmouseleave = () => {
            VXETable.modal.message({
              content: '固定栏不可拖拽',
              status: 'warning'
            })
            event.target.onmouseleave = null
          }
          event.target.onclick = () => {
            event.target.onmouseleave = null
          }
        },
        onEnd: ({ newIndex, oldIndex, item }: any) => {
          const { collectColumn } = $grid.getTableColumn() //获取当前表格的列,全量表头列和当前渲染中的表头列
          // 递归方法获取可视列
          const filterColumn = (Array: []): any => {
            return Array.filter((item: any) => {
              if (!item.children) {
                return item.visible
              } else {
                return filterColumn(item.children)
              }
            })
          }
          const wrapperElem = item.parentNode as HTMLElement
          const tableColumn = filterColumn(collectColumn)
          const newColumn = tableColumn[newIndex]
          if (newColumn.fixed) {
            // 错误的移动
            const oldThElem = wrapperElem.children[oldIndex] as HTMLElement
            if (newIndex > oldIndex) {
              wrapperElem.insertBefore(item, oldThElem)
            } else {
              wrapperElem.insertBefore(item, oldThElem ? oldThElem.nextElementSibling : oldThElem)
            }
            VXETable.modal.message({
              content: '固定栏不可拖拽',
              status: 'warning'
            })
            return
          }
          // 获取列索引 columnIndex > fullColumn
          const oldColumnIndex = $grid.getColumnIndex(tableColumn[oldIndex])
          const newColumnIndex = $grid.getColumnIndex(tableColumn[newIndex])
          // 移动到目标列
          collectColumn.splice(newColumnIndex, 0, collectColumn.splice(oldColumnIndex, 1)[0])
          const saveSort: string[] = []
          collectColumn.forEach((item: any) => {
            if (item.field) {
              saveSort.push(item.field)
            } else if (item.type) {
              saveSort.push(item.type)
            }
          })
          $grid.loadColumn(collectColumn)
          nextTick(() => {
            if (
              props.tableConfig.customConfig?.storage === undefined ||
              props.tableConfig.customConfig?.storage
            ) {
              let Sort: any = localStorage.getItem('VXE_TABLE_SORT_COLUMNS')
              Sort ? (Sort = JSON.parse(Sort)) : (Sort = {})
              Sort[props.tableConfig.id] = saveSort
              localStorage.setItem('VXE_TABLE_SORT_COLUMNS', JSON.stringify(Sort))
            }
          })
        }
      }
    )
  })
}
//#endregion
const clearAllFormData = (value: any) => {
  for (let key in value) {
    if (typeof value[key] === 'object' && value[key] !== null) {
      clearAllFormData(value[key])
    } else {
      value[key] = undefined
    }
  }
}

const cloneFormConfigItems = ref<any>([])
if (props.tableConfig.formConfig) {
  cloneFormConfigItems.value = _.cloneDeep(props.tableConfig.formConfig.items)
  cloneFormConfigItems.value.forEach((item: any) => {
    if (item.addButton) {
      item.disabledDelet = true
    }
  })
}
//查询栏配置方法
const toFormConfigItems = (value: any) => {
  gridOptions.formConfig!.items = []
  value.forEach((item: any) => {
    gridOptions.formConfig?.items?.push(
      item.itemType === 'button'
        ? {
            span: item.span,
            align: item.align,
            slots: {
              default: () => {
                return [
                  <div>
                    <vxe-button type="submit" status="primary" content="查询"></vxe-button>
                    <vxe-button
                      type="submit"
                      onClick={() => clearAllFormData(formData.value)}
                      content="重置"
                    ></vxe-button>
                  </div>
                ]
              }
            }
          }
        : {
            titleWidth: item.titleWidth,
            field: item.field,
            title: item.title,
            span: item.span,
            slots: {
              default: item.field
            }
          }
    )
    if (item.itemType !== 'button' && item.itemType !== 'selectInput') {
      if (!formData.value[item.field] === undefined) {
        formData.value[item.field] = undefined
      }
    } else if (item.itemType === 'selectInput') {
      if (!formData.value[item.field]) {
        formData.value[item.field] = {}
      }
    }
  })
}
toFormConfigItems(cloneFormConfigItems.value)
const addSelectInput = (value: any) => {
  for (let index = 0; index < cloneFormConfigItems.value.length; index++) {
    if (cloneFormConfigItems.value[index].addButton) {
      cloneFormConfigItems.value.splice(index + 1, 0, _.cloneDeep(value))
      value.span -= 2
      value.addButton = false
      cloneFormConfigItems.value[index + 1].field += index + 1
      cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span -= value.span
      if (cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span < 0) {
        cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span = 22 - value.span
      }
      toFormConfigItems(cloneFormConfigItems.value)
      break
    }
  }
  for (let index = 0; index < cloneFormConfigItems.value.length; index++) {
    if (cloneFormConfigItems.value[index].itemType === 'selectInput') {
      cloneFormConfigItems.value[index].disabledDelet = false
    }
  }
}
const deleteSelectInput = (value: any) => {
  formData.value[value.field] = {}
  let selectInputSum = 0
  for (let index = 0; index < cloneFormConfigItems.value.length; index++) {
    if (cloneFormConfigItems.value[index].field === value.field) {
      cloneFormConfigItems.value.splice(index, 1)
    }
    if (cloneFormConfigItems.value[index].itemType === 'selectInput') {
      selectInputSum++
    }
  }
  if (selectInputSum <= 1) {
    for (let index = 0; index < cloneFormConfigItems.value.length; index++) {
      if (cloneFormConfigItems.value[index].itemType === 'selectInput') {
        cloneFormConfigItems.value[index].disabledDelet = true
      }
    }
  }
  const lastItem = cloneFormConfigItems.value[cloneFormConfigItems.value.length - 2]
  if (!lastItem.addButton) {
    lastItem.addButton = true
    lastItem.span += 2
    cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span += value.span - 2
  } else {
    cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span += value.span
  }
  if (cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span >= 22) {
    cloneFormConfigItems.value[cloneFormConfigItems.value.length - 1].span = 2
  }
  toFormConfigItems(cloneFormConfigItems.value)
}

onBeforeMount(() => {
  //表格操作按钮显示
  const toolbarButton = gridOptions.toolbarConfig?.buttons?.filter((item) => {
    if (props.tableConfig.toolbarConfig) {
      if (props.tableConfig.toolbarConfig[item.code] === false) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  })
  gridOptions.toolbarConfig!.buttons = toolbarButton
  //列重新排序
  const Sort = JSON.parse(localStorage.getItem('VXE_TABLE_SORT_COLUMNS') as string)
  Sort && JSON.stringify(Sort[props.tableConfig.id]) !== '[]' && Sort[props.tableConfig.id]
    ? Sort[props.tableConfig.id].forEach((sortItem: any) => {
        props.tableConfig.columns.forEach((item: any) => {
          if (sortItem == item.field) {
            gridOptions.columns?.push(item)
          } else if (sortItem == item.type) {
            gridOptions.columns?.push(item)
          }
        })
      })
    : (gridOptions.columns = props.tableConfig.columns)
  //绑定递归绑定样式
  const bindStyle = (Array: any = []) => {
    Array?.forEach((item: any) => {
      if (item.isBindStyle !== false) {
        if (!item.children) {
          if (!item.type) {
            if (!item.slots) {
              item.slots = {}
            }
            const elementBody = item.slots.default
            const elementFooter = item.slots.footer
            item.slots.default = ({ row }: any) => {
              let rowValue
              if (elementBody) {
                rowValue = elementBody(row)
                if (rowValue || rowValue === 0) {
                  switch (currentMode.value) {
                    case 'span': {
                      return [<>{rowValue}</>]
                    }
                    case 'tag': {
                      return [
                        <>
                          {rowValue[0].children.map((element: any) =>
                            element.children[0] === undefined || element.children[0] === '' ? (
                              <element.type></element.type>
                            ) : (
                              <element.type>
                                <el-tag>{element}</el-tag>
                              </element.type>
                            )
                          )}
                        </>
                      ]
                    }
                    case 'button': {
                      return [
                        <>
                          {rowValue[0].children.map((element: any) =>
                            element.children[0] === undefined || element.children[0] === '' ? (
                              <element.type></element.type>
                            ) : (
                              <element.type>
                                <el-button>{element}</el-button>
                              </element.type>
                            )
                          )}
                        </>
                      ]
                    }
                  }
                }
              } else {
                rowValue = row[item.field]
                if (rowValue || rowValue === 0) {
                  switch (currentMode.value) {
                    case 'span': {
                      return [<>{rowValue}</>]
                    }
                    case 'tag': {
                      return [<el-tag>{rowValue}</el-tag>]
                    }
                    case 'button': {
                      return [<el-button>{rowValue}</el-button>]
                    }
                  }
                }
              }
            }
            item.slots.footer = ({ items, _columnIndex }: any) => {
              let rowValue
              if (elementFooter) {
                rowValue = elementFooter(items[_columnIndex])
                if (rowValue || rowValue === 0) {
                  switch (currentMode.value) {
                    case 'span': {
                      return [<>{rowValue}</>]
                    }
                    case 'tag': {
                      return [
                        <>
                          {rowValue[0].children.map((element: any) =>
                            element.children[0] !== undefined ? (
                              <element.type>
                                <el-tag>{element}</el-tag>
                              </element.type>
                            ) : (
                              <element.type></element.type>
                            )
                          )}
                        </>
                      ]
                    }
                    case 'button': {
                      return [
                        <>
                          {rowValue[0].children.map((element: any) =>
                            element.children[0] !== undefined ? (
                              <element.type>
                                <el-button>{element}</el-button>
                              </element.type>
                            ) : (
                              <element.type></element.type>
                            )
                          )}
                        </>
                      ]
                    }
                  }
                }
              } else {
                rowValue = items[_columnIndex]
                if (rowValue || rowValue === 0) {
                  switch (currentMode.value) {
                    case 'span': {
                      return [<>{rowValue}</>]
                    }
                    case 'tag': {
                      return [<el-tag>{rowValue}</el-tag>]
                    }
                    case 'button': {
                      return [<el-button>{rowValue}</el-button>]
                    }
                  }
                }
              }
            }
          }
        } else {
          bindStyle(item.children)
        }
      }
    })
  }
  bindStyle(gridOptions.columns)
  //颜色读取
  const colorConfig = JSON.parse(localStorage.getItem('VXE_TABLR_COLOR') as string)
  if (
    colorConfig &&
    JSON.stringify(colorConfig[props.tableConfig.id]) !== '{}' &&
    colorConfig[props.tableConfig.id]
  ) {
    fontColor.value = colorConfig[props.tableConfig.id].fontColor
    cellHeaderColor.value = colorConfig[props.tableConfig.id].cellHeaderColor
    cellBodyColor.value = colorConfig[props.tableConfig.id].cellBodyColor
    rowCheckedColor.value = colorConfig[props.tableConfig.id].rowCheckedColor
  }
})

let initTime: any
onMounted(() => {
  initTime = setTimeout(() => {
    columnDrop()
  }, 100)
})
onUnmounted(() => {
  clearTimeout(initTime)
  if (sortable) {
    sortable.destroy()
  }
})
</script>
<template>
  <div>
    <vxe-grid
      @sort-change="isQueryData('sort')"
      @filter-change="isQueryData('filter')"
      @page-change="isQueryData('page')"
      @checkbox-change="exportCheckedData"
      @checkbox-all="exportCheckedData"
      @radio-change="exportRadioData"
      ref="xGrid"
      v-bind="gridOptions"
      class="complete_table"
      v-on="gridEvents"
    >
      <template #toolbar_tools>
        <slot name="add_operate_before"></slot>
        <el-button
          v-if="
            props.tableConfig.toolbarConfig?.resetSort === undefined
              ? true
              : props.tableConfig.toolbarConfig?.resetSort
          "
          class="toolbar_button_style"
          @click="resetSort"
          text
          icon="Switch"
        >
          还原排序
        </el-button>
        <el-dropdown
          v-if="
            props.tableConfig.toolbarConfig?.tableStyle === undefined
              ? true
              : props.tableConfig.toolbarConfig?.tableStyle
          "
          trigger="click"
        >
          <el-button class="toolbar_button_style" text icon="SetUp"> 表格样式 </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changStyle('span')">默认</el-dropdown-item>
              <el-dropdown-item @click="changStyle('tag')">标签</el-dropdown-item>
              <el-dropdown-item @click="changStyle('button')">按钮</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-popover
          v-if="
            props.tableConfig.toolbarConfig?.colorSet === undefined
              ? true
              : props.tableConfig.toolbarConfig?.colorSet
          "
          :visible="showColorSet"
          placement="right"
          :width="360"
        >
          <template #reference>
            <el-button class="toolbar_button_style" @click="showColorSet = true" text icon="Brush">
              颜色设置
            </el-button>
          </template>
          <el-row>
            <el-col :span="8">
              <el-color-picker
                show-alpha
                size="small"
                v-model="cellHeaderColor"
                :predefine="['#f8f8f9']"
              />&nbsp;表头颜色
            </el-col>
            <el-col :span="8">
              <el-color-picker
                show-alpha
                size="small"
                v-model="cellBodyColor"
                :predefine="['#ffffff']"
              />&nbsp;表格颜色
            </el-col>
            <el-col :span="8">
              <el-color-picker
                show-alpha
                size="small"
                v-model="cellFooterColor"
                :predefine="['#ffffff']"
              />&nbsp;表尾颜色
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="8">
              <el-color-picker
                show-alpha
                size="small"
                v-model="fontColor"
                :predefine="['#606266']"
              />&nbsp;文字颜色
            </el-col>
            <el-col :span="8">
              <el-color-picker
                show-alpha
                size="small"
                v-model="rowCheckedColor"
                :predefine="['#fff3e0']"
              />&nbsp;选中行颜色
            </el-col>
          </el-row>
          <el-divider style="margin: 12px 0" />
          <el-row>
            <el-col style="display: flex; justify-content: center" :span="12">
              <el-button plain @click="saveColor" style="border: none; width: 100%">
                确认
              </el-button>
            </el-col>
            <el-col style="display: flex; justify-content: center" :span="12">
              <el-button plain @click="resetColor" style="border: none; width: 100%">
                还原
              </el-button>
            </el-col>
          </el-row>
        </el-popover>
        <slot name="add_operate_after"></slot>
      </template>
      <template v-for="item in cloneFormConfigItems" #[item.field]>
        <el-input
          :key="item.field"
          v-if="item.itemType == 'input'"
          v-model="formData[item.field]"
          :placeholder="item.placeholder"
        />
        <el-input-number
          :key="item.field"
          v-if="item.itemType == 'inputNumber'"
          v-model="formData[item.field]"
          :placeholder="item.placeholder"
          controls-position="right"
          :min="item.min"
          :max="item.max"
          :precision="item.precision"
          :step="item.step"
        />
        <el-select
          :key="item.field"
          v-if="item.itemType == 'select'"
          v-model="formData[item.field]"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-row v-if="item.itemType == 'selectInput'" :key="item.field">
          <el-col :span="item.addButton ? 17 : 24" style="padding-right: 20px">
            <el-input v-model="formData[item.field][item.selectValue]">
              <template #prepend>
                <el-select
                  v-model="item.selectValue"
                  :style="{
                    width: `${item.selectWidth}px`
                  }"
                  @change="formData[item.field] = {}"
                >
                  <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              <template #append>
                <el-button
                  icon="Delete"
                  @click="deleteSelectInput(item)"
                  :disabled="item.disabledDelet"
                ></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col v-if="item.addButton" :span="7" style="padding-left: 10px">
            <el-button icon="Plus" @click="addSelectInput(item)">条件</el-button>
          </el-col>
        </el-row>
        <el-date-picker
          :key="item.field"
          v-if="item.itemType === 'datePicker'"
          v-model="formData[item.field]"
          :type="item.type"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </template>
    </vxe-grid>
  </div>
</template>
<style lang="scss">
.complete_table {
  //颜色绑定
  .vxe-toolbar,
  .vxe-table--header-wrapper {
    background-color: v-bind(cellHeaderColor) !important;
  }
  .vxe-table--body-wrapper {
    color: v-bind(fontColor) !important;
    background-color: v-bind(cellBodyColor) !important;
  }
  .vxe-table--body .row--checked {
    background-color: v-bind(rowCheckedColor);
  }
  .vxe-table--footer-wrapper {
    background-color: v-bind(cellFooterColor) !important;
  }
  //hover时颜色
  .row--hover {
    background-color: v-bind(cellBodyColorHover) !important;
  }
  .row--checked.row--hover {
    background-color: v-bind(rowCheckedColorHover) !important;
  }
  .vxe-cell {
    .vxe-cell--title {
      color: v-bind(fontColor);
    }
    .vxe-cell--edit-icon,
    .vxe-cell-help-icon {
      color: v-bind(fontColor);
    }
    input {
      color: v-bind(fontColor);
    }
    span {
      color: v-bind(fontColor);
    }
  }
  .vxe-toolbar {
    > div {
      button {
        span,
        i {
          color: v-bind(fontColor);
        }
      }
      .vxe-button--dropdown-panel {
        span {
          color: #606266;
        }
      }
    }
    .vxe-button.type--button.is--circle {
      background-color: v-bind(cellBodyColor);
    }
    button:hover {
      background-color: v-bind(cellBodyColor) !important;
    }
    .el-button.is-text:not(.is-disabled):focus {
      background-color: v-bind(cellBodyColor);
    }
  }
  //其他样式
  .vxe-buttons--wrapper {
    flex-grow: 0;
  }
  .vxe-tools--wrapper {
    flex-grow: 1;
  }

  .theme--perfect {
    background-color: transparent !important;
    border-color: transparent !important;
  }
  .theme--perfect:hover {
    background-color: v-bind(cellBodyColor) !important;
  }
  .el-input-number,
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
    .el-input__wrapper {
      padding-left: 11px !important;
    }
  }

  .vxe-grid--toolbar-wrapper {
    margin-top: 20px;
    .vxe-toolbar {
      padding: 8px 10px;
    }
  }
  .vxe-pager {
    align-items: end;
  }
}
.is--maximize {
  .vxe-grid--toolbar-wrapper {
    margin-top: 0;
  }
}
.drop_background_color {
  background-color: $color-primary;
}
//修改颜色样式与$color-primary一致
.theme--primary {
  border-color: $color-primary !important;
  background-color: $color-primary !important;
}
.theme--primary:hover {
  border-color: #5ca0f9 !important;
  background-color: #5ca0f9 !important;
}
.is--checked,
.is--indeterminate,
.vxe-icon-checkbox-indeterminate,
.vxe-icon-checkbox-checked {
  color: $color-primary !important;
}
.is--disabled.vxe-custom--option {
  color: #bfbfbf !important;
}
.is--disabled.vxe-custom--option .vxe-checkbox--icon {
  color: #dcdfe6 !important;
}
</style>
