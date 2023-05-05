<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <template title="基本信息">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>基本信息</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-row>
                <a-col :span="13">
                  <CommonSearchItem ref="commonSearchItem" :CommonFormInline="iFrom" :rules="iRules" :hasDepartment="true" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" deptLabel="领用部门" :disabled="true"></CommonSearchItem>
                </a-col>
              </a-row>
            </template>

            <template title="领用清单">
              <div>
                <div class="ttile border-b-e7">
                  <PageTitle class="ttile-text">领用清单</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable :noPaging="true">
                  <a-table
                    style="width:100%;"
                    :columns="columns"
                    :scroll="{ x: 920 }"
                    :locale="{emptyText: emptyText}"
                    :data-source="iFrom.itemList"
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
      :receiveId="receiveId"
      :detailObj="detailObj"
      :nextInfoStatus="nextInfoStatus"
      :plainOptions="plainOptions"
      :nextInfoStatusName="nextInfoStatusName"
    />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { addPpeClaimApi, getPpeClaimDetailApi, changePpeClaimApi, getPpeDepositoryListNoPageApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail, DeptUserTree, getFlowLogApi } from '@/services/api'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveNodeUser, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import OperationLog from '@/components/flowLog/flowLog.vue'
import HandleModel from './components/handleModel.vue';
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: { FixedBottom, UploadBtnStyle, OrganizeLazyTree, OperationLog, HandleModel },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      DEPLOYID: '',
      // 岗位list
      gangweiList: [],
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {
        receiveOrganizationId: undefined,
        receiveDeptId: undefined,
        itemList: undefined,
      },
      iRules: {
        receiveOrganizationId: [{ required: true, message: "所属组织不能为空", trigger: "change" },],
        receiveDeptId: [{ required: true, message: "部门不能为空", trigger: "change" },],
        itemList: [{ required: true, message: "报废清单不能为空", trigger: "blur" },],
      },
      // 化学品名称list
      chemicalsList: [],
      // 主要成分table
      columns: [
        {
          title: "序号",
          dataIndex: "code",
          key: "code",
          customRender: (text, row, index) => {
            return index + 1
          },
          width: 80,
        },
        {
          title: "PPE类型",
          dataIndex: "ppeType",
          key: "ppeType",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('PPE_type', text) : ''
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
          title: "物料名称/型号",
          dataIndex: "materialNameAndBrand",
          key: "materialNameAndBrand",
          width: 160,
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
          title: "领取数量",
          dataIndex: "receiveAmount",
          key: "receiveAmount",
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
          title: "单位",
          dataIndex: "unit",
          key: "unit",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('PPE_unit', text) : ''
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
          title: "领用人",
          dataIndex: "receiveUserNameList",
          key: "receiveUserNameList",
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
          title: "使用方式",
          dataIndex: "useType",
          key: "useType",
          customRender: (text) => {
            text = dictionary('ppeUseType', text)
            return text;
          },
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark",
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
      ],
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
      // 使用方式
      ppeUseType: [],
      // ppe库存列表--物料名称/型号
      ppeDepositoryList: [],
      // 领用人
      // userTreeData: [],
      // 流程审批日志信息
      flowLogList: [],

      // 主键id
      receiveId: undefined,
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
    this.setRouterCode("ppeManage");
    // 使用方式字典
    this.ppeUseType = dictionary("ppeUseType");
    // 主键id
    this.receiveId = this.$route.query.receiveId || getQueryVariable("receiveId")
    // 流程key
    // this.DEPLOYID = this.getChemicalDictValue("approvalType", 'TEMPAPPROVAL');
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为处理
    isHandlePage() {
      return this.$route.path.indexOf('ppeClaimHandle') != -1
    },
    // 是否为最后一个节点
    isEnd() {
      let end = this.nextInfoStatus.indexOf('end') == 0
      return end
    },
  },
  methods: {
    //处理 获取下一节点infoStatus信息
    getNextTask(taskId, infoStatus) {
      let para = {
        taskId,
        param: {}
      }
      para.param[infoStatus] = infoStatus
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
          userId: this.detailObj.createUserId,
          corporationId:this.iFrom.corporationId || undefined
        }
        return msdsApproveNodeUser(para)
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
      Promise.all([this.getPageDetail(), this.getPpeDepositoryListNoPage()])
        .then(resArr => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 物料名称/型号
    getPpeDepositoryListNoPage() {
      const params = {};
      return getPpeDepositoryListNoPageApi(params)
        .then((res) => {
          this.ppeDepositoryList = res.data || []
        })
        .catch(err => { })
    },
    // 获取用户组织树
    // getDeptUserTree() {
    //   return DeptUserTree()
    //     .then(res => {
    //       this.userTreeData = [res.data];
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })
    // },
    // 获取页面详情
    getPageDetail() {
      let receiveId = this.$route.query.receiveId || getQueryVariable("receiveId")
      let apiData = { receiveId }
      return new Promise((resolve, rej) => {
        getPpeClaimDetailApi(apiData)
          .then(res => {
            // 节点相关
            if (this.isHandlePage) {
              let detailObj = res.data ? res.data : {}
              let { taskId, infoStatus } = detailObj
              this.detailObj = cloneDeep(detailObj)
              this.getNextTask(taskId, infoStatus)
            }
            // 数据表单回显相关
            let iFrom = res.data
            iFrom.itemList.forEach(item => {
              item.guid = this.guid()
            })
            this.iFrom = iFrom
            // 获取已选择的组织机构回显
            
            if (iFrom.processId) {
              this.getflowLog(iFrom.processId, iFrom.handler)
                .then(res => {
                  resolve(this.iFrom)
                })
            } else {
              resolve(this.iFrom)
            }
            this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptId)
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
      this.$router.push({
        path:'/occupationHealth/ppeManage',
        query: { activeKey: 2 }
      })
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 部门表单校验
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'receiveDeptId', 'ruleForm')
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
  width: 100%;
  bottom: 30px;
  left: 0px;
  z-index: 999;
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