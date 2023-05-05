// import {BASE_URL} from '@/services/api'
import {get,post,postExcel} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let ehsKpi = serviceNameList['ehsKpi']

/*--------组织绩效指标------------*/
// 列表分页
export const getKpiIndexList = params => post( ehsKpi + '/api/ehs/kpi/dept/index/page/list', params);

//组织绩效指标 指标新增
export const addKpiIndex = params => post( ehsKpi + '/api/ehs/kpi/dept/index/addOrganizeIndex', params);

//组织绩效指标 指标删除
export const deleteKpiIndex = params => post( ehsKpi + '/api/ehs/kpi/dept/index/deleteOrganizeIndex', params);

//组织绩效指标 指标改
export const editKpiIndexEdit= params => post( ehsKpi + '/api/ehs/kpi/dept/index/editOrganizeIndex', params);

//组织绩效指标 指标查
export const checkKpiIndex = params => post( ehsKpi + '/api/ehs/kpi/dept/index/viewOrganizeIndex', params);


/*---------组织绩效报表-----------*/
//  列表分页
export const getReportFormsList = params => post( ehsKpi + '/api/ehs/kpi/dept/config/page/list', params);

//添加部门
export const addAchDept = params => post( ehsKpi + '/api/ehs/kpi/dept/config/addAchDept', params);

//移除部门
export const deleteAchDept = params => post( ehsKpi + '/api/ehs/kpi/dept/config/deleteAchDept', params);

//选择部门弹出框
export const selectDeptList= params => post( ehsKpi + '/api/ehs/kpi/dept/config/list', params);

//配置指标接口 (列表单个“配置”，“开始配置”)共用接口
export const addAchDeptConfig = params => post( ehsKpi + '/api/ehs/kpi/dept/config/addAchDeptConfig', params);

//查看指标配置详情
export const viewAchDeptConfig = params => post( ehsKpi + '/api/ehs/kpi/dept/config/viewAchDeptConfig', params);


/*---------组织绩效数据填报-----------*/

//  列表分页
export const getDataFillList = params => post( ehsKpi + '/api/ehs/kpi/dept/data/page/list', params);

//根据部门id查询绩效配置
export const queryAchDeptConfig = params => post( ehsKpi + '/api/ehs/kpi/dept/data/queryAchDeptConfig', params);

//填报组织绩效
export const fillInAchDeptData = params => post( ehsKpi + '/api/ehs/kpi/dept/data/fillInAchDeptData', params);

//选择部门下拉框---已配置绩效报表部门
export const selectDeptK= params => post( ehsKpi + '/api/ehs/kpi/dept/data/deptList', params);

//编辑组织绩效数据
export const editAchDeptData = params => post( ehsKpi + '/api/ehs/kpi/dept/data/editAchDeptData', params);

//查看绩效数据
export const viewAchDeptData = params => post( ehsKpi + '/api/ehs/kpi/dept/data/viewAchDeptData', params);

//批量导出
export const batchExport = params => postExcel( ehsKpi + '/api/ehs/kpi/dept/data/batchExport', params);

//删除绩效数据
export const deleteAchDateData = params => post( ehsKpi + '/api/ehs/kpi/dept/data/deleteAchDateData', params);

/*---------组织绩效汇总-----------*/

//  列表分页
export const querySummayDeptData = params => post( ehsKpi + '/api/ehs/kpi/dept/data/querySummayDeptData', params);

//各部门绩效得分统计图（柱状图）
export const achDeptSummaryBar = params => post( ehsKpi + '/api/ehs/kpi/dept/data/achDeptSummaryBar', params);

//各部门分档统计图--饼状
export const achDeptSummaryLevel = params => post( ehsKpi + '/api/ehs/kpi/dept/data/achDeptSummaryLevel', params);



/*---------组织绩效-部门-----------*/

//  列表分页
export const queryDeptData = params => post( ehsKpi + '/api/ehs/kpi/dept/data/queryDeptData', params);

//部门-绩效得分统计图（柱状图）
export const queryDeptBar = params => post( ehsKpi + '/api/ehs/kpi/dept/data/queryDeptBar', params);

//部门-分档统计图--饼状
export const queryDeptLevel = params => post( ehsKpi + '/api/ehs/kpi/dept/data/queryDeptLevel', params);


//环境月报现地 撤回
// export const downloadFile = params => postExcel( envMonth + '/api/ehs/month/environmentMonth/summary/downloadFile', params);
