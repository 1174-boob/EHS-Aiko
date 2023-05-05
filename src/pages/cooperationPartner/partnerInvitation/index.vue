<template>
  <!-- 邀请列表 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>合作伙伴邀请</PageTitle>
    <div class="card-container">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="发出的邀请">
          <SearchTerm>
            <a-form-model layout="inline" :model="formInline" :colon="false">
              <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
              <a-form-model-item label="供应商名称">
                <a-input v-model="formInline.name" placeholder="供应商名称模糊搜索" allowClear></a-input>
              </a-form-model-item>
              <a-form-model-item label="邀请状态">
                <a-select v-model="formInline.type" placeholder="请选择" allowClear>
                  <a-select-option value="0">待发送</a-select-option>
                  <a-select-option value="1">待处理</a-select-option>
                  <a-select-option value="2">待审核</a-select-option>
                  <a-select-option value="3">审核通过</a-select-option>
                  <a-select-option value="4">审核驳回</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="float-right">
                <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
                <a-button @click="iRest">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </SearchTerm>
          <DashBtn>
            <div>
              <a-button type="dashed" @click="addInvitation">
                <a-icon type="plus" />新建邀请
              </a-button>
              <a-button type="dashed" @click="sendInvitation">批量发送</a-button>
            </div>
          </DashBtn>
          <!-- 列表 -->
          <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
            <a-table
              :columns="columns"
              :scroll="{ x: 800 }"
              :locale="{emptyText: emptyText}"
              :data-source="invitationList"
              :rowKey="(record, index)=>{return record.invitationId}"
              :pagination="false"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps }"
              :components="drag(columns)"
            >
              <div slot="invitationState" slot-scope="record">
                <span>{{invitationStateKV[record.invitationState]}}</span>
              </div>
              <div slot="customTitle">操作</div>
              <div slot="action" slot-scope="record">
                <span class="color-0067cc cursor-pointer" @click="InvitationAction(record)">{{stateKV[record.invitationState]}}</span>
              </div>
            </a-table>
          </CommonTable>
        </a-tab-pane>
        <a-tab-pane key="2" tab="收到的邀请">
          <SearchTerm>
            <a-form-model layout="inline" :model="receivedForm" :colon="false">
              <CommonSearchItem ref="commonSearchItem" :CommonFormInline="receivedForm"></CommonSearchItem>
              <a-form-model-item label="客户名称">
                <a-input v-model="receivedForm.name" placeholder="客户名称模糊搜索" allowClear></a-input>
              </a-form-model-item>
              <a-form-model-item label="邀请状态">
                <a-select v-model="receivedForm.type" placeholder="请选择" allowClear>
                  <a-select-option value="0">待发送</a-select-option>
                  <a-select-option value="1">待处理</a-select-option>
                  <a-select-option value="2">待审核</a-select-option>
                  <a-select-option value="3">审核通过</a-select-option>
                  <a-select-option value="4">审核驳回</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="float-right">
                <a-button type="primary" :loading="loading" @click="receivedSearch">查询</a-button>
                <a-button @click="receivedRest">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </SearchTerm>
          <CommonTable :spinning="tableSpinningReceived" :page="receivedPage" :pageNoChange="pageReceivedChange" :showSizeChange="sizeReceivedChange">
            <a-table
              :columns="receivedColumns"
              :scroll="{ x: 800 }"
              :locale="{emptyText: emptyText}"
              :data-source="receivedList"
              :rowKey="(record, index)=>{return index}"
              :pagination="false"
              :components="drag(receivedColumns)"
            >
              <div slot="invitationState" slot-scope="record">
                <span>{{invitationStateKV[record.invitationState]}}</span>
              </div>
              <div slot="customTitle">操作</div>
              <div slot="action" slot-scope="record">
                <span class="color-0067cc cursor-pointer" @click="receivedAction(record)">{{receivedStateKV[record.invitationState]}}</span>
              </div>
            </a-table>
          </CommonTable>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 新建弹框 -->
    <CommonModal :title="invitationTitle" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="invitationForm" :model="invitationForm" :rules="invitationRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left">
          <CommonDept :CommonFormInline="invitationForm" :rules="invitationRules" :labelAlign="'left'" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" @corporationChange="corporationChange"></CommonDept>
          <a-form-model-item label="供应商名称" prop="companyName">
            <a-input class="form-input" v-model.trim="invitationForm.companyName" placeholder="请输入" @blur="invitationBlur" @change="companyNameChange" allowClear />
          </a-form-model-item>
          <a-form-model-item label="供应商简称" prop="companyAbbreviation">
            <a-input class="form-input" v-model="invitationForm.companyAbbreviation" placeholder="供应商简称自动带出" @blur="invitationBlur" disabled />
          </a-form-model-item>
          <staffOrDept :labelTitle="'所属部门'" :checkAbel="false" :deptTreeId="deptTreeId" :treeType="'dept'" propKey="departmentId" :treeRoles="invitationRules" :checkedTreeNode="checkedTreeNode" @getTreeData="getDeptTreeData"></staffOrDept>
          <staffOrDept :labelTitle="'所属担当'" :checkAbel="false" :deptTreeId="deptTreeId" :checkedTreeNode="checkedStaffNode" @getTreeData="getStaffTreeData" :treePlaceholder="'请先选择部门'" :onPreview="staffDisabled"></staffOrDept>
          <a-form-model-item label="备注">
            <a-input class="form-input" v-model="invitationForm.remarks" placeholder="请输入" allowClear />
          </a-form-model-item>
        </a-form-model>
      </template>

      <template slot="btn">
        <a-button @click="cancelInvitation">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitInvitation('0')">保存</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitInvitation('1')">邀请</a-button>
      </template>
    </CommonModal>
    
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dragTable from "@/mixin/dragTable.js";
import staffTree from "@/mixin/treeTab.js"; // 选择组织成员单选
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from 'lodash';
import staffOrDept from "@/components/staffOrDept";
import {
  getOrganizeList,
  DeptUserTree,
  SelectIssueInvitationPage,
  ReceivedInvitationPage,
  SelectCompany,
  InsertInvitation,
  BatchSendInvitation,
  InvitationDetail,
  ParentDeptList,
  UpdateInvitation,
  DetailNgform
} from "@/services/api.js";

export default {
  components: {staffOrDept},
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, staffTree],
  data() {
    return {
      tableSpinning:false,
      tableSpinningReceived:false,
      activeKey:'1',
      checkedTreeNode:[],
      checkedStaffNode:[],
      IdObjs: {},
      deptTreeId:'',
      staffDisabled: true,
      visible: false,
      invitationTitle: '新建邀请',
      labelCol: { span: 5 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      selectedRowKeys: [],
      gData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      receivedPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      invitationForm: {
        companyName: '',
        companyAbbreviation: '', //供应商简称
        companyCode: '', //供应商编码
        departmentId: undefined, //部门id
        toBear: undefined, //担当
        remarks: '', //备注
      },
      // departmentIdArr: [],
      invitationId: '',
      invitationIdList: [], //选中的待发送id集合
      searchFormData: {},
      formInline: {
        name: '',
        type: undefined
      },
      receivedFormData: {},
      receivedForm: {
        name: '',
        type: undefined
      },
      stateKV: {
        '0': '编辑',
        '1': '查看',
        '2': '审核',
        '3': '查看',
        '4': '查看',
      },
      receivedStateKV: {
        '1': '完善信息',
        '2': '查看',
        '3': '变更信息',
        '4': '完善信息',
      },
      invitationStateKV: {
        '0': '待发送',
        '1': '待处理',
        '2': '待审核',
        '3': '审核通过',
        '4': '审核驳回',
      },
      columns: [
        {
          title: '供应商名称',
          dataIndex: 'companyName',
          key: "companyName",
          width: 300
        },
        {
          title: '供应商简称',
          dataIndex: 'companyAbbreviation',
          key: "companyAbbreviation",
          width: 200
        },
        {
          title: '所属部门',
          dataIndex: 'departmentName',
          key: "departmentName",
          width: 300
        },
        {
          title: '所属担当',
          dataIndex: 'toBearName',
          width: 200
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          key: "remarks",
          width: 200
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'invitationState' },
          key: "invitationState",
          width: 100
        },
        {
          title: '邀请人',
          dataIndex: 'invitationPersonName',
          width: 200
        },
        {
          title: '邀请时间',
          dataIndex: 'updateTime',
          key: "updateTime",
          width: 200
        },
        {
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      receivedColumns: [
        {
          title: '客户名称',
          dataIndex: 'customerName',
          key: "customerName",
          align: 'center',
          ellipsis: true,
          width: 300
        },
        {
          title: '客户简称',
          dataIndex: 'customerAbbreviation',
          key: "customerAbbreviation",
          align: 'center',
          ellipsis: true,
          width: 200
        },
        {
          title: '所属部门',
          dataIndex: 'departmentName',
          key: "departmentName",
          align: 'center',
          ellipsis: true,
          width: 300
        },
        {
          title: '所属担当',
          dataIndex: 'toBearName',
          align: 'center',
          ellipsis: true,
          width: 200
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          key: "remarks",
          align: 'center',
          ellipsis: true,
          width: 200
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'invitationState' },
          key: "invitationState",
          align: 'center',
          ellipsis: true,
          width: 100
        },
        {
          title: '邀请人',
          dataIndex: 'invitationPersonName',
          align: 'center',
          ellipsis: true,
          width: 200
        },
        {
          title: '邀请时间',
          dataIndex: 'updateTime',
          key: "updateTime",
          align: 'center',
          ellipsis: true,
          width: 200
        },
        {
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          align: 'center',
          ellipsis: true,
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      invitationList: [],
      receivedList: [],
      // treeData: [],
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      // userTreeData: [],
      // treeDefaultExpandedKeys: [], //默认展开的树节点
      userTreeShow: true,
      invitationRules: {
        companyName: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' },
        ],
        companyAbbreviation: [
          { required: true, message: '供应商简称不能为空', trigger: 'blur' },
        ],
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == '/cooperationPartner/audit') {
      next(vm => {
        vm.setRouterCode("partnerInvitation");
        vm.getSelectIssueInvitationPage();
      })
    } else if (from.path == '/cooperationPartner/changeInformation' || from.path == '/cooperationPartner/completeInformation') {
      next(vm => {
        vm.setRouterCode("partnerInvitation");
        vm.getReceivedInvitationPage();
      })
    } else {
      next(vm=>{
        vm.setRouterCode("partnerInvitation");
      })
    }
  },
  created() {
    this.setRouterCode("partnerInvitation");
    this.columns.splice(2, 0, this.addCommonColumnItem(200));
    this.getSelectIssueInvitationPage();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        if (this.activeKey == 1) {
          this.iRest();
        } else {
          this.receivedRest();
        }

      }
    }, 20);
  },
  methods: {
    corporationChange(a, b) {
      this.deptTreeId = b;
    },
    // 分页查询发出企业邀请
    getSelectIssueInvitationPage(searchFormData = this.searchFormData) {
      const params = {
        ...searchFormData,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      this.tableSpinning = true
      SelectIssueInvitationPage(params)
      .then(res => {
        this.cancelLoading(100);
        this.invitationList = res.data.list || [];
        this.page.total = res.data.total;
        
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 分页查询企业收到的邀请
    getReceivedInvitationPage(receivedFormData = this.receivedFormData) {
      const params = {
        ...receivedFormData,
        pageSize: this.receivedPage.pageSize,
        pageNo: this.receivedPage.pageNo,
      }
      this.tableSpinningReceived = true
      ReceivedInvitationPage(params).then(res => {
        this.cancelLoading(100);
        this.receivedList = res.data.list || [];
        this.receivedPage.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinningReceived = false
      })
    },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.value.includes(inputValue)
    },
    // 供应商名称输入框失去焦点时候
    invitationBlur() {
      const params = {
        companyName: this.invitationForm.companyName
      }
      SelectCompany(params).then(res => {
        if (res.data.companyAbbreviation) {
          this.invitationForm.companyAbbreviation = res.data.companyAbbreviation;
          this.invitationForm.companyCode = res.data.companyCode;
        } else {
          this.$antMessage.warning('暂无该企业信息');
          this.invitationForm.companyAbbreviation = '';
          this.invitationForm.companyCode = '';
        }

      }).catch(err => {
        console.log(err);
      })
    },
    // 供应商名称使用清空操作的时候
    companyNameChange(value) {
      if (!value.target.value) {
        this.invitationBlur()
      }
    },
    // 机构选择改变
    getDeptTreeData(value) {
      console.log("hhhhh",value);
      const id = value.treeIdList.join();
      this.checkedTreeNode = value.treeIdList;
      if(id) {
        this.invitationForm.departmentId = id;
        this.staffDisabled = false;
      } else {
        this.staffDisabled = true;
        this.invitationForm.departmentId = undefined;
      }
      this.checkedStaffNode = [];
      this.invitationForm.toBear = undefined;
      formValidator.formItemValidate(this, 'departmentId', 'invitationForm')
      // console.log(this.invitationForm,12);
    },
    // 改变担当
    getStaffTreeData(obj) {
      this.checkedStaffNode = obj.treeIdList;
      this.invitationForm.toBear = obj.treeIdList.join();
      this.$set(this.invitationForm, "toBearName", obj.treeNameAndCodeList[0] && obj.treeNameAndCodeList[0].treeName);
      this.$set(this.invitationForm, "toBearWorkNum", obj.treeNameAndCodeList[0] && obj.treeNameAndCodeList[0].treeCode);
    },
    tabChange(key) {
      if (key == 1) {
        this.getSelectIssueInvitationPage();
      } else {
        this.getReceivedInvitationPage();
      }
    },
    // 新建邀请
    addInvitation() {
      this.invitationTitle = '新建邀请';
      this.visible = true;
    },
    // 取消邀请
    cancelInvitation() {
      this.visible = false;
      this.invitationForm = {
        companyName: '',
        companyAbbreviation: '', //供应商简称
        companyCode: '', //供应商编码
        departmentId: undefined, //部门id
        toBear: undefined, //担当
        remarks: '', //备注
      }
    },
    // 批量发送
    sendInvitation() {
      BatchSendInvitation({ invitationIdList: this.invitationIdList }).then(res => {
        if (res.code == 20000) {
          this.$antMessage.success("发送成功")
          this.selectedRowKeys = [];
          this.invitationIdList = [];
          this.page.pageNo = 1;
          this.getSelectIssueInvitationPage();
        }
      }).catch(err => {
        console.log(err);
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.invitationIdList = selectedRowKeys;
      this.selectedRowKeys = selectedRowKeys;
    },
    // 设置不可选
    getCheckboxProps: record => ({
      props: {
        disabled: record.invitationState !== "0",
      },
    }),
    // 关闭弹框
    cancelFn() {
      this.visible = false;
    },
    // 发出的邀请操作
    InvitationAction(record) {
      if (record.invitationState == '0') { //编辑
        this.invitationTitle = '编辑邀请';
        this.visible = true;
        this.invitationId = record.invitationId
        InvitationDetail({ invitationId: this.invitationId }).then(res => {
          const data = res.data;
          this.invitationForm = data;
          const deptId = data.departmentId;
          this.checkedTreeNode = deptId ? deptId.split(",") : [];
          this.deptTreeId = deptId ? deptId : '',
          this.staffDisabled = deptId ? false : true,
          this.checkedStaffNode = data.toBear ? data.toBear.split(",") : []
        }).catch(err => {
          console.log(err);
        })
      } else if (record.invitationState == '1' || record.invitationState == '3' || record.invitationState == '4') { //查看
        this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/completeInformation", query: { id: record.invitationId, url: this.$route.path, status: 1, fromId: record.fromId, companyId: record.companyId } })
      } else if (record.invitationState == '2') { //审核
        this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/completeInformation", query: { id: record.invitationId, url: this.$route.path, status: 2, fromId: record.fromId, companyId: record.companyId, isView: true } })
      }
    },
    // 接收的邀请操作
    receivedAction(record) {
      let status = 1; // 查看
      if (record.invitationState == '4' || record.invitationState == '1') { // invitationState-->1：第一次完善信息（无数据）  2：查看  3：变更信息（有上次填写的数据用于回显）  4：驳回后可以继续完善信息（有上次填写的数据用于回显）
        status = 3; // 完善信息
      } else if (record.invitationState == '3') {
        status = 4; // 变更信息
      }
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/completeInformation", query: { id: record.invitationId, url: this.$route.path, status: status, fromId: record.fromId, companyId: record.companyId } })
    },
    // 新建邀请确定
    submitInvitation(value) {
      if (!formValidator.formAll(this, 'invitationForm')) {
        return
      }
      if (this.invitationTitle == '新建邀请') {
        const params = {
          ...this.invitationForm,
          invitationState: value,
        }
        InsertInvitation(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(`${value == '0' ? "保存" : '邀请'}成功`);
            this.invitationForm = {};
            this.visible = false;
            this.checkedTreeNode = [];
            this.checkedStaffNode = [];
            this.staffDisabled = true;
            this.getSelectIssueInvitationPage();
          }
        }).catch(err => {
          console.log(err);
        })
      } else if (this.invitationTitle == '编辑邀请') { //编辑邀请
        const params = {
          ...this.invitationForm,
          invitationState: value,
          invitationId: this.invitationId,
        }
        UpdateInvitation(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(`${value == '0' ? "保存" : '邀请'}成功`);
            this.invitationForm = {};
            this.visible = false;
            this.checkedTreeNode = [];
            this.checkedStaffNode = [];
            this.staffDisabled = true;
            this.getSelectIssueInvitationPage();
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getSelectIssueInvitationPage();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getSelectIssueInvitationPage();
    },
    // 页码改变
    pageReceivedChange(page) {
      this.receivedPage.pageNo = page;
      // 获取列表
      this.getReceivedInvitationPage();
    },
    // 字典组每页展示条数改变
    sizeReceivedChange(page, pageSize) {
      this.receivedPage.pageNo = 1;
      this.receivedPage.pageSize = pageSize;
      this.getReceivedInvitationPage();
    },
    // 查询
    iSearch() {
      this.searchFormData = JSON.parse(JSON.stringify(this.formInline))
      this.handleLoading();
      this.getSelectIssueInvitationPage(this.searchFormData);
    },
    // 收到企业邀请查询
    receivedSearch() {
      this.receivedFormData = JSON.parse(JSON.stringify(this.receivedForm))
      this.handleLoading();
      this.getReceivedInvitationPage();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        name: '',
        type: undefined
      },
        this.searchFormData = JSON.parse(JSON.stringify(this.formInline))
      this.getSelectIssueInvitationPage();
    }, 250, { leading: true, trailing: false }),
    // 收到企业邀请重置
    receivedRest: debounce(function () {
      this.receivedPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.receivedForm = {
        name: '',
        type: undefined
      },
        this.receivedFormData = JSON.parse(JSON.stringify(this.receivedForm))
      this.getReceivedInvitationPage();
    }, 250, { leading: true, trailing: false }),
    getEditData() { // 拿编辑数据
      let params = {
        url: this.$route.path,
      }
      DetailNgform(params).then(res => {
        let obj = {
          code: res.data.code,
          url: res.data.url,
          remark: res.data.remark,
          name: res.data.name,
          tempId: res.data.tempId
        }
      }).catch((err) => {
        console.log(err);
      })
    },
  },
}
</script>

<style lang="less" scoped>
.radio-option {
  & > div {
    margin-top: 20px;
    border: 1px dashed #ccc;
    width: 150px;
    height: 150px;
    padding: 20px;
  }
  .active-config {
    color: #0067cc;
    border: 1px dashed #0067cc;
  }
}
</style>