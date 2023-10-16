import {get,post,postExcel} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

// 三级安全教育-列表-获取
export const getSafetyEduTableList = params => post(`${serviceNameList.health}/api/ehs/security/education/records/pageList`, params);
// 三级安全教育-详细人数(五个格)
export const getSafetyEduPeopleNum = params => post(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);

// 三级安全教育-批量推送
export const pushBatchSafetyEdu = params => post(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);
// 三级安全教育-更新上岗意见
export const pdateSafetyEduOnboarding = params => post(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);
// 三级安全教育-批量签署
export const signBatchSafetyEduApi = params => post(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);
// 三级安全教育-单独签署
export const signSingleSafetyEduApi = params => post(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);
// 三级安全教育-批量导出
export const exportSafetyEduListApi = params => postExcel(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);
// 三级安全教育-删除
export const rmSafetyEduItemApi = params => post(`${serviceNameList.health}/api/ehs/security/safety/responsibility/statement/count`, params);

// 签名管理-获取签名
export const getSignManagementDataApi = params => post(`${serviceNameList.health}/api/ehs/security/seal/data/list/page`, params);
// 签名管理-保存签名
export const addSignManagementDataApi = params => post(`${serviceNameList.health}/api/ehs/security/seal/data/add`, params);
// 签名管理-更改签名
export const editSignManagementDataApi = params => post(`${serviceNameList.health}/api/ehs/security/seal/data/edit`, params);
// 签名管理-删除签名
export const rmSignManagementDataApi = params => post(`${serviceNameList.health}/api/ehs/security/seal/data/delete`, params);


