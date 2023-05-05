<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="科目名称">
          <a-input v-model.trim="formInline.subjectName" :maxLength="200" placeholder="请输入科目名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="课程名称">
          <a-input v-model.trim="formInline.courseName" :maxLength="200" placeholder="请输入课程名称" allowClear></a-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="状态">
          <a-select v-model="formInline.searchStatus" placeholder="请选择" option-filter-prop="children" style="width: 200px" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{item.statusLable}}</a-select-option>
          </a-select>
        </a-form-model-item>-->
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
        <vxe-column field="courseName" :min-width="120" title="课程名称"></vxe-column>
        <vxe-column field="subjectName" :min-width="120" title="所属科目"></vxe-column>
        <vxe-column field="coursewareNum" :min-width="120" title="课件数量"></vxe-column>
        <vxe-column field="studyDuration" :min-width="140" title="学习时长(分)" formatter="studyDuration"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="120">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer" @click="goDetail(row)">查看</span>
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
import { getMyCourseTestList } from "@/services/api.js";
export default {
  mixins: [cancelLoading],
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
      statusList: [
        {
          id: 1,
          statusLable: '待学习',
        },
        {
          id: 2,
          statusLable: '已完成',
        },
        {
          id: 3,
          statusLable: '合格',
        },
        {
          id: 4,
          statusLable: '不合格',
        },
      ],
      activeKey: 1
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
  computed: {
    searchStatus() {
      // courseStatus 1-待学习，2-已完成
      // examStatus 2-合格，3-不合格
      let searchStatus = {}
      switch (this.activeKey) {
        case 1:  //待学习
          searchStatus = {
            courseStatus: 1
          }
          break;
        case 2:  //已完成
          searchStatus = {
            courseStatus: 2
          }
          break;
        case 3:  //合格
          searchStatus = {
            examStatus: 2
          }
          break;
        case 4:  //不合格
          searchStatus = {
            examStatus: 3
          }
          break;
        default:
          searchStatus = {}
      }
      return searchStatus
    }
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
      this.handleLoadingTwo()
      let apiData = {
        ...this.formInline,
        ...this.searchStatus,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      getMyCourseTestList(apiData)
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
          this.cancelLoadingTwo();
        })
    },
    goDetail(row) {
      let query = { courseId: row.courseId }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/myCourseDetail',
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
