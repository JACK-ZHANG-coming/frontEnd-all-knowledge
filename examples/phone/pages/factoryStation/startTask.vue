<template>
	<view class="startTask-container">
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
				<u-button type="primary" size="mini" @click="startTask(objTask)">开工</u-button>
				<u-button type="primary" size="mini" @click="alertMsg">SOP</u-button>
				<u-button type="primary" size="mini" @click="alertMsg">物料齐套</u-button>
				<u-button type="primary" size="mini" @click="feedMaterial(objTask)">投料</u-button>
			</view>
		</view>
		<Empty :text="'暂无待开工工单'" v-if="lstData.length===0"></Empty>
		<u-modal v-model="show" title="开工投料选择" width="90%" :show-cancel-button="true" @confirm="feedMaterialConfirm">
			<scroll-view scroll-y="true" style="height: 400px;" @touchmove.stop="touchIsEnd">
				<view class="material-container">
					<u-collapse :accordion="false">
						<u-collapse-item
							:title="item.semiFinishedOrBuyPart.properties.Name+'【'+item.semiFinishedOrBuyPart.properties.MaterialNo+'】'"
							v-for="(item, index) in lstMtPick" :key="index">
							<view v-for="(child,num) in item.warehouseItems" :key="num" class="material-item">
								<u-checkbox class="checkBox" v-model="child.properties.selected"></u-checkbox>
								<view class="content">
									<view>工序名称：{{child.properties.psname}}</view>
									<view>开工数量：{{child.properties.actualbeginquantity}}</view>
									<view>仓库：{{warehouseDic[child.properties.Warehouse_OBJID]}}</view>
									<view>仓库物料：{{child.properties.MaterialNo}}</view>
									<view>物料名称：{{child.properties.Name}}</view>
									<view>可用数量：{{child.properties.UsableQuantity}}</view>
									<view>需求数量：{{child.properties['*requisitionquantity']}}</view>
									<view>
										<span>耗用数量：</span>
										<u-number-box :max="parseFloat(child.properties.UsableQuantity)"
											v-model="child.properties.consumedquantity"></u-number-box>
									</view>
									<view style="overflow: hidden;">
										<span style="float: left;line-height: 35px;">系列号：</span>
										<u-input v-model="child.properties.BatchNo" type="text" :border="false" />
									</view>
								</view>
							</view>
							<u-empty v-if="item.warehouseItems.length===0"></u-empty>
						</u-collapse-item>
					</u-collapse>
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
	interface mtPickType {
		batchNo : string,
		materialType : number,
		semiFinishedOrBuyPart : Jrjobject,
		warehouseItems : Jrjobject[]
	}
	const baseTool = new BaseTool()
	const lstData = ref<Jrjobject[]>([])
	const lstField = ref<fieldType[]>([
		{
			title: '本次开工数量',
			field: 'actualbeginquantity',
			dataType: '1'
		},
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
	const lstMtPick = ref<mtPickType[]>([])
	const warehouseDic = ref<object>({})
	onMounted(() => {
		getMyTask();
		getWarehouseList()
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
			res.forEach(item => {
				new Jrjobject(item).SetValue('actualbeginquantity', 0)
			})
			lstData.value = res
		});
	};
	const startTask = (objTask : Jrjobject) => {
		const actualbeginquantity = new Jrjobject(objTask).GetPropFloat('actualbeginquantity')
		if (actualbeginquantity === 0) {
			baseTool.msg('请输入本次开工数量')
			return
		}
		const url = '/WsWorkshopExecController/StartTask'
		const param = {
			worksheet: objTask,
			actualBeginQuantity: actualbeginquantity,
			prevWHItems: lstMtPick.value
		}
		baseTool.postData(url, param).then((res) => {
			if (res) {
				baseTool.msg('开工成功')
			}
		});
	}
	const getWarehouseList = () => {
		const url = '/WsObjLevelController/QueryObjects'
		const param = {
			type: 'SysWarehouse'
		}
		baseTool.postData(url, param).then((res : Jrjobject[]) => {
			let tempObj = {}
			res.forEach((item : Jrjobject) => {
				let OBJID = new Jrjobject(item).GetPropVal('OBJID')
				let NAME = new Jrjobject(item).GetPropVal('NAME')
				tempObj[`${OBJID}`] = NAME
			})
			warehouseDic.value = tempObj
		});
	}
	const feedMaterial = (objTask : Jrjobject) => {
		const actualbeginquantity = new Jrjobject(objTask).GetPropFloat('actualbeginquantity')
		if (actualbeginquantity === 0) {
			baseTool.msg('请输入本次开工数量')
			return
		}
		objTask.id = new Jrjobject(objTask).GetPropFloat('MesAssignSheet__ObjID')
		objTask.type = 'MesAssignSheet'
		const url = '/WsWorkshopExecController/GetUsingWHItemsBy'
		const param = {
			worksheet: objTask,
			actualBeginQuantity: actualbeginquantity,
			includeSelf: true // 上道工序，目前写死为true
		}
		baseTool.postData(url, param).then((res : mtPickType[]) => {
			res.forEach(item => {
				item.warehouseItems.forEach(child => {
					new Jrjobject(child).SetValue('actualbeginquantity', actualbeginquantity)
					new Jrjobject(child).SetValue('consumedQuantity', 0)
				})
			})
			lstMtPick.value = res
			show.value = true
		});
	}
	const feedMaterialConfirm = () => {
		lstMtPick.value.forEach(item => {
			item.warehouseItems = item.warehouseItems.filter(child => {
				return child.properties.selected === true
			})
		})
	}
</script>

<style scoped lang="scss">
	.startTask-container {
		padding: 10px 8px 1px 8px;
		height: 100vh;
		overflow: auto;

		.assign-container {
			background-color: white;
			padding: 5px;
			margin-bottom: 10px;
			overflow: hidden;

			.btn-container {
				display: flex;
				justify-content: space-around;
				width: 100%;
			}
		}

		.material-container {
			padding-left: 10px;
			margin: 10px 0;
			max-height: 70vh;
			overflow: auto;

			.material-item {
				line-height: 25px;
				margin: 5px 0;
				overflow: hidden;

				.checkBox {
					margin: 100px 0 0 15px;
					float: left;
				}

				.content {
					width: calc(100% - 60px);
					float: left;
				}
			}
		}
	}

	.assign-container>view {
		min-width: 50%;
		max-width: 100%;
		float: left;
		line-height: 25px;
	}
</style>