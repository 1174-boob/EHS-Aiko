import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 值班表管理-配置值班表-详情
export const getOndutyConfigDetailApi = params => get(`${serviceNameList.danger}/api/ehs/duty/cor/detail`, params);
// 值班表管理-配置值班表-新增
export const addOndutyConfigApi = params => post(`${serviceNameList.danger}/api/ehs/duty/cor/update`, params);
// 值班表管理-报警记录
export const getAlarmRecordApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);
// 值班表管理-故障维修记录
export const getTroubleShootingApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);
// 值班表管理-测试记录
export const getTestRecordApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);
// 值班表管理-巡检记录
export const getInspectionRecordApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);
// 值班表管理-事件记录
export const getEventRecordApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);
// 值班表管理-消防系统CRT每日检测
export const getFireFightingSystemApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);
// 值班表管理-消防业务电话记录表
export const getFirePhoneRecordApi = params => post(`${serviceNameList.danger}/api/ehs/danger/danger/selectDetail`, params);

// 值班表记录-详情
export const getOndutyRecordDetailApi = params => get(`${serviceNameList.danger}/api/ehs/duty/table/detail`, params);
// 值班表记录-报警记录--列表
export const getOndutyAlarmRecordApi = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/fire/list`, params);
// 值班表记录-故障维修记录--列表
export const getOndutyTroubleShootingApi = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/list`, params);
// 值班表记录-故障维修记录--修改
export const editOndutyTroubleShootingApi = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/maintenance`, params);
// 值班表记录-测试记录--列表
export const getOndutyTestRecordApi = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/list`, params);
// 值班表记录-巡检记录、事件记录--列表
export const getInspectionRecordListApi = params => post(`${serviceNameList.danger}/api/ehs/duty/history/list`, params);
// 值班表记录-巡检记录、事件记录--新增
export const addInspectionRecordApi = params => post(`${serviceNameList.danger}/api/ehs/duty/history/add`, params);
// 值班表记录-巡检记录、事件记录--编辑
export const editInspectionRecordApi = params => post(`${serviceNameList.danger}/api/ehs/duty/history/update`, params);
// 值班表记录-巡检记录、事件记录--删除
export const rmInspectionRecordApi = params => get(`${serviceNameList.danger}/api/ehs/duty/history/delete`, params);


// 值班记录-消防业务电话记录表--列表
export const getFirePhoneRecordListApi = params => post(`${serviceNameList.danger}/api/ehs/duty/tel/list`, params);
// 值班记录-消防业务电话记录表--新增
export const addFirePhoneRecordListApi = params => post(`${serviceNameList.danger}/api/ehs/duty/tel/add`, params);
// 值班记录-消防业务电话记录表--编辑
export const editFirePhoneRecordListApi = params => post(`${serviceNameList.danger}/api/ehs/duty/tel/update`, params);
// 值班记录-消防业务电话记录表--删除
export const rmFirePhoneRecordItemApi = params => get(`${serviceNameList.danger}/api/ehs/duty/tel/delete`, params);


// 值班表记录-消防系统CRT每日检测--修改
export const editOndutyFireFightingSystemApi = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/list`, params);
// 值班表记录-提交-编辑
export const editOndutyRecordApi = params => post(`${serviceNameList.danger}/api/ehs/duty/table/update`, params);
// 值班表记录-交接班
export const ondutyRecordChangeShiftsApi = params => post(`${serviceNameList.danger}/api/ehs/duty/table/handover`, params);