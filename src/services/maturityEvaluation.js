// import {BASE_URL} from '@/services/api'
import {get,post,postExcel} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let customization = serviceNameList['customization']

/*--------成熟度评价指标------------*/
// 列表分页
export const getMaturityEvaluaList = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/index/list/page', params);

//成熟度评价指标 指标新增
export const addMaturityEvalua = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/index/add', params);

//成熟度评价指标 指标删除
export const deleteMaturityEvalua = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/index/delete', params);

//成熟度评价指标 指标改
export const editMaturityEvaluaEdit= params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/index/edit', params);

//成熟度评价指标 指标查详情
export const getMaturityEvaluaItemDetails = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/index/detail', params);


/*---------成熟度评价报表-----------*/
// 成熟度评价 列表分页
export const getMaturityEvaluationQuotaReportList = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/list/page', params);

// 成熟度评价 添加部门
export const addMaturityEvaluationQuotaReportDept = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/add', params);

// 成熟度评价 删除部门(列表数据)
export const deleteMaturityEvaluationQuotaReportDept = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/delete', params);

// 选择部门弹出框
export const getMaturityEvaluationQuotaReportNoPageList= params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/list', params);

//配置指标接口 (列表单个“配置”，“开始配置”)共用接口
export const addMaturityEvaluationQuotaReportConfig = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/edit', params);

//查看指标配置详情
export const getMaturityEvaluationQuotaReportConfigDetails = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/detail', params);


/*---------成熟度评价数据填报-----------*/
// 列表分页
export const getMaturityEvaluationDataList = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/list/page', params);

//删除绩效数据
export const rmMaturityEvaDataConfigDataItem = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/delete', params);

// 获取详情
export const getMaturityEvaDataConfigDetails = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/detail', params);

// 填报成熟度评价数据
export const fillMaturityEvaDataConfigData = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/edit', params);

// 导出成熟度评价数据
export const exportMaturityEvaDataConfigData = params => postExcel( customization + '/api/ehs/customization/ax/maturity/evaluation/data/download', params);


/*---------组织绩效汇总-----------*/

//  评价结果
export const getMaturityEvaDataSumEvaluatResult = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/analysis/evaluation/results', params);

//  主要扣分明细
export const getMaturityEvaDataSumDeductPoints = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/analysis/details/of/major/deductions', params);

//  部门得分环比统计
export const getMonthStatisics = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/analysis/department/score/month/on/month/statistics', params);

//  部门得分月度统计
export const getDepartmentScore = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/data/analysis/monthly/statistics/of/department/score', params);

//各部门绩效得分统计图（柱状图）
export const achDeptSummaryBar = params => post( customization + '/api/ehs/kpi/dept/data/achDeptSummaryBar', params);

//各部门分档统计图--饼状
export const achDeptSummaryLevel = params => post( customization + '/api/ehs/kpi/dept/data/achDeptSummaryLevel', params);



