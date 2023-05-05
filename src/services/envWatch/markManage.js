import { get, post, postExcel } from '@/utils/request.js'
// import serviceNameList from '@/config/default/service.config.js'
const serviceNameList = {
  monitor: 'ehs-monitor'
}
/** 环境在线监测-点位图管理 */

//点位图现地-列表
export const markPointList = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/list', params, headers)
export const markPointAdd = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/add', params, headers)
//点位图现地-编辑
export const markPointEdit = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/update', params, headers)
//点位图现地-删除
export const markPointDelete = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/delete', params, headers)
//点位图标注-保存
export const markPointSave = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/label/save', params, headers)
//点位图标注-清除
export const markPointClear = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/label/remove', params, headers)
//点位图标注-详情
export const markPointDetail = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/point/detail', params, headers)

//污染物数据新增
export const pollutantAdd = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/pollutant/add', params, headers)
// 污染物数据编辑
export const pollutantUpdate = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/pollutant/update', params, headers)
//污染物数据列表
export const pollutantPageList = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/pollutant/page/list', params, headers)
//污染物数据删除
export const pollutantDelete = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/pollutant/delete', params, headers)
//污染物详情
export const pollutantDetail = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/pollutant/detail', params, headers)

//点位图数据配置-分页列表
export const pointConfigPageList = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/page/list', params, headers)
//点位图数据配置-新增
export const pointConfigAdd = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/add', params, headers)
//点位图数据配置-编辑
export const pointConfigUpdate = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/update', params, headers)
//点位图数据配置-详情
export const pointConfigDetail = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/detail', params, headers)
//点位图数据配置-删除
export const pointConfigDelete = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/delete', params, headers)
//获取污染物全量选项（）
export const monitorPollutantList = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/pollutant/list', params, headers)
//获取新增污染物选项接口
export const monitorPollutantOptionList = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/pollutant/list', params, headers)

//获取数采仪编号选项
export const monitorInstrumentOptions = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/list', params, headers)
//数采仪获取实时值
export const monitorRealTimeData = (params, headers) => post(serviceNameList.monitor + '/api/ehs/monitor/instrument/realTimeData', params, headers)
