import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 危险作业台账-列表数据-查询
export const getDangerWorkStaticListApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/select`, params);
// 危险作业台账-新增
export const addDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/save`, params);
// 危险作业台账-详情
export const getDangerWorkStaticDetailApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/selectDetail`, params);
// 危险作业台账-编辑
export const editDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/update`, params);
// 危险作业台账-列表数据-删除
export const rmDangerWorkStaticItemApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/delete`, params);
// 危险作业台账-列表数据-导出
export const exportDangerWorkStaticApi = params => postExcel(`${serviceNameList.safe}/api/ehs/safe/danger/export`, params);

// 危险作业台账-查看-撤回作业
export const revokeDangerWorkStaticItemApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/withdrawCreateUser`, params);
// 危险作业台账-处理-关闭作业
export const closeDangerWorkStaticItemApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/close`, params);
// 危险作业台账-获取人员
export const getDangerWorkStaticPeopleApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/getSecurityUserList`, params);
// 危险作业台账-查看、处理-获取日志
export const getDangerWorkStaticLogApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/getLog`, params);
// 危险作业台账-处理-驳回
export const rejectDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/withdraw`, params);
// 危险作业台账-处理-通过
export const passDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/handerInfo`, params);
// 危险作业台账-处理-暂存
export const stagingDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/handerInfo`, params);