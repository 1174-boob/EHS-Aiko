//危险源-风险点台账接口
import { get, post, postExcel } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

// 风险点台账-列表数据-查询
export const getRiskBookListApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/select`, params);
// 风险点台账-新增
export const addRiskBookApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/save`, params);
// 风险点台账-根据风险等级-获取管控层级
export const getControlsLevelByRiskLevelApi = params => post(`${serviceNameList.risk}/api/ehs/risk/check/frequency/list/by-riskLevel `, params);
// 风险点台账-详情
export const getRiskBookDetailApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/detail`, params);
// 风险点台账-编辑
export const editRiskBookApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/update`, params);
// 风险点台账-变更
export const changeRiskBookApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/newSubmit`, params);
// 风险点台账-列表数据-删除
export const rmRiskBookItemApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/delete`, params);
// 风险点台账-列表数据-导出
export const exportRiskBookApi = params => postExcel(`${serviceNameList.risk}/api/ehs/risk/point/export`, params);


// 风险点审批-列表数据-查询
export const getRiskApprovalListApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/select`, params);
// 风险点台账-选择风险点-列表数据-查询
export const getRiskApprovalGetRiskBookListApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/list/no-submit`, params);
// 风险点审批-新增
export const addRiskApprovalApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/save`, params);
// 风险点审批-详情
export const getRiskApprovalDetailApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/detail`, params);
// 风险点审批-编辑
export const changeRiskApprovalApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/update`, params);
// 风险点审批-列表数据-删除
export const rmRiskApprovalItemApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/delete`, params);
// 风险点审批-获取审批人
export const getRiskUserNodeInfo = params => post(`${serviceNameList.risk}/api/ehs/process/node/selectNodeUser`, params);
// 风险点审批-处理-驳回
export const riskApprovalHandleRejectApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/fail`, params);
// 风险点审批-处理-通过
export const riskApprovalHandlePassApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/success`, params);
// 风险点审批-处理-最后一个节点-归档
export const riskApprovalHandleSaveFilingApi = params => post(`${serviceNameList.risk}/api/ehs/risk/point/approval/complete`, params);