import { get, post, postExcel } from '@/utils/request.js'
import serviceNameList from '@/config/default/service.config.js'
// let serviceNameList = {
//   month: 'ehs-month',
//   safe: 'ehs-safe',
//   danger: 'ehs-danger'
// }
/** 安全月报子公司start */
//事故事件详情查询
export const monthEventDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/eventDetail', params, headers)

//隐患总结分析详情
export const monthHideDangerDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/hideDangerDetail', params, headers)
//隐患总结分析保存
export const monthHideDangerSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveHideDanger', params, headers)

//报警数据分析详情
export const monthAlarmDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/alarmDetail', params, headers)
//报警数据分析保存
export const monthAlarmSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveAlarm', params, headers)

//特种设备分析
export const equipmentDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/equipmentDetail', params, headers)
//特种设备分析保存
export const saveEquipment = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveEquipment', params, headers)

//应急演练分析报告详情
export const drillAnalyseDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/drillAnalyseDetail', params, headers)

//EHS培训报告详情
export const staffTrainDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/staffTrainDetail', params, headers)
//EHS培训报告详情保存
export const staffTrainSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveStaffTrain', params, headers)

//设备安全联锁抽查详情
export const deviceChainDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/deviceChainDetail', params, headers)
//设备安全联锁抽查保存
export const deviceChainSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveDeviceChain', params, headers)
//外协厂商培训详情

//应知应会抽查报告详情
export const shouldGetDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/knowHandleDetail', params, headers)
//应知应会抽查报告保存
export const shouldGetSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveKnowHandle', params, headers)

//设备安全认证详情
export const deviceCertifyDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/deviceCertifyDetail', params, headers)
//设备安全认证保存
export const deviceCertifySave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveDeviceCertify', params, headers)

//危险作业分析报告
export const dangerAnalyseDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/dangerAnalyseDetail', params, headers)
//危险作业分析报告保存
export const dangerAnalyseSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveDangerAnalyse', params, headers)

//职业健康管理险情
export const occupationHealthDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/occupationHealthDetail', params, headers)

//外协厂商培训报告
export const outSourceTrainDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/outSourceTrainDetail', params, headers)
//外协厂商培训报告保存
export const outSourceTrainSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/saveOutSourceTrain', params, headers)

//操作日志

export const getSafeLog = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/process/getLog', params, headers)
//分页查询现地安全月报列表
export const safeMonthList = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/process/select', params, headers)
//提交现地安全月报
export const safeMonthProcessSave = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/process/save', params, headers)
//处理现地安全月报
export const safeMonthProcessResolve = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/process/handlerNode', params, headers)
//驳回（重新编辑）现地安全月报
export const safeMonthProcessReject = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/process/returnNode', params, headers)
//报警联网统计图
export const alarmAnalysisChart = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/alarmAnalysis', params, headers)
//校验当前月是否已经提交数据
export const checkReportData = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/process/checkReportData', params, headers)
//外协图表
export const outSourceTrainDetailAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/outSourceTrainDetailAnalysis', params, headers)



// 安全月报汇总

//查询事故事件详情
export const headEventDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/eventDetail', params, headers)
//查询隐患总结分析详情
export const headHideDangerDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/hideDangerDetail', params, headers)
//查询报警数据详情
export const headAlarmDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/alarmDetail', params, headers)
// 特种设备
export const headEquipmentDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/equipmentDetail', params, headers)
// 应急演练分析报告
export const headDrillAnalyseDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/drillAnalyseDetail', params, headers)
//查看设备安全连锁抽查
export const headDeviceChainDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/deviceChainDetail', params, headers)
//外协厂商培训报告
export const headOutSourceTrainDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/outSourceTrainDetail', params, headers)
// ehs培训报告
export const headStaffTrainDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/staffTrainDetail', params, headers)
//查看应知应会抽查报告
export const headKnowHandleDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/knowHandleDetail', params, headers)
//查看危险作业分析报告
export const headDangerAnalyseDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/dangerAnalyseDetail', params, headers)
//查看设备安全认证报告
export const headDeviceCertifyDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/deviceCertifyDetail', params, headers)
//职业健康管理
export const headOccupationHealthDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/occupationHealthDetail', params, headers)
// 查询修改记录列表
export const headSelect = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/select', params, headers)
// 报警联网统计图(总公司)
export const analysisAlarmHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/alarmHeadAnalysis', params, headers)
// 设备安全连锁抽查柱状图统计图(总公司)
export const analysisDeviceChainHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/deviceChainHeadAnalysis', params, headers)
// 设备安全连锁抽查饼状图统计图(总公司)
export const analysisDeviceChainHeadAnalysisPie = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/deviceChainHeadAnalysisPie', params, headers)
// 应知应会抽查报告统计图(总公司)
export const analysisKnowHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/knowHeadAnalysis', params, headers)
// 设备安全认证报告柱状图统计图(总公司)
export const analysisDeviceCertifyHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/deviceCertifyHeadAnalysis', params, headers)
// 设备安全认证报告饼状图统计图(总公司)
export const analysisDeviceCertifyHeadAnalysisPie = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/deviceCertifyHeadAnalysisPie', params, headers)
// 职业健康管理统计图(总公司)
export const analysisOccupationHealthHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/occupationHealthHeadAnalysis', params, headers)
// 外协厂商培训报告统计图(总公司)
export const analysisOutSourceTrainDetailHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/outSourceTrainDetailHeadAnalysis', params, headers)
// EHS培训报告统计图(总公司)
export const analysisStaffTrainDetailHeadAnalysis = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/analysis/staffTrainDetailHeadAnalysis', params, headers)
// 保存报警数据,汇总
export const headSaveAlarm = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/saveAlarm', params, headers)
// 保存安全月报-特种设备(汇总)
export const headSaveEquipment = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/saveEquipment', params, headers)

// 隐患排查同比环比(总公司)
export const analysisMonthHideBar = (params, headers) => post(serviceNameList.safe + '/api/ehs/safe/data/analysis/month/hideBar', params, headers)
// 隐患排查饼状图(总公司)
export const analysisMonthHideCookie = (params, headers) => post(serviceNameList.safe + '/api/ehs/safe/data/analysis/month/hideCookie', params, headers)
// 危险作业同比环比(总公司)
export const analysisMonthDangerBar = (params, headers) => post(serviceNameList.safe + '/api/ehs/safe/data/analysis/month/dangerBar', params, headers)
// 危险作业饼状图(总公司)
export const analysisMonthDangerCookie = (params, headers) => post(serviceNameList.safe + '/api/ehs/safe/data/analysis/month/dangerCookie', params, headers)
// 应急演练统计图（安全月报）
export const statisticsOverviewMonthbar = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/data/analysis/drill/statistics/overview/monthbar', params, headers)
// 应急演练级别（计划演练，实际演练 安全月报）
export const statisticsTypeMonthcookie = (params, headers) => post(serviceNameList.danger + '/api/ehs/danger/data/analysis/drill/statistics/type/monthcookie', params, headers)

// 查询职业禁忌人员
export const contrainHealthStaffDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/contrainHealthStaffDetail', params, headers)
// 查询禁忌调岗
export const tabooHealthStaffDetail = (params, headers) => post(serviceNameList.envMonth + '/api/ehs/month/security/head/tabooHealthStaffDetail', params, headers)