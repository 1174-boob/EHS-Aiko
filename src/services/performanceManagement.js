import { get, post, postExcel } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

/** 绩效管理 */
// 指标-分页-删除-编辑-新增-查询
export const getIndexSelect = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/index/select', params)
export const indexDelete = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/index/delete', params)
export const indexUpdate = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/index/update', params)
export const indexSave = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/index/save', params)
export const indexSelectDetail = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/index/selectDetail', params)

// 管理绩效数据
// 分页管理绩效数据列表
export const orgDataSelect = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/select', params)
// 保存管理绩效数据
export const orgDataSave = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/save', params)
// 查看管理绩效数据详情
export const orgDataselectDetail = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/selectDetail', params)
// 编辑管理绩效数据
export const orgDataUpdate = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/update', params)
// 删除
export const orgDataDelete = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/delete', params)
// 详情-新加
export const orgDataSelectDetailBySummary = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/selectDetailBySummary', params)
// 导出
export const orgDataExport = (params) => postExcel(serviceNameList.kpi + '/api/ehs/kpi/org/data/export', params)

// 现地
// 现地数据柱状图
export const orgDataAnalysisHistogram = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/analysisHistogram', params)
// 现地数据饼状图
export const orgDataanalysisBar = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/analysisBar', params)

// 绩效汇总
// 汇总数据柱状图
export const orgDataAnalysisHistogramSummary = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/analysisHistogramSummary', params)
// 汇总数据饼状图
export const orgDataAnalysisBarSummary = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/analysisBarSummary', params)
// 汇总列表
export const orgDataSelectSummary = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/selectSummary', params)
// 提交审批
export const orgDataSaveApproval = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/saveApproval', params)
// 通过
export const orgDataHandlerApproval = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/handlerApproval', params)
// 驳回
export const orgDataReturnHandler = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/returnHandler', params)
// 审批列表
export const orgDataSelectApproval = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/selectApproval', params)
// 详情
export const orgDataSelectApprovalDetail = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/selectApprovalDetail', params)
// 日志
export const orgDataGetLog = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/org/data/getLog', params)

// 绩效报表
// 配置报表-选择组织列表
export const organizationSelect = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/organization/select', params)
// 配置报表-保存
export const organizationSave = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/organization/save', params)
// 配置报表-查看
export const organizationSelectDetail = (params) => post(serviceNameList.kpi + '/api/ehs/kpi/organization/selectDetail', params)


