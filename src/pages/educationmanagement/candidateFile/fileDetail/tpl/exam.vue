<template>
  <div>
    <PageTitle class="ttile-text">考试情况</PageTitle>
    <a-divider />
    <!--表格列表 -->
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="testName" :min-width="120" title="考试名称"></vxe-column>
        <vxe-column field="pushCode" :min-width="150" title="推送时间"></vxe-column>
        <vxe-column field="examDate" :min-width="150" title="考试时间"></vxe-column>
        <vxe-column field="examDuration" :min-width="120" title="考试时长(分)" :formatter="getTimeStr"></vxe-column>
        <vxe-column field="courseName" :min-width="120" title="关联课程"></vxe-column>
        <vxe-column field="testStatus" :min-width="120" title="考试结果" :formatter="testStatusStr"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="160">
          <template #default="{ row }">
            <div class="vxe-table-btn" v-if="row.testStatus != 1">
              <span class="color-0067cc cursor-pointer" @click="previewPaper(row)">预览试卷</span>
              <span class="color-0067cc cursor-pointer" @click="exportPaper(row)">导出试卷</span>
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
import { getCandidateFileDetailExam, getCandidateFileDetailExamExport } from "@/services/api.js";
import { debounce } from "lodash";
export default {
  props: {
    userId: {},
    companyId: {},
  },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableList: [],
    };
  },
  created() {
    // this.getTableList();
  },
  methods: {
    // 获取列表
    getTableList() {
      let apiData = {
        userId: this.userId,
        companyId: this.companyId,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      return getCandidateFileDetailExam(apiData)
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
    previewPaper(row) {
      let query = {
        userId: this.userId,
        companyId: this.companyId,
        testId: row.testId
      }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/filePreview',
        query
      })
    },
    // 导出
    exportPaper: debounce(
      function (row) {
        console.log(row);
        if (!this.canClickBtnMixin("fileDetail-export")) {
          return;
        }
        let apiData = {
          userId: this.userId,
          companyId: this.companyId,
          testId: row.testId
        }
        getCandidateFileDetailExamExport(apiData)
          .then(res => {
            this.spreadSheetPDF(res.data, row.paperName)
          })
          .catch(err => {

          })
      },
      250,
      { leading: true, trailing: false }
    ),
    // 转时间
    getTimeStr({ cellValue }) {
      return cellValue ? (((cellValue / 1000).toFixed(0)) / 60).toFixed(1) : 0
    },
    // 考试结果
    testStatusStr({ cellValue }) {
      // 1未开始  2合格 3不合格
      let valObj = {
        '1': '未开始',
        '2': '合格',
        '3': '不合格',
      }
      return cellValue && valObj[cellValue] ? valObj[cellValue] : ''
    },
  }
};
</script>

<style scoped lang='less'>
</style>
