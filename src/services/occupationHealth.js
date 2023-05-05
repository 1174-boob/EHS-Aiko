import { get, post } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

/** 职业健康 */
//获取危险因素数据
export const getSelectHarm = (params) => post(serviceNameList.health + '/api/ehs/health/statistics/selectHarm', params)
//获取统计数据现地
export const selectHarmDataSite = (params) => post(serviceNameList.health + '/api/ehs/health/statistics/selectHarmDataSite', params)
//获取统计数据(有时间岗位)
export const selectHarmDataSiteCode = (params) => post(serviceNameList.health + '/api/ehs/health/statistics/selectHarmDataSiteCode', params)
//获取危险因素数据
export const selectHarmDataGroup = (params) => post(serviceNameList.health + '/api/ehs/health/statistics/selectHarmDataGroup', params)



/*职业危害因素检测*/
//自主检测列表
export const independentTestingPageList = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/independentTesting/page/list', params)
//自主检测-检测记录
export const checkHistory = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/independentTesting/checkHistory', params)
//自主检测-检测记录-新增
export const checkHistoryAdd = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/independentTesting/checkHistory/add', params)
export const checkHistoryEdit = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/independentTesting/checkHistory/update', params)


//定期委外列表
export const outsourcingPageList = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/page/list', params)
//定期委外-检测记录
export const outsourcingCheckHistory = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/checkHistory', params)
//定期委外-岗位检测项目
export const checkProject = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/checkHistory/checkProject', params)
//定期委外-检测记录-新增
export const outsourcingcCeckHistoryAdd = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/checkHistory/details/add', params)
//定期委外-历史记录-检测值明细
export const checkHistoryDetails = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/checkHistory/details', params)
//定期委外-检测记录-修改检测值
export const checkHistoryUpdate = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/checkHistory/details/update', params)
//定期委外-检测记录-修改检测值
export const checkHistoryFileUpdate = (params) => post(serviceNameList.health + '/api/ehs/harm/factor/outsourcing/checkHistory/file/update', params)
//获取检测项目
export const getHarmAll = (params) => get(serviceNameList.health + '/api/ehs/harm/factor/all', params)
//获取所有岗位
export const getPostAll = (params) => post(serviceNameList.health + '/api/ehs/dangerous/station/all', params)