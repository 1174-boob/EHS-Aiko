<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>应急演练审批</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline"></CommonDept>
        <a-form-model-item label="申请类型">
          <a-select v-model="formInline.applyType" placeholder="请选择申请类型">
            <a-select-option v-for="item in applyTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span v-if="record.isHander == 1" class="color-0067cc cursor-pointer m-r-15" @click="toCreate(record)">处理</span>
          <span v-if="record.portalStatus == 2" class="color-0067cc cursor-pointer m-r-15" @click="authorization(record)">授权</span>
          <span class="color-red cursor-pointer" @click="actionDel(record)">删除</span>
        </div>
        <div slot="applyType" slot-scope="record">{{getMappingValue(applyTypeList, "key", record.applyType).value}}</div>
        <div slot="draftName" slot-scope="record">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{record.draftCode ? (record.draftName + "/" + record.draftCode) : record.draftName}}</p>
            </div>
            <span>{{record.draftCode ? (record.draftName + "/" + record.draftCode) : record.draftName}}</span>
          </a-popover>
        </div>
        <div slot="portalStatus" slot-scope="record">{{getMappingValue(portalStatusList, "key", record.portalStatus).value}}</div>
      </a-table>
    </CommonTable>
    <!-- 更新授权弹框 -->
    <CommonModal :title="'更新授权'" :visible="reAuthorVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="当前处理节点" prop="nodeStatesText">
            {{editForm.nodeStatesText}}
          </a-form-model-item>
          <a-form-model-item class="flex" label="原处理人" prop="handerId">
            {{editForm.handerName+'/'+editForm.handerJobNumber}}
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'holdUserId'"
            :checkAbel="false"
            :treeRoles="editFormRules"
            :labelTitle="'更新授权人员'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="editForm.holdUserId"
          />
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import dictionary from '@/utils/dictionary'
import { emergentProcessPageList, emergentProcessDeleteDrillProcess, reassignDangerHandlerUser } from '@/services/api.js';
import { formValidator } from "@/utils/clx-form-validator.js"
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { StaffOrDept },
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      applyTypeList: [
        {
          key: "0",
          value: "演练计划"
        },
        {
          key: "1",
          value: "演练报告"
        },
      ],
      portalStatusList: [],
      reAuthorVisible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表单验证
      editFormRules: {
        holdUserId: [
          { required: true, message: "更新授权人员不能为空", trigger: "change" },
        ],
      },
      editForm: {},
      editParams:{},
      processId:'',

      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '审批单编号',
          dataIndex: 'processNumber',
          width: 180,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '所属组织',
          dataIndex: 'corporationName',
          width: 140,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 200,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '申请类型',
          scopedSlots: { customRender: 'applyType' },
          width: 120,
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'draftName' },
          width: 140,
        },
        {
          title: '起草时间',
          dataIndex: 'createTime',
          width: 160,
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'portalStatus' },
          fixed: 'right', // 固定操作列
          width: 110
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 140 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      changeTypeList: [],
      dangerousPostAll: [],
      userId: "",
      treeData: [],
    }
  },
  created() {
    this.setRouterCode("emergencyApprove");
    this.initConfigPage()
    this.getDataList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },
    //获取工号
    getWorkNum(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeCode);
        }
      }
      return listName;
    },

    //更新授权人员
    personThingOne(data) {
      this.editForm.holdUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.holdUserName = this.getName(list);
      this.editForm.holdUserJobNumber = this.getWorkNum(list);
    },
    // 授权
    authorization(e){
      console.log('rowwww',e);
      if (!this.canClickBtnMixin("emergencyApprovalAuthorization")) {
        return;
      }
      this.processId = e.processId
      let _this = this
      this.$antConfirm({
        title: '更新授权流程节点人员会影响原有流程，是否确认进行更新授权？',
        onOk () {
          _this.reAuthorVisible = true
          // 0 退回起草人
          // 1 申请部门经理 审批
          // 2 技安环保部经理 审批
          // 3 技安环保部总监 审批
          // 4 申请部门总监 审批
          // 5 分管安全副总经理 审批
          // 6 总经理 审批
          switch (e.nodeStatus) {
            case "0":
              _this.editForm.nodeStatesText = '退回起草人';
              break;
            case "1":
              _this.editForm.nodeStatesText = '申请部门经理 审批';
              break;
            case "2":
              _this.editForm.nodeStatesText = '技安环保部经理 审批';
              break;
            case "3":
              _this.editForm.nodeStatesText = '技安环保部总监 审批';
              break;
            case "4":
              _this.editForm.nodeStatesText = '申请部门总监 审批';
              break;
            case "5":
              _this.editForm.nodeStatesText = '分管安全副总经理 审批';
              break;
            case "6":
              _this.editForm.nodeStatesText = '总经理 审批';
              break;
          }
          _this.editForm.handerName = e.handerName;
          _this.editForm.handerJobNumber = e.handerJobNumber;
        },
        onCancel () {

        }
      });
    },
    // 更新授权确认
    editConfirm(){
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      this.editParams = {
        processId:this.processId,
        handlerUserId:this.editForm.holdUserId[0],
        handlerUserJobNumber:this.editForm.holdUserJobNumber[0],
        handlerUserName:this.editForm.holdUserName[0]
      }
      reassignDangerHandlerUser(this.editParams).then((res)=>{
        if(res.code == 20000){
          this.$antMessage.success('授权成功')
          // 获取列表
          this.getDataList();
          this.reAuthorVisible = false
          this.editParams = {}
          this.editForm = {}
        } else {
          this.$antMessage.warn(res.message)
          return
        }
      })
    },
    // 点击取消按钮
    addCancle() {
      this.reAuthorVisible = false;
      this.editForm = {};
    },
    initConfigPage(){
      this.portalStatusList = dictionary("dirllPlanApproveStatus"); // 审批状态
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    // 审批列表
    getDataList() {
      this.tableSpinning = true
      return emergentProcessPageList({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.preFormInline
      })
      .then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      })
      .catch(err => {})
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonDept.reset();
      this.treeData = [];
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    // 按钮-详情
    actionLook(record) {
      if (record.applyType == "0") { // 计划
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanView", query: { processId: record.processId } });
      } else { // 报告
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approveReportView", query: { processId: record.processId, hasReport: true } });
      }
    },
    // 按钮-删除
    actionDel(record) {
      if (!this.canClickBtnMixin("emergencyApprove-del")) {
        return;
      }
      if (record.portalStatus == 2) {
        this.$antMessage.warn("审批中，不可删除");
        return;
      }
      emergentProcessDeleteDrillProcess({
        processId: record.processId
      }).then(res => {
        this.$antMessage.success("删除成功！");
        this.getDataList();
      })
    },
    // 按钮-处理
    toCreate(record) {
      if (record.applyType == "0") { // 计划
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanHandle", query: { processId: record.processId } });
      } else { // 报告
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approveReportHandle", query: { processId: record.processId, hasReport: true } });
      }
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    }
  }
}
</script>
<style lang="less" scoped>
</style>