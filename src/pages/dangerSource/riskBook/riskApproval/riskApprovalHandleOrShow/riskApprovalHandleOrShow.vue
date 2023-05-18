<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :wrapper-col="wrapperCol">
            <template title="基本信息">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>基本信息</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-row>
                <a-col :span="13">
                  <CommonSearchItem ref="corporationId" :CommonFormInline="iFrom" :notTablePage="true" :hasDepartment="false" :disabled="true"></CommonSearchItem>
                </a-col>
              </a-row>
            </template>
            <template title="领用清单">
              <div>
                <div class="ttile border-b-e7">
                  <PageTitle class="ttile-text">风险点</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="riskPointList" label=" " prop="riskPointList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable :noPaging="true">
                  <a-table
                    style="width:100%;"
                    :columns="columns"
                    :scroll="{ x: tableScrollX() }"
                    :locale="{emptyText: emptyText}"
                    :data-source="iFrom.riskPointList"
                    :rowKey="(record, index)=>{return index}"
                    :pagination="false"
                  ></a-table>
                </CommonTable>
              </a-form-model-item>
            </template>
          </a-form-model>

          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
                <template v-if="isHandlePage">
                  <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="openModel('reject')">驳回</a-button>
                  <a-button type="primary" class="m-r-15" :loading="loading" @click="openModel('pass')">通过</a-button>
                </template>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <div class="right-box" v-if="flowLogList.length">
      <OperationLog :flowLogList="flowLogList" />
    </div>

    <HandleModel
      v-if="isHandlePage"
      v-model="handleModelShow"
      :modelType="modelType"
      :riskPointApprovalId="riskPointApprovalId"
      :detailObj="detailObj"
      :nextInfoStatus="nextInfoStatus"
      :plainOptions="plainOptions"
      :nextInfoStatusName="nextInfoStatusName"
    />
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { GetNextTask, getFlowLogApi } from '@/services/api'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import OperationLog from '@/components/flowLog/flowLog.vue'
import HandleModel from './components/handleModel.vue';
import { getRiskApprovalDetailApi, getRiskUserNodeInfo } from "@/services/dangerSource/risk";
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: { FixedBottom, OperationLog, HandleModel },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      spinning: true,
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      iFrom: {},
      iRules: {
        riskPointList: [{ required: true, message: "风险点不能为空", trigger: "change" },],
      },
      // 主要成分table
      columns: [
        {
          title: "编号",
          dataIndex: "riskPointNo",
          key: "riskPointNo",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 170,
        },
        {
          title: "所在位置",
          dataIndex: "riskPointLocation",
          key: "riskPointLocation",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 130,
        },
        {
          title: "风险点",
          dataIndex: "riskPointName",
          key: "riskPointName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 130,
        },
        {
          title: "危险源种类",
          dataIndex: "dangerSourceTypeList",
          key: "dangerSourceTypeList",
          customRender: (textArr) => {
            textArr = textArr ? textArr : []
            let text = '';
            (this.getChemicalDictList('wxy_hazardkind') || []).map(item => {
              if (textArr.includes(item.dictValue))
                text = text ? (text + ',' + item.dictLabel) : item.dictLabel
            })
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 130,
        },
        {
          title: "可能导致的事件",
          dataIndex: "dangerSourceEventList",
          key: "dangerSourceEventList",
          width: 150,
          customRender: (textArr) => {
            textArr = textArr ? textArr : []
            let text = '';
            (this.getChemicalDictList('wxy_leadtheevent') || []).map(item => {
              if (textArr.includes(item.dictValue))
                text = text ? (text + ',' + item.dictLabel) : item.dictLabel
            })
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "管控层级",
          dataIndex: "controlsLevelId",
          key: "controlsLevelId",
          width: 130,
          customRender: (text) => {
            text = text ? dictionary('controlLevel', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "责任部门",
          dataIndex: "responsibilityDeptId",
          key: "responsibilityDeptId",
          width: 130,
          customRender: (text) => {
            text = text ? this.deptCache[text] : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "责任人",
          dataIndex: "responsibilityPersonName",
          key: "responsibilityPersonName",
          width: 130,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 130,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "风险分级",
          dataIndex: "riskLevel",
          key: "riskLevel",
          customCell: (record) => {
            let background = dictionary('riskLevel', record.riskLevel, false).color || ''
            return {
              style: { 'background': background },
            };
          },
          customRender: (text) => {
            text = text ? dictionary('riskLevel', text) : ''
            return (
              <span>{{ text }}</span>
            );
          },
          width: 110,
          fixed: "right", // 固定操作列
        },
      ],

      // 流程审批日志信息
      flowLogList: [],
      // 主键id
      riskPointApprovalId: undefined,
      // 通过、驳回弹窗-显示隐藏
      handleModelShow: false,
      // 弹窗类型 通过、驳回
      modelType: 'pass',
      // 详情信息
      detailObj: {},
      // 通过时选择的人员列表
      plainOptions: [],
      // 下一个节点
      nextInfoStatus: undefined,
      nextInfoStatusName: '',
    }
  },
  created() {
    this.setRouterCode('riskBook')
    // 列表插入所属组织
    this.columns.splice(1, 0, this.addCommonColumnItem(130));
    this.columns.splice(2, 0, this.addCommonColumnDepartment(130));
    // 主键id
    this.riskPointApprovalId = this.$route.query.riskPointApprovalId || getQueryVariable('riskPointApprovalId')
    this.userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.userId = this.userInfo.userId;
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为处理
    isHandlePage() {
      return !Boolean(this.$route.meta.isShowPage)
    },
    // 是否为最后一个节点
    isEnd() {
      let end = this.nextInfoStatus.indexOf('end') == 0
      return end
    },
  },
  methods: {
    //处理 获取下一节点infoStatus信息
    getNextTask(taskId, infoStatus, hasChargeSecurityHeadId, riskLevelType) {
      let para = {
        taskId,
        param: {},
      }
      para.param[infoStatus] = infoStatus
      para.param.hasChargeSecurityHeadId = hasChargeSecurityHeadId
      para.param.riskLevelType = riskLevelType
      GetNextTask(para)
        .then(res => {
          // {
          //   id: "STAFF_FIRST"
          //   param: {SECTION_CHIEF: "SECTION_CHIEF"}
          // }
          this.nextInfoStatus = res.data.id
          this.nextInfoStatusName = res.data.name
        })
        .catch(err => { })
    },
    //获取节点用户信息
    getUserNodeInfo(infoStatus) {
      // 结束不获取下级用户
      if (this.isEnd) {
        this.plainOptions = []
        return Promise.resolve()
      } else {
        let para = {
          node: infoStatus,
          createUserId:this.detailObj.createUserId?this.detailObj.createUserId:this.userId,
          riskPointApprovalId: this.detailObj.riskPointApprovalId
        }
        if (infoStatus == 'POSITION_SECTION_CHIEF__2') {
          para.userId = this.detailObj.createUserId
        }
        return getRiskUserNodeInfo(para)
          .then(res => {
            const { data } = res
            this.plainOptions = (data || []).map(item => {
              const { userId: value, name: label } = item
              return { value, label }
            })
          })
          .catch(err => { })
      }
    },
    // 意见弹窗
    openModel(modelType) {
      this.modelType = modelType
      if (modelType == 'pass') {
        this.handleLoading();
        // 先获取节点用户信息
        let infoStatus = this.nextInfoStatus
        this.getUserNodeInfo(infoStatus)
          .then(res => {
            this.handleModelShow = true
          })
          .finally(() => {
            this.cancelLoading();
          })
      } else {
        this.handleModelShow = true
      }
    },
    // 页面初始化
    initPage() {
      // 获取页面详情和组织机构
      Promise.all([this.getPageDetail()])
        .then(resArr => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 获取页面详情
    getPageDetail() {
      let riskPointApprovalId = this.riskPointApprovalId
      let apiData = { riskPointApprovalId }
      return new Promise((resolve, rej) => {
        getRiskApprovalDetailApi(apiData)
          .then(res => {
            // 节点相关
            if (this.isHandlePage) {
              let detailObj = res.data ? res.data : {}
              let { taskId, infoStatus, hasChargeSecurityHeadId, riskLevelType } = detailObj
              this.detailObj = cloneDeep(detailObj)
              this.getNextTask(taskId, infoStatus, hasChargeSecurityHeadId, riskLevelType)
            }
            // 数据表单回显相关
            let iFrom = res.data
            this.iFrom = iFrom
            if (iFrom.processId) {
              this.getflowLog(iFrom.processId, iFrom.handler)
                .then(res => {
                  resolve(this.iFrom)
                })
            } else {
              resolve(this.iFrom)
            }
          })
          .catch(err => {
            rej()
          })
      })
    },
    // 获取操作记录
    getflowLog(processId, handlerStr) {
      let handler = handlerStr ? handlerStr.split(',') : []
      let apiData = { processInstanceId: processId, handler }
      return getFlowLogApi(apiData)
        .then(res => {
          this.flowLogList = res.data || []
        })
        .catch(err => { })
    },
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.push({ path: '/safeManage/dualControlManage/riskManage/riskApproval' })
    },
  }
}
</script>

<style lang="less" scoped>
.searchtable-wrapper {
  display: flex;
  .left-box {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
    .ttile {
      display: flex;
      align-items: center;
      margin-bottom: -3px;
      border-bottom: 1px solid transparent;
      .ttile-text {
        margin-bottom: 10px;
        margin-right: 12px;
      }
      .ttile-bbtn {
        margin-bottom: 0px;
      }
    }
    ::v-deep .fixed-bottom {
      bottom: 0px;
    }
  }
  .right-box {
    flex: none;
    display: flex;
  }
}
::v-deep .fixed-bottom {
  width: 100% !important;
  bottom: 0px !important;
  left: 0px !important;
}
::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>