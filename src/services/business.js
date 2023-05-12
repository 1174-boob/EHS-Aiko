//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

//获取业务组织列表
export const GetOrgPageList = params => post(`ehs-customer/api/org/page/list`, params);

//获取全部组织信息
export const GetOrgGroup = params => get(`ehs-customer/api/org/group/list`, params);

//新增业务组织
export const AddOrg = params => post(`ehs-customer/api/org/insert`, params);

//修改业务组织
export const UpdateOrg = params => post(`ehs-customer/api/org/update`, params);

//删除业务组织
export const DelOrg = params => get(`ehs-customer/api/org/delete`, params);

// 获取详情
export const GetOrgDetail = params => get(`ehs-customer/api/org/detail`, params);

// 组织树
export const GetOrgTree = params => get(`ehs-customer/api/org/tree`, params);

// 关联组织
export const BindDept = params => post(`ehs-customer/api/org/bind/dept`, params);
