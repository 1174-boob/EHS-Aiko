import { post } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js';

// 分页危险源评审列表
export const reviewSelect = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/review/select`, params);
// 查询危险源台账评审详情
export const reviewSelectDetail = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/review/selectDetail`, params);
// 评审
export const reviewInfo = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/review/reviewInfo`, params);
// 退回
export const returnReview = params => post(`${serviceNameList.risk}/api/ehs/risk/detail/review/returnReview`, params);
