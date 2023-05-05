//危险源-风险点台账接口
import { get, post, postExcel } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

// 风险等级建筑结构分页列表
export const riskBuildingList = params => post(`${serviceNameList.risk}/api/ehs/risk/building/select`, params);
//建筑结构添加
export const riskBuildingAdd = params => post(`${serviceNameList.risk}/api/ehs/risk/building/save`, params);
//建筑结构编辑
export const riskBuildingUpdate = params => post(`${serviceNameList.risk}/api/ehs/risk/building/update`, params);
//建筑结构删除
export const riskBuildingDelete = params => post(`${serviceNameList.risk}/api/ehs/risk/building/delete`, params);
//根据所属组织查询建筑、楼层级联数据
export const getRiskBuildingTreeData = params => post(`${serviceNameList.risk}/api/ehs/risk/building/tree`, params);
//四色图列表
export const fourColorList = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/select`, params);
//新增四色图
export const fourColorAdd = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/save`, params);
//编辑四色图
export const fourColorUpdate = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/update/picture`, params);
//删除四色图
export const fourColorDelete = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/delete`, params);
//编辑四色图标注信息
export const updateMarkInfo = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/update/item`, params);
//四色图标注详情
export const fourColorDetail = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/detail`, params);
//四色图标注信息保存
export const fourColorMarkInfoSave = params => post(`${serviceNameList.risk}/api/ehs/risk/four/color/picture/update/item`, params);
