<script setup lang="tsx">
import { ref, reactive } from 'vue'
// import { JTable } from '@jrj-front-end/jrj-ui'
const header = ref('测试组件')
// const tableConfig = reactive<any>({
//   id: 'deviceAndonTable', //必填唯一
//   align: 'center',
//   height: 770,
//   toolbarConfig: {
//     insert_actived: false,
//     mark_cancel: false,
//     delete: false,
//     save: false
//   },
//   columns: [
//     {
//       field: 'name',
//       title: '设备名称',
//       sortable: true
//     },
//     {
//       field: 'code',
//       title: '编码',
//       sortable: true
//     },
//     {
//       field: 'state',
//       title: '状态',
//       sortable: true
//     },
//     {
//       field: '操作',
//       title: '操作',
//       fixed: 'right',
//       width: 80,
//       isBindStyle: false,
//       slots: {
//         default: () => {
//           return [
//             <>
//               <el-button text>
//                 <p class="color_primary">报修</p>
//               </el-button>
//             </>
//           ]
//         }
//       }
//     }
//   ],
//   data: [
//     {
//       name: '全自动模切机',
//       code: 'SMQ162001',
//       state: '正常'
//     }
//   ]
// })
</script>

<template>
  <div class="HelloWorld">
    <div class="header">
      {{ header }}
    </div>
    <div class="content">
      <!-- <j-div  :content="123"></j-div> -->
      <!-- <j-table :tableConfig="tableConfig"></j-table> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
$headerHeight: 30px;
.HelloWorld {
  height: 100%;
  width: 100%;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: $headerHeight;
    border: 1px solid black;
  }
  .content {
    width: 100%;
    height: calc(100vh - $headerHeight);
    border: 1px solid yellowgreen;
  }
}
</style>
