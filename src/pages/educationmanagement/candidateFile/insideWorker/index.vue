<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="部门">
          <DeptTree :placeholder="formInline.corporationId ? '请选择':'请先选择所属组织'" v-model="formInline.deptId" :deptData="deptData" :disabled="!formInline.corporationId"></DeptTree>
        </a-form-model-item>
        <a-form-model-item label="姓名">
          <a-input v-model.trim="formInline.userName" :maxLength="20" placeholder="请输入姓名" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号">
          <a-input v-model.trim="formInline.userCode" :maxLength="30" placeholder="请输入工号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="corporationId" :min-width="120" title="所属组织">
          <template #default="{ row }">
            <span>{{matchOrganizeName(row.corporationId)}}</span>
          </template>
        </vxe-column>
        <vxe-column field="deptId" :min-width="120" title="部门">
          <template #default="{ row }">
            <span>{{deptCache[row.deptId]}}</span>
          </template>
        </vxe-column>
        <vxe-column field="userName" :min-width="120" title="姓名"></vxe-column>
        <vxe-column field="userCode" :min-width="120" title="工号"></vxe-column>
        <vxe-column field="studyDuration" :min-width="140" title="累计学习时长(分)" formatter="studyDuration"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="120">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer" @click="goDetail(row)">查看详情</span>
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
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import { getCandidateFileList } from "@/services/api.js";
import chemicalDict from "@/mixin/chemicalDict.js";
import deptAndUser from '@/mixin/deptAndUser.js'
export default {
  mixins: [cancelLoading, chemicalDict, deptAndUser],
  data() {
    return {
      tableSpinning:false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      tableList: [],
    };
  },
  created() {
    this.getTableList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        type: 1,  //'1'-本部，'2'-厂商
      };
      this.tableSpinning = true
      getCandidateFileList(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    goDetail(row) {
      let query = { userId: row.userId, companyId: row.companyId, type: '1' }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/fileDetail',
        query: query
      })
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
    // 查询
    iSearch() {
      if (this.formInline.userName && this.formInline.userName.length < 2) {
        this.$antMessage.warn('姓名最少输入2位');
        return
      }
      if (this.formInline.userCode && this.formInline.userCode.length < 5) {
        this.$antMessage.warn('工号最少输入5位');
        return
      }
      this.handleLoading();
      this.getTableList();
    },
    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {}
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style scoped lang='less'>
</style>
