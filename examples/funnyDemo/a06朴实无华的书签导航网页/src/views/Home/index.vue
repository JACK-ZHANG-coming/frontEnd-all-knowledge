<!-- 
  书签网址
  目前仅支持单层，不支持多层嵌套
 -->
<script setup lang="ts" name="Home">
import { reactive, ref } from 'vue'
import { Share, Search, Upload, Download, Delete, Plus, Switch } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DomFormatModal from '../../components/DomFormatModal.vue'
import { typeCheck } from 'jrj-front-end-tool'

interface bookmarkType {
  favicon: string | null | any
  title: string
  src: string
}

interface bookmarkGroupType {
  [prop: string]: bookmarkType[]
}


const bulkImportPlaceholder = `
  这里粘贴已经解析过的json数据（就是刚刚解析浏览器书签文件的内容），例子如下：
  [
    {
      书签栏1: [
        {
          favicon: 'data:image/png;base64,iVBORw0K',
          title: '百度',
          src: 'https://www.baidu.com/'
        },
        {
          favicon: 'data:image/png;base64,iVBI/QN7F9CfB8suEw',
          title: '语',
          src: 'https://www.yuque.com/dashboard'
        }
      ]
    },
    {
      书签栏2: [
        {
          favicon: 'data:image/png;base64,iVBORw',
          title: '前端-掘金',
          src: 'https://juejin.cn/frontend'
        },
        {
          favicon: 'data:image/png;base64,iVBORw0KGgoAAAAN',
          title: 'WindrunnerMax',
          src: 'https://blog.touchczy.top/#/'
        }
      ]
    }
  ]
`

const allBookmarkData = ref<bookmarkGroupType[]>(
  JSON.parse(localStorage.getItem('allBookmarkData') || '[]')
)
const searchValue = ref('')
const domFormatModalRef = ref<any>(null)
const bulkImportModalVisible = ref<boolean>(false)
const bulkImportJson = ref('')

const areFunctionNotOpen = (e: any) => {
  console.log('e', e)
  ElMessage({
    showClose: true,
    message: '功能暂未开放',
    type: 'warning'
  })
}

const openBookmarkUrl = (url: string) => {
  window.open(url)
}

const areChangeVisible = () => {
  domFormatModalRef.value?.areChangeVisible()
}

const areBulkImport = () => {
  if (bulkImportJson.value.length <= 0) {
    ElMessage({
      message: '请输入内容',
      type: 'warning'
    })
    return
  }
  confirmImport()
}

const confirmImport = () => {
  ElMessageBox.confirm('批量导入书签，原来已经存储的书签被删除，是否确认?', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      try {
        JSON.parse(bulkImportJson.value)
        localStorage.setItem('allBookmarkData', bulkImportJson.value)
        allBookmarkData.value = JSON.parse(localStorage.getItem('allBookmarkData') || '[]')
      } catch {
        ElMessage({
          type: 'error',
          message: '输入的不是Json格式，请检查'
        })
      }
      ElMessage({
        type: 'success',
        message: '替换成功'
      })
      bulkImportModalVisible.value = false
    })
    .catch(() => {
      bulkImportModalVisible.value = false
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const areExport = () => {
  // 创建一个Blob对象，用于存储JSON字符串数据
  const blob = new Blob([JSON.stringify(allBookmarkData.value)], { type: 'application/json' })

  // 创建一个a标签，用于下载JSON文件
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'allBookmarkData.json' // 设置文件名

  // 模拟用户点击下载链接
  a.click()
  ElMessage({
    type: 'success',
    message: '导出成功'
  })
}
</script>

<template>
  <el-container class="common-el-container">
    <el-header class="common-el-header">
      <span>😀朴实无华的书签导航网页</span>
      <el-space :size="10" spacer="|">
        <el-input
          v-model="searchValue"
          @input="areFunctionNotOpen"
          placeholder="输入搜索书签"
          :prefix-icon="Search" />
        <el-button type="info" :icon="Plus" @click="areFunctionNotOpen">新增书签</el-button>
        <el-button type="info" :icon="Delete" @click="areFunctionNotOpen">删除书签</el-button>
        <el-button type="primary" :icon="Upload" @click="bulkImportModalVisible = true">
          批量导入书签
        </el-button>
        <el-button type="primary" :icon="Download" @click="areExport">导出书签</el-button>
        <el-button type="primary" :icon="Switch" @click="areChangeVisible">
          解析浏览器书签文件
        </el-button>
        <el-button type="info" :icon="Share" @click="areFunctionNotOpen">源码</el-button>
      </el-space>
    </el-header>
    <el-main>
      <div class="container" v-for="(item, index) in allBookmarkData" :key="index">
        <div class="title">{{ Object.keys(item)[0] }}</div>
        <div class="box">
          <div class="item" v-for="(item_2, index_2) in Object.values(item)[0]" :key="index_2">
            <img :src="item_2?.favicon" />
            <span
              :title="item_2.title"
              @click="
                () => {
                  openBookmarkUrl(item_2?.src)
                }
              ">
              {{ item_2?.title }}
            </span>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
  <DomFormatModal ref="domFormatModalRef"></DomFormatModal>
  <el-dialog v-model="bulkImportModalVisible" title="批量导入书签" width="80%">
    <div style="display: flex; justify-content: center; width: 100%; height: 60vh; overflow: auto">
      <el-input
        v-model="bulkImportJson"
        :rows="20"
        type="textarea"
        :placeholder="bulkImportPlaceholder" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="areBulkImport">批量导入</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.common-el-container {
  width: 100vw;
  height: 100vh;
}

.common-el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-bottom: 2px solid rgb(148, 147, 147);
}

.container {
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    height: 42px;
    line-height: 42px;
    padding-left: 20px;
    font-size: 26px;
    border-left: 5px solid black;

    &.title-border-color2 {
      border-left: 5px solid rgb(85, 84, 84);
    }
    &.title-border-color3 {
      border-left: 5px solid rgb(165, 163, 163);
    }
    &.title-border-color4 {
      border-left: 5px solid rgb(209, 206, 206);
    }
  }
  .box {
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    width: 100%;
    .item {
      display: grid;
      align-items: center;
      justify-content: flex-start;
      grid-template-columns: 30px minmax(20px, calc(100% - 30px));
      height: 50px;
      span {
        padding: 10px 20px;
        border-radius: 10px;
        margin-right: 5px;
        overflow: hidden; // 溢出隐藏
        white-space: nowrap; // 防止文字换行
        text-overflow: ellipsis; // 超出宽度用省略号
        cursor: pointer;
        &:hover {
          background-color: rgb(192, 221, 247);
          transition: 0.5s;
        }
      }
    }
  }
}
</style>
