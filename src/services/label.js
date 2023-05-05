//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

//获取标签组列表
export const GetLabelPageList = params => post(`${serviceNameList.customer}/api/label/page/list`, params);

//新增标签组
export const AddOLabel = params => post(`${serviceNameList.customer}/api/label/add`, params);

//修改标签组
export const UpdateOLabel = params => post(`${serviceNameList.customer}/api/label/update`, params);

//删除标签组
export const DelOLabel = params => get(`${serviceNameList.customer}/api/label/delete`, params);

// 标签新增｜修改 -> 提交
export const LabelItemAdd = params => post(`${serviceNameList.customer}/api/label/item/commit`, params);

// 删除标签
export const DelOItemLabel = params => get(`${serviceNameList.customer}/api/label/item/delete`, params);

// 获取标签
export const GetItemLabel = params => post(`${serviceNameList.customer}/api/label/item/list`, params);
