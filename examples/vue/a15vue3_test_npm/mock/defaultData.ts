import { Jrjobject } from 'demo-component/lib/index'

export const tempJrjObject: Jrjobject = {
  id: 1,
  type: 'MesSkill',
  properties: {
    ObjID: '1',
    ClassType: 'MesSkill',
    name: '技能1',
    creator: 'SYSTEM',
    creationdate: '2024/4/25 14:47:41',
    Description: '11111111',
    LastModifier: 'SYSTEM',
    LastModifydate: '2024/4/26 10:40:41',
    ApplicationID: '0',
    FactoryID: '1',
    ProcessNo: 'QF050101',
    restrictFunction: '["开工","维修","报工"]'
  }
} as Jrjobject

export const tempObj = {
  ObjID: '1',
  ClassType: 'MesSkill',
  name: '技能1',
  creator: 'SYSTEM',
  creationdate: '2024/4/25 14:47:41',
  Description: '11111111',
  LastModifier: 'SYSTEM',
  LastModifydate: '2024/4/26 10:40:41',
  ApplicationID: '0',
  FactoryID: '1',
  ProcessNo: 'QF050101',
  restrictFunction: '["开工","维修","报工"]',
  id: 1,
  type: 'MesSkill'
}

export const tempJrjObjectGroup = {
  id: 0,
  type: '',
  properties: {
    MesMaintainListTemplate__ObjID: '1',
    MesMaintainListTemplate__ClassType: 'MesMaintainListTemplate',
    MesMaintainListTemplate__name: '计划名称121',
    MesMaintainListTemplate__maintenanceCycle: '1',
    MesMaintainListTemplate__maintenanceCycleUnit: '2',
    MesMaintainListTemplate__enabled: 'False',
    MesMaintainListTemplate__startDate: '2024/3/29 9:57:20',
    MesMaintainListTemplate__lastDate: '2024/4/1 16:27:55',
    MesMaintainListTemplate__nextDate: '2024/4/1 16:28:55',
    MesMaintainListTemplate__advanceTime: '10',
    MesMaintainListTemplate__advanceTimeUnit: '1',
    MesMaintainListTemplate__Creator: 'admin',
    MesMaintainListTemplate__Creationdate: '2024/3/29 9:57:52',
    MesMaintainListTemplate__LastModifier: 'admin',
    MesMaintainListTemplate__LastModifydate: '2024/4/1 16:28:42',
    MesMaintainListTemplate__ApplicationID: '0',
    MesMaintainListTemplate__FactoryID: '1',
    MesMaintainListTemplate__description: '',
    QcpEquipmentGroup__ObjID: '',
    QcpEquipmentGroup__name: '',
    QcpEquipment__ObjID: '',
    QcpEquipment__name: '',
    QcpEquipment__StaffNO: '',
    QcpEquipment__equipmentGroup_objid: '',
    QcpEquipment__equipmentGroup_name: ''
  }
}

export const tempSelectObj = {
  x1: 'y1',
  x2: 'y2',
  x3: 'y3'
}

export const tempSelectArr = [
  { value: 'x1', label: 'y1' },
  { value: 'x2', label: 'y2' },
  { value: 'x3', label: 'y3' },
]