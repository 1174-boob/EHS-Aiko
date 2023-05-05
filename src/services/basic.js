import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let ziidy = serviceNameList['ziidy']

//标识注册
export const GetBasicList = params => post(ziidy + '/api/register/handle/getPageList',params);
export const DetailBasicList = params => get(ziidy + '/api/register/handle/getById',params);
export const DelBasicList = params => get(ziidy + '/api/register/handle/delete',params);
export const GetDataTemplateList = params => get(ziidy + '/api/dataTemplate/getTemplateList',params);
export const GetDataTemplate = params => get(ziidy + '/api/dataTemplateProperty/getProperties',params);
export const GetInstanceTemplate = params => get(ziidy + '/api/dataExample/getExampleList',params);
export const GetInstanceTemplateFormSet = params => get(ziidy + '/api/dataExample/getExampleInfoById',params);
export const AddBasicDetailList = params => post(ziidy + '/api/register/handle/register',params);
export const ChangeBasicDetailList = params => post(ziidy + '/api/register/handle/updateHandle', params);
export const UploadOk = params => post(ziidy + '/api/annex/upload/register', params);

//企业前缀
export const EnterprisePrefix = params => get(ziidy + '/api/company/getCompanyInfo', params);