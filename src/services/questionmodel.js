import {get,post, postExcel} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'
let course = serviceNameList['course']

//题库模块:
//题库列表
export const GetDataList = params => post(course + '/api/course/topic/pageList', params);
//题库删除
export const DelDataList = params => get(course + '/api/course/topic/delete', params);
//题库列表复制
export const CopylDataList = params => get(course + '/api/course/topic/copy', params);
//题库详情
export const DetaillDataList = params => get(course + '/api/course/topic/detail', params);
//题库新增、修改
export const AddOrChangeDataList = params => post(course + '/api/course/topic/add', params);
//科目列表
export const SubjectsDataList = params => post(course + '/api/course/subject/list', params);
//科目批量上传
export const SubjectsUpload = params => post(course + '/api/course/topic/upload', params);


//试卷模块：
//试卷列表
export const GetQuestionDataList = params => post(course + '/api/course/paper/list/page', params);
//试卷删除
export const DelQuestionDataList = params => post(course + '/api/course/paper/delete', params);
//试卷-新增-第二步-题目列表、查询选项题目
export const GetKDataList = params => post(course + '/api/course/topic/pageList', params);
//试卷-新增-第二步-题目列表、查询选项题目(更换版 2023-6-10)
export const GetTopicDataList = params => post(course + '/api/course/topic/list', params);
//试卷新增
export const AddQuestionDataList = params => post(course + '/api/course/paper/insert', params);
//试卷查看
export const LookQuestionlDataList = params => post(course + '/api/course/paper/detail', params);
//试卷编辑
export const ChangeQuestionDataList = params => post(course + '/api/course/paper/update', params);
//获取最大限制数量-单多判
export const GetThreeBigCount = params => post(course + '/api/course/paper/topic/num', params);

// 考试管理-分页查询
export const TestListPage = params => post(course + '/api/exam/list/page', params);
// 考试管理-新增
export const TestInsert = params => post(course + '/api/exam/insert', params);
// 考试管理-详情
export const TestDetail = params => post(course + '/api/exam/detail', params);
// 考试管理-删除
export const TestDelete = params => post(course + '/api/exam/delete', params);
// 考试管理-更新
export const TestUpdate = params => post(course + '/api/exam/update', params);
// 发布按钮
export const TestPublish = params => get(course + '/api/exam/publish', params);
// 考试推送
export const ExamPush = params => post(course + '/api/push/exam/push', params);
// 考试详情下载
export const ExamDetail = params => postExcel(course + '/api/exam/getResultOfToday', params);
// 获取考试推送列表
export const ExamPushInfo = params => post(course + '/api/push/exam/pushInfo', params);
// 获取推送详情列表
export const ExamPushCodeInfo = params => postExcel(course + '/api/push/exam/pushCodeInfo', params);
// 下载二维码
export const GetQrCode = params => get(course + '/api/exam/getQrCode', params);