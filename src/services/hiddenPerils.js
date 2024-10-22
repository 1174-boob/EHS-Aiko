import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config'
let front = serviceNameList['safe']
let customer = serviceNameList['customer']

//获取主部门id和name
export const GetParentResponsibilityDept = params => post(customer + '/api/enterprise/dept/getAdminDeptId', params);

//隐患排查台账模块：
//隐患分页列表
export const GethiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/page/list', params);
//隐患删除
export const DelhiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/delete', params);
//隐患新增
export const AddhiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/add', params);
//隐患编辑
export const UpdatehiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/update', params);
//隐患详情
export const DetailhiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/detail', params);
//延期申请，处理等多个接口
export const DelayhiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/handerInfo', params);
//获取下级审批人
export const GetHiddenNextPeople = params => post(front + '/api/ehs/safe/hide/danger/find/now/handle', params);
//撤回、驳回
export const BackhiddenPerilsList = params => post(front + '/api/ehs/safe/hide/danger/withdraw', params);
//延期通过驳回
export const PassOrBackhiddenPerils = params => post(front + '/api/ehs/safe/hide/danger/delay', params);
//批量导出
export const ExportHiddenList = params => postExcel(front + '/api/ehs/safe/hide/danger/download', params);
//操作日志
export const HiddenLogList = params => post(front + '/api/ehs/safe/hide/danger/getLog', params);
//导入
export const ImportHidden = params => post(front + '/api/ehs/safe/hide/danger/upload', params);
//授权
export const reassignHandlerUser = params => post(front + '/api/ehs/safe/hide/danger/reassign/handler/user', params);
//直接关闭
export const directClose = params => post(front + '/api/ehs/safe/hide/danger/direct/close', params);
//起草人撤回到草稿箱
export const withdrawCreateUser = params => post(front + '/api/ehs/safe/hide/danger/withdraw/create/user', params);

//隐患分页列表
export const GethiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/page/list', params);
//隐患删除
export const DelhiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/delete', params);
//隐患新增
export const AddhiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/add', params);
//隐患编辑
export const UpdatehiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/update', params);
//隐患详情
export const DetailhiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/detail', params);
//延期申请，处理等多个接口
export const DelayhiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/handerInfo', params);
//获取下级审批人
export const GetHiddenNextPeopleAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/find/now/handle', params);
//撤回、驳回
export const BackhiddenPerilsListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/withdraw', params);
//延期通过驳回
export const PassOrBackhiddenPerilsAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/delay', params);
//批量导出
export const ExportHiddenListAssociation = params => postExcel(front + '/api/ehs/safe/association/hide/danger/download', params);
//操作日志
export const HiddenLogListAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/getLog', params);
//导入
export const ImportHiddenAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/upload', params);
//授权
export const reassignHandlerUserAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/reassign/handler/user', params);
//直接关闭
export const directCloseAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/direct/close', params);
//起草人撤回到草稿箱
export const withdrawCreateUserAssociation = params => post(front + '/api/ehs/safe/association/hide/danger/withdraw/create/user', params);