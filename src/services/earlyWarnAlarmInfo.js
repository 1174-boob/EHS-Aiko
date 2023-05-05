import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 获取污染物-无分页
export const getFlueExhaustGasPollutantsApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/pollutant/list`, params);

// 废气、废水预警信息-列表数据-查询
export const getEarlyWarnInfoListApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/page/list`, params);
// 废气、废水预警信息-数据合计
export const getEarlyWarnInfoListTotalApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/count`, params);
// 废气预警信息-导出
export const exportEarlyWarnInfoItemApi = params => postExcel(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/exportWarning`, params);
// 废气报警信息-导出
export const exportEarlyAlarmInfoItemApi = params => postExcel(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/exportAlarm`, params);
// 废气、废水预警信息-详情
export const getEarlyWarnInfoDetailApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/detail`, params);
// 废气、废水预警信息-处理
export const changeEarlyWarnInfoItemApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/process`, params);
// 废气、废水预警信息-日志
export const getEarlyWarnInfoLogList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/alarm/selectOperateLog`, params);


// 废水、废气报警信息-列表数据-查询
export const getEarlyWarnInfoWasteWaterListApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/page/list`, params);
// 废气、废水报警信息-数据合计
export const getEarlyWarnInfoWasteWaterListTotalApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/count`, params);
// 废水报警信息-导出
export const exportEarlyWarnInfoWasteWaterItemApi = params => postExcel(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/exportWarning`, params);
// 废水报警信息-导出
export const exportEarlyAlarmInfoWasteWaterItemApi = params => postExcel(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/exportAlarm`, params);
// 废水、废气报警信息-详情
export const getEarlyWarnInfoWasteWaterDetailApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/detail`, params);
// 废水、废气报警信息-处理
export const changeEarlyWarnInfoWasteWaterItemApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/process`, params);
// 废水、废气报警信息-日志
export const getEarlyWarnInfoWasteWaterLogList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/alarm/selectOperateLog`, params)


// 废气、水在线监测实时数据-获取
export const getFlueExhaustECRealTimeOptionApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/data/line/data/real/time`, params);
// 废气、水在线监测-日值-获取
export const getFlueExhaustECDayOptionApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/data/line/data/day`, params);
// 废气、水在线监测-月值-获取
export const getFlueExhaustECMonthOptionApiFn = params => post(`${serviceNameList.monitor}/api/ehs/monitor/data/line/data/month`, params);

// 废气在线监测-查看更多-列表获取
export const getFlueGasMonitoringMoreApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/data/line/data/more/gas`, params);
// 废水在线监测-查看更多-列表获取
export const getFlueWaterMonitoringMoreApi = params => post(`${serviceNameList.monitor}/api/ehs/monitor/data/line/data/more/water`, params);




