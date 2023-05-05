import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 事故事件-事故事件情况-查询
export const getInjuryOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/injuries`, params);
// 事故事件-事故事件情况-导出
export const exportInjuryOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/injuries/download`, params);
// 事故事件-财产损失情况-查询
export const getPropertyLossOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/damage`, params);
// 事故事件-财产损失情况-导出
export const exportPropertyLossOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/damage/download`, params);
// 事故事件-事故类型情况-查询
export const getAccidentTypeOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/type`, params);
// 事故事件-事故类型情况-导出
export const exportAccidentTypeOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/type/download`, params);
// 事故事件-事故事件类型-查询
export const getEventTypeOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/round/type`, params);
// 事故事件-事故事件类型-导出
export const exportEventTypeOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/round/type/download`, params);
// 事故事件-事故级别情况-查询
export const getEventLevelOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/round/level`, params);
// 事故事件-事故级别情况-导出
export const exportEventLevelOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/event/round/level/download`, params);


// 虚惊未遂事件-事件类型情况-柱状图-查询
export const getNoEventTypeBarOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/type`, params);
// 虚惊未遂事件-事件类型情况-柱状图-导出
export const exportNoEventTypeBarOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/type/download`, params);
// 虚惊未遂事件-事件类型情况-饼状图-查询
export const getNoEventTypePieOptionApi = params => post(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/round/type`, params);
// 虚惊未遂事件-事件类型情况-饼状图-导出
export const exportNoEventTypePieOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/accident/statistical/accident/round/type/download`, params);


// 危险作业管理-作业情况总览-查询
export const getOperationOptionApi = params => post(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/count/bar`, params);
// 危险作业管理-作业情况总览-导出
export const exportOperationOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/count/bar/download`, params);
// 危险作业管理-作业类别-查询
export const getJobCategoryOptionApi = params => post(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/type/bar`, params);
// 危险作业管理-作业类别-导出
export const exportJobCategoryOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/type/bar/download`, params);
// 危险作业管理-作业类别-饼图-查询
export const getJobCategoryPieOptionApi = params => post(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/type/cookie`, params);
// 危险作业管理-作业类别-饼图-导出
export const exportJobCategoryPieOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/type/cookie/download`, params);
// 危险作业管理-作业类型-饼图-查询
export const getJobTypePieOptionApi = params => post(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/common/cookie`, params);
// 危险作业管理-作业类型-饼图-导出
export const exportJobTypePieOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/common/cookie/download`, params);
// 危险作业管理-对比分析-查询
export const getDangerWorkDACompareOptionApi = params => post(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/comp/bar`, params);
// 危险作业管理-对比分析-导出
export const exportDangerWorkDACompareOptionApi = params => postExcel(`${serviceNameList.safe}/api/ehs/safe/data/analysis/operate/statistics/comp/bar/download`, params);

// 教育培训-列表-表头-查询
export const getResourcepoolDAColumnsApi = params => post(`${serviceNameList.course}/api/ehs/statical/data`, params);
// 教育培训-科目数据分析-查询
export const getAccountDAOptionApi = params => post(`${serviceNameList.course}/api/ehs/statical/subjects/data`, params);
// 教育培训-科目数据分析-导出
export const exportAccountDAOptionApi = params => postExcel(`${serviceNameList.course}/api/ehs/statical/subjects/data/download`, params);
// 教育培训-课程场次排名-查询
export const getCourseRankingOptionApi = params => post(`${serviceNameList.course}/api/ehs/statical/matches/ranking`, params);
// 教育培训-课程场次排名-导出
export const exportCourseRankingOptionApi = params => postExcel(`${serviceNameList.course}/api/ehs/statical/matches/ranking/download`, params);
