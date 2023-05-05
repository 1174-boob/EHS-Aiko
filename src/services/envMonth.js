// import {BASE_URL} from '@/services/api'
import {get,post,postExcel} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let envMonth = serviceNameList['envMonth']

//环境月报-现地 列表分页
export const getEnvMonthList = params => post( envMonth + '/api/ehs/month/environmentMonth/page', params);

//提交前校验是否重复提交 
export const checkOut = params => post( envMonth + '/api/ehs/month/environmentMonth/checkOut', params); 

//环境月报-现地 新增
export const saveEnvMonth = params => post( envMonth + '/api/ehs/month/environmentMonth/save', params);

//环境月报-现地 详情
export const detailsEnvMonth = params => post( envMonth + '/api/ehs/month/environmentMonth/details', params);


//环境月报-现地 修改
export const update = params => post( envMonth + '/api/ehs/month/environmentMonth/update', params);


//环境月报汇总 数据汇总表
export const environmentMonthList = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthList', params);


//环境月报汇总 单耗环比
export const environmentMonthRingratio = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthRingratio', params);



//环境月报汇总 环境指标
export const environmentMonthDetailed = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthDetailed', params);

//环境月报汇总 碳排放量月份数据
export const environmentMonthCarbonemissions = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthCarbonemissions', params);

//环境月报汇总 碳排放量月份数据统计图
export const environmentMonthCarbonemissionsStatistics = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthCarbonemissionsStatistics', params);

//环境月报汇总 碳排放量子模块汇总
export const listEnvironmentMonthlySubmodule = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/listEnvironmentMonthlySubmodule', params);

//环境月报汇总 碳排放量部门数据统计图
export const environmentMonthEmissionStatistics = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthEmissionStatistics', params);





//环境月报汇总 电量子模块汇总
export const listEnvironmentMonthlyPowerSubmodule = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/listEnvironmentMonthlyPowerSubmodule', params);

//环境月报汇总 电量月份数据
export const environmentMonthPower = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthPower', params);

//环境月报汇总 水资源管理子模块汇总
export const listEnvironmentMonthlyWaterResourceSubmodule = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/listEnvironmentMonthlyWaterResourceSubmodule', params);

//环境月报汇总 水资源管理月份数据
export const environmentMonthWaterResource = params => post( envMonth + '/api/ehs/month/environmentMonth/summary/environmentMonthWaterResource', params);



//环境月报汇总 天然气boe接口
export const naturalBOE = params => post( envMonth + '/api/ehs/month/environmentMonth/naturalBOE', params);

//环境月报汇总 水资源管理月份数据
export const naturalLocal = params => post( envMonth + '/api/ehs/month/environmentMonth/naturalLocal', params);
  


//环境月报汇总 废气物boe接口
export const wasteBOE = params => post( envMonth + '/api/ehs/month/environmentMonth/wasteBOE', params);

//环境月报汇总 水资源管理月份数据
export const wasteLocal = params => post( envMonth + '/api/ehs/month/environmentMonth/wasteLocal', params);


//环境月报汇总 废水废气污染物排放
export const wasteWaterAndGas = params => post( envMonth + '/api/ehs/month/environmentMonth/wasteWaterAndGas', params);

//环境月报汇总 废水废气污染物排放折线图
export const wasteWaterAndGasLineChart = params => post( envMonth + '/api/ehs/month/environmentMonth/wasteWaterAndGasLineChart', params);


//环境月报汇总 在线均值对比
export const meanComparison = params => post( envMonth + '/api/ehs/month/environmentMonth/meanComparison', params);



//环境月报汇总 在线均值对比
export const wasteWater = params => post( envMonth + '/api/ehs/month/environmentMonth/wasteWater', params);



//环境月报现地 导出
export const envMonthExport = params => postExcel( envMonth + '/api/ehs/month/environmentMonth/export', params);

//环境月报现地 审批提交
export const envMonthSubmit = params => post( envMonth + '/api/ehs/month/environmentMonth/submit', params);

//环境月报现地 通过
export const envMonthApproved = params => post( envMonth + '/api/ehs/month/environmentMonth/approved', params);

//环境月报现地 驳回
export const envMonthApprovalRejection = params => post( envMonth + '/api/ehs/month/environmentMonth/approvalRejection', params);

//环境月报现地 撤回
export const envMonthApprovalWithdraw = params => post( envMonth + '/api/ehs/month/environmentMonth/approvalWithdraw', params);

//环境月报现地 撤回
export const getLog = params => post( envMonth + '/api/ehs/month/environmentMonth/getLog', params);


//环境月报现地 撤回
export const downloadFile = params => postExcel( envMonth + '/api/ehs/month/environmentMonth/summary/downloadFile', params);
