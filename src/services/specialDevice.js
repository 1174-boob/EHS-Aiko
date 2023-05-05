import { get, post, postExcel } from '@/utils/request.js'
// import serviceNameList from '@/config/default/service.config.js'
let serviceNameList = {
  danger: 'ehs-danger'
}
/** 特种设备start */
//特种设备分页查询
export const specialEquipmentList = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/specialEquipment/queryPageList', params, headers)
//特种设备新增
export const specialEquipmentInsert = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/specialEquipment/insert', params, headers)
//特种设备删除
export const specialEquipmentDelete = (params, headers) => get(serviceNameList.danger + '/api/ehs/danger/specialEquipment/delete', params, headers)
//特种设备更新
export const specialEquipmentUpdate = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/specialEquipment/update', params, headers)
//特种设备详情
export const specialEquipmentDetail = (params, headers) => get(serviceNameList.danger + '/api/ehs/danger/specialEquipment/queryBySpecialEquipmentId', params, headers)
//特种设备批量导出
export const specialEquipmentExport = (params, headers) => postExcel(serviceNameList.danger + '/api/ehs/danger/specialEquipmentExcel/export', params, headers)
//特种设备批量导入
export const specialEquipmentImport = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/sepicalEquipmentExcel/importEquipment', params, headers)
//特种设备下载模板
export const specialEquipmentTemplateDown = (params, headers) => postExcel(serviceNameList.danger + '/api/ehs/danger/spcialEquipmentExcel/template1', params, headers)

//安全附件 - 分页列表
export const safeAnnexList = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/safeAnnex/queryByCondition', params, headers)
//安全附件新增
export const safeAnnexInsert = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/safeAnnex/add', params, headers)
//安全附件删除
export const safeAnnexDelete = (params, headers) => get(serviceNameList.danger + '/api/ehs/danger/safeAnnex/delete', params, headers)
//安全附件更新
export const safeAnnexUpdate = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/safeAnnex/update', params, headers)
//安全附件详情
export const safeAnnexDetail = (params, headers) => get(serviceNameList.danger + '/api/ehs/danger/safeAnnex/queryByAnnexId', params, headers)

//安全附件批量导出
export const safeAnnexExcelExport = (params, headers) => postExcel(serviceNameList.danger + '/api/ehs/danger/safeAnnexExcel/exportExcel', params, headers)
//安全附件批量导入
export const safeAnnexExcelImport = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/safeAnnexExcel/importFile', params, headers)
//安全附件下载模板
export const safeAnnexExceltemplateDown = (params, headers) => postExcel(serviceNameList.danger + '/api/ehs/danger/template', params, headers)



