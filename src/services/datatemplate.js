import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let ziidy = serviceNameList['ziidy']

//数据模板
export const GetDataList = params => post(ziidy + '/api/dataTemplate/getPageList',params);
export const DelDataList = params => get(ziidy + '/api/dataTemplate/delete',params);
export const DraftDataList = params => post(ziidy + '/api/dataTemplate/saveDraft',params);
export const SaveDataList = params => post(ziidy + '/api/dataTemplate/complete', params);
export const DetailDataList = params => get(ziidy + '/api/dataTemplate/getById', params);
export const RefreshDataList = params => get(ziidy + '/api/dataTemplate/refresh', params);
export const UpdateDataList = params => post(ziidy + '/api/dataTemplate/update', params);

//属性
export const GetAttributeList = params => post(ziidy + '/api/dataTemplateProperty/getPageList',params);
export const AddAttributeList = params => post(ziidy + '/api/dataTemplateProperty/save',params);
export const DelAttributeList = params => get(ziidy + '/api/dataTemplateProperty/delete',params);
export const ChangeAttributeList = params => post(ziidy + '/api/dataTemplateProperty/update',params);
export const DetailAttributeList = params => get(ziidy + '/api/dataTemplateProperty/getById', params);

//实例模板
export const GetInstanceList = params => get(ziidy + '/api/dataTemplateProperty/getProperties', params);
export const AddInstanceList = params => post(ziidy + '/api/dataExample/save', params);
export const GetTabHead = params => get(ziidy + '/api/dataExample/getPageHead', params);
export const GetTabBody = params => post(ziidy + '/api/dataExample/getPageList', params);
export const UploadCoedList = params => post(ziidy + '/api/dataExample/update', params);
export const DelCoedList = params => get(ziidy + '/api/dataExample/delete', params);
export const InterfaceUpload = params => post(ziidy + '/api/annex/upload/example', params);


