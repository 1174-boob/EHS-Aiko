<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="course-info flex align-items-center justify-content-between">
      <div class="pd-t-15 pd-b-15">
        <div class="font-14">用户名称：{{userInfo.userName ? userInfo.userName : "--"}}</div>
        <div class="font-14 m-t-10">公司名称：{{userInfo.companyName ? userInfo.companyName : "--"}}</div>
        <div class="font-14 m-t-10">联系电话：{{userInfo.phone ? userInfo.phone : "--"}}</div>
        <div class="font-14 m-t-10">证件号码：{{userInfo.idNumber ? userInfo.idNumber : "--"}}</div>
      </div>
      <div class="flex">
        <div class="flex flex-direction-column m-r-20">
          <p class="m-b-15">考试次数</p>
          <p class="color-0067cc font-28 font-weight-bold text-center">{{testMsg.examTimes}}</p>
        </div>
        <div class="flex flex-direction-column m-r-20">
          <p class="m-b-15">合格次数</p>
          <p class="color-0067cc font-28 font-weight-bold text-center">{{testMsg.accessTimes}}</p>
        </div>
        <div class="flex flex-direction-column">
          <p class="m-b-15">待完成培训</p>
          <p class="color-0067cc font-28 font-weight-bold text-center">{{testMsg.toStudyTimes}}</p>
        </div>
      </div>
    </div>
    <div class="test-msg">
      <div class="m-t-20 border-b-e7">
        <PageTitle>培训情况</PageTitle>
      </div>
      <div class="m-t-20">
        <DashBtn>
          <div>
            <a-button type="dashed" @click="previewFn(1)">预览试卷</a-button>
            <!-- <a-button type="dashed" @click="exportFn">导出试卷</a-button> -->
          </div>
        </DashBtn>
      </div>
      <div class="test-detail m-t-20">
        <CommonTable :noPaging="true">
          <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :scroll="{ x: 800 }"
            :locale="{emptyText: emptyText}"
            :data-source="tableDataList"
            :rowKey="(record, index)=>{return index}"
            :pagination="false"
          >
            <div slot="studyStatus" slot-scope="record">{{findText(studyStatus, "key", record.studyStatus).value}}</div>
            <div slot="studyDuration" slot-scope="record">{{record.studyDuration | formatTime('s')}}</div>
            <div slot="testStatus" slot-scope="record">{{findText(testStatus, "key", record.testStatus).value}}</div>
          </a-table>
        </CommonTable>
      </div>
    </div>
    <div class="push-msg">
      <div class="m-t-20 border-b-e7">
        <PageTitle>考试情况</PageTitle>
      </div>
      <div class="m-t-20">
        <DashBtn>
          <div>
            <a-button type="dashed" @click="previewFn(2)">预览试卷</a-button>
            <!-- <a-button type="dashed" @click="exportFn">导出试卷</a-button> -->
          </div>
        </DashBtn>
      </div>
      <div class="m-t-20">
        <CommonTable :noPaging="true">
          <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeysDetail, onChange: onSelectChangeDetail }"
            :columns="columnsDetail"
            :scroll="{ x: 800 }"
            :locale="{emptyText: emptyText}"
            :data-source="tableDataListDetail"
            :rowKey="(record, index)=>{return index}"
            :pagination="false"
          >
            <div slot="examDuration" slot-scope="record">{{record.examDuration | formatTime}}</div>
            <div slot="testStatus" slot-scope="record">{{findText(testStatus, "key", record.testStatus).value}}</div>
          </a-table>
        </CommonTable>
      </div>
    </div>
    <CommonModal title="预览试卷" :visible="detailVisible" :cancelFn="detailCancle">
      <div class="preview-paper" v-for="(item, index) in paperMsgList" :key="index">
        <div class="paper-tip flex justify-content-between pd-t-20 pd-b-20">
          <span class="m-r-10">考试日期：{{item.examDate}}</span>
          <span class="m-r-10">得分：{{item.score}}</span>
        </div>
        <div class="paper-name pd-b-20">{{item.name ? item.name : "----"}}</div>
        <div class="flex justify-content-around pd-b-20">
          <span>考生姓名：{{userInfo.userName}}</span>
          <span>考生组织（公司或部门）：{{userInfo.companyName}}</span>
          <span>考生证件号/工号：{{userInfo.idNumber}}</span>
        </div>
        <div>考生答案已用绿色标识</div>
        <div class="paper-topic" v-for="(topic, topicNo) in item.topicVoList" :key="topic.topicId">
          <div class="flex justify-content-between pd-b-20 font-weight-bold">
            <span>第{{topicNo + 1}}题、（{{findText(topicType, "key", topic.topicType).value}}）{{topic.topicTitle}} （ ）</span>
          </div>
          <div class="paper-options">
            <div class="flex justify-content-between pd-b-20" v-for="(options, ind) in topic.optionsRels" :key="options.optionsId">
              <span :class="{'color-green': topic.answer.indexOf(options.optionsId)>-1}">{{sortList[ind]}}、{{options.optionsContent}}</span>
              <span v-if="options.solution == 1">(正确答案)</span>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  </div>
</template>
<script>
import { PushExamList, PushCourseList, PaperDetail, GetUserMsg, GetStatistics } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      dataMsg: undefined,

      columns: [
        {
          title: '课程名称',
          dataIndex: 'courseName',
          key: "courseName"
        },
        {
          title: '学习状态',
          scopedSlots: { customRender: "studyStatus" },
          key: "studyStatus",
        },
        {
          title: '学习时间',
          dataIndex: 'studyTime',
          key: "studyTime"
        },
        {
          title: '学习时长（分）',
          // dataIndex: 'studyDuration',
          scopedSlots: { customRender: "studyDuration" },
          key: "studyDuration"
        },
        {
          title: '是否有考试',
          dataIndex: 'haveTest',
          key: "haveTest"
        },
        {
          title: '考试状态',
          scopedSlots: { customRender: "testStatus" },
          key: "testStatus"
        }
      ],
      tableDataList: [],
      selectedRowKeys: [],

      detailVisible: false,

      columnsDetail: [
        {
          title: '考试名称',
          dataIndex: 'testName',
          key: "testName",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '考试时间',
          dataIndex: 'examDate',
          key: "examDate",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '考试时长（分）',
          // dataIndex: 'examDuration',
          scopedSlots: { customRender: "examDuration" },
          key: "examDuration",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '考试状态',
          scopedSlots: { customRender: "testStatus" },
          key: "testStatus",
          width: 150,
          align: "center",
          ellipsis: true
        }
      ],
      tableDataListDetail: [],
      selectedRowKeysDetail: [],

      testStatus: [
        {
          key: 1,
          value: "未开始"
        },
        {
          key: 2,
          value: "合格"
        },
        {
          key: 3,
          value: "不合格"
        },
      ],
      studyStatus: [
        {
          key: 0,
          value: "未开始"
        },
        {
          key: 1,
          value: "学习中"
        },
        {
          key: 2,
          value: "已完成"
        },
      ],
      topicType: [
        {
          key: 1,
          value: "单选题"
        },
        {
          key: 2,
          value: "多选题"
        },
        {
          key: 3,
          value: "判断题"
        },

      ],
      paperMsgList: {},
      sortList: ["A", "B", "C", "D", "E", "F", "G", "H"],
      userInfo: {},
      testMsg: {},
    }
  },
  filters: {
    // 格式化毫秒,ss有参数时候是秒
    formatTime(value, ss = null) {
      if (!value) {
        return "--"
      } else {
        const time = ss ? value * 1 : Math.floor(value * 1 / 1000);
        const second = time % 60;
        const minute = time / 60;
        const hour = time / 3600;
        if (time / 60 < 1) {
          return `${time}秒`
        } else if (minute >= 1 && minute < 60) {
          let mm = Math.floor(minute);
          return `${mm}分${second}秒`
        } else if (minute >= 60) {
          let hh = Math.floor(hour);
          let mm = Math.floor((time - 3600 * hh) / 60)
          return `${hh}小时${mm}分${second}秒`
        }
      }
    }
  },
  created() {
    this.setRouterCode("partnerList");
    this.dataMsg = this.$route.query;
    console.log(this.dataMsg)
    if (!this.dataMsg) {
      this.$router.push("/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerList");
    }
    this.getDataList(); // 
    this.getDataListDetail(); // 
    this.getUserMsg();
    this.getStatistics(); // 
  },
  methods: {
    getUserMsg() {
      GetUserMsg({
        dispatchId: this.dataMsg.beUserId,
      }).then(res => {
        this.userInfo = res.data;
      }).catch((err) => {
        console.log(err);
      })
    },
    getStatistics() {
      GetStatistics({
        centerId: this.dataMsg.centerId,
        corporationId: this.dataMsg.corporationId,
        pushCompanyId: this.dataMsg.pushCompanyId,
        userId: this.dataMsg.beUserId,
        companyId: this.dataMsg.companyId
      }).then(res => {
        this.testMsg = res.data;
      }).catch((err) => {
        console.log(err);
      })
    },
    previewFn(type) {
      let param = {
        type: type == 1 ? "course" : "test",
      }
      let testRecordsIdList = [];
      if (type == 1) {
        for (let i = 0; i < this.selectedRowKeys.length; i++) {
          if (this.tableDataList[this.selectedRowKeys[i]].testRecordsId != null) {
            testRecordsIdList.push(this.tableDataList[this.selectedRowKeys[i]].testRecordsId)
          }
        }
      } else {
        for (let i = 0; i < this.selectedRowKeysDetail.length; i++) {
          if (this.tableDataListDetail[this.selectedRowKeysDetail[i]].testRecordsId != null) {
            testRecordsIdList.push(this.tableDataListDetail[this.selectedRowKeysDetail[i]].testRecordsId)
          }
        }
      }
      param.testRecordsIdList = testRecordsIdList;
      PaperDetail(param).then((res) => {
        this.paperMsgList = res.data;
        this.detailVisible = true;
      }).catch((err) => {
        console.log(err);
      })
    },
    exportFn() {
    },
    // 获取推送列表
    getDataList() {
      PushCourseList({
        centerId: this.dataMsg.centerId,
        corporationId: this.dataMsg.corporationId,
        pushCompanyId: this.dataMsg.pushCompanyId,
        userId: this.dataMsg.beUserId,
        companyId: this.dataMsg.companyId
      }).then((res) => {
        this.tableDataList = res.data;
      }).catch((err) => {
        console.log(err);
      })
    },
    detailCancle(record) {
      this.detailVisible = false;
    },
    getDataListDetail() {
      PushExamList({
        centerId: this.dataMsg.centerId,
        corporationId: this.dataMsg.corporationId,
        userId: this.dataMsg.beUserId,
        companyId: this.dataMsg.companyId
      }).then((res) => {
        this.tableDataListDetail = res.data;
      }).catch((err) => {
        console.log(err);
      })
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelectChangeDetail(selectedRowKeys) {
      this.selectedRowKeysDetail = selectedRowKeys;
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
  box-shadow: 10px 10px 10px 1px #eee;
  width: calc(100% - 20px);
  padding: 0 20px;
  margin-bottom: 40px;
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
  & > .position-abs {
    right: 0;
    top: 38px;
    p {
      text-align: center;
    }
  }
}
.course-msg {
  .lecturer-list {
    img {
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
}
//
.preview-paper {
  padding: 30px 50px;
  border: 1px solid #999;
  box-shadow: 10px 10px 10px 1px #eee;
  margin-bottom: 20px;
  .paper-name {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .paper-options {
    & > div {
      padding-left: 50px;
    }
  }
}
/deep/ .ant-modal {
  width: 90% !important;
}
.color-green {
  color: green;
}
</style>