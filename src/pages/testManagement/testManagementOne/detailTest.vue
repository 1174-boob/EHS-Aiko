<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="push-msg">
      <div class="m-t-20 border-b-e7">
        <PageTitle>推送详情</PageTitle>
      </div>
      <div class="m-t-20">
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="选择时间">
              <a-date-picker placeholder="请选择时间" format="YYYY-MM-DD" v-model="formInline.time"/>
            </a-form-model-item>
            <!-- 搜索栏按钮需要加固定的float-right类名 -->
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
          <a-table :columns="columns" bordered :scroll="{ x: 800 }" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
            <div slot="action" slot-scope="record">
              <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
              <span class="color-0067cc cursor-pointer" @click="actionExport(record)">导出</span>
            </div>
          </a-table>
        </CommonTable>
      </div>
    </div>

    <CommonDrawer title="学习情况查看" :visible="detailVisible" :cancelFn="detailCancle" :width="'80vw'" :zIndex="2000">
      <template>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInlineDetail" :colon="false">
            <a-form-model-item label="员工姓名">
              <a-input placeholder="请输入员工姓名" v-model="formInlineDetail.userName" />
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="iSearchDetail">查询</a-button>
              <a-button @click="iRestDetail">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="pageDetail" :pageNoChange="pageNoChangeDetail" :showSizeChange="onShowSizeChangeDetail">
          <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableDataListDetail">
            <vxe-column field="userName" :min-width="120" title="员工姓名"></vxe-column>
            <vxe-column field="company" :min-width="120" title="厂商"></vxe-column>
            <vxe-column field="deptName" :min-width="120" title="部门"></vxe-column>
            <vxe-column field="score" :min-width="120" title="考试成绩"></vxe-column>
            <vxe-column field="testStatus" :min-width="120" title="考试状态">
              <template #default="{ row }">
                <span>{{findText(testStatusList, "key", row.testStatus).value}}</span>
              </template>
            </vxe-column>
            <vxe-column field="testTime" :min-width="120" title="考试时间"></vxe-column>
            <template #empty>
              <div style="padding:16px 0;">
                <a-empty />
              </div>
            </template>
          </vxe-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button type="dashed" @click="detailCancle">取消</a-button>
      </template>
    </CommonDrawer>
  </div>
</template>
<script>
import { deptDict ,PushInfo } from "@/services/api.js";
import { ExamDetail, ExamPushInfo, ExamPushCodeInfo } from "@/services/questionmodel.js";
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
import dayJs from "dayjs";

export default {
  mixins: [cancelLoading],
  data() {
    return {
      activeKey: "1",
      dataMsg: undefined,
      lecturerMsg: {},
      coverImg: "",
      recordData:{},
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '推送批次',
          dataIndex: 'pushCode',
          key: "pushCode",
          width:200
        },
        {
          title: '推送人数',
          dataIndex: 'pushUser',
          key: "pushUser"
        },
        {
          title: '考试人数',
          dataIndex: 'testUser',
          key: "testUser"
        },
        {
          title: '合格人数',
          dataIndex: 'qualifiedUser',
          key: "qualifiedUser"
        },
        {
          title: '不合格人数',
          dataIndex: 'unQualifiedUser',
          key: "unQualifiedUser"
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 150 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],

      detailVisible: false,
      detailMsg: {},
      formInlineDetail: {},
      preFormInlineDetail: {},
      pageDetail: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columnsDetail: [
        {
          title: '员工姓名',
          dataIndex: 'userName',
          key: "userName",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '厂商',
          dataIndex: 'company',
          key: "company",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          key: "deptName",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '学习状态',
          scopedSlots: { customRender: 'studyStatus' },
          key: "studyStatus",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '考试状态',
          scopedSlots: { customRender: 'testStatus' },
          key: "testStatus",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '是否合格',
          scopedSlots: { customRender: 'isQualified' },
          key: "isQualified",
          width: 150,
          align: "center",
          ellipsis: true
        }
      ],
      tableDataListDetail: [],
      selectedRowKeys: [],
      studyStatusList: [
        {
          key: "0",
          value: "未开始"
        },
        {
          key: "1",
          value: "学习中"
        },
        {
          key: "2",
          value: "已完成"
        },
      ],
      testStatusList: [ // 未考试 1 合格 2 不合格 3
        {
          key: "1",
          value: "未考试"
        },
        {
          key: "2",
          value: "合格"
        },
        {
          key: "3",
          value: "不合格"
        },
      ],

      subjectList: [],
      lecturerList: [],
      moduleList: [],
      paperMsg: {},
      organizationObj: {}
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.userName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.name;
    this.dataMsg = this.$route.params.dataMsg;
    if (!this.dataMsg) {
      this.$router.push("/ehsGerneralManage/educationmanagement/testManagement");
      return;
    }
    deptDict().then(res1 => {
      this.organizationObj = res1.data.idList;
    }).catch((err) => {
      console.log(err);
    })
    this.getExamDetailList();
  },
  methods: {
    getExamDetailList() {
      ExamPushInfo({
        testId: this.dataMsg.testId,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }).then(res => {
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      });
    },
    // 获取推送列表
    getDataList() {
      return ExamPushInfo({
        ...this.formInline,
        courseId: this.dataMsg.courseId,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        testId: this.dataMsg.testId,
      }).then((res) => {
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      })
    },
    // 查询
    iSearch() {
      console.log(this.formInline.time)
      this.formInline.time = this.formInline.time
          ? dayJs(this.formInline.time).format("YYYY-MM-DD")
          : undefined,
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
    actionExport(record) {
      let apiData = {
        testId: this.dataMsg.testId,
        // courseId: this.dataMsg.courseId,
        pushCode: record.pushCode,
      }
      ExamDetail(apiData)
        .then(res => {
          this.spreadSheetExcel(res, "导出当天考试成绩", '.xlsx');
        })
        .catch(err => { })
    },
    actionLook(record) {
      this.detailMsg = record;
      this.detailVisible = true;
      this.formInlineDetail = {}
      this.getDataListDetail(record);
    },
    detailCancle(record) {
      this.detailVisible = false;
    },
    detailConfirm(record) {
      this.detailVisible = false;
    },
    // 推送列表-查看
    getDataListDetail(record) {
      // console.log('record',record);
      this.recordData = JSON.parse(JSON.stringify(record)) 
      // console.log('this.recordData',this.recordData);
      return ExamPushCodeInfo({
        testId: this.dataMsg.testId,
        // pushCode: record.pushCode,
        testPushId: this.recordData.testPushId,
        time: '',
        userName: '',
        pageSize: this.pageDetail.pageSize,
        corporationId: '',
        pageNo: this.pageDetail.pageNo,
        ...this.preFormInlineDetail

        // courseId: this.dataMsg.courseId,
        // pushCode: this.detailMsg.pushCode,
        // pageSize: this.pageDetail.pageSize,
        // pageNo: this.pageDetail.pageNo,
        // ...this.preFormInlineDetail
      }).then((res) => {
        this.tableDataListDetail = res.data.list;
        this.pageDetail.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      })
    },
    // 查看-查询
    iSearchDetail() {
      this.preFormInlineDetail = { ...this.formInlineDetail };
      this.handleLoadingTwo()
      // 获取列表
      this.getDataListDetail(this.recordData)
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 查看-重置
    iRestDetail: debounce(function () {
      this.pageDetail = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInlineDetail = {};
      this.preFormInlineDetail = {};
      this.getDataListDetail(this.recordData)
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChangeDetail(page) {
      this.pageDetail.pageNo = page;
      // 获取列表
      this.getDataListDetail(this.recordData);
    },
    onShowSizeChangeDetail(current, pageSize) {
      this.pageDetail.pageNo = 1;
      this.pageDetail.pageSize = pageSize;
      this.getDataListDetail(this.recordData);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    findText(arr, key, val) { // key：字段值， val：过滤值
      if (val == 0) val = 0 + "";
      if (!(arr && key && val)) {
        return {};
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return arr[i]
        }
      }
      return {}
    },
  }
}
</script>
<style lang="less" scoped>
.course-info {
  img {
    width: 160px;
    height: 120px;
  }
  p {
    line-height: 1;
    margin: 0;
    &:last-child {
      margin-top: 10px;
    }
  }
}
.course-msg {
  .lecturer-list {
    img {
      width: 60px;
      height: 60px;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
}
</style>