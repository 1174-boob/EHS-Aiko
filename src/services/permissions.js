//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

//自定义列表接口：
export const GetCustomList = params => post(`${serviceNameList.customer}/api/custome/fields/page/list`, params);

//自定义新增/修改接口
export const AddOrChangeCustom = params => post(`${serviceNameList.customer}/api/custome/fields/edit`, params);

//发票抬头接口/api/custome/fields/edit
export const DelCustomItem = params => get(`${serviceNameList.customer}/api/custome/fields/delete`, params);

//创建唯一登录路链接
export const AddLink = params => get(`${serviceNameList.customer}/api/company/link`, params);

//校验是否生成过唯一登录链接
export const IsLink = params => get(`${serviceNameList.customer}/api/company/detail`, params);

//冻结事件
export const FreezeThing = params => get(`${serviceNameList.customer}/api/company/user/info/freeze`, params);

//激活事件
export const Activation = params => post(`${serviceNameList.customer}/api/company/user/info/activation`, params);

//离职事件
export const Resign = params => get(`${serviceNameList.customer}/api/company/user/info/resign`, params);

//申请人列表
export const GetUserInfoList = params => post(`${serviceNameList.customer}/api/company/user/info/page/list`, params);

//移除事件
export const DelUserInfoList = params => post(`${serviceNameList.customer}/api/company/user/info/delete`, params);

//用户新增/详情弹框中自定义字段接口
export const CustomField = params => get(`ehs-customer/api/custome/fields/list`, params);

//生成邀请码
export const AddCode = params => get(`${serviceNameList.customer}/api/company/invite/code/create`, params);

//重新生成邀请码
export const ToRegenerateCode = params => get(`${serviceNameList.customer}/api/company/invite/code/update`, params);

//邀请用户加入企业弹框 修改设置时间 是否管理员审批事件
export const UpdateInfoInterFace = params => post(`${serviceNameList.customer}/api/company/invite/code/update/info`, params);

//发送手机/邮箱验证码事件
export const SendPhoneOrEmailThing = params => post(`${serviceNameList.customer}/api/company/invite/code/send/info`, params);

// 停用/启用邀请码事件
export const StopUsingEnabled = params => get(`${serviceNameList.customer}/api/company/invite/code/update/status`, params);

// 已离职用户查询详情
export const ResignedUserDetail = params => get(`${serviceNameList.customer}/api/company/user/info/detail`, params);

//新增用户/编辑用户接口
export const AddUserOrEditInterface = params => post(`${serviceNameList.customer}/api/company/user/info/edit`, params);

//用户回显
export const UserDetailInterFace = params => get(`${serviceNameList.customer}/api/company/user/info/echo`, params);

//用户回显
export const DeptDetailInterFace = params => get(`${serviceNameList.customer}/api/enterprise/dept/echo`, params);

//查询分配部门
export const DeptGranted = params => get(`${serviceNameList.customer}/api/user/dept/granted`, params);

//提交分配部门
export const SubDeptGranted = params => post(`${serviceNameList.customer}/api/user/grant/dept`, params);

//我加入企业-确认
export const AddinviteCode = params => post(`${serviceNameList.customer}/api/company/joinCompany`, params);

//我加入企业-列表
export const GetCompanyList = params => post(`${serviceNameList.customer}/api/company/user/info/join/list`, params);

//获取手机号 
export const GetPhoneT = params => get(`${serviceNameList.customer}/api/user/getPhoneByUserId`, params);

//身份验证确认-离职
export const okDeparture = params => post(`${serviceNameList.customer}/api/company/user/info/resign/code`, params);

//根据文件id获取文件url
export const getPortraitUrl = params => post(`${serviceNameList.customer}/api/bps/file/getPath/byId`, params);

