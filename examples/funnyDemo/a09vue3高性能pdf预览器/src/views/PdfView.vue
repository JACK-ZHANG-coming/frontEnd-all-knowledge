<!-- pdf预览器 -->
<script setup lang="ts">
import { onMounted, ref, watch, reactive, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const currentFileUrl = ref('')

const loading = ref(false)
const route = useRoute()
const fullName = ref('未命名文件')
const fileType = ref<'pdf' | ''>('')
const currentBase64FileData = reactive({
  base64: '',
  name: '',
})

const verifyPrintRight = async () => {
  // 打印权限校验
  let flag = true // 默认有权限
  loading.value = true
  /**
   * ... 权限接口请求
   *
   */
  flag = false // 这里根据接口返回的权限判断结果返回 true 或 false，当前临时赋值为静态数值没有权限
  loading.value = false
  return flag
}

const verifyDownloadRight = async () => {
  // 这里进行权限判断接口请求
  let flag = true // 默认有权限
  loading.value = true
  /**
   * ... 权限接口请求
   *
   */
  flag = true // 这里根据接口返回的权限判断结果返回 true 或 false，当前临时赋值为静态数值有权限
  loading.value = false
  return flag
}

// 检测设备
const checkDevice = () => {
  if (isMobileDevice(false, 'LowerDevice')) {
    pdfViewVersionType.value = 'old'
  } else {
    pdfViewVersionType.value = 'newest'
  }
}

const initPreview = async () => {
  currentBase64FileData.base64 = ''
  currentBase64FileData.name = ''
  currentFileUrl.value = ''
  loading.value = true

  fullName.value = (route.query.file as string) || ''
  fileType.value = getFileType(fullName.value) as 'pdf' | ''
  window.document.title = `${fullName.value}`
  currentFileUrl.value = encodeURIComponent(
    `http://116.198.200.217:7501/api/v1/user/getPdfFile?file=${fullName.value}&customFileName=${fullName.value}`,
  )
  //
  // currentFileUrl.value = encodeURIComponent(
  //   `http://116.198.200.217:7501/api/v1/user/getPdfFile?file=%E6%B5%8B%E8%AF%95pdf%E6%96%87%E4%BB%B61.pdf`,
  // )
  switch (fileType.value) {
    case 'pdf':
      nextTick(() => {
        iframeRef.value?.addEventListener('load', onFrameLoad)
      })
      break
    default:
      break
  }
  loading.value = false
}

//#region pdf预览相关
const pdfViewVersionType = ref<'' | 'newest' | 'old'>('')
const iframeRef = ref<HTMLIFrameElement | null>(null)
// 用来临时存放 iframe 的 document 以便卸载时移除监听
let iframeDoc: Document | null = null
// “放行”标记属性名
const ALLOWED_FLAG = 'data-parent-allowed'
// 事件处理器，注册在 iframeDoc 上
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interceptor = async (e: any) => {
  // console.log('点击了按钮')
  const target = e.target
  // console.log('target:', target)
  if (!target.matches('button[data-require-perm]')) return
  // 如果是我们之前人为触发放行的，就清除标记并放行
  if (target.hasAttribute(ALLOWED_FLAG)) {
    target.removeAttribute(ALLOWED_FLAG)
    return
  }
  e.preventDefault()
  e.stopImmediatePropagation()
  // 拿到按钮标识：优先 id，否则取 data-action
  const buttonId = target.id || target.getAttribute('data-action') || ''
  // 在父页面统一做权限判断
  const allowed = await checkUserPermission(buttonId)
  if (allowed) {
    // 如果有权限 打标记再触发一次 click，让它执行原始逻辑
    target.setAttribute(ALLOWED_FLAG, 'true')
    target.click()
  } else {
    alert('没有权限')
  }
}

// iframe 加载完成后的回调：拿到 iframeDoc 并注册拦截器
const onFrameLoad = () => {
  const iframeEl = iframeRef.value
  if (!iframeEl) return
  iframeDoc = iframeEl.contentDocument
  if (!iframeDoc) return
  // 捕获阶段拦截 click 和 touchend（兼容移动端）
  iframeDoc.addEventListener('click', interceptor, true)
  iframeDoc.addEventListener('touchend', interceptor, true)
}

const checkUserPermission = async (buttonId: unknown) => {
  try {
    let flag = true
    switch (buttonId) {
      case 'downloadButton':
      case 'secondaryDownload':
      case 'download':
        flag = await verifyDownloadRight()
        break
      case 'printButton':
      case 'secondaryPrint':
        flag = await verifyPrintRight()
        break
      default:
        break
    }
    return flag
  } catch (err) {
    console.error('权限校验出错', err)
    return false
  }
}

// 在 onUnmounted 中移除事件监听
onUnmounted(() => {
  // 卸载时，先移除 iframe 的 load 监听
  iframeRef.value?.removeEventListener('load', onFrameLoad)
  // 再移除在 iframeDoc 上注册的事件
  if (iframeDoc) {
    iframeDoc.removeEventListener('click', interceptor, true)
    iframeDoc.removeEventListener('touchend', interceptor, true)
  }
})
//#endregion

const isMobileDevice = (
  excludeIpad: boolean = false,
  customFlag: 'IOS' | 'ANDROID' | 'PC' | 'LowerDevice' | '' = '',
) => {
  // @ts-expect-error 忽略报错
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  let flag = false

  // 检查常见的移动设备的用户代理
  if (/android/i.test(userAgent)) {
    flag = true
  }

  // @ts-expect-error 忽略报错
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    flag = true
  }

  if (/windows phone/i.test(userAgent)) {
    flag = true
  }

  if (/mobile/i.test(userAgent)) {
    flag = true
  }

  // 排除列表
  if (excludeIpad && /iPad|iPod/.test(userAgent)) {
    flag = false
  }

  // 自定义标识 单独校验某种设备，其他都不看
  if (customFlag === 'IOS') {
    flag = /iPad|iPhone|iPod/.test(userAgent) ? true : false
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && (flag = true) // iPad伪装成Mac的情况
  } else if (customFlag === 'LowerDevice') {
    // 目前将iPad|iPhone|iPod 都视为较低的设备
    flag = /iPad|iPhone|iPod/.test(userAgent) ? true : false
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && (flag = true) // iPad伪装成Mac的情况
  }

  // 如果都不匹配，则认为是PC端
  return flag
}

/**
 * 获取文件的后缀名
 * e.g: abc.pdf===>pdf
 * @param fileName 文件名称
 * @param bigOrSmall 是否大小写 '0' 原样输出 '1'小写（默认） '2'大写
 * @returns
 */
const getFileType = (fileName: string, bigOrSmall: '0' | '1' | '2' = '1') => {
  let fileType = ''
  let findIndex = -1
  for (let i = fileName.length - 1; i >= 0 && fileName; i--) {
    if (fileName.charAt(i) === '.') {
      findIndex = i
      break
    }
  }
  if (findIndex >= 0) {
    fileType = fileName.slice(findIndex + 1)
  }
  if (bigOrSmall == '1') {
    return fileType.toLocaleLowerCase()
  } else if (bigOrSmall == '2') {
    return fileType.toLocaleUpperCase()
  } else {
    return fileType
  }
}

watch(route, (nowValue) => {
  if (nowValue.name !== 'view') {
    return
  }
  initPreview()
})

onMounted(() => {
  checkDevice()
  initPreview()
})
</script>

<template>
  <div v-loading="loading" class="common-layout view-view">
    <el-container class="el_container">
      <div className="iframe">
        <iframe
          v-if="pdfViewVersionType === 'newest'"
          ref="iframeRef"
          style="height: 100%; width: 100%"
          :src="`./lib/pdfjs-5.2.133-legacy-dist/web/viewer.html?file=${currentFileUrl}`"
        >
        </iframe>
        <!-- 低版本的 pdfjs 版本 -->
        <iframe
          v-else-if="pdfViewVersionType === 'old'"
          ref="iframeRef"
          style="height: 100%; width: 100%"
          :src="`./lib/pdf/web/viewer.html?file=${currentFileUrl}`"
        >
        </iframe>
      </div>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  width: 100vw;
  height: 100vh;
  .el_container {
    width: 100%;
    height: 100%;
    .el_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #e5e5e5;
      font-size: 16px;
      .el-button {
        --el-button-disabled-border-color: #c4c4c4 !important;
        --el-button-disabled-bg-color: #c4c4c4 !important;
      }
      .tool-div {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .el_main {
      position: relative;
      width: 100%;
      height: 100%;
      --el-main-padding: 0px;
      overflow: auto;
    }
  }
  .iframe {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
// 禁用当前页面浏览器自带打印
@media print {
  body {
    display: none;
  }
}
</style>
