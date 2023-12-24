<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const textarea1 = ref<any>('')
const textarea2 = ref<any>('')

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const areChangeVisible = () => {
  console.log('dialogVisible.value', dialogVisible.value)
  dialogVisible.value = !dialogVisible.value
}

const areGetDomJson = (bodyElement: any) => {
  let teamJson = []
  let oneData: any = {
    书签栏: []
  }
  if (bodyElement.querySelector('DL') && bodyElement.querySelector('DL').querySelector('DL')) {
    let firstFloor = bodyElement.querySelector('DL').querySelector('DL')
    console.log('firstFloor', firstFloor.childNodes)
    for (let i = 0; i < firstFloor.childNodes.length; i++) {
      let currentChildNode = firstFloor.childNodes[i]
      if (currentChildNode.querySelector('DL')) {
        let name = currentChildNode.querySelector('h3').innerText || `书签栏${i}`
        let tempData: any = {
          [`${name}`]: []
        }
        let currentChildNodeList = currentChildNode.querySelector('DL').childNodes
        for (let j = 0; j < currentChildNodeList.length; j++) {
          if (currentChildNodeList[j].querySelector('a')) {
            tempData[`${name}`].push({
              favicon: currentChildNodeList[j].querySelector('a').getAttribute('ICON'),
              title: currentChildNodeList[j].querySelector('a').innerText,
              src: currentChildNodeList[j].querySelector('a').getAttribute('HREF')
            })
          }
        }
        if (currentChildNodeList.length > 0) {
          teamJson.push(tempData)
        }
      } else if (currentChildNode.querySelector('a')) {
        oneData['书签栏'].push({
          favicon: currentChildNode.querySelector('a').getAttribute('ICON'),
          title: currentChildNode.querySelector('a').innerText,
          src: currentChildNode.querySelector('a').getAttribute('HREF')
        })
      }
    }
    if (oneData['书签栏'].length > 0) {
      teamJson.unshift(oneData)
    }
  }

  return teamJson
}

const areFormat = () => {
  console.log('textarea1', textarea1)
  if (textarea1.value.length <= 0) {
    ElMessage({
      message: '请输入粘贴浏览器书签网页源码,才能转换',
      type: 'warning'
    })
    return
  }
  const parser = new DOMParser()
  try {
    // 第二个参数指定了解析类型，通常使用 'text/xml' 或 'text/html'
    let dom = parser.parseFromString(textarea1.value, 'text/html')
    let domJson = areGetDomJson(dom)
    textarea2.value = JSON.stringify(domJson)
    console.log('dom', dom)
    console.log('domJson', JSON.stringify(domJson))
  } catch (err: any) {
    ElMessage({
      message: err?.message,
      type: 'error'
    })
  }
}

defineExpose({
  areChangeVisible
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Dom转换" width="80%">
    <div
      style="
        display: grid;
        justify-content: center;
        align-items: center;
        grid-template-columns: 1fr 80px 1fr;
        width: 100%;
        height: 60vh;
        overflow: auto;
      ">
      <div style="width: 100%; height: 100%">
        <el-input
          v-model="textarea1"
          :rows="20"
          type="textarea"
          placeholder="这里粘贴浏览器书签网页源码" />
      </div>
      <div style="width: 100%; height: 100%; text-align: center; padding-top: 200px">
        <el-button @click="areFormat">转换</el-button>
      </div>
      <div style="width: 100%; height: 100%">
        <el-input
          v-model="textarea2"
          :rows="20"
          type="textarea"
          placeholder="这是展示解析后的json数据" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
