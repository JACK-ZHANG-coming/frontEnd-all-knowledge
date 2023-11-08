<template>
	<u-cell-group>
		<u-cell-item title="基本信息" value='简睿捷MES管理系统'></u-cell-item>
		<u-cell-item title="版权所有" value='南京简睿捷软件开发有限公司'></u-cell-item>
		<u-cell-item title="版本号" value='1.0.0'></u-cell-item>
		<u-cell-item title="服务IP" :value='MES_IP'></u-cell-item>
	</u-cell-group>
	<u-button style="margin-top: 10px;" type="primary" @click="checkRefresh">检查更新</u-button>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import BaseTool from '../../common/baseTool.js';
	const MES_IP = ref('')
	onMounted(() => {
		uni.getStorage({
			key: 'MES_IP',
			success: (res) => {
				MES_IP.value = res.data
			}
		})
	})
	const checkRefresh = () => {
		new BaseTool().msg('当前版本已经是最新版本')
	}
</script>

<style>

</style>