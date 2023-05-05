<template>
  <!-- 用户 -->
  <div class="user-box clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>用户</PageTitle>
    <!-- 主要区域 -->
    <div class="user-main">
      <!-- 左侧树 -->
      <div class="user-main-left bea_scroll_xt">
        <div class="l-top">
          <span>组织架构</span>
        </div>
        <a-tree v-if="treeData.length" :replace-fields="{ title: 'name', key: 'id' }" :tree-data="treeData" @select="selectTree" :selectedKeys.sync="selectedKeysOld" :defaultExpandAll="false" />
      </div>

      <!-- 右侧列表 -->
      <div class="user-main-right clx-show-scroll clx-flex-1 beauty-scroll">
        <!-- 查询 -->
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="手机号">
              <a-input v-model="formInline.phone" placeholder="请输入手机号" :maxLength="phoneMaxLength" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item label="姓名">
              <a-input v-model="formInline.name" placeholder="请输入姓名" :maxLength="14" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item label="工号">
              <a-input v-model="formInline.jobNumber" placeholder="请输入工号" :maxLength="jobNumberMaxLength" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item label="状态">
              <a-select v-model="formInline.status" placeholder="请输入状态">
                <a-select-option v-for="item in userInfoStatus" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
              <a-button @click="iRest" :loading="loadingFour">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>

        <!-- 按钮 -->
        <div class="btns_div clx-btn-dashed-box">
          <a-button class="clx-btn-margin-right" type="dashed" @click="addUser">
            <a-icon type="plus" />创建用户
          </a-button>
          <a-button class="clx-btn-margin-right" type="dashed" @click="joinUser">邀请用户加入企业</a-button>
          <a-button class="clx-btn-margin-right btn-text-margin" type="dashed" @click="openApplicant">申请人列表</a-button>
          <span class="field-management btn-text-margin" @click="selectModelShow">字段管理</span>
          <span class="field-management field-management-grey" @click="leavingUser">已离职用户</span>
        </div>
        <!-- 表格 -->
        <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange" v-if="columns.length">
          <a-table :columns="columns" :scroll="{ x: tableScroll }" :locale="{ emptyText: emptyText }" :data-source="dataList" :rowKey="(record, index) => {return index;}" :pagination="false">
            <div slot="jobNumber" slot-scope="text, record">
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{text}}</span>
              </a-popover>
            </div>
            <div slot="email" slot-scope="text, record">
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{text}}</span>
              </a-popover>
            </div>
            <div slot="adminDeptAndPosition" slot-scope="text, record">
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{text}}</span>
              </a-popover>
            </div>
            <div slot="status" slot-scope="text, record">
              <span>{{getDictionaryItemObj("companyUserInfoFindStatus", text)}}</span>
            </div>
            <div slot="action" slot-scope="text, record">
              <span class="color-0067cc table-btn cursor-pointer" :class="btnAuthDisable(record)? 'table-btn-back-disable':''" @click="editDict(record)">编辑</span>
              <span class="color-0067cc table-btn cursor-pointer" :class="btnAuthDisable(record)? 'table-btn-back-disable':''" @click="setDepartStaff(record, '1')">分配角色</span>
              <span class="color-0067cc table-btn cursor-pointer" @click="openDepAndPosModel(record)">部门及职位</span>
              <TableMoreBtn>
                <li v-if="record.status == 1" :class="btnAuthDisable(record)? 'table-btn-back-disable':''" @click="freezeOrDeparture('freeze', record)">冻结</li>
                <li v-else :class="btnAuthDisable(record)? 'table-btn-back-disable':''" @click="freezeOrDeparture('activation', record)">激活</li>
                <li :class="btnAuthDisable(record)? 'table-btn-back-disable':''" @click="freezeOrDeparture('departure', record)">离职</li>
                <li @click="detailUser(record)">详情</li>
              </TableMoreBtn>
            </div>
          </a-table>
        </CommonTable>
      </div>
    </div>

    <!-- 新增/编辑用户Modal -->
    <CommonModal :title="dictTitle" :visible="addUserFlag" :cancelFn="cancelThing">
      <div slot="form">
        <a-form-model ref="addUserFormRef" :model="addUserForm" :rules="addUserRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="right">
          <a-form-model-item label="头像" style="padding-bottom: 10px">
            <upload-header v-model="addUserForm.profile" @handleSuccessName="addFormUploadSuccess" :file-list="fileList" :imageUrl="imageUrl" :isAlt="true"></upload-header>
          </a-form-model-item>
          <a-form-model-item label="手机号" prop="phone">
            <a-input v-model.trim="addUserForm.phone" placeholder="请输入手机号" :disabled="addOrChangeUser == 'edit' ? true : false" :maxLength="phoneMaxLength" />
          </a-form-model-item>
          <a-form-model-item label="姓名" prop="name">
            <a-input v-model.trim="addUserForm.name" :disabled="addOrChangeUser == 'edit' ? true : false" placeholder="请输入姓名" :maxLength="14" />
          </a-form-model-item>
          <a-form-model-item label="昵称" prop="nickName">
            <a-input v-model.trim="addUserForm.nickName" placeholder="请输入昵称" :maxLength="14" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-select v-model="addUserForm.sex" placeholder="请输入性别">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="生日">
            <a-date-picker v-model="addUserForm.birthday" :popupStyle="{ zIndex: 9999 }" placeholder="请输入生日" style="display: block; widht: 100%" :disabled-date="disabledDatebirthday" />
          </a-form-model-item>
          <a-form-model-item label="邮箱" prop="email">
            <a-input v-model.trim="addUserForm.email" placeholder="请输入邮箱" :disabled="addOrChangeUser == 'edit' ? true : false" />
          </a-form-model-item>
          <a-form-model-item label="角色">
            <a-tree-select
              v-model="addUserForm.roleIds"
              :selectable="false"
              placeholder="请选择角色"
              tree-checkable
              :tree-data="treeDataRoles"
              style="width: 100%"
              :dropdown-style="{
                maxHeight: '400px',
                overflow: 'auto',
                zIndex: 9999,
              }"
              :replace-fields="{
                title: 'roleName',
                key: 'roleId',
                value: 'roleId',
              }"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="标签" prop="labelId">
            <a-tree-select
              v-model="addUserForm.labelIds"
              placeholder="请选择标签"
              tree-checkable
              :tree-data="labelList"
              style="width: 100%"
              :dropdown-style="{
                maxHeight: '400px',
                overflow: 'auto',
                zIndex: 9999,
              }"
              :replace-fields="{
                title: 'labelName',
                key: 'labelId',
                value: 'labelId',
              }"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="工号" prop="jobNumber">
            <a-input v-model.trim="addUserForm.jobNumber" placeholder="请输入工号" :maxLength="jobNumberMaxLength" />
          </a-form-model-item>
          <a-form-model-item label="过期时间" prop="expireDate" extra="不填将使用系统默认过期时间 2099-01-01，过期后系统自动将该用户改为“已冻结”状态">
            <a-date-picker v-model="addUserForm.expireTime" :popupStyle="{ zIndex: 9999 }" placeholder="请选择过期时间" style="display: block; widht: 100%" :disabled-date="disabledDate" />
          </a-form-model-item>
        </a-form-model>

        <div v-show="formCustomNew.length">
          <div class="bor_deash_div"></div>
          <h1 class="h1_wxt">自定义信息</h1>

          <a-form-model ref="customRef" :model="addUserFormT" :rules="addUserRulesT" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="right">
            <a-form-model-item v-for="(item, index) in formCustomNew" :key="index" :label="item.label" :prop="item.prop">
              <a-input v-model.trim="addUserFormT[item.prop]" :placeholder="'请输入' + item.label" />
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>

      <div slot="btn">
        <a-button type="dashed" @click="cancelThing">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" :loading="loadingTwo" @click="submitAddModel">提交</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" :loading="loadingThree" @click="submitAddModel('continue')" v-show="addOrChangeUser != 'edit'">提交并继续添加</a-button>
      </div>
    </CommonModal>

    <!-- 申请人列表Modal -->
    <CommonModal title="申请人列表" :visible="FlagApplicant" :cancelFn="cancelThingApplicant">
      <div class="btns_div clx-btn-dashed-box">
        <a-button class="clx-btn-margin-right" type="dashed" @click="activateOrRemove('activate', 'all')">激活</a-button>
        <a-button class="clx-btn-margin-right" type="dashed" @click="activateOrRemove('remove', 'all')">移除</a-button>
      </div>
      <CommonTable :page="pageApplicant" :pageNoChange="pageNoChangeApplicant" :showSizeChange="showSizeChangeApplicant">
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :columns="columnsApplicant"
          :locale="{ emptyText: emptyText }"
          :data-source="dataListApplicant"
          :rowKey="
            (record, index) => {
              return record.companyUserInfoId;
            }
          "
          :pagination="false"
        >
          <div slot="customTitle">操作</div>
          <div slot="actionApplicant" slot-scope="text, record">
            <span class="color-0067cc cursor-pointer" @click="activateOrRemove('activate', 'one', record)" style="margin-right: 10px">激活</span>
            <span class="color-0067cc cursor-pointer" @click="activateOrRemove('remove', 'one', record)">移除</span>
          </div>
        </a-table>
      </CommonTable>
    </CommonModal>

    <!-- 详情组件 -->
    <CustomFormDetail v-model="resignedDetail" :detailFormData="detailForm" :detailFormCustomNew="detailFormCustomNew" />

    <!-- 邀请用户加入企业组件 -->
    <JoinEnterprise :JoinQyFlag="JoinQyFlag" :step="false" :addcodeObj="addcodeObj" @closeJoinEnterpriseFlag="closeJoinEnterpriseFlag" @toRegenerateCode="toRegenerateCode" @joinUser="joinUser" />

    <!-- 分配角色 -->
    <SetAuth ref="setAuth" :authVisible="setAuthVisible" :userRoleList="treeDataRoles" :selItem="selItem" @closeAuthModel="cancelAuthModel" />

    <!-- 字段管理 -->
    <SelTable v-model="selectModel" :tableColumnAll="tableColumnAllList" :tableColumnIng="seltableColumnList" @setTableColumn="setTableColumn" :seltableColumnVersion="seltableColumnVersion" />

    <!-- 部门及职位弹窗 -->
    <DepAndPosModel v-model="depAndPosModelShow" :depAndPosModelData="depAndPosModelData" :treeDataG="treeDataG" @getTableList="getTableList" />
  </div>
</template>

<script>
import {
  getTreeUserList,
  getUserRoleList,
  GetLabelList,
} from "@/services/api";
import {
  FreezeThing,
  GetUserInfoList,
  Activation,
  DelUserInfoList,
  Resign,
  CustomField,
  AddCode,
  ToRegenerateCode,
  StopUsingEnabled,
  AddUserOrEditInterface,
  ResignedUserDetail,
  UserDetailInterFace,
  DeptGranted,
  SubDeptGranted,
} from "@/services/permissions";
import dayJs from "dayjs";
import moment from "moment";
import { cloneDeep, debounce } from "lodash";
import treeMixin from "@/mixin/tree";
import fromMaxLength from "@/mixin/fromMaxLength";
import JoinEnterprise from "./joinEnterprise.vue";
import cancelLoading from "@/mixin/cancelLoading";
import teableSelected from "@/mixin/teableSelected";
import CustomFormDetail from "./customFormDetail.vue";
import getDictionaryItemObj from "@/utils/dictionary";
import { formValidator } from "@/utils/clx-form-validator.js";
import uploadHeader from "@/components/upload/uploadHeader.vue";
import SetAuth from "./setAuth.vue";
import TableMoreBtn from '@/components/tableMoreBtn/tableMoreBtn.vue'
import SelTable from './userComponents/selTable.vue'
import DepAndPosModel from './userComponents/depAndPosModel.vue'
export default {
  components: { uploadHeader, JoinEnterprise, CustomFormDetail, SetAuth, TableMoreBtn, SelTable, DepAndPosModel },
  mixins: [treeMixin, fromMaxLength, teableSelected, cancelLoading,],
  data() {
    return {
      depAndPosModelShow: false,
      depAndPosModelData: undefined,
      emptyText: <a-empty />,
      getDictionaryItemObj,
      selectedKeys: [],
      treeData: [],
      addUserRulesT: {},
      dictTitle: "创建用户",
      addLoading: false,
      dataList: [],
      labelList: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      selectedKeysOld: [],
      treeDataG: [],
      recordObj: {},
      fileList: [],
      imageUrl: "", //头像回显
      userInfoStatus: [], //搜索状态下拉
      addUserFormT: {}, //自定义字段
      formCustomNew: [], //自定义字段列表转换后
      formCustom: [], //自定义字段列表
      FlagApplicant: false, //申请人弹框开关
      JoinQyFlag: false, //邀请用户加入企业开关
      dataListApplicant: [], //申请人列表
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      addUserFlag: false, //创建用户弹框开关
      selectUserOrPhoneModalShow: false, // 选择用户获手机号弹窗
      visible: false, // 弹窗显示
      treeData: [], // 组织架构 -树
      treeDataRoles: [], //新增用户-角色列表
      distriDepartVis: false, // 分配部门的弹窗
      detailForm: [], ////用户详情
      addcodeObj: {}, //邀请用户加入企业对象
      addOrChangeUser: undefined, //新增用户/修改用户区分变量
      deptIdList: [], //存储部门id树选中-包括父级
      resignedDetail: false, //用户详情弹框开关
      detailFormCustomNew: [], //用户详情-自定义字段
      upDeptIds: [],
      currentUserId: "",
      setAuthVisible: false, //切换分配角色显示
      userRoleList: [],
      selItem: "",
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columnsApplicant: [
        //申请人每一列
        {
          title: "手机号",
          dataIndex: "phone",
          align: "center",
        },
        {
          title: "审批状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          customRender: (text) => {
            return (
              <div>{getDictionaryItemObj("companyUserInfoStatus", text)}</div>
            );
          },
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 150,
          align: "center",
          // fixed: "right", // 固定操作列
          scopedSlots: { customRender: "actionApplicant" },
        },
      ],
      pageApplicant: {
        //申请人分页
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      addUserRules: {
        //创建用户表单校验
        phone: [
          {
            required: true,
            // message: "请输入手机号",
            validator: formValidator.texTphoneNumber,
            trigger: "blur",
          },
        ],
        name: [
          {
            required: false,
            validator: formValidator.specialSymbols,
            trigger: "blur",
            text: "名称",
          },
        ],
        email: [
          { required: false, message: "邮箱不能为空", trigger: "change" },
          { type: "email", message: "请输入正确的邮箱格式" },
        ],
        jobNumber: [
          { required: false, validator: formValidator.texTjobNumber, trigger: "blur", },
        ]
      },
      addUserForm: {
        //创建用户表单
        name: undefined,
        nickName: undefined,
        profile: undefined,
        sex: undefined,
        birthday: undefined,
        expireTime: undefined,
        phone: undefined,
        email: undefined,
        roleIds: [],
        labelIds: [],
        jobNumber: undefined,
      },
      formInline: {
        // 搜索表单
        name: undefined,
        phone: undefined,
        jobNumber: undefined,
        status: undefined,
      },
      // 全部表头
      tableColumnAllList: [
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "工号",
          dataIndex: "jobNumber",
          key: "jobNumber",
          scopedSlots: { customRender: "jobNumber" },
        },
        {
          title: "邮箱",
          dataIndex: "email",
          key: "email",
          scopedSlots: { customRender: "email" },
        },
        {
          title: "主部门及职位",
          dataIndex: "adminDeptAndPosition",
          key: "adminDeptAndPosition",
          scopedSlots: { customRender: "adminDeptAndPosition" },
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: "status" },
        },
      ],
      // 显示的表头
      seltableColumnList: [],
      // 字段管理
      selectModel: false,
      // 字段管理版本
      seltableColumnVersion: 1,
      tableScroll: 1000,
      // 当前登录人用户id
      userId: undefined,
    };
  },
  created() {
    this.userInfoStatus = getDictionaryItemObj("companyUserInfoFindStatus"); //状态-激活/冻结
    this.userId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.userId
    this.getTreeUserTreeFn(true); // 获取组织架构-树结构
    // 从本地获取表头显示信息
    this.setColumnsDataFormLoc()
  },
  computed: {
    // 列表表头
    columns() {
      // 默认表头
      let columnsDefaultData = [
        {
          dataIndex: "action",
          key: "action",
          title: "操作",
          width: 270,
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ]
      if (this.seltableColumnList.length <= 2) {
        delete columnsDefaultData[0].width
        delete columnsDefaultData[0].fixed
      } else {
        columnsDefaultData[0].width = 270
        columnsDefaultData[0].fixed = "right"
      }
      this.tableScroll = this.seltableColumnList.length * 166
      let columnsData = [...this.seltableColumnList, ...columnsDefaultData]
      columnsData.forEach(item => {
        item.align = item.align ? item.align : 'center'
        item.ellipsis = item.ellipsis ? item.ellipsis : true
      })
      return columnsData
    },
    // 公司信息
    company() {
      let company = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company : {};
      return company;
    },
  },
  methods: {
    // 是否有按钮权限
    btnAuthDisable(row) {
      let isDisable = false
      if (row.userId == this.userId) { // 对自己
        isDisable = true
      } else {
        if (row.type == 0) {  //对超管
          isDisable = true
        } else if (row.type == 2) { //对子用户
          isDisable = false
        }
      }
      return isDisable
    },
    // 部门及职位-弹窗
    openDepAndPosModel(row) {
      this.depAndPosModelData = row
      this.depAndPosModelShow = true
    },
    // 从本地获取表头显示信息
    setColumnsDataFormLoc() {
      let seltableColumnListArr = JSON.parse(localStorage.getItem('console_user_seltableColumnList')) || []
      if (seltableColumnListArr.length) {
        let userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
        let selectedRowKeysArr = seltableColumnListArr.filter(item => {
          return item.userId == userId
        })
        if (selectedRowKeysArr.length && selectedRowKeysArr[0].version == this.seltableColumnVersion) {
          // 根据筛选的显示对应表头
          this.setTableColumn(selectedRowKeysArr[0].selectedRowKeys)
          return
        }
      }
      this.seltableColumnList = cloneDeep(this.tableColumnAllList)
    },
    // 字段管理弹窗
    selectModelShow() {
      this.selectModel = true;
    },
    // 根据筛选的显示对应表头
    setTableColumn(selectedRowKeys) {
      this.seltableColumnList = this.tableColumnAllList.filter((item) => {
        return selectedRowKeys.includes(item.key);
      });
    },
    //获取用户详情事件
    async detailUser(data) {
      if (this.canClickBtnMixin("user-1")) {
        let result = await ResignedUserDetail({
          companyUserInfoId: data.companyUserInfoId,
        });
        if (result.code == "20000") {
          this.detailForm = result.data;
          console.log(this.detailForm,'1231231231 ');
          this.detailFormCustomNew = result.data
            ? result.data.userFields
              ? result.data.userFields
              : []
            : [];
        }
        this.resignedDetail = true;
      }
    },
    //新增用户弹框-过期时间禁用
    disabledDate(current) {
      return current && current < moment().subtract(1, "days"); //当天之前的不可选，不包括当天
    },
    //新增用户弹框-生日禁用
    disabledDatebirthday(current) {
      return current && current > moment().subtract(0, "days"); //当天之后的不可选，包括当天
    },
    //用户编辑事件
    editDict(record) {
      if (this.btnAuthDisable(record)) {
        return
      }
      if (this.canClickBtnMixin("user-1")) {
        this.addOrChangeUser = "edit"; //区分新增还是修改
        this.dictTitle = "修改用户";
        this.recordObj = record;
        this.getUserIdentityList(); //添加用户-角色树 数据
        this.getLabelList();//添加标签
        this.customField(); //添加用户-获取自定义字段接口
        UserDetailInterFace({ companyUserInfoId: record.companyUserInfoId })
          .then((res) => {
            this.formCustom = res.data.userFields || []; //自定义字段
            this.formCustomThing(true); //修改自定义字段格式-事件

            let {
              name,
              nickName,
              profile,
              sex,
              birthday,
              expireTime,
              phone,
              roleIds,
              labelIds,
              profilePath,
              email,
              jobNumber,
            } = res.data;

            this.addUserForm.profile = profile || undefined;
            this.addUserForm.phone = phone || undefined;
            this.addUserForm.name = name || undefined;
            this.addUserForm.nickName = nickName || undefined;
            this.addUserForm.sex = sex || undefined;
            this.addUserForm.birthday = birthday || undefined;
            this.addUserForm.email = email || undefined;
            this.addUserForm.roleIds = roleIds || [];
            this.addUserForm.labelIds = labelIds || [];
            this.addUserForm.expireTime = expireTime || null;
            this.addUserForm.jobNumber = jobNumber || undefined;
            this.imageUrl = profilePath;
            this.fileList = profilePath ? [{ uid: profile, status: "done", url: profilePath, },] : [];
            this.addUserFlag = true; //弹框显示
            // this.previewPhoto(profilePath);
          })
          .catch((err) => { });
      }
    },
    //创建用户事件
    addUser() {
      if (this.canClickBtnMixin("user-1")) {
        this.getUserIdentityList(); //添加用户-角色树 数据
        this.getLabelList();//添加标签
        this.customField(); //添加用户-获取自定义字段接口
        this.addUserFlag = true;
        this.addOrChangeUser = "add"; //区分新增还是修改
        this.dictTitle = "新增用户";
        this.imageUrl = "";
      }
    },
    //提交事件
    submitAddModel(type) {
      if (!formValidator.formAll(this, "addUserFormRef")) return; //校验表单
      if (!formValidator.formAll(this, "customRef")) return; //校验自定义信息表单
      let par = {};
      if (this.addOrChangeUser == "add") {
        //添加
        par = {
          ...this.addUserForm,
          expireTime: this.addUserForm.expireTime
            ? dayJs(this.addUserForm.expireTime).format("YYYY-MM-DD HH:mm:ss")
            : "",
          birthday: this.addUserForm.birthday
            ? dayJs(this.addUserForm.birthday).format("YYYY-MM-DD")
            : "",
          userFields: this.formCustomNew.length
            ? this.TransformData()
            : undefined, //自定义字段列表
        };
      } else {
        //修改
        par = {
          ...this.addUserForm,
          expireTime: this.addUserForm.expireTime
            ? dayJs(this.addUserForm.expireTime).format("YYYY-MM-DD HH:mm:ss")
            : "",
          birthday: this.addUserForm.birthday
            ? dayJs(this.addUserForm.birthday).format("YYYY-MM-DD")
            : "",
          userFields: this.formCustomNew.length
            ? this.TransformData()
            : undefined, //自定义字段列表
          companyUserInfoId: this.recordObj.companyUserInfoId,
        };
      }
      if (type && type == "continue") {
        //开启loading
        this.handleLoadingThree();
      } else {
        this.handleLoadingTwo();
      }

      AddUserOrEditInterface(par)
        .then((res) => {
          if (type && type == "continue") {
            //提交并继续
            //关闭弹框
            this.cancelLoadingThree();
            this.cancelThingF();
            setTimeout(() => {
              this.addUser(); //打开弹框
            }, 500);
          } else {
            //提交
            this.cancelLoadingTwo();
            this.cancelThingF();
          }
          this.getTableList();
          if (this.addOrChangeUser == "add") {
            this.$message.success("添加成功");
          } else {
            this.$message.success("修改成功");
          }
        })
        .catch((err) => {
          this.cancelLoadingTwo();
          this.cancelLoadingThree();
        });
    },
    //关闭弹框-并清空新增表单值
    cancelThingF() {
      this.addUserFlag = false;
      //清空表单每一项值
      this.clearAddUserForm();
      //清空自定义字段表单每一项
      this.clearCustomForm();
    },
    //清空添加用户弹框表单值
    clearAddUserForm() {
      this.addUserForm = {
        nickName: undefined,
        profile: undefined,
        sex: undefined,
        birthday: undefined,
        expireTime: undefined,
        phone: undefined,
        roleIds: [],
        labelIds: [],
        jobNumber: undefined,
      };
    },
    //停用事件
    reEnable() {
      this.$confirm({
        title: "提示",
        content: "邀请信息已停用",
        cancelText: "取消",
        okText: "重新启用",
        onOk: () => {
          this.toEnable();
        },
      });
    },
    //重新启用
    toEnable() {
      this.$confirm({
        title: "提示",
        content:
          "重新启用后，仍然是您停用前使用的邀请信息，员工可以继续加入到您的企业。",
        cancelText: "取消",
        onOk: () => {
          StopUsingEnabled({
            codeStatus: 0,
            companyInviteCodeId: this.addcodeObj.companyInviteCodeId,
          })
            .then((res) => {
              this.joinUser();
              this.$message.success("启用成功");
            })
            .catch((err) => {

            });
        },
      });
    },
    //自定义字段接口
    async customField() {
      let result = await CustomField();
      if (result.code == 20000) {
        this.formCustom = result.data || [];
        this.formCustomThing();
      }
    },
    //修改自定义字段格式-事件
    formCustomThing(type) {
      //type 只有编辑回显的时候才传
      let newArr = [];
      let newArrTwo = {};
      let newArrS = {};
      this.formCustom.forEach((item) => {
        newArr.push({
          label: item.cnName,
          prop: item.customeFieldsId,
          required: item.required,
        });
        if (type) {
          newArrTwo[item.customeFieldsId] = item.value || undefined;
        } else {
          newArrTwo[item.customeFieldsId] = "";
        }

        newArrS[item.customeFieldsId] = [
          {
            required: item.required == 1 ? true : false,
            message: `请输入${item.cnName}`,
          },
        ];
      });
      this.formCustomNew = newArr; //处理后形成 新数组
      this.addUserFormT = newArrTwo; //处理后形成 存储表单每一项数组
      this.addUserRulesT = newArrS; //处理后形成 存储表单每一项校验数组
    },
    //获取申请人列表事件
    async getUserInfoList() {
      let par = { ...this.pageApplicant, statusList: [0] };
      let result = await GetUserInfoList(par);
      if (result.code == 20000) {
        this.dataListApplicant = result.data.list;
        this.pageApplicant.total = result.data.total;
      }
    },
    // 页码改变-申请人
    pageNoChangeApplicant(page) {
      this.pageApplicant.pageNo = page;
      // 获取申请人列表
      this.getUserInfoList();
    },
    //改变每页条数事件-申请人
    showSizeChangeApplicant(pageNo, pageSize) {
      this.pageApplicant.pageNo = pageNo;
      this.pageApplicant.pageSize = pageSize;
      //获取申请人列表
      this.getUserInfoList();
    },
    //获取用户添加弹框-用户身份列表
    async getUserIdentityList() {
      let companyId = (this.companyId = JSON.parse(
        sessionStorage.getItem("zconsole_userInfo")
      ).company
        ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
          .companyId
        : "");
      let productId = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
        .productSets
        ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets
          .productId
        : "";
      let result = await getUserRoleList({ companyId, productId });
      if (result.code == 20000) {
        this.treeDataRoles = result.data;
        console.log(this.treeDataRoles,'2111212');
      }
    },
    //获取用户添加弹框-用户标签列表
    async getLabelList() {
      let postData = {
        ...this.page,
        ...this.formInline,
      };
      return GetLabelList(postData)
        .then((res) => {
          let { list: labelList, total } = res.data
            ? res.data
            : { list: [], total: 0 };
          this.labelList = labelList ? labelList : [];
          this.page.total = total;
          this.labelList = res.data;
          console.log(labelList , "dasda");
        })
        .catch((err) => {});
    },
    //邀请用户加入企业按钮点击事件
    async joinUser() {
      if (this.canClickBtnMixin("user-4")) {
        let result = await AddCode();
        if (result.code == 20000) {
          if (result.data.codeStatus == 1) {
            //停用状态
            this.reEnable(); //显示停用弹框
          } else {
            this.addcodeObj = result.data;
            this.JoinQyFlag = true;
          }
        }
      }
    },
    //关闭邀请用户加入企业弹框
    closeJoinEnterpriseFlag() {
      this.JoinQyFlag = false;
    },
    //最终拿到后端需要的数据格式-方法
    TransformData(arr) {
      //传arr为编辑 不传为新增
      let newArr = [];
      let obj = arr && arr.length ? arr : this.addUserFormT;
      let objT = this.formCustom;

      for (var i in obj) {
        newArr.push({ customeFieldsId: i, value: obj[i] });
      }

      let sameArr = objT.map((item) => {
        const data = newArr.find(
          (i) => item.customeFieldsId == i.customeFieldsId
        );
        return {
          ...item,
          ...data,
        };
      });
      return sameArr;
    },
    //申请人-激活移除事件
    async activateOrRemove(type, types, record) {
      let par = {};
      if (types == "all" && !this.selectedRowKeys.length) {
        return this.$message.info("请先选择一条数据");
      }
      if (type == "activate") {
        //激活
        par = {
          list: record ? [record.companyUserInfoId] : this.selectedRowKeys,
        };
        let result = await Activation(par);
        if (result.code == "20000") {
          this.getUserInfoList();
          this.getTableList();
          this.selectedRowKeys = [];
          this.$message.success("激活成功");
        }
      } else {
        //移除
        par = {
          list: record ? [record.companyUserInfoId] : this.selectedRowKeys,
        };
        let result = await DelUserInfoList(par);
        if (result.code == "20000") {
          this.getUserInfoList();
          this.getTableList();
          this.selectedRowKeys = [];
          this.$message.success("移除成功");
        }
      }
    },
    //申请人弹框打开事件
    openApplicant() {
      if (this.canClickBtnMixin("user-5")) {
        this.getUserInfoList(); //调用申请人列表事件
        this.FlagApplicant = true;
      }
    },
    //申请人弹框关闭事件
    cancelThingApplicant() {
      this.FlagApplicant = false;
      this.selectedRowKeys = []; //清空选中的数据
    },
    //冻结/激活/离职事件
    async freezeOrDeparture(type, record) {
      if (this.btnAuthDisable(record)) {
        return
      }
      if (type != "departure") {
        if (!this.canClickBtnMixin("user-1")) {
          return;
        }
      } else {
        if (!this.canClickBtnMixin("user-3")) {
          return;
        }
      }
      this.$confirm({
        title: "提示",
        content: `${type == "freeze"
          ? "确定冻结该用户？"
          : type == "activation"
            ? "确定激活该用户？"
            : "离职后，成员将无法访问本企业，确定离职吗？"
          }`,
        cancelText: "取消",
        onOk: async () => {
          if (type == "freeze") {
            //冻结
            let result = await FreezeThing({
              companyUserInfoId: record.companyUserInfoId,
            });
            if (result.code == "20000") {
              this.$message.success("冻结成功");
              this.getTableList();
            }
          } else if (type == "activation") {
            //激活
            let result = await Activation({ list: [record.companyUserInfoId] });
            if (result.code == "20000") {
              this.$message.success("激活成功");
              this.getTableList();
            }
          } else {
            //离职--departure
            let result = await Resign({
              companyUserInfoId: record.companyUserInfoId,
            });
            if (result.code == "20000") {
              this.$message.success("离职成功");
              this.getTableList();
            }
          }
        },
      });
    },
    // 新增工单--文件上传成功
    addFormUploadSuccess(fileList) {
      this.addUserForm.profile = fileList.length ? fileList[0].id : undefined;
    },
    //关闭用户弹框
    cancelThing() {
      this.$confirm({
        title: "提示",
        content: "取消后信息将不会保存，确定取消吗？",
        cancelText: "取消",
        onOk: () => {
          this.cancelThingF();
        },
      });
    },
    //清空自定义字段表单
    clearCustomForm() {
      let obj = this.addUserFormT;
      for (var i in obj) {
        obj[i] = undefined;
      }
    },
    //创建用户选择时间事件
    onChange(date, dateString) {

    },
    // 选择组织架构的某一项
    selectTree(selectedKeys) {
      this.selectedKeysOld = selectedKeys;
      this.getTableList(); // 获取列表
    },
    // 获取组织架构树-左侧
    getTreeUserTreeFn(type) {
      //type true刚进页面掉起
      return getTreeUserList()
        .then((res) => {
          this.treeData = [res.data]; // 组织架构树
          this.treeDataG = [res.data]; // 新增用户-上级部门树
          if (type) {
            this.selectedKeysOld = [res.data.id];
          }
          // 获取列表
          this.getTableList();
        })
        .catch((err) => {

        });
    },
    // 获取右侧列表
    getTableList() {
      // 条件筛选查询
      let selObj = this.formInline;
      let postData = {};
      //组织架构
      postData = {
        companyId: this.company.companyId,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        jobStatus: 0,
        statusList: [1, 2],
        ...selObj,
        deptId: this.selectedKeysOld[0],
      };
      if (postData.deptId == -1) {
        delete postData.deptId;
      }

      return GetUserInfoList(postData) //获取右侧列表接口
        .then((res) => {
          let { list: dataList, total } = res.data
            ? res.data
            : { list: [], total: 0 };
          this.dataList = dataList || [];
          this.page.total = total;
          // 处理页码 问题
          if (
            this.dataList.length === 0 &&
            (this.page.pageNo !== 1 || this.page.total !== 0)
          ) {
            this.page.pageNo = 1;
            this.getTableList();
          }
          this.cancelLoadingFour();
        })
        .catch((err) => {
          this.cancelLoadingFour();
        });
    },
    //用户-页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    //用户-改变每页条数事件
    showSizeChange(pageNo, pageSize) {
      this.page.pageNo = pageNo;
      this.page.pageSize = pageSize;
      //获取列表
      this.getTableList();
    },
    //离职用户-跳转页面
    leavingUser() {
      this.$router.push("resignedUser");
    },
    // 查询
    iSearch() {
      this.handleLoading();
      // 获取列表
      this.getTableList().finally(() => {
        this.cancelLoading();
      });
    },
    //重新生成邀请码
    async toRegenerateCode() {
      let result = await ToRegenerateCode();
      if (result.code == 20000) {
        this.addcodeObj = result.data;
        this.$message.success("重新生成信息成功");
      }
    },
    // 申请人-表格选择的key
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = {
          name: undefined,
          phone: undefined,
          jobNumber: undefined,
          status: undefined,
        };
        this.selectedKeysOld = [];
        this.selectedKeys = [];
        this.handleLoadingFour(); //按钮loading开启
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 分配角色
    setDepartStaff(data, num) {
      if (this.btnAuthDisable(data)) {
        return
      }
      if (this.canClickBtnMixin("user-1")) {
        // this.getTreeUserTreeFn();
        this.currentUserId = data.userId;
        this.selItem = data;
        if (num == 1) {
          //角色
          this.getUserIdentityList(); //添加用户-角色树 数据
          this.setAuthVisible = true;
        } else {
          DeptGranted({ userId: data.userId })
            .then((res) => {
              this.distriDepartVis = true;
              this.upDeptIds = res.data || [];
            })
            .catch((err) => { });
        }
      }
    },
    cancelAuthModel() {
      this.setAuthVisible = false;
    },
    cancelDistriDepartVis() {
      this.distriDepartVis = false;
    },
  },
};
</script>

<style lang="less" scoped>
.btns_div {
  margin-bottom: 20px;
  .btn-margin {
    margin-right: 10px;
  }
  .btn-text-margin {
    margin-right: 30px;
  }
  .field-management {
    font-size: 14px;
    color: #0067cc;
    cursor: pointer;
  }
  .field-management-grey {
    color: #999999 !important;
  }
}
.h1_wxt {
  font-size: 14px;
  margin-bottom: 30px;
}
.bor_deash_div {
  height: 1px;
  border: 1px dashed rgba(238, 238, 238, 1);
  margin-bottom: 30px;
}
.user-box {
  display: flex;
  flex-direction: column;
  // title
  .user-title {
    flex: none;
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 30px 15px 0;
  }
  // 内容区域
  .user-main {
    flex: 1;
    display: flex;
    .user-main-left {
      width: 3.6rem;
      margin-right: 20px;
      background: #fff;
      padding: 0.2rem;
      overflow-y: auto;

      background: rgba(250, 250, 250, 0.5);
      border: 1px solid #f4f4f4;
      // border: 1px solid #ccc;
      box-sizing: border-box;
      .l-top {
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.19rem;
        border-bottom: solid #ccc 1px;
        margin-bottom: 0.2rem;
        span {
          font-size: 18px;
          color: #181818;
          font-weight: bold;
        }
      }
    }
    .user-main-right {
      flex: 1;
      // 查询
      .user-search {
        padding: 27px 22px 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        background: rgba(250, 250, 250, 0.5);
        border: 1px solid #f4f4f4;
        border-radius: 2px;
        .user-search-left-item-box {
          .ant-form-item-children {
            display: flex;
            align-items: center;
          }
          .user-search-left-item-selct {
            width: 100px;
            margin-right: 10px;
          }
          .user-search-left-item {
            width: 220px;
          }
        }
        .user-search-left {
          .ant-form-item {
            margin-bottom: 16px !important;
          }
        }
        .user-search-right {
          margin-bottom: 16px !important;
        }
      }
      // 创建用户
      .user-apply {
        margin: 0.2rem 0;
      }
    }
  }
}
.clx-model-body {
  .relation-tree-title {
    display: flex;
    .relation-tree-title-all {
      & > span {
        color: #0067cc;
      }
      margin-right: 20px;
    }
    .relation-tree-title-sel {
      & > span {
        color: #0067cc;
      }
    }
  }
}
.user-select-Modal {
  .user-select-Modal-body {
    padding-bottom: 40px;
  }
}
// 列表按钮灰色
.table-btn-back-disable {
  color: #999999 !important;
  cursor: auto;
}
::v-deep .ant-tabs-nav {
  width: 100% !important;
  .ant-tabs-tab {
    text-align: center;
    margin: 0 !important;
    width: 50% !important;
  }
}

::v-deep .ant-select-search__field__placeholder,
.ant-select-selection__placeholder {
  color: #999;
}
// 角色样式
::v-deep .ant-select-selection--multiple > ul > li {
  margin-top: 6px;
}
@media screen and (max-width: 1366px) {
  ::v-deep .ant-select-selection--multiple > ul > li {
    margin-top: 4px;
  }
}
.table-btn {
  margin-right: 16px !important;
}
@media screen and (max-width: 1366px) {
  margin-right: 10px !important;
}
// ::v-deep .common-table .ant-table-fixed-right .ant-table-tbody td > div span {
//   margin-right: auto;
// }
</style>
