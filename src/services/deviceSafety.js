// import {BASE_URL} from '@/services/api'
import {get,post,postExcel} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let ehsEquip = serviceNameList['ehsEquip']

//设备信息分页
export const getDeviceInfoList = params => post( ehsEquip + '/api/ehs/equip/equipment/account/page', params);

//设备信息分页
export const getDeviceInfoData = params => post( ehsEquip + '/api/ehs/equip/equipment/account/equipmentData', params);

//设备详情
export const getDeviceDetails = params => post( ehsEquip + '/api/ehs/equip/equipment/account/details', params);

//设备新增
export const deviceSave = params => post( ehsEquip + '/api/ehs/equip/equipment/account/save', params);

//设备删除
export const deviceDelete = params => post( ehsEquip + '/api/ehs/equip/equipment/account/delete', params);

//设备更新
export const deviceUpdate = params => post( ehsEquip + '/api/ehs/equip/equipment/account/update', params);

//设备导入 
export const deviceImport = params => post( ehsEquip + '/api/ehs/equip/equipment/account/importEquipment', params);

//设备导出
export const deviceExport = params => postExcel( ehsEquip + '/api/ehs/equip/equipment/account/export', params);

//-------认证履历页面------//
//认证履历列表 
export const recordList = params => post( ehsEquip + '/api/ehs/equip/equipment/certification/list', params);

//认证履历详情 ×
export const recordDetails = params => post( ehsEquip + '/api/ehs/equip/equipment/certification/details', params);

//认证履历导出 
export const recordExport = params => postExcel( ehsEquip + '/api/ehs/equip/equipment/certification/export', params);

//-------设备变更页面------//
//设备变更列表 
export const changeList = params => post( ehsEquip + '/api/ehs/equip/equipment/change/list', params);

//设备变更新增 
export const changeSave = params => post( ehsEquip + '/api/ehs/equip/equipment/change/save', params);

//设备变更详情 
export const changeDetails = params => post( ehsEquip + '/api/ehs/equip/equipment/change/details', params);

//设备变更删除 
export const changeDelete = params => post( ehsEquip + '/api/ehs/equip/equipment/change/delete', params);

//设备变更删除 
export const changeUpdate = params => post( ehsEquip + '/api/ehs/equip/equipment/change/update', params);

//设备变更删除 
export const changeExport = params => postExcel( ehsEquip + '/api/ehs/equip/equipment/change/export', params);


//-------------设备认证审批--------------//
//设备认证审批列表
export const authList = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/page', params);


//设备认证审批新增
export const authAdd = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/save', params);

//设备认证审批查询
export const authDetails = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/details', params);

//设备认证审批编辑
export const authEdit = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/update', params);

//设备认证审批删除
export const authDelete = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/delete', params);



//设备认证导出
export const authToExport = params => postExcel( ehsEquip + '/api/ehs/equip/equipment/approval/export', params);


//设备认证审批通过
export const authApproved = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/approved', params);

//设备认证审批b驳回和撤回
export const authRejection = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/rejection', params);

//设备认证审批删除
export const authGetLog = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/getLog', params);

//设备认证重新分配
export const authReassign = params => post( ehsEquip + '/api/ehs/equip/equipment/approval/reassign', params);



//设备数据统计
export const deviceData = params => post( ehsEquip + '/api/ehs/equip/equipment/account/dataStatistics', params);

//设备认证导出
export const dataStatisticsExport = params => postExcel( ehsEquip + '/api/ehs/equip/equipment/account/dataStatisticsExport', params);