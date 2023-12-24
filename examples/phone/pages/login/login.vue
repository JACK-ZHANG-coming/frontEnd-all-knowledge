<template>
	<view class="login-container">
		<uni-forms :border="true" :modelValue="formData" :rules="rules" label-width="80">
			<uni-forms-item label="姓名" name="name">
				<uni-easyinput prefixIcon="person" type="text" v-model="formData.name" placeholder="请输入姓名" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password">
				<uni-easyinput prefixIcon="locked" type="password" v-model="formData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item label="工厂" name="password">
				<el-select style="width:100%;" v-model="formData.factory" placeholder="请选择工厂" @change="factoryChange">
					<el-option v-for="item in lstFactoryData" :key="item.value" :label="item.text"
						:value="item.value" />
				</el-select>
			</uni-forms-item>
			<uni-forms-item label="工作中心" name="password">
				<el-select style="width:100%;" v-model="formData.workcenter" filterable placeholder="请选择工作中心"
					@change="workcenterChange">
					<el-option v-for="item in lstWorkcenterData" :key="item.value" :label="item.text"
						:value="item.value" />
				</el-select>
			</uni-forms-item>
		</uni-forms>
		<button style="margin-top: 10px;" type="primary" @click="submitForm">登录</button>
		<uni-title style="margin-top:10px" title="配置IP" align="right" color="#027fff" @click="goSetIP"></uni-title>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import BaseTool from '../../common/baseTool.js';
	import Jrjobject from '../../common/Jrjobject'
	type selectType = {
		value : string | number,
		text : string
	}
	const formData = ref({
		name: 'admin',
		password: '',
		factory: '',
		workcenter: ''
	})
	const lstFactory = ref<Jrjobject[]>([])
	const lstFactoryData = ref<selectType[]>([])
	const lstWorkcenter = ref<Jrjobject[]>([])
	const lstWorkcenterData = ref<selectType[]>([])
	const rules = ref<object>({
		// 对name字段进行必填验证
		name: {
			rules: [{
				required: true,
				errorMessage: '请输入姓名',
			}]
		},
		// 对password字段进行必填验证
		password: {
			rules: [{
				required: true,
				errorMessage: '请输入密码',
			}]
		}
	})
	const baseTool = new BaseTool()

	onMounted(() => {
		getFactoryList()
		getWorkcenterList()
	})

	const getFactoryList = () => {
		const url_factory = '/WsSessionController/GetFactoryWithoutToken'
		baseTool.postData(url_factory, {}).then((res : Jrjobject[]) => {
			lstFactory.value = res
			lstFactoryData.value = res.map((item) => {
				return {
					value: new Jrjobject(item).GetPropVal('name'),
					text: new Jrjobject(item).GetPropVal('name')
				}
			})
		});
	}

	const getWorkcenterList = () => {
		const url_workcenter = '/WsSessionController/GetWorkCenterWithoutToken'
		baseTool.postData(url_workcenter, {}).then((res : Jrjobject[]) => {
			lstWorkcenter.value = res
			lstWorkcenterData.value = res.map((item) => {
				return {
					value: item.id,
					text: new Jrjobject(item).GetPropVal('WCNo')
				}
			})
		});
	}

	const factoryChange = (val : string) => {
		formData.value.factory = val
	}

	const workcenterChange = (val : string) => {
		console.log('val', val);
		formData.value.workcenter = val
	}

	const submitForm = () => {
		if (formData.value.name === '') {
			baseTool.msg('请输入用户名')
			return
		}
		if (formData.value.factory === '' || formData.value.workcenter === '') {
			baseTool.msg('请选择工厂或工作中心')
			return
		}
		const url = '/WsSessionController/Login'
		const param = {
			userName: formData.value.name,
			property: 'name',
			password: formData.value.password,
			factory: formData.value.factory,
			appName: 'MES',
			host: '',
			licenseCode: ''
		}
		baseTool.postData(url, param).then(res => {
			let temp = res as unknown as any
			temp.factoryData = lstFactory.value.filter(
				(item : any) => new Jrjobject(item).GetPropVal('name') === formData.value.factory
			)[0]
			temp.workCenterData = lstWorkcenter.value.filter(
				(item : any) => item.id === formData.value.workcenter
			)[0]
			temp.wcId = temp.workCenterData.id.toString()
			temp.userData = {
				id: temp.userId,
				properties: {
					name: formData.value.name
				},
				type: 'SysPerson'
			}
			uni.setStorage({
				key: 'USER_INFO',
				data: JSON.stringify(temp)
			})
			baseTool.msg('登录成功')
			uni.redirectTo({
				url: '/pages/index/index'
			})
		});
	}

	const goSetIP = () => {
		uni.redirectTo({
			url: '/pages/login/setIP'
		})
	}
</script>

<style scoped lang="scss">
	.login-container {
		background-color: white;
		padding: 0 10px;

		::v-deep .el-select .el-input {
			height: 35px !important;
		}
	}
</style>