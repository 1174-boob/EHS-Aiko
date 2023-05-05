import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let ziidy = serviceNameList['ziidy']
//开发者账号
export const GetDevelopersList = params => post(ziidy + '/api/account/page/list',params);
export const AddDevelopersList = params => post(ziidy + '/api/account/add',params);
export const ChangeDevelopersList = params => post(ziidy + '/api/account/update',params);
export const DelDevelopersList = params => get(ziidy + '/api/account/delete',params);