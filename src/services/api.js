import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'
export const loginIn = params => post('/login', params);
export const getRoutesConfig = params => get('/routes', params);

// 登录登出相关
export const getToken = (params, headers) => get(serviceNameList.authehs + '/api/token/getToken', params, headers);
export const getUserInfo = (params) => post(serviceNameList.authehs + '/api/token/getUserMessage', params);
// export const getPublicKey = params => get(serviceNameList.customer + '/api/rsa/publicKey', params);
export const getPublicKey = params => get('ehs-customer/api/customer/rsa/publicKey', params);
export const getDevToken = (params, headers) => post(serviceNameList.auth + '/oauth/token', params, headers);
export const getApiToken = (params, headers) => post('ehs-auth/api/login', params, headers);
export const getTokenApi = (params, headers) => get(serviceNameList.authehs + '/api/token/getToken', params, headers);
export const getDevCompany = (params, headers) => get(serviceNameList.customer + '/api/userRoleRel/getCompany', params, headers);
export const getDevMessage = (params, headers) => post(serviceNameList.authehs + '/api/token/getUserMessage', params, headers);
export const getDevMessageBOE = (params, headers) => post('ehs-customer/api/user/getUserInfo', params, headers);
export const logout = (params, headers) => get(serviceNameList.auth + '/api/auth/logout', params, headers);
export const checkToken = (params, headers) => post(serviceNameList.auth + '/oauth/check_token', params, headers);
export const checkTokenEHS = (params, headers) => post(serviceNameList.authehs + '/api/token/checkToken', params, headers);
export const getMenuTree = (params) => get('ehs-customer/api/role/getLoginMenu', params);
// export const changeCompany = (params, headers) => get(serviceNameList.auth + '/api/auth/changeCompany', params, headers);
export const changeCompany = (params, headers) => get(process.env.VUE_APP_ZICONSOLE_AUTH + '/api/auth/changeCompany', params, headers);
export const getPortraitUrlt = params => post(`${serviceNameList.btpFile}/api/file/getPath`, params);
//获取头像下拉右侧数字接口
export const GetUpcomingNum = params => get(`ehs-customer/api/over/view/getUpcomingNum`, params);
// 公共 字典 
export const getDictionary = params => post(`ehs-customer/api/dict/list`, params);
// 获取所有按钮权限 ---------------------------此处需要替换为ehs的权限接口
export const getAllButtonCodeList = params => get(`ehs-customer/api/role/getLoginButtonCode`, params);
// 查询用户部门组织树
export const getDeptUserTree = params => post(`ehs-customer/api/lowpower/deptUser/step`, params);
//省市区接口
// export const GetProvincesList = params => get(`ehs-customer/api/city/get/city`, params);
// 公共 上传文件 getSTS 
export const getUploadSTS = params => post(`ehs-customer/api/bps/file/getSTS`, params);
// 公共 保存文件  
export const saveUploadFile = params => post(`ehs-customer/api/bps/file/upload`, params);
// 公共 获取上传结果(获取文件、图片上传成功的结果)
export const getUrlApi = params => get(`ehs-customer/api/bps/file/upload/process`, params);
// 公共 根据用户获取用户主部门信息
export const getInsidePeopleInfoApi = params => post(`ehs-customer/api/feign/getAdminDeptByCompanyIdAndUserId`, params);


// header 菜单
export const getHeaderList = params => get(`ehs-customer/api/category/product/list`, params);
// header 角色切换-获取角色列表
export const getCompany = params => get(`ehs-customer/api/userRoleRel/getCompany`, params);
// 合同管理 获取列表
export const getContractTableList = params => post(`${serviceNameList.contract}/api/contract/page/list`, params);
// 合同管理 撤销
export const changeContractItemStatus = params => post(`${serviceNameList.contract}/api/contract/status/canceled`, params);
export const contractAddAddress = params => post(`ehs-customer/api/address/insert`, params);
// 合同管理--填写信息 获取地址列表
export const contractGetAddressAll = params => post(`ehs-customer/api/address/list/page`, params);
// 修改手机号-发送验证码
export const sendPhoneCode = params => get(`ehs-customer/api/send/sendPhoneCode`, params);
// 修改手机号-验证验证码
export const checkPhoneCode = params => post(`ehs-customer/api/send/checkPhoneCode`, params);
// 修改手机号-确定修改
export const changePhone = params => post(`ehs-customer/api/user/bindPhone`, params);
// 修改邮箱-发送验证码
export const sendEmailCode = params => post(`ehs-customer/api/user/getEmailCode`, params);
// 修改邮箱-验证验证码
export const checkEmailCode = params => post(`ehs-customer/api/user/checkCode`, params);
// 修改邮箱-确定修改
export const changeEmail = params => post(`ehs-customer/api/user/bindEmail`, params);
// 绑定邮箱-确定
export const AddEmail = params => post(`ehs-customer/api/user/bindEmail`, params);
// 修改密码
export const ChangePassword = params => post(`ehs-customer/api/user/changePassword`, params);
// 获取组织部门和组织人员的新接口-2022-10-17
export const getDeptAndUser = params => post(`ehs-customer/api/enterprise/dept/getDeptAndUser`, params);
// 获取组织部门和组织人员的子节点新接口-2022-10-17
export const getDeptAndUserByDeptId = params => post(`ehs-customer/api/enterprise/dept/getDeptAndUserByDeptId`, params);
// 部门树结构改成key(部门id):value(部门中文名)，供表格回显部门使用
export const getDeptCache = params => get(`ehs-customer/api/enterprise/dept/getDeptCache`, params);
// 获取组织人员的组合名称新接口-2022-10-17
export const getUserAndJobNumber = params => post(`ehs-customer/api/user/getUserAndJobNumber`, params);
// 搜索部门名称新接口-2022-10-17
export const searchDept = params => post(`ehs-customer/api/company/dept/searchDept`, params);
// 搜索人员名称新接口-2022-10-17
export const searchUser = params => post(`ehs-customer/api/company/dept/searchUser`, params);

// 公共-获取审批日志
export const getFlowLogApi = params => post(`${serviceNameList.danger}/api/ehs/flow/getTaskComments`, params);
// 公共-根据部门获取责任人
export const getLiablePeopleByDeptId = params => post(`ehs-customer/api/enterprise/dept/findDeptBoss`, params);

// 优惠券管理-激活优惠券
export const couponActiveApi = params => get(`${serviceNameList.coupon}/api/coupon/born`, params);
// 优惠券管理-获取产品列表
// 获取角色
export const roleList = params => post(`ehs-customer/api/role/list`, params);

//总览页-接口
//获取管理绩效评价
export const getPreviewPerformanceAppraisalApi = params => post(`${serviceNameList.kpi}/api/ehs/kpi/data/analysis/index`, params);

//获取团队列表
export const GetTeamList = params => get(`ehs-customer/api/over/view/team/statistics`, params);
//获取钱数
export const GetCostList = params => get(`ehs-customer/api/company/product/seven/pay`, params);
//获取信息接口
export const GetCostInformationList = params => get(`${serviceNameList.payment}/api/order/todo/costInformation`, params);
//获取下拉框信息接口
export const GetSelectByCompanyList = params => get(`${serviceNameList.coupon}/api/coupon/unused/count`, params);
//获取工作订单接口
export const GettoWorkOrderList = params => get(`${serviceNameList.worklist}/api/workList/toWorkOrder`, params);
//获取产品接口
export const GettoProductList = params => get(`ehs-customer/api/over/view/product/list`, params);
//获取认证接口
export const IsCertification = params => get(`ehs-customer/api/company/product/update/show`, params);
//获取是否免费接口
export const ApplyFree = params => get(`ehs-customer/api/company/product/show/free/product`, params);
//获取详情
export const GetIsCompany = params => get(`ehs-customer/api/company/detail`, params);
//获取合同订单数量
export const GetContractCount = params => get(`${serviceNameList.contract}/api/contract/open/contractSize`, params);
//获取新闻公告列表总览页-右下角
export const GetNewsBulletin = params => post(`${serviceNameList.notice}/api/notice/publish/page/list`, params);
//ehs政策法规新增
export const InsertPolicyLaw = params => post(`${serviceNameList.danger}/api/ehs/policylaw/insertPolicyLaw`, params);
//ehs政策法规编辑
export const UpdatePolicyLaw = params => post(`${serviceNameList.danger}/api/ehs/policylaw/updatePolicyLaw`, params);
//ehs政策法规查询列表
export const SelectPolicylaw = params => post(`${serviceNameList.danger}/api/ehs/policylaw/selectPolicylawPage`, params);
//ehs政策法规删除
export const DeletePolicylaw = params => post(`${serviceNameList.danger}/api/ehs/policylaw/deletePolicylawById`, params);
//ehs政策法规详情
export const SelectPolicylawDetail = params => post(`${serviceNameList.danger}/api/ehs/policylaw/selectPolicylawDetail`, params);
//ehs危险工作查询列表
export const SelectDangerList = params => post(`${serviceNameList.danger}/api/ehs/danger/selectDangerPage`, params);
//字典组新增
export const SaveDictData = params => post(`ehs-customer/api/ehs/sysDictType/saveSysDictType`, params);
//字典组分页查询
export const DictTypePage = params => post(`ehs-customer/api/ehs/sysDictType/getSysDictTypePage`, params);
//字典编辑更新
export const UpdateDictTypePage = params => post(`ehs-customer/api/ehs/sysDictType/updateSysDictType`, params);
//字典组删除
export const RemoveDictType = params => post(`ehs-customer/api/ehs/sysDictType/removeSysDictType`, params);
//字典数据详情分页查询
export const DictDataPage = params => post(`ehs-customer/api/ehs/sysDictData/getSysDictDataPage`, params);
//字典数据新增
export const SaveSysDictData = params => post(`ehs-customer/api/ehs/sysDictData/saveSysDictData`, params);
//移除字典项值
export const RemoveSysDictData = params => post(`ehs-customer/api/ehs/sysDictData/removeSysDictData`, params);
//更新字典项值
export const UpdateSysDictData = params => post(`ehs-customer/api/ehs/sysDictData/updateSysDictData`, params);
//分页查询发出企业邀请
export const SelectIssueInvitationPage = params => post(`${serviceNameList.danger}/api/ehs/invitation/selectIssueInvitationPage`, params);
//分页查询企业收到的邀请
export const ReceivedInvitationPage = params => post(`${serviceNameList.danger}/api/ehs/invitation/selectReceivedInvitationPage`, params);
//根据供应商名称完全匹配供应商信息
export const SelectCompany = params => post(`${serviceNameList.danger}/api/ehs/invitation/selectCompany`, params);
//根据供应商名称完全匹配供应商信息
export const InsertInvitation = params => post(`${serviceNameList.danger}/api/ehs/invitation/insertInvitation`, params);
//根据供应商名称完全匹配供应商信息
export const BatchSendInvitation = params => post(`${serviceNameList.danger}/api/ehs/invitation/batchSendInvitation`, params);
//查看详情
export const InvitationDetail = params => post(`${serviceNameList.danger}/api/ehs/invitation/selectInvitationDetail`, params);
//待发送编辑邀请
export const UpdateInvitation = params => post(`${serviceNameList.danger}/api/ehs/invitation/updateInvitation`, params);
//我的供应商
export const InvitationSupplier = params => post(`${serviceNameList.danger}/api/ehs/invitation/supplier`, params);
//我的客户
export const InvitationClient = params => post(`${serviceNameList.danger}/api/ehs/invitation/client`, params);
//审核通过
export const InvitationToExamine = params => post(`${serviceNameList.danger}/api/ehs/invitation/toExamineInvitation`, params);
//审核通过
export const rejectInvitation = params => post(`${serviceNameList.danger}/api/ehs/invitation/rejectInvitation`, params);
//变更信息
export const ChangeInformation = params => post(`${serviceNameList.danger}/api/ehs/invitation/changeInformation`, params);
//变更信息
export const PerfectInformation = params => post(`${serviceNameList.danger}/api/ehs/invitation/perfectInformation`, params);
//节假日列表
export const HolidayDate = params => get(`${serviceNameList.danger}/api/ehs/holiday/holidays`, params);
//设置节假日
export const HolidaySet = params => post(`${serviceNameList.danger}/api/ehs/holiday/set`, params);
//流程设计查询节点字段权限
export const SelectProcessField = params => post(`${serviceNameList.form}/api/ehs/process/selectProcessFieldDetail`, params);
//流程设计修改字段权限
export const UpdateProcessField = params => post(`${serviceNameList.form}/api/ehs/process/updateProcessField`, params);
//新建流程
export const SaveProcess = params => post(`${serviceNameList.btp}/api/process/template/save`, params);
export const EhsSaveProcess = params => post(`${serviceNameList.danger}/api/ehs/process/template/save`, params);
//表单流程详情
export const DetailByForm = params => post(`${serviceNameList.btp}/api/process/template/detailByForm`, params);
export const EhsDetailByForm = params => post(`${serviceNameList.danger}/api/ehs/process/template/detailByForm`, params);
//修改流程详情
export const UpdateProcess = params => post(`${serviceNameList.btp}/api/process/template/update`, params);

// 隐患排查台账列表
export const getStandingBookList = params => post(`${serviceNameList.danger}/api/ehs/hiddeenDangerCheck/pageList`, params);
export const addStandingBookList = params => post(`${serviceNameList.danger}/api/ehs/hiddeenDangerCheck/save`, params);
export const deleteStandingBookList = params => post(`${serviceNameList.danger}/api/ehs/hiddeenDangerCheck/delete`, params);
export const detailStandingBookList = params => post(`${serviceNameList.danger}/api/ehs/hiddeenDangerCheck/detail`, params);

// 组织机构
// export const getOrganizeList = params => post(`ehs-customer/api/lowpower/dept/tree`, params);
export const getOrganizeList = params => post(`${serviceNameList.danger}/api/ehs/company/dept/tree`, params);
// 机构层级列表
export const ParentDeptList = params => post(`${serviceNameList.danger}/api/ehs/company/dept/parentDeptList`, params);
// 用户组织机构树
export const DeptUserTree = params => post(`${serviceNameList.danger}/api/ehs/company/dept/userTree`, params);
export const updateOrgainizeList = params => post(`${serviceNameList.danger}/api/ehs/company/dept/update`, params);
export const getUserDetail = params => post(`${serviceNameList.danger}/api/ehs/company/user/detail`, params);
export const updateUserDetail = params => post(`${serviceNameList.danger}/api/ehs/company/user/update`, params);
export const getUserPageList = params => post(`${serviceNameList.danger}/api/ehs/company/user/pageList`, params);
//获取列表
export const GetLabelList = params => post(`ehs-customer/api/label/list`, params);
// 控制台角色--获取角色权限树
export const getConsoleRoleTree = params => get(`ehs-customer/api/resource/queryResourceTree`, params);
//权限-角色授权-设置添加
export const AddUserRole = params => post(`ehs-customer/api/user/grant/role`, params);
//权限-用户-角色授予-回显
export const BackUserRole = params => get(`ehs-customer/api/user/granted`, params);
// 权限--部门 查看获取详情--表单信息
export const getDepartmentDetails = params => get(`ehs-customer/api/enterprise/dept/detail`, params);
// 权限--用户 获取职位列表-不分页
export const getPositionListApi = params => post(`ehs-customer/api/position/list`, params);
// 权限--用户 获取组织架构
export const getTreeUserList = params => get(`ehs-customer/api/user/tree`, params);
// 权限--用户 获取列表
export const getUserList = params => post(`ehs-customer/api/user/pageList`, params);
// 权限--用户 获取角色列表 分配使用
export const getUserRoleList = params => post(`ehs-customer/api/role/list`, params);
// 权限--用户 保存部门及职位
export const saveDeptAndPositionApi = params => post(`ehs-customer/api/enterprise/dept/allocating/dept`, params);
// 同步组织
export const syncOrgainize = params => get(`${serviceNameList.danger}/api/ehs/company/dept/sync/boeplat`, params);
// 应用角色授权管理--新增授权用户
export const addGrantUser = params => post(`ehs-customer/api/userRoleRel/bindProduct`, params);
// 应用角色授权管理--新增角色
export const addAppAuthRole = params => post(`ehs-customer/api/role/addOrUpdate`, params);
// 应用角色授权管理--修改角色
export const changeAppAuthRole = params => post(`ehs-customer/api/role/addOrUpdate`, params);
// 应用角色授权管理--修改角色--获取详情
export const getAppAuthRoleDetail = params => get(`ehs-customer/api/role/detail`, params);
// 应用角色授权管理--获取用户列表
export const getAppAuthRoleUserList = params => post(`ehs-customer/api/role/getUserListPageByRoleId`, params);
// 权限--部门 获取组织架构
export const getDepartmentTree = params => get(`ehs-customer/api/enterprise/dept/tree`, params);
// 应用角色授权管理--获取授权用户时可选择的用户列表
export const getGrantModelTreeData = params => post(`ehs-customer/api/userRoleRel/product/authUserList`, params);
// 应用角色授权管理--获取当前产品的菜单权限树
export const getGrantTreeList = params => get(`ehs-customer/api/resource/getResourceTree`, params);
// 应用角色授权管理--删除角色
export const rmAppAuthRole = params => post(`ehs-customer/api/role/delete`, params);
// 应用角色授权管理--删除授权用户
export const rmGrantUser = params => post(`ehs-customer/api/userRoleRel/product/deleteAuth`, params);
// 应用角色授权管理--获取角色列表
export const getAppAuthRoleList = params => post(`ehs-customer/api/role/list`, params);
// 部门和人员均可以选中
export const CompanyUserTree = params => post(`${serviceNameList.danger}/api/ehs/company/dept/companyUserTree`, params);
// 上传文件
export const importFile = params => post(`${serviceNameList.btpFile}/api/file/resource/upload`, params);
// 获取自定义表单模板列表
export const GetNgformList = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormTemplate`, params);
// 更改是否需要流程状态
export const UpdateIsProcess = params => post(`${serviceNameList.form}/api/ehs/formtemplate/updateProcess`, params);
// 添加自定义表单存储json
export const AddNgform = params => post(`${serviceNameList.form}/api/ehs/formtemplate/insertFormTemplate`, params);
// 更新自定义表单存储新json
export const UpdateNgform = params => post(`${serviceNameList.form}/api/ehs/formtemplate/updateFormTemplate`, params);
// 获取自定义表单拿json
export const DetailNgform = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormTemplateDetail`, params);
// 填写自定义表单模板插入业务数据
export const InsertFormData = params => post(`${serviceNameList.form}/api/ehs/formtemplate/insertFormData`, params);
// 获取插入的数据列表
export const SelectFormData = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormData`, params);
// 更新业务数据
export const UpdateFormData = params => post(`${serviceNameList.form}/api/ehs/formtemplate/updateFormData`, params);
// 删除业务数据
export const DeleteFormData = params => post(`${serviceNameList.form}/api/ehs/formtemplate/deleteFormData`, params);
// 自定义组件字典，获取字典列表 + 获取列表每一项对象对应的具体字典项数据
export const getDictTypeAll = params => get(`${serviceNameList.danger}/api/ehs/sysDictType/list/all`, params);
export const getDictDataAll = params => post(`${serviceNameList.danger}/api/ehs/sysDictData/list/all`, params);
export const getDictTree = params => get(`ehs-customer/api/ehs/sysDictType/dictTree`, params);
// 根据tempID查部署ID
export const GetId = params => post(`${serviceNameList.btp}/api/process/template/detailByForm`, params);
// 获取第一个节点信息
export const GetFirstNode = params => post(`${serviceNameList.btp}/api/camunda/firstNode`, params);
// 创建业务数据后发起流程接口
export const CreateProcess = params => post(`${serviceNameList.btp}/api/camunda/createProcess`, params);
// 保存业务流程
export const SaveBusinessProcess = params => post(`${serviceNameList.danger}/api/ehs/process/business/save`, params);
// 获取下一个节点信息
export const GetNextTask = params => post(`${serviceNameList.btp}/api/camunda/nextTask`, params);
// 查用户列表
export const SearchUserList = params => post(`${serviceNameList.danger}/api/ehs/process/template/node/userList`, params);
// 审核通过流程
export const ApprovedTask = params => post(`${serviceNameList.btp}/api/camunda/approvedTask`, params);
// 更新业务流程接口
export const UpdateBusinessProcess = params => post(`${serviceNameList.danger}/api/ehs/process/business/update`, params);
// 新建业务数据重新获取模板json
export const SelectTemplateByNode = params => post(`${serviceNameList.form}/api/ehs/process/selectTemplateByNode`, params);
// 获取业务流程信息
export const GetBusinessDetail = params => post(`${serviceNameList.danger}/api/ehs/process/business/detail`, params);
// 流程配置信息
export const GetNodeDetail = params => post(`${serviceNameList.danger}/api/ehs/process/template/node/detail`, params);
// 驳回接口
export const RejectedTask = params => post(`${serviceNameList.btp}/api/camunda/rejectedTask`, params);
// 驳回接口
export const getNowTask = params => post(`${serviceNameList.btp}/api/camunda/nowTask`, params);
// 获取新建页撤回
export const getRevokeStatus = params => post(`${serviceNameList.danger}/api/ehs/process/business/revokeStatus`, params);
// 撤回接口
export const CancelTask = params => post(`${serviceNameList.btp}/api/camunda/cancelTask`, params);
// 撤回后删除流程
export const DeleteProcess = params => post(`${serviceNameList.danger}/api/ehs/process/business/delete`, params);

// 消息管理
export const messageSelectPage = params => post(`${serviceNameList.message}/api/message/selectPage`, params);
// 编辑消息
export const messageUpdate = params => post(`${serviceNameList.message}/api/message/updateManagement`, params);
// 讲师管理
// 根据id拿上传图片信息
export const GetfileMsgList = params => post(`${serviceNameList.btpFile}/api/file/getPath`, params);
// 讲师列表
export const GetLecturerlist = params => post(`${serviceNameList.course}/api/course/lecturer/list/page`, params);
// 查看
export const DetailLecturer = params => post(`${serviceNameList.course}/api/course/lecturer/detail`, params);
// 新增
export const InsertLecturer = params => post(`${serviceNameList.course}/api/course/lecturer/insert`, params);
// 编辑
export const UpdateLecturer = params => post(`${serviceNameList.course}/api/course/lecturer/update`, params);
// 删除
export const DeleteLecturer = params => post(`${serviceNameList.course}/api/course/lecturer/delete`, params);

// 课件管理
// 科目列表
export const GetSubjectlist = params => post(`${serviceNameList.course}/api/course/subject/list`, params);
// 课件列表
export const GetCoursewarelist = params => post(`${serviceNameList.course}/api/course/courseware/list/page`, params);
// 新增
export const InsertCourseware = params => post(`${serviceNameList.course}/api/course/courseware/insert`, params);
// 编辑
export const UpdateCourseware = params => post(`${serviceNameList.course}/api/course/courseware/update`, params);
// 删除
export const DeleteCourseware = params => post(`${serviceNameList.course}/api/course/courseware/delete`, params);
// 下载课件
export const DownLoadCourseware = params => post(`${serviceNameList.btpFile}/api/file/getPath`, params);

// 课程管理
// 所有讲师列表
export const GetLecturerAllList = params => post(`${serviceNameList.course}/api/course/lecturer/list/all`, params);
// 所有课件列表
export const GetCoursewareAllList = params => post(`${serviceNameList.course}/api/course/courseware/get/all`, params);
// 课程列表 
export const GetCourseList = params => post(`${serviceNameList.course}/api/course/pageList`, params);
// 课程列表-不分页查全部
export const courseListAll = params => post(`${serviceNameList.course}/api/course/list/all`, params);
// 课程详情
export const GetCourseDetail = params => post(`${serviceNameList.course}/api/course/detail`, params);
// 插入课程
export const InsertCourse = params => post(`${serviceNameList.course}/api/course/save`, params);
// 更新课程
export const UpdateCourse = params => post(`${serviceNameList.course}/api/course/update`, params);
// 删除课程
export const DeleteCourse = params => post(`${serviceNameList.course}/api/course/delete`, params);
// 课程上下架
// export const UpdateCourseStatus = params => get(`${serviceNameList.course}/api/course/update/status`, params);
export const UpdateCourseStatus = params => post(`${serviceNameList.course}/api/companyCourse/update/status/publish`, params);
// 课程详情里的讲师和模块信息
export const CourseDetail = params => post(`${serviceNameList.course}/api/course/detail`, params);
// 推送
export const PushCourse = params => post(`${serviceNameList.course}/api/push/course/push`, params);
// 推送详情列表
export const PushInfo = params => post(`${serviceNameList.course}/api/push/course/pushInfo`, params);
export const PushCodeInfo = params => post(`${serviceNameList.course}/api/push/course/pushCodeInfo`, params);
// 查看课程-导出
export const courseManagementDetailCourseDowloadApi = params => post(`${serviceNameList.course}/api/push/paper/export`, params);

//获取科目列表
export const getSubject = params => post(`${serviceNameList.course}/api/course/subject/list`, params);
export const getlistPage = params => post(`${serviceNameList.course}/api/course/subject/listPage`, params);
export const insertSubject = params => post(`${serviceNameList.course}/api/course/subject/insert`, params);
export const updateSubject = params => post(`${serviceNameList.course}/api/course/subject/update`, params);
export const delSubject = params => post(`${serviceNameList.course}/api/course/subject/del`, params);

//内容管理模块
export const getContentModel = params => post(`${serviceNameList.course}/api/course/pageList`, params);
// 向科目中添加多选课程
export const updateCourses = params => post(`${serviceNameList.course}/api/course/updateSubject`, params);


// 点击派工，人员列表
export const GetDispatchPage = params => post(`${serviceNameList.danger}/api/ehs/invitation/dispatchPage`, params);
// 我的客户-点击派工-人员列表
export const SelectDispatch = params => post(`${serviceNameList.danger}/api/ehs/invitation/selectDispatch`, params);
// 保存派工信息
export const SaveDispatch = params => post(`${serviceNameList.danger}/api/ehs/invitation/dispatch`, params);
// 我的供应商查看派工列表
export const GetDispatchList = params => post(`${serviceNameList.danger}/api/ehs/invitation/toDispatch`, params);
// 更新派工人员
export const UpdateDispatch = params => post(`${serviceNameList.danger}/api/ehs/invitation/updateDispatch`, params);
// 获取已经派工的人员id
export const getDispatchRowDisabledDataApi = params => post(`${serviceNameList.danger}/api/ehs/invitation/getDispatchUserIdList`, params);

// 删除
export const DeleteDispatch = params => post(`${serviceNameList.danger}/api/ehs/invitation/deleteDispatch`, params);

// 推送-公司人员列表
export const GetPushTree = params => post(`${serviceNameList.danger}/api/ehs/education/pushPersonnelTree`, params);
// 组织人员id名称字典
export const deptDict = params => get(`${serviceNameList.danger}/api/ehs/company/dept/dict`, params);

// 学习记录
// 预览试卷
export const PaperDetail = params => post(`${serviceNameList.course}/api/push/paper/detail`, params);
// 考试推送列表
export const PushExamList = params => post(`${serviceNameList.course}/api/push/exam/list/page`, params);
// 课程推送列表
export const PushCourseList = params => post(`${serviceNameList.course}/api/push/course/list/page`, params);
// 获取考试记录页面用户相关信息
export const GetUserMsg = params => get(`${serviceNameList.danger}/api/ehs/invitation/getDispatchUserInfo`, params);
// 学习记录页面获取考试次数等信息
export const GetStatistics = params => post(`${serviceNameList.course}/api/push/statistics`, params);

//文件上传-分片合并
export const mergeFileApi = params => post(`${serviceNameList.btpFile}/api/file/uploader/mergeFile`, params);

// 自定义表单树结构-用于自定义组件关联表单
export const GetSelectFormTree = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormTree`, params);

// 合作伙伴完善信息-获取自定义表单模板
export const SelectFormTemplateDetailByEnter = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormTemplateDetailByEnter`, params);
// 合作伙伴完善信息-插入自定义表单数据
export const InsertFormDataByEnter = params => post(`${serviceNameList.form}/api/ehs/formtemplate/insertFormDataByEnter`, params);
// 合作伙伴完善信息-更新自定义表单模板
export const UpdateFormDataByEnter = params => post(`${serviceNameList.form}/api/ehs/formtemplate/updateFormDataByEnter`, params);
// 合作伙伴完善信息-查询自定义表单数据详情
export const SelectFormDataDetailByEnter = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormDataDetailByEnter`, params);
// 合作伙伴-详情 
export const invitationSupplieDetail = params => post(`${serviceNameList.danger}/api/ehs/invitation/supplier/detail`, params);
// 合作伙伴-详情 
export const invitationClientDetail = params => post(`${serviceNameList.danger}/api/ehs/invitation/client/detail`, params);


// 自定义表单增加接口/
export const SaveEndNodeId = params => post(`${serviceNameList.form}/api/ehs/process/saveEndNodeId`, params);
// 自定义表单-查看表单数据详情
export const selectFormDataDetail = params => post(`${serviceNameList.form}/api/ehs/formtemplate/selectFormDataDetail`, params);

// 报警联网管控-报警信息处理-火灾列表
export const InfoFirePageList = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/fire/page/list`, params);
// 报警联网管控-报警信息处理-特气列表
export const InfoGasPageList = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/gas/page/list`, params);
// 环境数据监测-废水废气实时查询
export const onlineRealTime = params => post(`${serviceNameList.danger}/api/ehs/online/realTime`, params);
// 环境数据监测-废水废气按30天查询
export const onlineDayTime = params => post(`${serviceNameList.danger}/api/ehs/online/dayTime`, params);
// 环境数据监测-废水废气查询按12月统计
export const onlineMothorTime = params => post(`${serviceNameList.danger}/api/ehs/online/mothorTime`, params);
// 环境数据监测-查看更多
export const onlineDataInfo = params => post(`${serviceNameList.danger}/api/ehs/online/dataInfo`, params);
// 环境数据监测-查看更多
export const selectPolicy = params => post(`${serviceNameList.danger}/api/ehs/policylaw/selectPolicylawByStatistics`, params);

// 添加待办推送到BOE平台
export const PushTask = params => post(`${serviceNameList.danger}/api/ehs/task/pushTask`, params);

// 设备信息维护
// 火灾-分页查-增-改-删
export const firePageList = params => post(`${serviceNameList.danger}/api/ehs/equip/fire/page/list`, params);
export const fireInsert = params => post(`${serviceNameList.danger}/api/ehs/equip/fire/insert`, params);
export const fireUpdate = params => post(`${serviceNameList.danger}/api/ehs/equip/fire/update`, params);
export const fireDelete = params => get(`${serviceNameList.danger}/api/ehs/equip/fire/delete`, params);
// 特气-分页查-增-改-删
export const gasPageList = params => post(`${serviceNameList.danger}/api/ehs/equip/gas/page/list`, params);
export const gasInsert = params => post(`${serviceNameList.danger}/api/ehs/equip/gas/insert`, params);
export const gasUpdate = params => post(`${serviceNameList.danger}/api/ehs/equip/gas/update`, params);
export const gasDelete = params => get(`${serviceNameList.danger}/api/ehs/equip/gas/delete`, params);

// 黑名单
// 违规记录分页查-增-改-删
export const punishPageList = params => post(`${serviceNameList.danger}/api/ehs/enterblack/selectPunishPage`, params);
export const punishInsert = params => post(`${serviceNameList.danger}/api/ehs/enterblack/savePunish`, params);
export const punishUpdate = params => post(`${serviceNameList.danger}/api/ehs/enterblack/updatePunish`, params);
export const punishDelete = params => post(`${serviceNameList.danger}/api/ehs/enterblack/deletePunish`, params);
// 更新已派工人员禁用启用状态
export const updateDispatchByStatus = params => post(`${serviceNameList.danger}/api/ehs/invitation/updateDispatchByStatus`, params);
// 黑名单列表
export const selectEnterBlack = params => post(`${serviceNameList.danger}/api/ehs/enterblack/selectEnterBlack`, params);
// 查看合作伙伴黑名单规则次数
export const selectBlacklistRuleDetail = params => post(`${serviceNameList.danger}/api/ehs/enterblack/selectBlacklistRuleDetail`, params);
// 保存合作伙伴黑名单规则次数
export const saveBlacklistRule = params => post(`${serviceNameList.danger}/api/ehs/enterblack/saveBlacklistRule`, params);
// 移除黑名单
export const deleteEnterBlack = params => post(`${serviceNameList.danger}/api/ehs/enterblack/deleteEnterBlack`, params);
// 修改黑名单状态  
export const updateEnterBlack = params => post(`${serviceNameList.danger}/api/ehs/enterblack/updateEnterBlack`, params);

// 解除黑名单-新建审批单
export const blackRelieveAdd = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/add`, params);
// 解除黑名单-删除审批单
export const blackRelieveDelete = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/delete`, params);
// 解除黑名单-审批单更新
export const blackRelieveUpdate = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/update`, params);
// 解除黑名单-审批单详情
export const blackRelieveDetail = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/detail`, params);
// 解除黑名单-审批单分页查询
export const blackRelievePageList = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/page/list`, params);
// 解除黑名单-审批处理
export const blackRelieveProcess = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/process`, params);
// 解除黑名单-审批单日志
export const blackRelieveGetlog = params => post(`${serviceNameList.danger}/api/ehs/enterprise/black/relieve/getLog`, params);
// 查询新建移除黑名单页面固定信息
export const blackBeforeAddDetail = params => post(`${serviceNameList.danger}/api/ehs/enterblack/before/add/detail`, params);


// 预警测试
// 批量新增预警测试
export const preAlarmInsert = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/insert`, params);
// 编辑预警测试
export const preAlarmEdit = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/edit`, params);
// 删除预警测试
export const preAlarmDelete = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/delete`, params);
// 查看测试设备列表-火灾
export const fireEquipPageList = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/fire/equip/page/list`, params);
// 查看测试设备列表-特气
export const gasEquipPageList = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/gas/equip/page/list`, params);
// 移除设备
export const removeEquip = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/remove/equip`, params);
// 重新测试
export const retestEquip = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/retest/equip`, params);
// 预警查询分页列表
export const preAlarmPageList = params => post(`${serviceNameList.danger}/api/ehs/event/alarm/preAlarm/page/list`, params);

// 获取组织机构-平台
export const getLowpowerDept = params => post(`ehs-customer/api/lowpower/dept`, params);

// 获取法人机构全量列表
export const getCorporationListAll = params => post(`ehs-customer/api/ehs/corporation/dict`, params);
// 法人机构列表查询-增-删-改
export const getCorporationList = params => post(`${serviceNameList.danger}/api/ehs/corporation/list`, params);
export const saveCorporationList = params => post(`${serviceNameList.danger}/api/ehs/corporation/save`, params);
export const deleteCorporationList = params => post(`${serviceNameList.danger}/api/ehs/corporation/delete`, params);
export const updateCorporationList = params => post(`${serviceNameList.danger}/api/ehs/corporation/update`, params);



// 新导入化学品管理
// 新增
export const manageAdd = params => post(`${serviceNameList.chemicals}/api/ehs/import/manage/add`, params);
// 分页查询
export const managePageList = params => post(`${serviceNameList.chemicals}/api/ehs/import/manage/page/list`, params);
// 编辑
export const manageUpdate = params => post(`${serviceNameList.chemicals}/api/ehs/import/manage/update`, params);
// 详情
export const manageDetail = params => get(`${serviceNameList.chemicals}/api/ehs/import/manage/detail`, params);
// 删除
export const manageDelete = params => get(`${serviceNameList.chemicals}/api/ehs/import/manage/delete`, params);
// 审批通过
export const manageApproval = params => post(`${serviceNameList.chemicals}/api/ehs/import/manage/approval`, params);
// 审批驳回
export const manageRejection = params => post(`${serviceNameList.chemicals}/api/ehs/import/manage/rejection`, params);
// 审批归档
export const manageSaveFiling = params => post(`${serviceNameList.chemicals}/api/ehs/import/manage/saveFiling`, params);
// 批量导出
export const chemicalDownload = params => postExcel(`${serviceNameList.chemicals}/api/ehs/chemical/list/download`, params);
// 化学品清单
// 新建
export const chemicalSave = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/list/save`, params);
// 编辑
export const chemicalUpdate = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/list/update`, params);
// 分页查询
export const chemicalPageList = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/list/page/list`, params);
// 获取详情
export const chemicalDetail = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/list/detail`, params);
// 化学品存放库管理
// 新增
export const warehouseSave = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/save`, params);
// 编辑
export const warehouseUpdate = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/update`, params);
// 分页列表
export const warehousePageList = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/page/list`, params);
// 获取详情
export const warehouseDetail = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/detail`, params);
// 删除化学品设计存量
export const warehouseDeleteStorage = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/delete/storage`, params);
// 删除
export const warehouseDelete = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/delete`, params);
// 明细
export const warehouseStorageDetail = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/storage/detail`, params);
// 存取记录
export const warehouseStorageRecords = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/storage/records`, params);
// 化学品存放柜管理
// 新增
export const shelfSave = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/save`, params);
// 编辑
export const shelfUpdate = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/update`, params);
// 详情
export const shelfDetail = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/detail`, params);
// 删除化存放柜的学品设计存量
export const shelfDeleteStorage = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/delete/storage`, params);
// 删除
export const shelfDelete = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/delete`, params);
// 分页查询
export const shelfPageList = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/page/list`, params);
// 明细
export const shelfStorageDetail = params => post(`${serviceNameList.chemicals}/api/ehs/chemical/shelf/storage/detail`, params);
// 入库化学品分页查询
export const chemicalsPageList = params => post(`${serviceNameList.chemicals}/api/ehs/temporary/factory/chemicals/page/list`, params);
// 入库化学品导出
export const chemicalsIntoExport = params => postExcel(`${serviceNameList.chemicals}/api/ehs/temporary/factory/chemicals/into/export`, params);
// 化学品存储管理-导入模板下载
export const warehouseTemplateExport = params => postExcel(`${serviceNameList.chemicals}/api/ehs/chemical/warehouse/inventory/template/export`, params);
//获取城市
export const getCityOptions = params => get(`ehs-customer/api/city/get/city`, params);
// 危化品车辆管理分页查询
export const chemicalsCarPageList = params => post(`${serviceNameList.danger}/api/ehs/chemicalsCar/page`, params);
// 危化品车辆详情查看
export const chemicalsCarDetails = params => post(`${serviceNameList.danger}/api/ehs/chemicalsCar/details`, params);
// 车辆轨迹
export const chemicalsCarTrajectory = params => post(`${serviceNameList.danger}/api/ehs/chemicalsCar/trajectory`, params);
// 危化品车辆导出excel
export const chemicalsCarExport = params => postExcel(`${serviceNameList.danger}/api/ehs/chemicalsCar/export`, params);
// 危化品车辆统计柱状图
export const chemicalsCarincomingNum = params => post(`${serviceNameList.danger}/api/ehs/chemicalsCar/car/incomingNum`, params);
// 危化品车辆请求yj的token
export const trajectoryToken = params => post(`${serviceNameList.danger}/api/ehs/chemicalsCar/trajectory/token`, params);

// 车辆定位卡详情
export const electricityDetails = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/detail`, params);
// 车辆定位卡新增
export const electricityAdd = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/add`, params);
// 车辆定位卡删除
export const electricityDelete = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/delete`, params);
// 车辆定位卡更新
export const electricityUpdate = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/update`, params);
// 车辆定位卡分页列表
export const electricityPageList = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/list/page`, params);
// 车辆定位卡excel导出
export const electricityExport = params => postExcel(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/export`, params);
// 获取报警值
export const getAlarm = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/get/alarm`, params);
// 设置报警值
export const setAlarm = params => post(`${serviceNameList.danger}/api/ehs/chemicals/car/electricity/set/alarm`, params);



/** 职业健康体检 start*/
//体检管理分页列表
export const healthManageList = params => post(`${serviceNameList.health}/api/ehs/health/check/page/list`, params);
//体检管理新增
export const healthManageAdd = params => post(`${serviceNameList.health}/api/ehs/health/check/add`, params);
//体检管理修改
export const healthManageUpdate = params => post(`${serviceNameList.health}/api/ehs/health/check/update`, params);
//体检管理详情
export const healthManageDetail = params => get(`${serviceNameList.health}/api/ehs/health/check/detail`, params);
//体检审批管理详情--关联人员
export const healthApproveManageDetail = params => get(`${serviceNameList.health}/api/ehs/health/check/approval/detail`, params);
//职业健康根据姓名或工号查询人员
export const selectDetailByPersonId = params => get(`${serviceNameList.health}/api/ehs/health/user/check/detail`, params);
//职业健康审批列表||草稿列表
export const healthApprovalList = params => post(`${serviceNameList.health}/api/ehs/health/check/approval/page/list`, params);
//职业健康人数统计
export const healthNumCount = params => post(`${serviceNameList.health}/api/ehs/health/check/num`, params);
//更新体检结论
export const updateCheckResult = params => post(`${serviceNameList.health}/api/ehs/health/check/updateResult`, params);
//根据部门id查询对应人员台账
export const findHealthUserByDeptId = params => get(`${serviceNameList.health}/api/ehs/health/user/findUser`, params);
//上传|更新体检报告
export const uploadCheckFile = params => post(`${serviceNameList.health}/api/ehs/health/check/upload/checkFile`, params);
//草稿箱体检预约删除
export const healthCheckDelete = params => get(`${serviceNameList.health}/api/ehs/health/check/delete`, params);
//体检审批通过
export const PECheckApprove = params => post(`${serviceNameList.health}/api/ehs/health/check/approval`, params);
//体检审批驳回
export const PECheckRejection = params => post(`${serviceNameList.health}/api/ehs/health/check/rejection`, params);
//体检归档
export const PECheckSaveFiling = params => post(`${serviceNameList.health}/api/ehs/health/check/saveFiling`, params);
//体检驳回上一节点
export const rejectedTaskToLast = params => post(`${serviceNameList.btp}/api/ehs/camunda/rejectedTask`, params);
//体检通知
export const notifyNotCheck = params => post(`${serviceNameList.health}/api/ehs/health/check/tell/notCheck`, params);
//重新发送
export const sendOneNotify = params => post(`${serviceNameList.health}/api/ehs/health/check/tell/one`, params);
//体检管理导出
export const healthCheckExport = params => postExcel(`${serviceNameList.health}/api/ehs/health/check/export`, params);
//体检审批导出
export const healthCheckApproveExport = params => postExcel(`${serviceNameList.health}/api/ehs/health/check/person/export`, params);
//体检获取岗位（根据组织）
export const feathJobPosition = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/all`, params);
//体检审批记录
export const getTaskComments = params => get(`${serviceNameList.btp}/api/ehs/camunda/getTaskComments`, params);



// 危害岗位信息数据库
// 危害岗位-分页查询
export const stationPageList = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/page/list`, params);
// 危害岗位-新增
export const stationAdd = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/add`, params);
// 危害岗位-编辑
export const stationEdit = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/edit`, params);
// 危害岗位-删除
export const stationDelete = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/delete`, params);
// 危害岗位-导出
export const stationExport = params => postExcel(`${serviceNameList.health}/api/ehs/dangerous/station/export`, params);
// 危害因素-分页查询
export const factorPageList = params => post(`${serviceNameList.health}/api/ehs/harm/factor/page/list`, params);
// 危害因素-新增
export const factorAdd = params => post(`${serviceNameList.health}/api/ehs/harm/factor/add`, params);
// 危害因素-编辑
export const factorEdit = params => post(`${serviceNameList.health}/api/ehs/harm/factor/edit`, params);
// 危害因素-删除
export const factorDelete = params => post(`${serviceNameList.health}/api/ehs/harm/factor/delete`, params);
// 危害因素-导入模板下载
export const factorTemplateExport = params => postExcel(`${serviceNameList.health}/api/ehs/harm/factor/template/export`, params);
// 危害因素-批量导出
export const factorExport = params => postExcel(`${serviceNameList.health}/api/ehs/harm/factor/export`, params);

// 根据姓名或工号查询人员
export const selectByNameOrWokerNum = params => post(`${serviceNameList.health}/api/ehs/health/user/selectByNameOrWokerNum`, params);
// 根据工号精确查询人员(平台)
export const getUserByJobNumber = params => post(`${serviceNameList.health}/api/ehs/health/user/getUserByJobNumber`, params);
// 人员台账-新增人员
export const healthUserSave = params => post(`${serviceNameList.health}/api/ehs/health/user/save`, params);
// 人员台账-编辑人员
export const healthUserUpdate = params => post(`${serviceNameList.health}/api/ehs/health/user/update`, params);
// 人员台账-详情
export const healthUserDetail = params => post(`${serviceNameList.health}/api/ehs/health/user/selectDetail`, params);
// 人员台账-分页查询职业病诊断表
export const selectDiagnosis = params => post(`${serviceNameList.health}/api/ehs/health/user/selectDiagnosis`, params);
// 人员台账-分页查询关联既往病史列表
export const selectMedical = params => post(`${serviceNameList.health}/api/ehs/health/user/selectMedical`, params);
// 人员台账-分页查询关联职业史列表
export const selectExposure = params => post(`${serviceNameList.health}/api/ehs/health/user/selectExposure`, params);
// 人员台账-根据人员查询体检记录
export const checkHealthHistory = params => post(`${serviceNameList.health}/api/ehs/health/check/check/history`, params);
// 人员台账-根据人员查询体检记录
export const harmFactorAll = params => get(`${serviceNameList.health}/api/ehs/harm/factor/all`, params);
// 人员台账-根据人员查询体检记录
export const checkCancel = params => get(`${serviceNameList.health}/api/ehs/health/check/check/cancel`, params);
// 人员台账-根据组织和部门获取所有危险岗位
export const stationAll = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/all`, params);
// 人员台账-根据组织和部门获取所有危险岗位
export const harmFactor = params => get(`${serviceNameList.health}/api/ehs/dangerous/station/v2/harmFactor`, params);
// 人员台账接口：
//获取人员台账列表
export const GetListHeal = params => post(`${serviceNameList.health}/api/ehs/health/user/select`, params);
//人员台账详情-ppe配置列表
export const ppeReceiveList = params => post(`${serviceNameList.health}/api/ehs/ppe/receive/list/user`, params);
//分页查询调岗记录
export const selectUserPost = params => post(`${serviceNameList.health}/api/ehs/health/user/selectPost`, params);
//删除
export const DelListHeal = params => post(`${serviceNameList.health}/api/ehs/health/user/delete`, params);
//批量导出
export const DownHealMore = params => postExcel(`${serviceNameList.health}/api/ehs/health/user/export`, params);

// 自定义组件-关联传参数据
export const getRemoteInterface = (url, params) => get(url, params);
export const postRemoteInterface = (url, params) => post(url, params);

// 变岗申请
export const getSelectStaffList = params => post(`${serviceNameList.health}/api/ehs/health/user/selectByNameOrWokerNum`, params);
export const getStaffDetail = params => get(`${serviceNameList.health}/api/ehs/health/user/check/detail`, params);
// 根据部门查询危险岗位
export const getDangerousPost = params => get(`${serviceNameList.health}/api/ehs/dangerous/station/harmFactor`, params);
// 获取所有危害因素
export const getAllFactor = params => get(`${serviceNameList.health}/api/ehs/harm/factor/all`, params);
// 分页查询岗位列表
export const postPageList = params => post(`${serviceNameList.health}/api/ehs/health/post/select`, params);
// 新增
export const postSave = params => post(`${serviceNameList.health}/api/ehs/health/post/save`, params);
// 查询下级节点审批人
export const selectNodeUser = params => post(`${serviceNameList.health}/api/ehs/health/post/selectNodeUser`, params);
// 编辑
export const postUpdate = params => post(`${serviceNameList.health}/api/ehs/health/post/update`, params);
// 详情
export const postDetail = params => post(`${serviceNameList.health}/api/ehs/health/post/selectDetail`, params);
// 导出
export const postExport = params => postExcel(`${serviceNameList.health}/api/ehs/health/post/export`, params);
// 流程结束
export const postEndEvent = params => post(`${serviceNameList.health}/api/ehs/health/post/endEvent`, params);
// 看是不是安全员
export const getIsSafety = params => post(`${serviceNameList.health}/api/ehs/health/post/isSafety`, params);
// 获取所有危险岗位
export const getDangerousPostAll = params => post(`${serviceNameList.health}/api/ehs/dangerous/station/all`, params);
// 删除变岗申请
export const postDelete = params => post(`${serviceNameList.health}/api/ehs/health/post/delete`, params);
/** 职业健康 end */
// 提案管理
// 新建提案
export const proposalAdd = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/add`, params);
// 我的提案
export const proposalMyPageList = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/my/page/list`, params);
// 提案数据库
export const proposalPageList = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/page/list`, params);
// 提案详情查询
export const proposalDetail = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/detail`, params);
// 数据库详情
export const proposalDataDetail = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/data/detail`, params);
// 编辑提案
export const proposalUpdate = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/update`, params);
// 删除提案
export const proposalDelete = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/delete`, params);
// 提案评审列表
export const proposalReviewPageList = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/review/page/list`, params);
// 提案评审
export const proposalReview = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/review`, params);
// 提案分配
export const proposalDistribute = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/distribute`, params);
// 提案数据分析
export const proposalAnalyse = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/data/analyse/statistics/count`, params);
// 提案数据分析
export const proposalAnalyseCountDownLoad = params => postExcel(`${serviceNameList.proposal}/api/ehs/improve/proposal/data/analyse/statistics/count/downLoad`, params);
// 提案类型分析
export const proposalAnalyseLevelDownLoad = params => postExcel(`${serviceNameList.proposal}/api/ehs/improve/proposal/data/analyse/statistics/level/downLoad`, params);
// 提案级别分析
export const proposalAnalyseLevel = params => post(`${serviceNameList.proposal}/api/ehs/improve/proposal/data/analyse/statistics/level`, params);

// 数据权限
// 获取当前租户的法人机构树
export const getCorporationTree = params => get(`ehs-customer/api/ehs/corporation/getCorporationTree`, params);
// 获取当前登录用户所属的法人机构树
export const getLoginCorporation = params => get(`ehs-customer/api/ehs/corporation/getLoginCorporation`, params);
// 分配法人机构
export const divideCorporation = params => post(`${serviceNameList.danger}/api/ehs/company/user/divideCorporation`, params);
// 获取菜单配置列表
export const getMenuAuthList = params => get(`ehs-customer/api/ehs/menuDataAuth/getMenuAuthList`, params);
// 更新菜单权限
export const updateDataAuth = params => post(`${serviceNameList.danger}/api/ehs/menuDataAuth/updateDataAuth`, params);
// 校验菜单权限
export const getloginUserDataAuth = (params) => {
  if (sessionStorage.getItem("hasGetloginUserDataAuth")) {
    return Promise.resolve();
  }
  return post(`ehs-customer/api/ehs/menuDataAuth/getloginUserDataAuth`, params)
};

// 获取组织下的部门树
export const queryDeptTree = params => post(`ehs-customer/api/company/dept/queryDeptTree`, params);
/** 应急演练管理 start*/
// 数据库新增预案
export const planAddPrep = params => post(`${serviceNameList.danger}/api/ehs/emergent/plan/addPrep`, params);
// 数据库编辑预案
export const planEditPrep = params => post(`${serviceNameList.danger}/api/ehs/emergent/plan/editPrep`, params);
// 数据库删除预案
export const planDeletePrep = params => get(`${serviceNameList.danger}/api/ehs/emergent/plan/deletePrep`, params);
// 数据库查看预案
export const viewDetailPrep = params => get(`${serviceNameList.danger}/api/ehs/emergent/plan/viewDetailPrep`, params);
// 数据库分页查询预案
export const planPageList = params => post(`${serviceNameList.danger}/api/ehs/emergent/plan/page/list`, params);
// 新建应急演练
export const addDrillPlan = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/addDrillPlan`, params);
// 编辑应急演练
export const editDrillPlan = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/editDrillPlan`, params);
// 应急演练计划列表
export const drillPageList = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/page/list`, params);
// 应急演练计划删除
export const drillDeletePlan = params => get(`${serviceNameList.danger}/api/ehs/emergent/drill/deletePlan`, params);
// 应急演练计划-提交审批
export const drillSubmitApprove = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/submitApprove`, params);
// 批量导出
export const drillExportPlanData = params => postExcel(`${serviceNameList.danger}/api/ehs/emergent/drill/exportPlanData`, params);

// 应急演练计划计划
export const viewDetailPlan = params => get(`${serviceNameList.danger}/api/ehs/emergent/drill/viewDetailPlan`, params);
// 应急演练草稿箱--分页查询
export const draftPagelist = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/page/draftlist`, params);
// 应急演练草稿箱--编辑接口
export const editDraftDrillPlan = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/editDraftDrillPlan`, params);
// 应急演练计划调整
export const drillPlanAdjust = params => post(`${serviceNameList.danger}/api/ehs/emergent/drill/drillPlanAdjust`, params);
// 录入报告
export const addDrillReport = params => post(`${serviceNameList.danger}/api/ehs/emergent/report/addDrillReport`, params);
// 应急演练计划-查看报告
export const viewDrillPlanReportInfo = params => get(`${serviceNameList.danger}/api/ehs/emergent/drill/viewDrillPlanReportInfo`, params);

// 应急演练报告-查看
export const viewDetailReport = params => get(`${serviceNameList.danger}/api/ehs/emergent/report/viewDetailReport`, params);
// 应急演练报告-分页查询
export const reportPageList = params => post(`${serviceNameList.danger}/api/ehs/emergent/report/page/list`, params);
// 编辑
export const reportEditDrillReport = params => post(`${serviceNameList.danger}/api/ehs/emergent/report/editDrillReport`, params);
// 删除
export const reportDeleteReport = params => get(`${serviceNameList.danger}/api/ehs/emergent/report/deleteReport`, params);


// 应急演练审批-分页查询
export const emergentProcessPageList = params => post(`${serviceNameList.danger}/api/ehs/emergent/process/page/list`, params);
// 应急演练审批-详情
export const emergentProcessView = params => get(`${serviceNameList.danger}/api/ehs/emergent/process/viewDrillProcess`, params);
// 应急演练审批-通过/驳回
export const emergentProcessResolve = params => post(`${serviceNameList.danger}/api/ehs/emergent/process/handleProcess`, params);
// 应急演练审批-日志
export const emergentProcessLog = params => get(`${serviceNameList.danger}/api/ehs/emergent/process/getLog`, params);
// 应急演练审批-删除
export const emergentProcessDeleteDrillProcess = params => get(`${serviceNameList.danger}/api/ehs/emergent/process/deleteDrillProcess`, params);

// 地图标注-新增
export const mapLabelAdd = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/add`, params);
// 地图标注-清空标注
export const clearMapLabel = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/clearMapLabel`, params);
// 地图标注-分页查询
export const mapLabelpageList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/pageList`, params);
// 地图标注-详情
export const mapLabelDetail = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/detail`, params);
// 地图标注-编辑
export const mapLabelUpdate = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/update`, params);
// 地图标注-删除
export const mapLabelDelete = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/delete`, params);
// 地图标注-环境数据地图汇总
export const mapLabelList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/map/label/list`, params);
// 点位图-超管查询接口
export const pointList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/point/list`, params);
// 数据监测首页
export const monitorDataIndex = params => post(`${serviceNameList.monitor}/api/ehs/monitor/data/index`, params);
// 废水预警/报警管理-新增
export const waterConfigAdd = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/config/add`, params);
// 废水预警/报警管理-编辑
export const waterConfigUpdate = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/config/update`, params);
// 废水预警/报警管理-删除
export const waterConfigDelete = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/config/delete`, params);
// 废水预警/报警管理-分页查询
export const waterConfigPageList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/water/config/page/list`, params);
// 废气预警/报警管理-新增
export const gasConfigAdd = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/config/add`, params);
// 废气预警/报警管理-分页查询
export const gasConfigPageList = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/config/page/list`, params);
// 废气预警/报警管理-编辑
export const gasConfigUpdate = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/config/update`, params);
// 废气预警/报警管理-删除
export const gasConfigDelete = params => post(`${serviceNameList.monitor}/api/ehs/monitor/gas/config/delete`, params);



// 教育培训-考生档案-列表
export const getCandidateFileList = params => post(`${serviceNameList.course}/api/push/candidate/page/info`, params);
// 教育培训-考生档案-详情-用户信息-内部
export const getCandidateFileDetailUserInfoApi = params => get(`${serviceNameList.course}/api/push/getUserInfo`, params);
// 教育培训-考生档案-详情-用户信息-外部
export const getCandidateFileDetailOutUserInfoApi = params => post(`${serviceNameList.danger}/api/ehs/invitation/candidateUserInfo`, params);
// 教育培训-考生档案-详情-培训详情
export const getCandidateFileDetailCourse = params => post(`${serviceNameList.course}/api/push/candidate/course/list/page`, params);
// 教育培训-考生档案-详情-考试情况
export const getCandidateFileDetailExam = params => post(`${serviceNameList.course}/api/push/candidate/exam/list/page`, params);
// 教育培训-考生档案-详情-统计学习情况
export const getCandidateFileDetailUserStatistics = params => post(`${serviceNameList.course}/api/push/statistics`, params);
// 教育培训-考生档案-详情-导出试卷
export const getCandidateFileDetailExamExport = params => postExcel(`${serviceNameList.course}/api/push/candidate/paper/export`, params);
// 教育培训-考生档案-详情-预览试卷
export const getCandidateFileDetailExamPreview = params => post(`${serviceNameList.course}/api/push/candidate/paper/preview`, params);

// 教育培训-考生档案-培训情况-列表
export const getCandidateFileTrainingDetail = params => post(`${serviceNameList.course}/api/ehs/monitor/gas/config/delete`, params);
// 教育培训-考生档案-考试情况-列表
export const getCandidateFileExamDetail = params => post(`${serviceNameList.course}/api/ehs/monitor/gas/config/delete`, params);


// 教育培训-我的课程考试-课程-列表
export const getMyCourseTestList = params => post(`${serviceNameList.course}/api/push/user/course/page`, params);
// 教育培训-我的课程考试-课程-详情
export const getCandidateFileDetailApi = params => post(`${serviceNameList.course}/api/course/detail`, params);
// 教育培训-我的课程考试-课程-详情-进度 待学习、已完成、合格、不合格
export const getCandidateFileDetaiSteplApi = params => post(`${serviceNameList.course}/api/push/get/exam/status`, params);
// 教育培训-我的课程考试-课程-学习详情-列表全部
export const getCandidateFileStudyDetailApi = params => get(`${serviceNameList.course}/api/course/usercoursewarestudyrecords/selectLastCoursewareStudyRecord`, params);
// 教育培训-我的课程考试-课程-开始学习
export const startCandidateFileStudyApi = params => post(`${serviceNameList.course}/api/course/userstudyrecords/insert`, params);
// 教育培训-我的课程考试-课程-更新学习进度
export const setMyCourseStudyCountApi = params => post(`${serviceNameList.course}/api/course/usercoursewarestudyrecords/updateCoursewareStudyRecord`, params);
// 教育培训-我的课程考试-课程-获取目标课件学习详情
export const getMyCourseStudyTargetDetailApi = params => post(`${serviceNameList.course}/api/course/usercoursewarestudyrecords/selectCoursewareStudyRecord`, params);

// 教育培训-我的课程考试-考试-列表
export const getMyCourseExamList = params => post(`${serviceNameList.course}/api/push/user/exam/page`, params);
// 教育培训-我的课程考试-获取考试详情
export const getMyCourseExamDetailApi = params => post(`${serviceNameList.course}/api/exam/detail`, params);
// 教育培训-我的课程考试-获取试卷详情
export const getMyCourseExamPaperDetailApi = params => post(`${serviceNameList.course}/api/course/paper/detail`, params);
// 教育培训-我的课程考试-考试中-提交答案
export const myExamIngSubmitAnswersApi = params => post(`${serviceNameList.course}/api/push/paper/commit`, params);
// 教育培训-我的课程考试-考试中-答题结果详情
export const getMyExamResultDetailsApi = params => post(`${serviceNameList.course}/api/push/exam/result`, params);
// 教育培训-我的课程考试-考试中-答题结果详情
export const getMyExamResultApi = params => post(`${serviceNameList.course}/api/push/user/paper/detail`, params);