<template>
  <div>
    <PageTitle class="ttile-text">培训情况</PageTitle>
    <a-divider />
    <!--表格列表 -->
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="courseName" :min-width="120" title="课程名称"></vxe-column>
        <vxe-column field="studyStatus" :min-width="120" title="学习状态" :formatter="studyStatusStr"></vxe-column>
        <vxe-column field="pushCode" :min-width="150" title="推送时间"></vxe-column>
        <vxe-column field="studyTime" :min-width="150" title="学习时间"></vxe-column>
        <vxe-column field="studyDuration" :min-width="120" title="学习时长(分)" formatter="studyDuration"></vxe-column>
        <vxe-column field="paperName" :min-width="120" title="关联试卷" formatter="isNull"></vxe-column>
        <vxe-column field="testStatus" :min-width="120" title="考试结果" :formatter="testStatusStr"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="160">
          <template #default="{ row }">
            <div class="vxe-table-btn" v-if="row.paperName">
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
import { getCandidateFileDetailCourse, getCandidateFileDetailExamExport } from "@/services/api.js";
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
      return getCandidateFileDetailCourse(apiData)
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
        courseId: row.courseId,
        coursePushId: row.coursePushId,
      }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/filePreview',
        query
      })
    },
    // 导出
    exportPaper: debounce(
      function (row) {
        if (!this.canClickBtnMixin("fileDetail-export")) {
          return;
        }
        let apiData = {
          userId: this.userId,
          companyId: this.companyId,
          courseId: row.courseId,
          coursePushId: row.coursePushId,
        }
        getCandidateFileDetailExamExport(apiData)
          .then(res => {
            this.spreadSheetPDF(res, row.paperName)
          })
          .catch(err => {

          })
      },
      250,
      { leading: true, trailing: false }
    ),
    testStatusStr({ cellValue, row }) {
      if (!row.paperName) {
        return '--'
      } else {
        let testStatusObj = {
          1: '未开始',
          2: '合格',
          3: '不合格',
        }
        return testStatusObj[cellValue] ? testStatusObj[cellValue] : '--'
      }
    },
    studyStatusStr({ cellValue }) {
      let studyStatus = {
        0: '未开始',
        1: '学习中',
        2: '已完成',
      }
      return studyStatus[cellValue] ? studyStatus[cellValue] : ''
    }
  },
};
</script>

<style scoped lang='less'>
</style>
