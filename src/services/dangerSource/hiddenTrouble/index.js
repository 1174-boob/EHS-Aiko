//危险源接口
import { get, post } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'

//隐患排查任务单管理列表
export const getHiddenTroubleList = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/page/list', params);

//历史任务单
export const getHistoryTaskList = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/page/list/history', params);

//异常任务进度单
export const getAbnormalTaskList = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/page/list/abnormal', params);

//隐患排查任务单详情
export const getTaskDetail = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/detail', params);

//隐患排查任务单详情修改
export const getTaskUpdata = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/update', params);

//任务统计
export const getStatistical = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/task/statistical', params);

//获取用户信息
export const getUserInfo = (params) => post(serviceNameList.risk+'/api/ehs/perils/check/task/user/info', params);