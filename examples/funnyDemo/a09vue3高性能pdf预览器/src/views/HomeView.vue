<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const handleClick = (file: string = '') => {
  const url = `${window.document.location.origin}/pdfView?file=${file}`
  window.open(url)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = ref<any>(null)

onMounted(() => {
  try {
    AMapLoader.load({
      key: '7337da6bac6ef02e6d5cce647ed0f523',
      version: '2.0',
    })
      .then((AMap) => {
        console.log('高德地图加载成功', AMap)

        map.value = new AMap.Map('mapContainer', {
          zoom: 18,
        })
        // 添加定位插件
        console.log('===>', map.value.Geolocation)
        // 添加定位插件
        map.value.plugin('AMap.Geolocation', function () {
          console.log('定位插件加载成功')
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位
            timeout: 10000, // 超过10秒停止定位
            zoomToAccuracy: true, // 自动调整地图视野到定位点
          })
          // 开始定位
          geolocation.getCurrentPosition(function (
            status: string,
            result: { position: { lng: number; lat: number } },
          ) {
            if (status === 'complete') {
              const position = result.position // 获取定位结果
              console.log('当前位置经纬度：', position.lng, position.lat)
              map.value.setCenter([position.lng, position.lat])
            } else {
              console.error('定位失败：', result)
            }
          })
        })
      })
      .catch((error) => {
        console.error('高德地图加载失败:', error)
      })
  } catch (error) {
    console.error('高德地图加载失败:', error)
  }
})
</script>

<template>
  <main style="text-align: center; padding: 20px">
    <h3>Welcome to Vue 3 PDF Previewer</h3>
    <hr style="margin: 20px 0" />
    <el-button @click="handleClick('测试pdf文件1.pdf')">打开测试pdf1</el-button>
    <span style="margin: 0 10px"></span>
    <el-button @click="handleClick('阮一峰es6入门(第三版)新版-非商用.pdf')">打开测试pdf2</el-button>
    <div
      id="mapContainer"
      style="
        margin: 20px auto 0;
        width: 500px;
        height: 500px;
        border: 1px solid #ccc;
        border-radius: 10px;
        overflow: hidden;
      "
    ></div>
  </main>
</template>

<style scoped></style>
