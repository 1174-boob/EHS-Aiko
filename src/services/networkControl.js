import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config'
let danger = serviceNameList['danger']
let course = serviceNameList['course']
// let customer = serviceNameList['customer']

//报警联网管控模块：
//获取报警规则时间
export const GetRuleSelectTime = params => get(danger + '/api/ehs/event/alarm/rule/select', params);
//设置报警规则时间
export const SetRuleSelectTime = params => post(danger + '/api/ehs/event/alarm/rule/save', params);
//火灾处理
export const DealAlarmProcess = params => post(danger + '/api/ehs/event/alarm/process', params);
//火灾详情
export const GetAlarmProcess = params => post(danger + '/api/ehs/event/alarm/fire/process/detail', params);
//日志
export const GetLogList = params => post(danger + '/api/ehs/event/alarm/operate/logs', params);
//特气详情
export const GetGasProcess = params => post(danger + '/api/ehs/event/alarm/gas/process/detail', params);
//特气导出
export const DownloadGasProcess = params => postExcel(danger + '/api/ehs/event/alarm/gas/download', params);
//火灾导出
export const DownloadFireProcess = params => postExcel(danger + '/api/ehs/event/alarm/fire/download', params);
//原因
export const RetestPreAlarm = params => post(danger + '/api/ehs/event/alarm/retest/reason', params);

//班次列表-分页
export const GetClassesList = params => post(danger + '/api/ehs/alarm/networking/duty/classes/list/page', params);
//班次列表-不分页
export const GetClassesListNoPage = params => post(danger + '/api/ehs/alarm/networking/duty/classes/list', params);
//新建班次
export const AddClassesList = params => post(danger + '/api/ehs/alarm/networking/duty/classes/add', params);
//删除班次
export const DelClassesList = params => post(danger + '/api/ehs/alarm/networking/duty/classes/delete', params);
//编辑班次
export const ChangeClassesList = params => post(danger + '/api/ehs/alarm/networking/duty/classes/edit', params);

//排班列表
export const GetiInfoList = params => post(danger + '/api/ehs/alarm/networking/plan/table/info/list/page', params);
//新建排班
export const AddInfoList = params => post(danger + '/api/ehs/alarm/networking/plan/table/info/add', params);
//删除排班
export const DelInfoList = params => post(danger + '/api/ehs/alarm/networking/plan/table/info/delete', params);
//编辑排班
export const ChangeInfoList = params => post(danger + '/api/ehs/alarm/networking/plan/table/info/edit', params);
//值班表列表
export const GetCorList = params => post(danger + '/api/ehs/duty/cor/page/list', params);
//值班记录列表
export const GetDutyList = params => post(danger + '/api/ehs/duty/table/page/list', params);
//值班室监控顶部列表
export const GetMonitoringList = params => post(danger + '/api/ehs/duty/table/duty/monitoring', params);
//值班导出
export const ExoprCortExel = params => postExcel(danger + '/api/ehs/duty/table/export', params);

//配置管理：
//配置管理分页查询
export const GetConfigList = params => post(danger + '/api/ehs/config/page/list', params);
//删除配置
export const DelConfigList = params => get(danger + '/api/ehs/config/delete', params);
//启用禁用
export const StatusConfigList = params => post(danger + '/api/ehs/config/update/status', params);
//新增配置
export const AddsConfigList = params => post(danger + '/api/ehs/config/add', params);
//编辑配置
export const ChangeConfigList = params => post(danger + '/api/ehs/config/update', params);
//获取字典
export const GetDictConfigList = params => post('ehs-customer/api/ehs/config/list', params, { 'routerCode': 'preview' });

//获取总蓝页教育培训数量接口
export const GetStaticalaAllNum = params => post(course + '/api/ehs/statical/allNum', params);








