<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>提案数据库</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @centerChange="centerChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="所属部门">
          <dept-tree :placeholder="'请选择所属部门'" v-model="formInline.deptId" :deptData="deptData" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item label="提案人/工号">
          <a-input v-model="formInline.proposalPerson" placeholder="请输入提案人/工号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="提案名称">
          <a-input v-model="formInline.proposalName" placeholder="请输入提案名称" allowClear></a-input>
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
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="科室级">
        <DataBaseTable v-if="tabKey=='1'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage"></DataBaseTable>
      </a-tab-pane>
      <a-tab-pane key="2" tab="部门级">
        <DataBaseTable v-if="tabKey=='2'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage"></DataBaseTable>
      </a-tab-pane>
      <a-tab-pane key="3" tab="公司级">
        <DataBaseTable v-if="tabKey=='3'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage"></DataBaseTable>
      </a-tab-pane>
      <a-tab-pane key="4" tab="事业级">
        <DataBaseTable v-if="tabKey=='4'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage"></DataBaseTable>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>

import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import { proposalPageList } from "@/services/api.js";
import dictionary from "@/utils/dictionary.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import DataBaseTable from "./component/databaseTable.vue";
export default {
  mixins: [cancelLoading ],
  components: {DataBaseTable},
  data() {
    return {
      tableSpinning:false,
      tabKey: '1',
      dataSource: {},
      proposalGrade:[],
      formInline: {
        deptId: undefined
      },
      formData: {},
      deptData: [],
      proposalLevel:[],
      checkedTreeNode: [],
      deptTreeId: "",
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.setRouterCode("proposalDatabase");
    this.initConfigPage()
    this.getProposalPageList();
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
        this.proposalGrade = dictionary('proposalGrade'); //分档 1-不通过 2-普通 3-良好 4-优秀
    },
    // 获取列表
    getProposalPageList() {
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        proposalLevel: this.tabKey, //提案级别
        // proposalType: '2', //1-我的提案，2-提案数据库
      }
      this.tableSpinning = true
      proposalPageList(params)
      .then(res=>{
        this.dataSource = res.data;
      })
      .finally(()=>{
        this.tableSpinning =false
      })
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
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.getProposalPageList();
    },
    // 查询
    iSearch() {
      this.formData = JSON.parse(JSON.stringify(this.formInline));
      this.getProposalPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        deptId: null
      }
      this.formData = {};
      this.getProposalPageList();
    }, 250, { leading: true, trailing: false }),
    
    getPage(page) {
      this.page = page;
      this.getProposalPageList();
    }
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