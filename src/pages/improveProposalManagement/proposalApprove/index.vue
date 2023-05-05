<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>评审提案</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
          @corporationChange="corporationChange"
          @centerChange="centerChange"
          @corporationDeptChange="corporationDeptChange"
        ></CommonDept>
        <a-form-model-item label="所属部门">
          <dept-tree :placeholder="'请选择所属部门'" v-model="formInline.deptId" :deptData="deptData" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item label="提案人/工号">
          <a-input v-model="formInline.proposalPerson" placeholder="请输入提案人/工号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="提案名称">
          <a-input v-model="formInline.proposalName" placeholder="请输入提案名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="提案级别">
          <a-select v-model="formInline.proposalLevel" placeholder="请选择提案级别" allowClear>
            <a-select-option v-for="item in proposalLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="分档">
          <a-select v-model="formInline.proposalGrade" placeholder="请选择分档" allowClear>
            <a-select-option v-for="item in proposalGrade" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <a-tabs :default-active-key="defaultTabKey" @change="tabChange">
      <a-tab-pane key="1" tab="待处理">
        <ApproveTable v-if="tabKey=='1'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage"></ApproveTable>
      </a-tab-pane>
      <a-tab-pane key="2" tab="已处理">
        <ApproveTable v-if="tabKey=='2'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage"></ApproveTable>
      </a-tab-pane>
      <a-tab-pane key="3" tab="待分配">
        <ApproveTable v-if="tabKey=='3'" :tableSpinning="tableSpinning" :tabKey="tabKey" @distribute="distribute" :dataSource="dataSource" @getPage="getPage"></ApproveTable>
      </a-tab-pane>
    </a-tabs>
    <CommonModal title="分配人员" :visible="visible" :cancelFn="visibleCancel">
      <template slot="form">
        <a-form-model
          ref="distributeForm"
          :model="distributeForm"
          :rules="distributeRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <staffOrDept class="staff-Dept" ref="reviewerList" :labelTitle="'分配人员'" :treeRoles="distributeRules" :propKey="'reviewerList'" :checkedTreeNode="checkedTreeNode" @getTreeData="getTreeData"></staffOrDept>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="visibleCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="distributeConfirm" :loading="distributeLoading">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import { proposalReviewPageList, proposalDistribute, PushTask } from "@/services/api.js";
import dictionary from "@/utils/dictionary.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import ApproveTable from "./component/approveTable";
import staffOrDept from "@/components/staffOrDept";
import { getQueryVariable } from "@/utils/util.js";
export default {
  mixins: [cancelLoading],
  components: { ApproveTable, staffOrDept },
  data() {
    return {
      tableSpinning:false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      defaultTabKey: getQueryVariable('proposalTab') || '1',
      tabKey: getQueryVariable('proposalTab') || '1',
      visible: false,
      distributeLoading: false,
      formInline: {
        deptId: undefined
      },
      formData: {},
      proposalId: "",
      // proposalLevel: "",
      deptData: [],
      dataSource: {},
      proposalLevel: [],
      proposalGrade: [],
      checkedTreeNode: [],
      distributeForm: {},
      distributeRules: {
        reviewerList: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
      },
      proposalCode: ''
    }
  },
  created() {
    this.setRouterCode("proposalApprove");
    this.getProposalReviewPageList();
    this.initConfigPage()
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
    initConfigPage(){
      this.proposalLevel = dictionary('proposalLevel'); //提案级别 1-科室级 2-部门级 3-公司级 4-事业级
      this.proposalGrade = dictionary('proposalGrade'); //分档 1-不通过 2-普通 3-良好 4-优秀
    },
    // 组织改变
    corporationChange(val, deptId) {
      this.formInline.deptId = undefined;
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value
    },
    // 中心改变
    centerChange(val) {
      this.deptData = [];
      this.formInline.deptId = undefined;
    },
    tabChange(key) {
      this.tabKey = key;
      this.dataSource = {};
      this.getProposalReviewPageList();
    },
    getProposalReviewPageList() {
      const params = {
        ...this.formData,
        processStatus: this.tabKey, //1-待处理 2-已处理 3-待分配
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      proposalReviewPageList(params)
      .then(res => {
        this.dataSource = res.data;
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    getPage(page) {
      this.page = page;
      this.getProposalReviewPageList();
    },
    // 查询
    iSearch() {
      this.formData = JSON.parse(JSON.stringify(this.formInline));
      this.getProposalReviewPageList();
    },
    visibleCancel() {
      this.visible = false;
    },
    distributeConfirm() {
      if (!formValidator.formAll(this, 'distributeForm')) {
        return;
      }
      const params = {
        ...this.distributeForm,
        proposalId: this.proposalId
      }
      this.distributeLoading = true;
      proposalDistribute(params).then(res => {
        const reviewerList = this.distributeForm.reviewerList;
        this.pushTask(this.proposalId, reviewerList);
        this.$antMessage.success("操作成功")
        this.distributeLoading = false;
        this.visible = false;
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        }
        this.getProposalReviewPageList();
      }).catch(err => {
        console.log(err);
        this.distributeLoading = false;
      })
    },
    // 代办推送
    async pushTask(id, reviewerList) {
      // const title = this.proposalLevel == '3' ? '公司级提提案评审' :'事业级提提案评审'
      const title = this.formInline.proposalLevel == '3' ? 'proposalCompany' : 'proposalCareer'
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/securityThinkTank/improveProposalManagement/approveScoring&proposalId=${id}`
      const pushTask = await PushTask({
        title: title,
        approval: 'proposal',
        userId: reviewerList.join(),
        url: url,
        docId: this.proposalId,
        docNumber: this.proposalCode || '',
        handleType: 1,
      })
    },
    distribute(record) {
      this.proposalId = record.proposalId;
      this.proposalCode = record.proposalCode;
      this.formInline.proposalLevel = record.proposalLevel;
      this.visible = true;
    },
    getTreeData(value) {
      this.distributeForm.reviewerList = value.treeIdList;
      formValidator.formItemValidate(this, "reviewerList", "distributeForm")
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        deptId: undefined
      }
      this.formData = {};
      this.getProposalReviewPageList();
    }, 250, { leading: true, trailing: false }),
  }
}
</script>
<style lang="less" scoped>
.staff-Dept {
  ::v-deep .ant-form-item {
    display: flex;
  }
}
</style>