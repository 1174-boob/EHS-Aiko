//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

// 控制台角色--获取角色列表
export const getConsoleRoleList = params => post(`${serviceNameList.customer}/api/role/page/list`, params);
// 控制台角色--获取角色权限树
export const getConsoleRoleTree = params => get(`${serviceNameList.customer}/api/resource/queryResourceTree`, params);
// 控制台角色--新增角色
export const addConsoleRole = params => post(`${serviceNameList.customer}/api/role/addOrUpdate`, params);
// 控制台角色--获取角色详情
export const getConsoleRoleItemDetail = params => get(`${serviceNameList.customer}/api/role/detail`, params);
// 控制台角色--修改角色
export const changeConsoleRole = params => post(`${serviceNameList.customer}/api/role/addOrUpdate`, params);
// 控制台角色--删除角色
export const rmConsoleRole = params => post(`${serviceNameList.customer}/api/role/delete`, params);
