<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { DemoApi, JrjUtils, demoCom, Jrjobject, SimpleFormModal, SimpleFormModalType } from 'demo-component/lib/index'
import { tempObj, tempJrjObject, tempJrjObjectGroup, tempSelectObj, tempSelectArr } from '../mock/defaultData'

const fullScreen = () => {
  JrjUtils.FullScreen()
}

const getIp = () => {
  ElMessage({
    message: 'ip:' + JrjUtils.getIp(0),
    type: 'success'
  })
}

const objToJrjObject = () => {
  console.log('当前obj:', tempObj)
  console.log('转换之后的jrjObject:', JrjUtils.dataStructureConversion(tempObj))
  ElMessage({
    message: 'objToJrjObject转换成功，详细信息见控制台',
    type: 'success'
  })
}

const jrjObjectToObj = () => {
  console.log('当前jrjObject:', tempJrjObject)
  console.log('转换之后的obj:', JrjUtils.dataStructureConversion(tempJrjObject))
  ElMessage({
    message: 'jrjObjectToObj转换成功，详细信息见控制台',
    type: 'success'
  })
}

const getSingleJrjObject = () => {
  console.log('当前组合的JrjObject对象:', tempJrjObjectGroup)
  console.log('获取类为MesMaintainListTemplate的对象为:', JrjUtils.splitObj(tempJrjObjectGroup as Jrjobject, 'MesMaintainListTemplate'))
  ElMessage({
    message: '获取单个JrjObject对象成功，详细信息见控制台',
    type: 'success'
  })
}

const objToSelectArr = () => {
  console.log('当前字典对象:', tempSelectObj)
  console.log('转换完的:', JrjUtils.objToSelectArr(tempSelectObj))
  ElMessage({
    message: '对象字典转select数组，详细信息见控制台',
    type: 'success'
  })
}

const selectArrToObj = () => {
  console.log('当前select数组对象:', tempSelectArr)
  console.log('转换完的:', JrjUtils.selectArrToObj(tempSelectArr))
  ElMessage({
    message: 'select数组转对象字典成功，详细信息见控制台',
    type: 'success'
  })
}

//#region 动态表单弹框组件
const MesPart__StateDic = {
  '0': '未分派',
  '1': '已分派',
  '2': '完成结束'
}
const SourceTypeDic = {
  '1': '自制件',
  '2': '外购件',
  '3': '外协件',
  '4': '标准件'
}
const productionLineDic = {
  '51': 'QF50随车起重机装配线',
  '102': 'QF25零部件总成智能焊接线',
  '151': 'QF15底座立柱智能化生产线',
  '152': 'QF20随车吊吊臂智能化生产线',
  '153': 'QF30汽车吊转台车架智能焊接线',
  '154': 'QF35小箱体智能化焊接线',
  '155': 'QF40汽车吊吊臂智能化生产线',
  '156': 'QF45起重机涂装线',
  '201': 'QF05起重机下料中心',
  '202': 'QF10起重机机加中心',
  '251': 'QF55汽车起重机装配线',
  '501': '半挂产线',
  '551': 'ZX08自卸装配线',
  '651': '444444444',
  '701': 'aaaaa',
  '702': 'gggggggg',
  '703': 'jjjjjjjj',
  '704': '66666',
  '705': '888888',
  '751': '产线1',
  '801': '777777',
  '802': 'qqqqqqqq'
}
const openEditFormModal = (row: any) => {
  simpleFormModalConfig.value.formData = { ...row }
  moment.suppressDeprecationWarnings = true
  simpleFormModalConfig.value.formData['mesplineplanitem__creationdate'] = moment(row['mesplineplanitem__creationdate']).format('YYYY/MM/DD HH:mm:ss')
  simpleFormModalConfig.value.formData['mespart__startdate'] = moment(row['mespart__startdate']).format('YYYY/MM/DD HH:mm:ss')
  simpleFormModalConfig.value.formData['mespart__enddate'] = moment(row['mespart__enddate']).format('YYYY/MM/DD HH:mm:ss')
  simpleFormModalConfig.value.formData['mesplineplanitem__orderquantity'] = 2
  simpleFormModalConfig.value.visible = true
  simpleFormModalConfig.value.title = '动态表单弹框'
}
const simpleFromModalRef = ref<any>()
// SimpleFormModalType
const simpleFormModalConfig = ref<SimpleFormModalType>({
  visible: false,
  title: '编辑',
  formData: {},
  formInput: [
    {
      label: '发布时间',
      vModel: 'mesplineplanitem__creationdate',
      type: 'dateTimePicker',
      disabled: true
    },
    {
      label: '分派数量',
      vModel: 'mesplineplanitem__orderquantity',
      type: 'inputNumber',
      disabled: true
    },
    {
      label: '产线',
      vModel: 'mesplineplanitem__pline_objid',
      type: 'select',
      options: computed(() => JrjUtils.objToSelectArr(productionLineDic)) as any,
      disabled: true
    },
    {
      label: '开工时间',
      vModel: 'mespart__startdate',
      type: 'dateTimePicker'
    },
    {
      label: '完工时间',
      vModel: 'mespart__enddate',
      type: 'dateTimePicker'
    },
    {
      label: '名称',
      vModel: 'mespart__name',
      type: 'input',
      rules: [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    {
      label: '物料编码',
      vModel: 'mespart__materialno',
      type: 'input'
    },
    {
      label: '图号',
      vModel: 'mespart__identityno',
      type: 'input'
    },
    {
      label: '材料',
      vModel: 'mespart__material',
      type: 'input'
    },
    {
      label: '来源类型',
      vModel: 'mespart__sourcetype',
      type: 'select',
      options: computed(() => JrjUtils.objToSelectArr(SourceTypeDic)) as any
    },
    {
      label: '计划数量',
      vModel: 'mespart__orderquantity',
      type: 'inputNumber'
    },
    {
      label: '订单号',
      vModel: 'mesordersheet__orderno',
      type: 'input',
      disabled: true
    },
    {
      label: '生产订单',
      vModel: 'mesproductionschedule__lotno',
      type: 'input',
      disabled: true
    },
    {
      label: '状态',
      vModel: 'mespart__state',
      type: 'select',
      options: JrjUtils.objToSelectArr(MesPart__StateDic)
    },
    {
      label: '订单名称',
      vModel: 'mesordersheet__name',
      type: 'input',
      disabled: true
    }
  ],
  loading: false,
  submitHandle: async (data: any) => {
    if (!data) {
      return
    }
    simpleFormModalConfig.value.loading = true
    setTimeout(() => {
      simpleFormModalConfig.value.loading = false
      console.log('表单内容：', data)
      ElMessage({
        message: '表单内容获取成功，详情见控制台',
        type: 'success'
      })
    }, 2000)
  }
})
//#endregion

onMounted(() => {
  JrjUtils.AutoAdaptDpi()
})
</script>

<template>
  <div class="my-app">
    <div class="title">公共函数</div>
    <div class="content">
      <el-button @click="fullScreen">点击全屏</el-button>
      <el-button @click="getIp">获取当前ip</el-button>
      <div style="margin-top: 10px"></div>
      <el-button @click="objToJrjObject">数据结构转换ObjToJrjObject</el-button>
      <el-button @click="jrjObjectToObj">数据结构转换JrjObjectToObj</el-button>
      <el-button @click="getSingleJrjObject">提取单个JrjObject对象</el-button>
      <div style="margin-top: 10px"></div>
      <el-button @click="objToSelectArr">对象字典转select数组</el-button>
      <el-button @click="selectArrToObj">select数组转对象字典</el-button>
    </div>
    <div class="title">公共组件</div>
    <div class="content">
      <h4 style="margin-bottom: 10px">动态表单</h4>
      <el-button @click="openEditFormModal({})">打开动态表单弹框</el-button>
    </div>
  </div>
  <SimpleFormModal ref="simpleFromModalRef" v-model="simpleFormModalConfig"></SimpleFormModal>
</template>

<style scoped>
.my-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .title {
    padding: 50px 0 20px;
    font-size: 24px;
    font-weight: 500;
  }
  .content {
    width: 80%;
    padding: 20px;
  }
}
</style>
