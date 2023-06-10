<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>黑名单审批</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="供应商名称">
          <a-input v-model="formInline.companyName" placeholder="请输入供应商名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="入场部门">
          <a-tree-select
            show-search
            allow-clear
            v-model="formInline.incomingDeptId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
            :tree-data="treeData"
            placeholder="请选择入场部门"
            :filter-option="filterOptionMixin"
            :treeDefaultExpandAll="false"
          ></a-tree-select>
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

    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="formCode" :min-width="168" title="申请单编号"></vxe-column>
        <vxe-column field="supplierName" :min-width="120" title="供应商名称"></vxe-column>
        <vxe-column field="supplierCode" :min-width="120" title="供应商简称"></vxe-column>
        <vxe-column field="createUserName" :min-width="120" title="起草人"></vxe-column>
        <vxe-column field="corporationId" :min-width="120" title="所属组织">
          <template #default="{ row }">
            <span>{{matchOrganizeName(row.corporationId)}}</span>
          </template>
        </vxe-column>
        <vxe-column field="incomingDeptId" :min-width="120" title="入厂部门">
          <template #default="{ row }">
            <span>{{row.incomingDeptId ? deptCache[row.incomingDeptId] : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="createTime" :min-width="120" title="申请时间"></vxe-column>

        <vxe-column field="action" fixed="right" title="操作" width="160">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer m-r-15" @click="toCreate(row)">编辑</span>
              <span class="color-0067cc cursor-pointer" @click="actionDel(row)">删除</span>
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
      companyName: "",
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
      this.$set(this.formInline, "incomingDeptId", undefined);
      this.treeData = [];
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
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

    // 审批列表
    getTableList() {
      let apiData = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        draftStatus: 1,
        ...this.formInline,
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
      // 获取列表
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