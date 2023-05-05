<template>
  <div class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="fix-width flex-1 position-rel pd-b-100">
      <div class="scroll-center-box">
        <PageTitle>应急演练处理</PageTitle>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <div class="post-main">
            <!-- 计划详情 -->
            <PlanDetail :planDetail="planDetail"></PlanDetail>
            <!-- 报告详情 -->
            <ReportDetail v-if="hasReport" :reportDetail="reportDetail"></ReportDetail>
          </div>
        </a-spin>
      </div>
      <div :class="{'no-padding': !logData.length}" slot="fixedBottom">
        <!-- 责任部门部长审议时只有提交按钮 -->
        <FixedBottom>
          <div>
            <a-button @click="onCancle">返回</a-button>
            <a-button v-if="!isView && (userId == detailMsg.handle)" :loading="btnLoading" @click="reject">驳回</a-button>
            <a-button v-if="!isView && (userId == detailMsg.handle)" type="primary" :loading="btnLoading" @click="approved">通过</a-button>
          </div>
        </FixedBottom>
      </div>
    </div>
    <Log v-if="logData.length" :flowLogList="logData" :hiddenRemark="true"></Log>
  </div>
</template>

<script>
import PlanDetail from "./tpl/planDetail.vue"
import ReportDetail from "./tpl/reportDetail.vue"
import FixedBottom from "@/components/commonTpl/fixedBottom"
import Log from "@/components/flowLog/flowLog.vue"
import dictionary from '@/utils/dictionary'
import cancelLoading from '@/mixin/cancelLoading'
import { getQueryVariable } from "@/utils/util.js"

import { PushTask, emergentProcessView, emergentProcessResolve, emergentProcessLog } from '@/services/api.js';

export default {
  components: { PlanDetail, ReportDetail, FixedBottom, Log },
  mixins: [cancelLoading],
  data() {
    return {
      spinning: true,
      detailMsg: {},
      planDetail: {},
      reportDetail: {
        headImgs: [],
        fileLists: []
      },
      processId: "",
      emergencyLevel: [],
      // 节点信息
      logData: [], // 日志数据
      pushPara: {}, // 推送参数
      btnLoading: false,
      userId: "",
      hasReport: ''
    };
  },
  async created() {
    this.setRouterCode("emergencyApprove");
    this.emergencyLevel = dictionary("emergencyLevel"); //应急演练级别
    this.processId = (this.$route.query && this.$route.query.processId) || getQueryVariable('processId');
    this.hasReport = (this.$route.query && this.$route.query.hasReport) || getQueryVariable('hasReport');
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId;
    if (this.processId) {
      this.init();
    }
  },
  computed: {
    // hasReport() {
    //   return this.$route.query && this.$route.query.hasReport;
    // },
    isView() {
      return this.$route.query && this.$route.meta.isView;
    },
  },
  methods: {
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
    init() {
      this.getLogData();
      this.getEchoData()
    },
    // 编辑 | 查看 | 处理，获取回显数据
    async getEchoData() {
      let para = {
        processId: this.processId
      }
      emergentProcessView(para).then(res => {
        let resultObj = res.data || {};
        this.detailMsg = resultObj;
        this.planDetail = {
          processNumber: resultObj.processNumber,
          corporationName: resultObj.corporationName,
          draftName: resultObj.draftCode ? (resultObj.draftName + "/" + resultObj.draftCode) : resultObj.draftName,
          createTime: resultObj.createTime,
          applyType: resultObj.applyType == 0 ? "演练计划" : "演练报告",
          title: resultObj.title,
          draftDepartName: resultObj.draftDepartName,
          draftPhone: resultObj.draftPhone,
          finalOperateTime: resultObj.finalOperateTime,
          planDepartName: resultObj.planDepartName,
          drillLevel: this.getMappingValue(this.emergencyLevel, "key", resultObj.drillLevel).value,
          planList: resultObj.planList || [],
        }
        let drillReport = resultObj.drillReport || {};
        // 图片回显
        drillReport.headImgs = this.handleFileRedisplay(drillReport.gatherPhotoFiles);
        // 附件回显
        drillReport.fileLists = this.handleFileRedisplay(drillReport.gatherFiles); // 附件回显'
        // 表格回显
        drillReport.tableData = (drillReport.prepFeasibility || []).concat(drillReport.reposeSpeedDealAbility || []).concat(drillReport.fullReasonable || [])
        console.log(drillReport)
        this.reportDetail = drillReport;
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.spinning = false;
      })
    },
    async getLogData() {
      try {
        let para = {
          processId: this.processId,
        }
        let result = await emergentProcessLog(para);
        let list = result.data || [];
        for (let i = 0; i < list.length; i++) {
          list[i].assigneeName = list[i].hander;
          list[i].endTime = list[i].handerTime;
        }
        this.logData = list;
      } catch (err) {
        console.log(err);
      }
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? list : []
      let ids = list.map(item => {
        return item.id
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplay(list) {
      console.log(list)
      list = list ? list : []
      let fileList = []
      list.forEach(item => {
        let itemObj = {
          id: item.id,
          uid: item.id,
          name: item.sourceFileName,
          status: 'done',
          url: item.filePath,
        }
        fileList.push(itemObj)
      })
      return fileList
    },
    // 待办推送
    async pushTask() {
      const hasReport = this.hasReport ? this.hasReport : "";
      let routePath = "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanHandle";
      if (hasReport) {
        routePath = "/safeManage/emergencyManagement/emergencyDrillManagement/approveReportHandle";
      }
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + routePath + `&processId=${this.processId}&hasReport=${hasReport}`
      if (this.pushPara.handle) {
        await PushTask({
          title: "应急演练推送待办",
          approval: 'emergencyManagement',
          createUserId: this.detailMsg.createUserId,
          userId: this.pushPara.handle,
          // docId: this.pushPara.processId,
          taskId: this.pushPara.processId,
          url: url,
          docNumber: this.reportDetail?.processNumber,   //业务id
          docId: this.processId,  //主键id
        })
      } else {
        PushTask({
          title: "应急演练推送待办",
          approval: 'emergencyManagement',
          docNumber: this.reportDetail?.processNumber,   //业务id
          docId: this.processId,  //主键id
        })
        this.$router.push("/safeManage/emergencyManagement/emergencyDrillManagement/emergencyApprove");
      }
    },
    // 驳回按钮
    reject() {
      this.approvalStatus = 3;
      this.resolveFn();
    },
    // 通过按钮
    approved() {
      this.approvalStatus = 4;
      this.resolveFn();
    },
    async resolveFn() {
      try {
        this.btnLoading = true;
        let result = await emergentProcessResolve({
          processId: this.processId,
          handleType: this.approvalStatus
        })
        this.pushPara = result.data || {};
        if (this.approvalStatus == 4) { // 通过之后通知下级节点处理人
          this.pushTask();
        }
        this.$antMessage.success(this.approvalStatus == 4 ? "通过成功" : "驳回成功");
        this.$router.push("/safeManage/emergencyManagement/emergencyDrillManagement/emergencyApprove");
      } catch (err) {
        console.log(err);
        this.btnLoading = false;
      }
    },
    // 取消
    onCancle() {
      this.setKeepalive(true)
      this.$router.push("/safeManage/emergencyManagement/emergencyDrillManagement/emergencyApprove");
    },
  },
};
</script>

<style scoped lang='less'>
.fix-width {
  width: calc(100% - 426px);
}
.fixed-bottom {
  width: 100%;
}
.scroll-center-box {
  overflow: auto;
  height: 100%;
}
.post-wrapper {
  /deep/ .fixed-bottom {
    bottom: 0;
    margin: 0;
    left: 0;
  }
  /deep/ .log {
    flex: none;
  }
}

.file-list {
  margin-bottom: 10px;
  .file-list-title {
    margin-bottom: 10px;
  }
  .file-item {
    cursor: pointer;
    margin-bottom: 10px;
    color: #0067cc;
    &:last-child {
      margin-bottom: 0px;
    }
    & > img {
      max-width: 100%;
      margin-bottom: 10px;
    }
  }
}
.no-padding {
  width: 100% !important;
  .fixed-bottom {
    width: 100% !important;
  }
}
</style>