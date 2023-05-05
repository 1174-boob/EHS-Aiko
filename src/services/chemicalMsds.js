import { get, post } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

/** 化学品MSDS管理、培训资料库 */
//化学品msds审批列表
export const getMsdsApproveList = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/select', params, headers)
//化学品msds审批新建保存
export const msdsApproveSave = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/save', params, headers)
//化学品msds审批编辑保存
export const msdsApproveUpdate = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/update', params, headers)
//查询详情化学品MSDS审批
export const msdsApproveDetail = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/selectDetail', params, headers)
//删除化学品审批-草稿列表页
export const msdsApproveDelete = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/delete', params, headers)

//根据化学品名称获取详情
export const getDetailByChemicalName = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/list/msds/detail', params, headers)

//化学品msds审批通过
export const msdsApproveResolve = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/approval', params, headers)
//化学品msds审批驳回
export const msdsApproveReject = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/rejection', params, headers)
//化学品msds审批存草稿
export const msdsApproveSavaDraft = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/saveDraft', params, headers)
//化学品msds查询对应节点人员
export const msdsApproveNodeUser = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/user/selectNodeUser', params, headers)

//分页查询msds信息列表
export const msdsStoreList = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/selectFiling', params, headers)
//msds信息列表页删除
export const msdsStoreDelete = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/deleteFiling', params, headers)

//msds信息当前用户信息
export const msdsGetUserInfo = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/user/getUserInfo', params, headers)
//msds审批完归档
export const msdsApproveSaveFiling = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/msds/saveFiling', params, headers)

//化学品培训资料库分页列表
export const msdsCourseList = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/course/pageList', params, headers)
//化学品培训资料库新增
export const msdsCourseSave = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/course/save', params, headers)
// 化学品培训资料库修改
export const msdsCourseUpdate = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/course/update', params, headers)
// 化学品培训资料库详情
export const msdsCourseDelete = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/course/delete', params, headers)
// 化学品培训资料库删除
export const msdsCourseDetail = (params, headers) => post(serviceNameList.chemicals + '/api/ehs/chemical/course/detail', params, headers)

