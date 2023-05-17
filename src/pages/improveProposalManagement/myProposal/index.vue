<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>我的提案</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
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
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="addProposal">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="dataList"
        :rowKey="(record, index)=>{return index}"
        :pagination="false"
      >
      <template slot="person" slot-scope="record">
        {{record.draftPersonName}}/{{record.draftPersonJobNumber}}
      </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="proposalPreview(record.proposalId)">查看</span>
          <span class="color-0067cc cursor-pointer" v-if="record.proposalLevel !='4' && record.proposalGrade == '4'" @click="proposalEdit(record.proposalId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" v-if="record.proposalLevel =='1' && record.proposalGrade == '1'" @click="proposalDelete(record.proposalId)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import { proposalMyPageList, proposalDelete } from "@/services/api.js";
import dictionary from "@/utils/dictionary.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading ],
  data() {
    return {
      tableSpinning:false,
      formInline: {
      },
      formData: {},
      proposalLevel:[],
      proposalGrade:[],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '提案编号',
          dataIndex: 'proposalCode',
          key: "proposalCode",
          width: 210
        },
        {
          title: '提案人',
          scopedSlots: { customRender: 'person' },
          width: 200
        },
        {
          title: '提案名称',
          dataIndex: 'proposalName',
          customRender: (text,record) => {
            return text ? text : "--";
          },
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          customRender: (text,record) => {
            return text ? text : "--";
          },
          width: 200
        },
        {
          title: '提案级别',
          dataIndex: 'proposalLevel',
          customRender: (text,record) => {
            return record.proposalLevel ? dictionary('proposalLevel', record.proposalLevel) : "--";
          },
          width: 200
        },
        {
          title: '分档',
          dataIndex: 'proposalGrade',
          customRender: (text,record) => {
            return record.proposalGrade ? dictionary('proposalGrade', record.proposalGrade) : "--";
          },
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'approvalStatus',
          key: "approvalStatus",
          customRender: (text, record, index) => {
            return text==1 ? '评审中' : text==2 ?'评审完成' : '--';
          },
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        },
      ],
      dataList: [],
    }
  },
  created() {
    this.setRouterCode("myProposal");
    this.columns.splice(1, 0, this.addCommonColumnItem(150))
    this.columns.splice(3, 0, this.addCommonColumnDepartment({
      width: 150,
      key:'deptId',
      title: "部门"
    }));
    this.getProposalPageList();
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
      this.proposalLevel = dictionary('proposalLevel'); //提案级别 1-部门级 2-工厂级 3-基地级 4-集团级
      this.proposalGrade = dictionary('proposalGrade'); //分档 1-不通过 2-普通 3-良好 4-优秀
    },
    // 获取列表
    getProposalPageList() {
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        // proposalType: '1', //1-我的提案，2-提案数据库
      }
      this.tableSpinning = true
      proposalMyPageList(params)
      .then(res=>{
        this.dataList = res.data.list;
        this.page.total = res.data.total;
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      this.formData = JSON.parse(JSON.stringify(this.formInline));
      this.getProposalPageList()
    },
    // 跳转新建页面
    addProposal() {
      this.$router.push("/safeManage/securityThinkTank/improveProposalManagement/addProposal");
    },
    // 预览
    proposalPreview(proposalId) {
      this.$router.push({ path: '/safeManage/securityThinkTank/improveProposalManagement/previewProposal', query: { proposalId }})
    },
    // 编辑
    proposalEdit(proposalId) {
      this.$router.push({ path: '/safeManage/securityThinkTank/improveProposalManagement/editProposal', query: { proposalId }})
    },
    // 删除
    proposalDelete(proposalId) {
      const _this = this;
      if (!this.canClickBtnMixin("proposal-del")) {
        return;
      }
      this.$antConfirm({
        title: '确定删除吗?',
        onOk() {
          proposalDelete({ proposalId }).then(res => {
            _this.$antMessage.success(res.message);
            _this.getProposalPageList();
          }).catch(err => {
            // console.log(err);
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.formData = {};
      this.getProposalPageList();
    }, 250, { leading: true, trailing: false }),
    
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getProposalPageList()
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getProposalPageList()
    },
  }
}
</script>
<style lang="less" scoped>
</style>