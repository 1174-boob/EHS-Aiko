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
export const getMaturityEvaluationQuotaReportList = params => post( customization + '/api/ehs/kpi/dept/config/page/list', params);

// 成熟度评价 添加部门
export const addMaturityEvaluationQuotaReportDept = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/add', params);

// 成熟度评价 删除部门(列表数据)
export const deleteMaturityEvaluationQuotaReportDept = params => post( customization + '/api/ehs/customization/ax/maturity/evaluation/report/delete', params);

//选择部门弹出框
export const selectMaturityEvaluationQuotaReportDeptList= params => post( customization + '/api/ehs/kpi/dept/config/list', params);

//配置指标接口 (列表单个“配置”，“开始配置”)共用接口
export const addAchDeptConfig = params => post( customization + '/api/ehs/kpi/dept/config/addAchDeptConfig', params);

//查看指标配置详情
export const viewAchDeptConfig = params => post( customization + '/api/ehs/kpi/dept/config/viewAchDeptConfig', params);


/*---------组织绩效数据填报-----------*/

//  列表分页
export const getDataFillList = params => post( customization + '/api/ehs/kpi/dept/data/page/list', params);

//根据部门id查询绩效配置
export const queryAchDeptConfig = params => post( customization + '/api/ehs/kpi/dept/data/queryAchDeptConfig', params);

//填报组织绩效
export const fillInAchDeptData = params => post( customization + '/api/ehs/kpi/dept/data/fillInAchDeptData', params);

//选择部门下拉框---已配置绩效报表部门
export const selectDeptK= params => post( customization + '/api/ehs/kpi/dept/data/deptList', params);

//编辑组织绩效数据
export const editAchDeptData = params => post( customization + '/api/ehs/kpi/dept/data/editAchDeptData', params);

//查看绩效数据
export const viewAchDeptData = params => post( customization + '/api/ehs/kpi/dept/data/viewAchDeptData', params);

//批量导出
export const batchExport = params => postExcel( customization + '/api/ehs/kpi/dept/data/batchExport', params);

//删除绩效数据
export const deleteAchDateData = params => post( customization + '/api/ehs/kpi/dept/data/deleteAchDateData', params);

/*---------组织绩效汇总-----------*/

//  列表分页
export const querySummayDeptData = params => post( customization + '/api/ehs/kpi/dept/data/querySummayDeptData', params);

//各部门绩效得分统计图（柱状图）
export const achDeptSummaryBar = params => post( customization + '/api/ehs/kpi/dept/data/achDeptSummaryBar', params);

//各部门分档统计图--饼状
export const achDeptSummaryLevel = params => post( customization + '/api/ehs/kpi/dept/data/achDeptSummaryLevel', params);



/*---------组织绩效-部门-----------*/

//  列表分页
export const queryDeptData = params => post( customization + '/api/ehs/kpi/dept/data/queryDeptData', params);

//部门-绩效得分统计图（柱状图）
export const queryDeptBar = params => post( customization + '/api/ehs/kpi/dept/data/queryDeptBar', params);

//部门-分档统计图--饼状
export const queryDeptLevel = params => post( customization + '/api/ehs/kpi/dept/data/queryDeptLevel', params);


//环境月报现地 撤回
// export const downloadFile = params => postExcel( envMonth + '/api/ehs/month/environmentMonth/summary/downloadFile', params);
