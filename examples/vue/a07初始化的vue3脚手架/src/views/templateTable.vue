<script setup lang="tsx">
import CompleteTable from '@/components/CompleteTable/CompleteTable.vue'
import type { CompleteTableType } from '@/components/CompleteTable/CompleteTableType'
import { ref, reactive } from 'vue'
import XEUtils from 'xe-utils'
//获取表格方法以及被选中的数据
const getMethodsAndItems = ref()
const hasActiveEditRow = (value: any) => {
  return getMethodsAndItems.value.tableMethods('isEditByRow', value)
}
const refresh = (value: string) => {
  getMethodsAndItems.value.tableMethods('commitProxy', value)
}
const editRowData = (value: any) => {
  getMethodsAndItems.value.tableMethods('setEditRow', value)
}
const clearRowEvent = () => {
  getMethodsAndItems.value.tableMethods('clearEdit')
}
const saveRowData = () => {
  getMethodsAndItems.value.tableMethods('commitProxy', 'save')
}
const tableConfig = reactive<CompleteTableType>({
  id: 'templateTable', //必填唯一
  height: 830,
  showFooter: true,
  formConfig: {
    titleWidth: 80,
    items: [
      {
        titleWidth: 40,
        field: 'name',
        title: '名称',
        span: 4,
        placeholder: '请输入名称',
        itemType: 'input'
      },
      {
        field: 'email',
        title: '邮件',
        span: 5,
        placeholder: '请输入邮件',
        itemType: 'input'
      },
      {
        field: 'nickname',
        title: '昵称',
        span: 5,
        placeholder: '请输入昵称',
        itemType: 'input'
      },
      {
        field: 'role',
        title: '角色',
        span: 5,
        placeholder: '请输入角色',
        itemType: 'input'
      },
      {
        field: 'sex',
        title: '性别',
        span: 5,
        placeholder: '请选择性别',
        itemType: 'select',
        options: [
          { label: '女', value: '0' },
          { label: '男', value: '1' }
        ]
      },
      {
        titleWidth: 40,
        field: 'age',
        title: '年龄',
        span: 4,
        placeholder: '请输入年龄',
        itemType: 'inputNumber',
        min: 1,
        max: 120
      },
      {
        field: 'createDate',
        title: '创建时间',
        span: 6,
        itemType: 'datePicker',
        type: 'daterange'
      },
      {
        span: 14,
        align: 'right',
        itemType: 'button'
      }
    ]
  },
  customConfig: {
    disableColumns: ['role', 'age']
  },
  editRules: {
    name: [
      { required: true, message: '姓名必须填写' },
      { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' }
    ],
    email: [{ required: true, message: '邮件必须填写' }],
    role: [{ required: true, message: '角色必须填写' }]
  },
  columns: [
    { type: 'checkbox', width: 50, fixed: 'left' },
    {
      title: '合并',
      field: '合并',
      children: [
        {
          title: '姓名',
          field: 'name',
          sortable: true,
          titlePrefix: { message: '名称必须填写！' },
          editRender: { name: '$input', props: { placeholder: '请输入名称', clearable: true } },
          slots: {
            header: () => {
              return [
                <div>
                  <p>姓名</p>
                  <p>#Name</p>
                </div>
              ]
            }
          }
        },
        {
          title: '合并2',
          field: '合并2',
          children: [
            {
              field: 'role',
              title: 'Role',
              sortable: true,
              titlePrefix: {
                useHTML: true,
                content: '角色必须填写'
              },
              filters: [
                { label: '前端开发', value: '前端' },
                { label: '后端开发', value: '后端' },
                { label: '测试', value: '测试' },
                { label: '程序员鼓励师', value: '程序员鼓励师' }
              ],
              filterMultiple: false,
              editRender: { name: '$input', props: { placeholder: '请输入角色' } }
            },
            {
              field: 'role2',
              title: 'Role2'
            }
          ]
        }
      ]
    },
    {
      showOverflow: false,
      field: 'email',
      title: 'Email',
      editRender: { name: '$input', props: { placeholder: '请输入邮件' } },
      slots: {
        default: (value: any) => {
          return [
            <>
              <p>{value.email}</p>
              <p>#Email</p>
            </>
          ]
        }
      }
    },
    {
      field: 'nickname',
      title: 'Nickname',
      editRender: { name: '$input', props: { placeholder: '请输入昵称' } }
    },
    {
      field: 'sex',
      title: 'Sex',
      filters: [
        { label: '男', value: '1' },
        { label: '女', value: '0' }
      ],
      filterMultiple: false,
      editRender: {
        name: '$select',
        options: [
          { label: '女', value: '0' },
          { label: '男', value: '1' }
        ],
        props: { placeholder: '请选择性别' }
      },
      slots: {
        default: (value: any) => {
          return [
            <>
              <span>{value.sex == 0 ? '女' : '男'}</span>
            </>
          ]
        }
      }
    },
    {
      field: 'age',
      title: 'Age',
      sortable: true,
      editRender: { name: '$input', props: { type: 'number', max: 120, min: 1 } },
      slots: {
        footer: (value) => {
          return [
            <>
              <p>{value}</p>
            </>
          ]
        }
      }
    },
    {
      field: 'amount',
      title: 'Amount',
      editRender: {
        name: '$input',
        props: { type: 'float', digits: 2, placeholder: '请输入数值' }
      }
    },
    {
      field: 'updateDate',
      title: 'Update Date',
      width: 160,
      editRender: {
        name: '$input',
        props: { type: 'datetime', placeholder: '请输入数值' }
      },
      visible: false,
      sortable: true,
      slots: {
        default: (value: any) => {
          return [
            <>
              <span>{XEUtils.toDateString(value.updateDate, 'yyyy/MM/dd HH:ss:mm')}</span>
            </>
          ]
        }
      }
    },
    {
      field: 'createDate',
      title: 'Create Date',
      width: 160,
      visible: false,
      sortable: true
    },
    {
      isBindStyle: false,
      field: '操作',
      title: '操作',
      width: '200',
      fixed: 'right',
      slots: {
        default: ({ row }) => {
          return [
            <>
              {hasActiveEditRow(row) ? (
                <>
                  <el-button text onClick={() => clearRowEvent()}>
                    <p class="color_primary">取消</p>
                  </el-button>
                  <el-button text onClick={() => saveRowData()}>
                    <p class="color_primary">保存</p>
                  </el-button>
                </>
              ) : (
                <el-button text onClick={() => editRowData(row)}>
                  <p class="color_primary">编辑</p>
                </el-button>
              )}
            </>
          ]
        }
      }
    }
  ],
  proxyConfig: {
    props: {
      result: 'result', // 配置响应结果列表字段
      total: 'page.total' // 配置响应结果总页数字段
    },
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query: ({ page, sorts, filters, formData, serveApiUrl }) => {
        //参数分别为：页码页面显示信息，排序信息，过滤信息，查询信息，基础路径
        const queryParams: any = Object.assign({}, formData)
        // 处理排序条件
        const firstSort = sorts[0]
        if (firstSort) {
          queryParams.sort = firstSort.field
          queryParams.order = firstSort.order
        }
        // 处理筛选条件
        filters.forEach(({ field, values }: any) => {
          queryParams[field] = values.join(',')
        })
        return fetch(
          `${serveApiUrl}/api/pub/page/list/${page.pageSize}/${
            page.currentPage
          }?${XEUtils.serialize(queryParams)}`
        ).then((response) => {
          return response.json()
        })
      }
      // // 当点击工具栏删除按钮或者手动提交指令 delete 时会被触发
      // delete: (params: any, baseUrl: any) => {
      //   //参数为选择的条目信息，基础路径
      //   return fetch(`${baseUrl}/api/pub/save`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(params)
      //   }).then((response) => response.json())
      // },
      // save: (params: any, baseUrl: any) => {
      //   return fetch(`${baseUrl}/api/pub/save`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(params)
      //   }).then((response) => response.json())
      // }
    }
  },
  editConfig: {
    trigger: 'click'
  },
  footerMethod: (columns: any, data: any) => {
    return [
      columns.map((column: any, columnIndex: any) => {
        if (columnIndex === 0) {
          return '平均'
        }
        if (['age'].includes(column.field)) {
          let count = 0
          data.forEach((item: string) => {
            count += Number(item[column.field])
          })
          return count / data.length
        }
        return '暂无'
      }),
      columns.map((column: any, columnIndex: any) => {
        if (columnIndex === 0) {
          return '和值'
        }
        if (['age'].includes(column.field)) {
          let count = 0
          data.forEach((item: string) => {
            count += Number(item[column.field])
          })
          return count
        }
        return '暂无'
      })
    ]
  }
})
</script>
<template>
  <div class="box_padding">
    <div class="box_padding box_shadow">
      父组件按钮栏：
      <el-button @click="refresh('query')"> 刷新（重新请求数据,query方法调用） </el-button>
      <el-button @click="refresh('insert_actived')">新增（insert_actived方法调用）</el-button>
      <el-button @click="refresh('mark_cancel')">预删除/取消（mark_cancel方法调用）</el-button>
      <el-button @click="refresh('delete')">删除（delete方法调用）</el-button>
      <el-button @click="refresh('save')">保存（save方法调用）</el-button>
      <CompleteTable :tableConfig="tableConfig" ref="getMethodsAndItems">
        <template #add_operate_before>
          <div style="padding: 0 14px">
            <el-button>前添加额外操作（插槽名为：add_operate_before）</el-button>
          </div>
        </template>
        <template #add_operate_after>
          <div style="padding: 0 14px">
            <el-button>后添加额外操作（插槽名为：add_operate_after）</el-button>
          </div>
        </template>
      </CompleteTable>
    </div>
  </div>
</template>
