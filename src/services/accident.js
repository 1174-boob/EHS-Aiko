import { get, post, postExcel } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

/** 事故事件 虚惊未遂start */
//虚惊未遂事件分页查询
export const falseAlarmList = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/page/list', params, headers)
//虚惊新增
export const falseAlarmAdd = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/add', params, headers)
//虚惊修改
export const falseAlarmUpdate = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/update', params, headers)
//虚惊详情
export const falseAlarmDetail = (params, headers) => get(serviceNameList.safe + '/api/ehs/accident/detail', params, headers)
//虚惊删除
export const falseAlarmDelete = (params, headers) => get(serviceNameList.safe + '/api/ehs/accident/delete', params, headers)
//虚惊批量导出
export const falseAlarmMultiExport = (params, headers) => postExcel(serviceNameList.safe + '/api/ehs/accident/download', params, headers)
//虚惊未遂，流程处理
export const falseAlarmProcess = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/process', params, headers)
//虚惊操作日志
export const falseAlarmLog = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/getLog', params, headers)
//



// 事故事件分页查询
export const accidentEventPageList = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/page/list', params, headers)
// 事故事件新增
export const accidentEventAdd = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/add', params, headers)
// 事故事件删除
export const accidentEventDelete = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/delete', params, headers)
// 事故事件更新
export const accidentEventUpdate = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/update', params, headers)
// 事故事件详情
export const accidentEventDetail = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/detail', params, headers)
// 事故事件审批单处理
export const accidentEventHanderInfo = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/process', params, headers)
// 事故事件导出
export const accidentEventDownload = (params, headers) => postExcel(serviceNameList.safe + '/api/ehs/accident/event/download', params, headers)
// 事故事件日志
export const accidentEventGetLog = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/getLog', params, headers)
// 事故事件添加培训任务
export const accidentUploadFile = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/event/train/task/upload/file', params, headers)


// 事故快报分页查询
export const accidentReportPageList = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/report/page/list', params, headers)
// 事故快报新增
export const accidentReportAdd = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/report/add', params, headers)
// 事故快报删除
export const accidentReportDelete = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/report/delete', params, headers)
// 事故快报更新
export const accidentReportUpdate = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/report/update', params, headers)
// 事故快报详情
export const accidentReportDetail = (params, headers) => post(serviceNameList.safe + '/api/ehs/accident/report/detail', params, headers)
// 事故快报导出
export const accidentReportDownload = (params, headers) => postExcel(serviceNameList.safe + '/api/ehs/accident/report/download', params, headers)