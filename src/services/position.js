//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

//获取列表
export const GetPositonList = params => post(`${serviceNameList.customer}/api/position/page/list`, params);

//新增职位
export const AddOPositon = params => post(`${serviceNameList.customer}/api/position/save`, params);

//修改职位
export const UpdateOPositon = params => post(`${serviceNameList.customer}/api/position/update`, params);

//删除职位
export const DelOPositon = params => post(`${serviceNameList.customer}/api/position/delete`, params);

//删除职位
export const GetOPositonCode = params => post(`${serviceNameList.customer}/api/position/getCode`, params);

