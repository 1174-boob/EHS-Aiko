import {
    get,
    post,
    postExcel
} from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config'
let front = serviceNameList['safe']
let danger = serviceNameList['danger']

//图标：
//隐患数量统计
export const GetChartsList = params => post(front + '/api/ehs/safe/data/analysis/danger/statistics/count/bar', params);
//隐患类别
export const GetCategoryChartsList = params => post(front + '/api/ehs/safe/data/analysis/danger/statistics/category/cookie', params);
//隐患级别
export const GetLevelChartsList = params => post(front + '/api/ehs/safe/data/analysis/danger/statistics/level/cookie', params);
//隐患整改情况
export const GetRectificationChartsList = params => post(front + '/api/ehs/safe/data/analysis/danger/statistics/rectification/bar', params);
//隐患超期统计
export const GetExceedChartsList = params => post(front + '/api/ehs/safe/data/analysis/danger/statistics/exceed/bar', params);
//隐患对比分析
export const GetCompChartsList = params => post(front + '/api/ehs/safe/data/analysis/danger/statistics/comp/bar', params);
//隐患数量统计-导出
export const ExoprtChartsList = params => postExcel(front + '/api/ehs/safe/data/analysis/danger/statistics/count/bar/downLoad', params);
//隐患类别-导出
export const ExoprtCategoryChartsList = params => postExcel(front + '/api/ehs/safe/data/analysis/danger/statistics/category/cookie/download', params);
//隐患级别-导出
export const ExoprtLevelChartsList = params => postExcel(front + '/api/ehs/safe/data/analysis/danger/statistics/level/cookie/download', params);
//隐患整改情况-导出
export const ExoprtRectificationChartsList = params => postExcel(front + '/api/ehs/safe/data/analysis/danger/statistics/rectification/bar/download', params);
//隐患超期情况-导出
export const ExoprtExceedChartsList = params => postExcel(front + '/api/ehs/safe/data/analysis/danger/statistics/exceed/bar/download', params);
//对比分析-导出
export const ExoprtCompChartsList = params => postExcel(front + '/api/ehs/safe/data/analysis/danger/statistics/comp/bar/download', params);

//危险作业情况-总览页
export const GetStatisticsChartsList = params => post(front + '/api/ehs/safe/data/analysis/operate/statistics/count/bar', params);
//作业类别-总览页
export const GetStatisticsChartsTypeList = params => post(front + '/api/ehs/safe/data/analysis/operate/statistics/type/cookie', params);

//应急演练
//应急演练类型
export const GetStatisticsChartsTypeCookie = params => post(danger + '/api/ehs/danger/data/analysis/drill/statistics/type/cookie', params);
//应急演练类型-导出
export const ExoprtStatisticsChartsTypeCookie = params => postExcel(danger + '/api/ehs/danger/data/analysis/drill/statistics/type/cookie/download', params);
//应急演练级别
export const GetStatisticsChartsLeveCookie = params => post(danger + '/api/ehs/danger/data/analysis/drill/statistics/level/cookie', params);
//应急演练级别-导出
export const ExoprtStatisticsChartsLeveCookie = params => postExcel(danger + '/api/ehs/danger/data/analysis/drill/statistics/level/cookie/download', params);
//应急演练级别数据柱图
export const GetStatisticsChartsLeveBar = params => post(danger + '/api/ehs/danger/data/analysis/drill/statistics/level/bar', params);
//应急演练级别数据柱图-导出
export const ExoprtStatisticsChartsLeveBar = params => postExcel(danger + '/api/ehs/danger/data/analysis/drill/statistics/level/bar/download', params);
//应急演练类型数据柱图
export const GetStatisticsChartsTypeBar = params => post(danger + '/api/ehs/danger/data/analysis/drill/statistics/type/bar', params);
//应急演练类型数据柱图-导出
export const ExoprtStatisticsChartsTypeBar = params => postExcel(danger + '/api/ehs/danger/data/analysis/drill/statistics/type/bar/download', params);
//应急演练总览
export const GetStatisticsChartsOverviewBar = params => post(danger + '/api/ehs/danger/data/analysis/drill/statistics/overview/bar', params);
//应急演练总览-导出
export const ExoprtStatisticsChartsOverviewBar = params => postExcel(danger + '/api/ehs/danger/data/analysis/drill/statistics/overview/bar/download', params);