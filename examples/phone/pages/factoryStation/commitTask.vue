<template>
	<view class="commitTask-container">
		<view class="assign-container" v-for="(objTask,index) in lstData" :key="index">
			<view v-for="(objField,num) in lstField" :key="num">
				<span>{{objField.title}}：</span>
				<span v-if="objField.dataType">
					<u-number-box v-if="objField.dataType==='1'" v-model="objTask.properties[objField.field]"
						@change="valChange($event,objTask,objField.field)"></u-number-box>
				</span>
				<span v-else-if="objField.render" v-html="objField.render(objTask)"></span>
				<span v-else>{{objTask.properties[objField.field] }}</span>
			</view>
			<view class="btn-container">
				<u-button type="primary" size="mini" @click="alertMsg">SOP</u-button>
				<u-button type="primary" size="mini" @click="commitTask(objTask)">报工</u-button>
			</view>
		</view>
		<Empty :text="'暂无待报工工单'" v-if="lstData.length===0"></Empty>
		<u-modal v-model="show" title="报工" width="90%" :show-cancel-button="true" @confirm="commitTaskReal">
			<view class="person-report-container">
				<u-button type="primary" size="mini" @click="showPerson=true">选择人员</u-button>
				<view v-for="(item,index) in lstReportPerson" :key='index' class="person-report-item">
					<view>{{item.properties.NAME}}</view>
					<view>
						<u-number-box :max="parseFloat(currentTask.properties.MesAssignSheet__AssignQuantity)"
							v-model="item.properties.realquantity" @change="realquantityChange"></u-number-box>
					</view>
					<view>
						{{item.properties.workratio?Number((Number(item.properties.workratio)*100).toFixed(1))+'%':'0%'}}
					</view>
					<view>
						<u-button type="error" size="mini" @click="deleteReportPerson(item,index)">删除</u-button>
					</view>
				</view>
			</view>
		</u-modal>
		<u-modal v-model="showPerson" title="选择人员" width="90%" :show-cancel-button="true" @confirm="changeReportPerson">
			<scroll-view scroll-y="true" style="height: 400px;" @touchmove.stop="touchIsEnd">
				<view class="person-select-container">
					<view v-for="(item,index) in lstPerson" :key="index">
						<u-checkbox v-model="item.properties.selected"></u-checkbox>
						<span>{{item.properties.NAME+"【"+item.properties.STAFFNO+"】"}}</span>
					</view>
				</view>
			</scroll-view>
		</u-modal>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import BaseTool from '../../common/baseTool.js'
	import Jrjobject from '../../common/Jrjobject'
	import Empty from '../../componets/empty.vue'
	interface fieldType {
		title : string,
		field : string,
		render ?: Function,
		dataType ?: string
	}
	const baseTool = new BaseTool()
	const lstData = ref<Jrjobject[]>([])
	const lstField = ref<fieldType[]>([
		{
			title: '令号',
			field: 'MesOrderSheet__OrderNo'
		},
		{
			title: '生产批次号',
			field: 'MesProductionSchedule__LotNo'
		},
		{
			title: '物料编码',
			field: 'MesPart__MaterialNo'
		},
		{
			title: '图号',
			field: 'MesPart__IdentityNo'
		},
		{
			title: '零部件名称',
			field: 'MesPart__Name'
		},
		{
			title: '本道工序',
			field: 'QcpProcess__ProcessName'
		},
		{
			title: '计划数量',
			field: 'MesAssignSheet__AssignQuantity'
		},
		{
			title: '剩余开工数量',
			field: 'MesAssignSheet__RestReportQuantity'
		},
		{
			title: '已开工数量',
			field: 'MesAssignSheet__HasReportQuantity'
		},
		{
			title: '班组',
			field: 'MesTeam__name'
		},
		{
			title: '材质',
			field: 'MesPart__Specification'
		},
		{
			title: '工序数据',
			field: 'QcpProcess__ProcessData'
		},
		{
			title: '开工时间',
			field: 'MesAssignSheet__StartDate'
		},
		{
			title: '完工时间',
			field: 'MesAssignSheet__EndDate'
		},
		{
			title: '前道工序',
			field: 'MesSemiFinished__PreName'
		},
		{
			title: '后道工序',
			field: 'MesSemiFinished__NextName'
		},
		{
			title: '计量单位',
			field: 'MesSemiFinished__AssemblyUnit'
		},
		{
			title: '运行状态',
			field: 'MesAssignSheet__State',
			render: (objTask : Jrjobject) => {
				switch (new Jrjobject(objTask).GetPropVal('MesAssignSheet__State')) {
					case '0':
						return '准备中'
					case '1':
						return '可以开始'
					case '2':
						return '运行中'
					case '3':
						return '审核中'
					case '4':
						return '挂起'
					case '5':
						return '完成结束'
					case '6':
						return '被取消'
					default:
						return ""
				}
			}
		},
		{
			title: '制表人',
			field: 'MesAssignSheet__Creator'
		},
		{
			title: '制造零部件OBJID',
			field: 'MesPart__ObjID'
		},
		{
			title: '设备生产计划OBJID',
			field: 'MesProductionSchedule__ObjID'
		},
		{
			title: '派工单OBJID',
			field: 'MesAssignSheet__ObjID'
		},
		{
			title: '班组OBJID',
			field: 'MesAssignSheet__Team_OBJID'
		},
		{
			title: '制作工序OBJID',
			field: 'QcpProcess__ObjID'
		},
		{
			title: '质检方式',
			field: 'MesSemiFinished__InspectType'
		},
		{
			title: '网络快照OBJID',
			field: 'SysSnapshot__ObjID'
		},
		{
			title: '工序顺序号',
			field: 'MesSemiFinished__INDEXNO'
		},
		{
			title: '派工类型',
			field: 'MesAssignSheet__type'
		},
		{
			title: 'GroupId',
			field: 'MesAssignSheet__groupID'
		},
		{
			title: '所占工作比例',
			field: 'MesAssignSheet__WorkRatio'
		}
	])
	const show = ref<boolean>(false)
	const lstPerson = ref<Jrjobject[]>([])
	const lstReportPerson = ref<Jrjobject[]>([])
	const currentTask = ref<Jrjobject>(new Jrjobject())
	const showPerson = ref<boolean>(false)
	onMounted(() => {
		getMyTask();
		getPersonList()
	});
	const alertMsg = () => {
		baseTool.msg('该功能正在开发中')
	}
	const touchIsEnd = () => {
		return false
	}
	const valChange = (e : any, objTask : Jrjobject, field : string) => {
		new Jrjobject(objTask).SetValue(field, e.value)
	}
	const getMyTask = () => {
		const url = '/WsWorkshopExecController/ListMyTask';
		const param = {
			workcenters: [JSON.parse(uni.getStorageSync('USER_INFO')).workCenterData],
			workSheetType: 1,
			pageNum: 10,
			pageIndex: 0,
			filters: []
		};
		baseTool.postData(url, param).then((res : Jrjobject[]) => {
			lstData.value = res
		});
	};
	const getPersonList = () => {
		const url = '/WsObjLevelController/QueryObjects'
		const param = {
			type: 'SysPerson'
		}
		baseTool.postData(url, param).then((res : Jrjobject[]) => {
			const loginPersonID = new Jrjobject(JSON.parse(uni.getStorageSync('USER_INFO')).userData).id
			res.forEach((item : Jrjobject) => {
				new Jrjobject(item).SetValue('realquantity', 1)
				new Jrjobject(item).SetValue('workratio', 1)
				item.properties.selected = false
				let OBJID = new Jrjobject(item).id
				if (loginPersonID === OBJID) {
					item.properties.selected = true
					lstReportPerson.value = [item]
				}
			})
			lstPerson.value = res
		});
	}
	const commitTask = (objTask : Jrjobject) => {
		show.value = true
		currentTask.value = objTask
	}
	const changeReportPerson = () => {
		let temp = lstPerson.value.filter((item => {
			return item.properties.selected
		}))
		lstReportPerson.value = temp
		realquantityChange()
	}
	const deleteReportPerson = (item : Jrjobject, index : number) => {
		item.properties.selected = false
		let reportPersons = lstReportPerson.value
		reportPersons.splice(index, 1)
		lstReportPerson.value = reportPersons
		realquantityChange()
	}
	const realquantityChange = () => {
		let reportPersons = lstReportPerson.value
		let totalCount = 0
		reportPersons.forEach(item => {
			totalCount += new Jrjobject(item).GetPropFloat('realquantity')
		})
		reportPersons.forEach(item => {
			item.properties.workratio = (new Jrjobject(item).GetPropFloat('realquantity') / totalCount).toFixed(3)
		})
		lstReportPerson.value = reportPersons
	}
	const commitTaskReal = () => {
		let objTask = currentTask.value
		objTask.id = objTask.properties.MesReportSheet__ObjID
		objTask.type = 'MesReportSheet'
		const url = '/WsWorkshopExecController/CommitTask';
		const param = {
			worksheet: objTask,
			reporters: lstReportPerson.value,
			prevWHItems: [],
			props: {}
		};
		baseTool.postData(url, param).then((res : Jrjobject[]) => {
			if (res) {
				baseTool.msg('报工成功')
			}
		});
	}
</script>

<style scoped lang="scss">
	.commitTask-container {
		padding: 10px 8px 1px 8px;
		height: 100vh;
		overflow: auto;

		.assign-container {
			background-color: white;
			padding: 5px;
			margin-bottom: 10px;
			overflow: hidden;

			&>view {
				min-width: 50%;
				max-width: 100%;
				float: left;
				line-height: 25px;
			}

			.btn-container {
				display: flex;
				justify-content: space-around;
				width: 100%;
			}
		}

		.person-report-container {
			padding-left: 10px;
			margin-top: 15px;
			max-height: 70vh;
			overflow: auto;

			.person-report-item {
				margin: 15px 0;
				overflow: hidden;

				&>view {
					float: left;

					&:nth-child(1) {
						width: 22%;
					}

					&:nth-child(2) {
						width: 40%;
					}

					&:nth-child(3) {
						width: 20%;
					}

					&:nth-child(4) {
						width: 18%;
					}
				}

			}
		}

		.person-select-container {
			margin-top: 10px;

			&>view {
				padding: 0 20px;
				line-height: 30px;
			}
		}
	}
</style>