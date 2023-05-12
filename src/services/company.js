//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

// 权限--部门 获取列表
export const getDepartmentList = params => post(`ehs-customer/api/enterprise/dept/pageList`, params);
// 权限--部门 获取组织架构
export const getDepartmentTree = params => get(`ehs-customer/api/enterprise/dept/tree`, params);
// 权限--部门 新增
export const addDepartmentItem = params => post(`ehs-customer/api/enterprise/dept/add`, params);
// 权限--部门 修改
export const changeDepartmentItem = params => post(`ehs-customer/api/enterprise/dept/update`, params);
// 权限--部门 查看获取详情--表单信息
export const getDepartmentDetails = params => get(`ehs-customer/api/enterprise/dept/detail`, params);
//权限 --部门 批量删除
export const rmDepartmentItemAll = params => post(`ehs-customer/api/enterprise/dept/batch/delete`, params);
// 权限--部门 删除
export const rmDepartmentItem = params => get(`ehs-customer/api/enterprise/dept/delete`, params);
//权限-数据同步-部门
export const SynchronousDept = params => get(`ehs-customer/api/company/dept/sync`, params);
// 权限--部门 获取组织内所有用户
export const getAllUserByCompanyId = params => get(`ehs-customer/api/user/getAllUserByCompanyId`, params);
