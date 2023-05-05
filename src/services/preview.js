import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

export const EnterprisePrefix = params => get('/boeplat-ziid/api/company/getCompanyInfo', params);
