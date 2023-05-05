<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="科目名称">
          <a-input v-model.trim="formInline.subjectName" :maxLength="200" placeholder="请输入科目名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="考试名称">
          <a-input v-model.trim="formInline.examName" :maxLength="200" placeholder="请输入考试名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <a-tabs v-model="activeKey" @change="tabChange">
      <a-tab-pane v-for="item in statusList" :key="item.id" :tab="item.statusLable"></a-tab-pane>
    </a-tabs>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="testName" :min-width="120" title="考试名称"></vxe-column>
        <vxe-column field="subjectName" :min-width="120" title="考试科目"></vxe-column>
        <vxe-column field="courseName" :min-width="120" title="关联课程"></vxe-column>
        <vxe-column field="examDate" :min-width="140" title="考试时间"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="120">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer" @click="goDetail(row)">开始考试</span>
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

    <!-- 新增、编辑弹窗 -->
    <TipModel v-model="tipModelShow" :testDetai="testDetai" />
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import { getMyCourseExamList } from "@/services/api.js";
import TipModel from './tpl/tipModel.vue'
export default {
  components: { TipModel },
  mixins: [cancelLoading],
  data() {
    return {
      tableSpinning:false,
      tipModelShow: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      tableList: [],
      statusList: [
        {
          id: 1,
          statusLable: '未开始',
        },
        {
          id: 2,
          statusLable: '合格',
        },
        {
          id: 3,
          statusLable: '不合格',
        },
      ],
      testDetai: {},
      activeKey: 1,
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
    // tab切换
    tabChange(activeKey) {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.tableList = []
      this.getTableList()
    },
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        status: this.activeKey,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning= true
      getMyCourseExamList(params)
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
          this.tableSpinning= false
          this.cancelLoading();
        })
    },
    goDetail(row) {
      this.testDetai = row
      setTimeout(() => {
        this.tipModelShow = true
      }, 200);
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
      this.handleLoading();
      this.getTableList();
    },
    // 重置
    iRest: debounce(
      function () {
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
