import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js';

// 分页危险源台账列表
export const accountSelect = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/account/select`, params);
// 新增危险源台账
export const accountSave = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/account/save`, params);
// 查询危险源台账详情
export const selectAccountDetail = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/account/selectDetail`, params);
// 删除危险源台账
export const accountDelete = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/account/delete`, params);
// 编辑危险源台账
export const accountUpdate = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/account/update`, params);
// 导出危险源台账详情
export const accountExport = params => postExcel(`${serviceNameList.risk}/api/ehs/risk/detail/account/export`, params);
// 根据组织机构查询对应分类下的所有组织机构
export const selectClassByCorporation = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/config/selectClassByCorporation`, params);
// 指定对应专家信息
export const reviewSave = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/review/save`, params);
// 评审专家列表信息
export const reviewExpert = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/review/selectExpert`, params);