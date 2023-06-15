<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>黑名单审批</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="企业全称">
          <a-input v-model="formInline.supplierName" placeholder="请输入企业名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="企业简称">
          <a-input v-model="formInline.companyAbbreviation" placeholder="请输入企业简称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="审核状态">
          <a-select v-model="formInline.approvalStatus" placeholder="请选择审核状态">
            <a-select-option v-for="item in getDictTarget('s','approvalStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="申请日期">
          <a-range-picker style="width: 200px" class="search-range-picker" v-model="formInline.createDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
        </a-form-model-item>
       
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <!-- <a-button type="dashed" @click="toDraft">草稿箱</a-button> -->
      </div>
    </DashBtn>

    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="formCode" :min-width="180" title="编号"></vxe-column>
        <vxe-column field="corporationId" :min-width="120" title="所属组织">
          <template #default="{ row }">
            <span>{{matchOrganizeName(row.corporationId)}}</span>
          </template>
        </vxe-column>
        <vxe-column field="supplierName" :min-width="120" title="企业名称"></vxe-column>
        <vxe-column field="supplierCode" :min-width="120" title="企业简称"></vxe-column>
        <vxe-column field="createUserName" :min-width="120" title="起草人"></vxe-column>
        <vxe-column field="deptId" :min-width="120" title="起草人部门">
          <template #default="{ row }">
            <span>{{row.deptId ? deptCache[row.deptId] : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="createTime" :min-width="120" title="申请时间"></vxe-column>
        <vxe-column field="updateTime" :min-width="120" title="结束时间">
          <template #default="{ row }">
            <span>{{row.approvalStatus == 2 ? row.updateTime : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="approvalStatus" fixed="right" :min-width="100" title="状态">
          <template #default="{ row }">
            <span>{{getDictTarget('s','approvalStatus',row.approvalStatus)}}</span>
          </template>
        </vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="140">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(row)">查看</span>
              <span v-if="row.approvalStatus == 3 || row.approvalStatus == 4" class="color-0067cc cursor-pointer m-r-15" @click="toCreate(row)">编辑</span>
              <span v-if="row.handle && row.handle.includes(userId)" v-show="row.approvalStatus == 1" class="color-0067cc cursor-pointer m-r-15" @click="toResolve(row)">处理</span>
              <span v-if="row.approvalStatus == 3 || row.approvalStatus == 2 || row.approvalStatus == 4" class="color-0067cc cursor-pointer" @click="actionDel(row)">删除</span>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
  </div>
</template>

<script>
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import { blackRelievePageList, blackRelieveDelete } from '@/services/api.js';
import { getDictTarget } from "@/utils/dictionary";
export default {
  mixins: [cancelLoading],
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      userId: "",
      supplierName: "",
      treeData: [],
    }
  },
  created() {
    this.initConfigPage()
    this.getTableList();
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
       this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    getDictTarget,
    corporationChange() {
      this.$set(this.formInline, "deptId", undefined);
      this.treeData = [];
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
    },
    // 草稿箱
    toDraft() {
      this.$router.push("/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistDraft");
    },
    // 处理按钮
    toResolve(record) {
      if (record.formId) {
        this.$router.push({
          path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistResolve",
          query: { formId: record.formId }
        });
      }
    },
    // 编辑
    toCreate(record) {
      if (record.formId) {
        this.$router.push({
          path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistEdit",
          query: { formId: record.formId }
        });
      }
    },
    // 变岗审批列表
    getTableList() {
      if (this.$route.query.approvalStatus) {
        this.formInline.supplierName = this.$route.query.companyName;
        this.formInline.approvalStatus = this.$route.query.approvalStatus
      }
      let apiData = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        // draftStatus: 2,
        approvalStatus:this.formInline.approvalStatus ? this.formInline.approvalStatus:'',
        corporationId:this.formInline.corporationId,
        corporationName:this.formInline.corporationName,
        companyAbbreviation:this.formInline.companyAbbreviation,
        supplierName:this.formInline.supplierName ? this.formInline.supplierName :'',
        startTime: this.formInline.createDate ? this.formInline.createDate[0] : "",
        endTime: this.formInline.createDate ? this.formInline.createDate[1] : "",
      }
      this.tableSpinning = true
      return blackRelievePageList(apiData)
        .then(res => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err => { })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.handleLoading()
      this.getTableList()
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
      this.$route.query.companyName = '',
      this.$route.query.approvalStatus = '',
      this.getTableList()
    }, 250, { leading: true, trailing: false }),
    // 按钮-详情
    actionLook(record) {
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistDetail", query: { formId: record.formId, isView: true } });
    },
    // 按钮-删除
    actionDel(record) {
      if (!this.canClickBtnMixin("blacklistApprovalList-del")) {
        return;
      }
      if (record.approvalStatus == 1) {
        this.$antMessage.error("审批中，不可删除！");
        return;
      }
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return blackRelieveDelete({ formId: record.formId })
            .then((res) => {
              this.$antMessage.success('删除成功');
              this.getTableList();
            })
            .catch(err => { });
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    showSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    }
  }
}
</script>

<style lang="less" scoped>
</style>