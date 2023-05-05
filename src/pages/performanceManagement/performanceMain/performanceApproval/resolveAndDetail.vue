<template>
  <div class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="fix-width flex-1 position-rel pd-b-100">
      <div class="scroll-center-box">
        <PageTitle>{{isView ? "审批单详情" : "审批单处理"}}</PageTitle>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <div class="post-main m-b-20">
            <div class="font-16 color-0067cc m-b-20">审批状态：{{getMappingValue(statusList, "dictValue", detailMsg.infoStatus).dictLabel ? getMappingValue(statusList, "dictValue", detailMsg.infoStatus).dictLabel : "--"}}</div>
            <a-row :span="24">
              <a-col :span="12">
                <p><span>组织：</span><span>{{detailMsg.corporationName}}</span></p>
                <p><span>填报人：</span><span>{{detailMsg.createUserId}}</span></p>
                <p><span>审批人：</span><span>{{detailMsg.handlerName}}</span></p>
              </a-col>
              <a-col :span="12">
                <p><span>填报范围：</span><span>{{detailMsg.range}}</span></p>
                <p><span>提交时间：</span><span>{{detailMsg.createTime}}</span></p>
                <p><span>审批时间：</span><span>{{detailMsg.updateTime}}</span></p>
              </a-col>
            </a-row>
          </div>
          <CommonTable>
            <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
              <div slot="isNoIndex" slot-scope="record">
                {{getMappingValue(isNoIndexList, "key", record.isNoIndex).value}}
              </div>
              <div slot="action" slot-scope="record">
                <span class="color-0067cc" @click="toDetail(record)">查看详情</span>
              </div>
            </a-table>
          </CommonTable>
        </a-spin>
      </div>
      <div :class="{'no-padding': !logData.length}" slot="fixedBottom">
        <!-- 责任部门部长审议时只有提交按钮 -->
        <FixedBottom>
          <div>
            <a-button @click="onCancle">返回</a-button>
            <a-button v-if="!isView && (userId == detailMsg.handler)" :loading="btnLoading" @click="reject">驳回</a-button>
            <a-button v-if="!isView && (userId == detailMsg.handler)" type="primary" :loading="btnLoading" @click="approved">通过</a-button>
          </div>
        </FixedBottom>
      </div>
    </div>
    <Log v-if="logData.length" :flowLogList="logData" :hiddenRemark="true"></Log>
  </div>

</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";

import FixedBottom from "@/components/commonTpl/fixedBottom"
import Log from "@/components/flowLog/flowLog.vue"

import cancelLoading from '@/mixin/cancelLoading'
import { getQueryVariable } from "@/utils/util.js"
import {  orgDataSelectApprovalDetail, orgDataHandlerApproval, orgDataReturnHandler, orgDataGetLog } from '@/services/performanceManagement.js';
import { PushTask } from '@/services/api.js';

export default {
  components: { FixedBottom, Log },
  mixins: [cancelLoading, teableCenterEllipsis],
  data() {
    return {
      spinning: true,
      detailMsg: {},
      statusList: [],
      isNoIndexList: [
        {
          key: 2,
          value: "是"
        },
        {
          key: 1,
          value: "否"
        }
      ],
      columns: [
      {
          title: '是否有否决性指标',
          scopedSlots: { customRender: 'isNoIndex' },
          width: 200,
        },
        {
          title: '安全管理扣分分值',
          dataIndex: 'securityDeductScore',
          width: 200,
        },
        {
          title: '消防管理扣分分值',
          dataIndex: 'controlDeductScore',
          width: 200,
        },
        {
          title: '环境管理扣分分值',
          dataIndex: 'environmentDeductScore',
          width: 200,
        },
        {
          title: '职业健康管理扣分分值',
          dataIndex: 'healthyDeductScore',
          width: 200,
        },
        {
          title: '其他管理事项扣分分值',
          dataIndex: 'otherDeductScore',
          width: 200,
        },
        {
          title: '总扣分值',
          dataIndex: 'deductDeductScore',
          width: 200,
        },
        {
          title: '总得分',
          dataIndex: 'score',
          width: 200,
        },
        {
          title: '分档',
          dataIndex: 'level',
          minWidth: 150,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      // 节点信息
      id: "",
      logData: [], // 日志数据
      pushPara: {}, // 推送参数
      btnLoading: false,
      userId: "",
    };
  },
  async created() {
    this.statusList = this.getMappingValue(this.dictTypeData, "dictType", "kpi_node").dictItem;
    this.id = (this.$route.query && this.$route.query.id) || getQueryVariable('id');
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId;
    if (this.id) {
      this.init();
    }
  },
  computed: {
    isView() {
      return this.$route.meta && this.$route.meta.isView;
    },
    isResolve() {
      return (this.$route.meta && this.$route.meta.isResolve) || getQueryVariable('id'); // 审批列表进入或者待办进入
    }
  },
  methods: {
    init() {
      this.getLogData();
      this.getEchoData();
      // this.getDataList();
     },
    // 编辑 | 查看 | 处理，获取回显数据
    async getEchoData() {
      let para = {
        id: this.id
      }
      orgDataSelectApprovalDetail(para).then(res => {
        let resultObj = res.data || {};
        let summaryVoList = resultObj.summaryVoList || [];
        resultObj.handler = this.userId;
        let arr = [];
        for (let i = 0; i < summaryVoList.length; i++) {
          if (summaryVoList[i].corporationId) {
            arr.push(this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", summaryVoList[i].corporationId).orgAbbrName);
          }
        }
        this.detailMsg = {
          ...resultObj,
          corporationName: arr.join("，")
        };
        this.tableDataList = summaryVoList;
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.spinning = false;
      })
    },
    async getLogData() {
      try {
        let para = {
          operateId: this.id,
        }
        let result = await orgDataGetLog(para);
        let list = result.data || [];
        for (let i = 0; i < list.length; i++) {
          list[i].activityName = list[i].handerType;
          list[i].assigneeName = list[i].hander;
          list[i].endTime = list[i].handerTime;
        }
        this.logData = list;
      } catch (err) {
        console.log(err);
      }
    },
    toDetail(record) {
      console.log(record);
      this.$router.push({
        path: "/ehsGerneralManage/performanceManagement/dataFillingView",
        query: { 
          corporationId: record.corporationId,
          year: this.detailMsg.year,
          quarter: this.detailMsg.quarter,
        }
      })
    },
    
    // 驳回按钮
    reject() {
      this.btnLoading = true;
      orgDataReturnHandler({
        id: this.id,
      }).then(res => {
        this.$antMessage.success("审批驳回成功");
        this.$router.push("/ehsGerneralManage/performanceManagement/performanceApproval");
      }).finally(() => {
        this.btnLoading = false;
      })
    },
    // 通过按钮
    approved() {
      let str = "<table border>";
      str +=  "<tr><th>是否有否决性指标</th><th>安全管理扣分分值</th><th>消防管理扣分分值</th><th>环境管理扣分分值</th><th>职业健康管理扣分分值</th><th>其他管理事项扣分分值</th><th>总扣分值</th><th>总得分</th><th>分档</th></tr>"
      this.tableDataList.forEach(item => {
        str += `<tr><td>${this.getMappingValue(this.isNoIndexList, "key", item.isNoIndex).value}</td><td>${item.securityDeductScore}</td><td>${item.controlDeductScore}</td><td>${item.environmentDeductScore}</td><td>${item.healthyDeductScore}</td><td>${item.otherDeductScore}</td><td>${item.deductDeductScore}</td><td>${item.score}</td><td>${item.level}</td></tr>`;
      })
      str+= "</table>";
      this.btnLoading = true;
      orgDataHandlerApproval({
        id: this.id,
        htmlSummary: str
      }).then(res => {
        this.$antMessage.success("审批通过成功");
        this.pushPara = res.data || {};
        this.pushTask();
      }).finally(() => {
        this.btnLoading = false;
      })
    },
    // 取消
    onCancle() {
      this.setKeepalive(true)
      this.$router.push("/ehsGerneralManage/performanceManagement/performanceApproval");
    },  
    // 待办推送
    async pushTask() {
      let routePath = "/ehsGerneralManage/performanceManagement/performanceApprovalResolve";
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + routePath + `&id=${this.pushPara.id}`
      if (this.pushPara.handlerId && this.pushPara.id) {
        try {
          await PushTask({
            title: "管理绩效待办",
            approval:'performanceManagement',
            userId: this.pushPara.handlerId,
            docId: this.pushPara.id ? this.pushPara.id : this.pushPara.id,
            taskId: this.pushPara.id ? this.pushPara.id : this.pushPara.id,
            createUserId: this.detailMsg.createUserId,
            url: url,
          })
          this.$router.push("/ehsGerneralManage/performanceManagement/performanceApproval");
        } catch(err) {
          this.$router.push("/ehsGerneralManage/performanceManagement/performanceApproval");
        }
      } else {
        this.$router.push("/ehsGerneralManage/performanceManagement/performanceApproval");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.fix-width{
  width: calc(100% - 426px);
}
.fixed-bottom{
  width: 100%;
}
.scroll-center-box{
  overflow: auto;
  height: 100%;
}
.post-wrapper {
  /deep/ .fixed-bottom{
    bottom: 0;
    margin: 0;
    left: 0
  }
  /deep/ .log{
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
.no-padding{
  width: 100%!important;
  .fixed-bottom{
    width: 100%!important
  }
}
</style>