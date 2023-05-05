import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'
let front = serviceNameList.risk

// export const getToken = (params, headers) => get(serviceNameList.authehs + '/api/token/getToken', params, headers);
//风险排查频次库列表
export const getFrequencyList = (params) => post(front + '/api/ehs/risk/check/frequency/list', params);
//编辑风险排查频次库
export const updateFrequency = (params) => post(front + '/api/ehs/risk/check/frequency/update', params);

//危险源清单共性列表
export const GetCommonList = (params) => post(front + '/api/ehs/risk/detail/public/select', params);
//危险源清单共性删除
export const DelCommonList = (params) => post(front + '/api/ehs/risk/detail/public/delete', params);
//危险源清单共性详情
export const DetailCommonList = (params) => post(front + '/api/ehs/risk/detail/public/selectDetail', params);
//危险源清单共性编辑
export const EditCommonList = (params) => post(front + '/api/ehs/risk/detail/public/update', params);
//危险源清单共性导出
export const ExportCommonList = (params) => postExcel(front + '/api/ehs/risk/detail/public/export', params);


//危险源清单特异性列表
export const GetSpecificityList = (params) => post(front + '/api/ehs/risk/detail/specific/select', params);
//危险源清单特异性删除
export const DelSpecificityList = (params) => post(front + '/api/ehs/risk/detail/specific/delete', params);
//危险源清单特异性详情
export const DetailSpecificityList = (params) => post(front + '/api/ehs/risk/detail/specific/selectDetail', params);
//危险源清单特异性编辑
export const EditSpecificityList = (params) => post(front + '/api/ehs/risk/detail/specific/update', params);
//危险源清单特异性导出
export const ExportSpecificityList = (params) => postExcel(front + '/api/ehs/risk/detail/specific/export', params);


//分类配置列表
export const GetClassList = (params) => post(front + '/api/ehs/risk/detail/config/select', params);
//分类配置新增
export const AddClassList = (params) => post(front + '/api/ehs/risk/detail/config/save', params);
//分类配置编辑
export const EditClassList = (params) => post(front + '/api/ehs/risk/detail/config/update', params);
//分类配置删除
export const DelClassList = (params) => post(front + '/api/ehs/risk/detail/config/delete', params);
//查询全部所属分类
export const AllClassList = (params) => post(front + '/api/ehs/risk/detail/config/selectClassification', params);
//查询所属组织
export const GetOrganizationList = (params) => post(front + '/api/ehs/risk/detail/config/selectCorporation', params);







