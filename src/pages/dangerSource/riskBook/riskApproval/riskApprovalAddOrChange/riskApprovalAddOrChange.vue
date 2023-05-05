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
                  <CommonSearchItem ref="corporationId" :CommonFormInline="iFrom" :notTablePage="true" :hasDepartment="false" @corporationChange="corporationChange"></CommonSearchItem>
                </a-col>
              </a-row>
            </template>
            <template title="风险点">
              <div>
                <div class="ttile border-b-e7">
                  <PageTitle class="ttile-text">风险点</PageTitle>
                  <DashBtn class="ttile-bbtn">
                    <div>
                      <a-button type="dashed" @click="openSelRiskPoint()">
                        <a-icon type="plus" />新增
                      </a-button>
                    </div>
                  </DashBtn>
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
                    :rowKey="'riskPointId'"
                    :pagination="false"
                  >
                    <div slot="action" slot-scope="record">
                      <span class="color-0067cc cursor-pointer" @click="tableRowRm(record)">删除</span>
                    </div>
                  </a-table>
                </CommonTable>
              </a-form-model-item>
            </template>
          </a-form-model>

          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
                <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="saveChemicalIdentSafetyTips">保存</a-button>
                <a-button type="primary" class="m-r-15" :loading="loading" @click="submitBeforeFlow">提交</a-button>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <div class="right-box" v-if="flowLogList.length">
      <OperationLog :flowLogList="flowLogList" />
    </div>

    <!-- 关联危险源抽屉 -->
    <CommonDrawer title="选择风险点" :visible="selRiskPointShow" :cancelFn="closeSelRiskPoint" :width="'90vw'">
      <template>
        <SelRiskPoint ref="selRiskPoint" :corporationId="iFrom.corporationId" :selectedRowOld="(iFrom.riskPointList || [])" />
      </template>
      <template slot="btn">
        <a-button type="dashed" @click="closeSelRiskPoint">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="onSubmitHazardSourceDrawer">确定</a-button>
      </template>
    </CommonDrawer>

    <!-- 流程选择人员弹窗 -->
    <SelNodeUser v-model="selNodeUserModelShow" :plainOptions="plainOptions" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import SelNodeUser from "./components/selNodeUser.vue";
import { addRiskApprovalApi, getRiskApprovalDetailApi, changeRiskApprovalApi } from "@/services/dangerSource/risk";
import { getFlowLogApi } from '@/services/api'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import OperationLog from '@/components/flowLog/flowLog.vue'
import firstFlow from './mixin/firstFlow.js'
import SelRiskPoint from './components/selRiskPoint.vue'
import { PushTask } from '@/services/api'
export default {
  components: { FixedBottom, SelNodeUser, OperationLog, SelRiskPoint },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading, firstFlow],
  data() {
    return {
      selRiskPointShow: false,
      DEPLOYID: '',
      spinning: false,
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      iFrom: {},
      iRules: {
        corporationId: [{ required: true, message: "所属组织不能为空", trigger: "change" },],
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
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 80, // 宽度根据操作自定义设置
        },
      ],
      // 流程选择人员弹窗
      selNodeUserModelShow: false,
      // 领用人
      userTreeData: [],
      // 流程审批日志信息
      flowLogList: [],
      riskPointApprovalId: undefined,
    }
  },
  created() {
    this.riskPointApprovalId = this.$route.query.riskPointApprovalId
    // 列表插入所属组织
    this.columns.splice(1, 0, this.addCommonColumnItem(130));
    this.columns.splice(2, 0, this.addCommonColumnDepartment(130));
    // 流程key
    this.DEPLOYID = this.getChemicalDictValue("approvalType", 'FXDAPPROVAL');
    console.log('DEPLOYID', this.DEPLOYID);
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.riskPointApprovalId
    },
  },
  methods: {
    // 页面初始化
    initPage() {
      // console.log(this.$route.query);
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情和组织机构
        Promise.all([this.getPageDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 获取页面详情
    getPageDetail() {
      let riskPointApprovalId = this.riskPointApprovalId
      let apiData = { riskPointApprovalId }
      return new Promise((resolve, rej) => {
        getRiskApprovalDetailApi(apiData)
          .then(res => {
            this.iFrom = res.data
            resolve(this.iFrom)
          })
          .catch(err => {
            rej()
          })
      })
    },
    // 获取操作记录
    getflowLog(processId, handlerStr) {
      return Promise.resolve()
      let handler = handlerStr ? handlerStr.split(',') : []
      let apiData = { processInstanceId: processId, handler }
      return getFlowLogApi(apiData)
        .then(res => {
          this.flowLogList = res.data || []
        })
        .catch(err => { })
    },
    // 所属组织变更
    corporationChange() {
      this.$set(this.iFrom, 'riskPointList', [])
    },
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i];
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== "[object Object]") {
          dom = dom[0];
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: "center",
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: "smooth",
        });
        break; // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 表单校验
    formValidate() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = true
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      return formAll
    },
    // 提交之前的流程api
    submitBeforeFlow() {
      if (!this.formValidate() || this.loadingTwo) {
        return
      }
      this.handleLoading();
      // 1.创建节点 2.自动审批首节点 3.获取第二节点审批人
      this.creatFlow()
        .then(res => {
          this.selNodeUserModelShow = true
        })
        .catch(err => {  // 任何一步失败 保存到草稿箱
          this.saveChemicalIdentSafetyTips()
        })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 提交api
    submitChemicalIdentSafetyTips(handler) {
      let apiData = {
        ...this.iFrom,
        handler: handler.join(),
        ...this.flowData,
      }
      // 草稿 1-是，2-否
      apiData.auditStatus = 2
      const apiName = this.isAddPage ? addRiskApprovalApi : changeRiskApprovalApi
      return apiName(apiData)
        .then(res => {
          this.$antMessage.success('提交成功');
          // 代办推送
          let riskPointApprovalId = this.isAddPage ? res.data?.id : this.riskPointApprovalId
          this.pushTask(handler.join(), riskPointApprovalId)
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/dualControlManage/riskManage/riskApproval',
          })
        })
        .catch(err => {
          this.selRiskPointShow = false
          this.selNodeUserModelSho = false
        })
        .finally(() => {
          // this.cancelLoading();
        })
    },
    // 代办推送
    async pushTask(securityUser, riskPointApprovalId) {
      if (riskPointApprovalId) {
        const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/dualControlManage/riskManage/riskApprovalHandle&riskPointApprovalId=${riskPointApprovalId}`
        const pushTask = await PushTask({
          title: "风险点审批",
          approval: 'riskBook',
          userId: securityUser,
          url: url,
          docNumber: this.iFrom?.riskPointApprovalNo,   //业务id
          docId: riskPointApprovalId,  //主键id
        })
      }
    },
    // 保存api
    saveChemicalIdentSafetyTips() {
      console.log(this.iFrom);
      if (!this.formValidate() || this.loading) {
        return
      }
      let apiData = { ...this.iFrom }
      // 草稿 1-是，2-否
      apiData.auditStatus = 1
      const apiName = this.isAddPage ? addRiskApprovalApi : changeRiskApprovalApi
      this.handleLoadingTwo();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dualControlManage/riskManage/riskApproval' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 打开风险点抽屉
    openSelRiskPoint() {
      if (this.iFrom.corporationId) {
        this.selRiskPointShow = true;
      } else {
        this.$antMessage.warn('请先选择所属组织');
      }
    },
    // 关闭风险点抽屉
    closeSelRiskPoint() {
      this.selRiskPointShow = false;
    },
    // 关联风险点-抽屉-提交
    onSubmitHazardSourceDrawer() {
      // console.log('风险点', this.$refs.selRiskPoint.selectedRow);
      let riskPointList = [...this.$refs.selRiskPoint.selectedRow]
      this.$set(this.iFrom, 'riskPointList', riskPointList)
      formValidator.formItemValidate(this, 'riskPointList', 'ruleForm')
      this.closeSelRiskPoint()
    },
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 删除表格某一行
    tableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.riskPointList = this.iFrom.riskPointList.filter(item => {
            return item.riskPointId != row.riskPointId
          })
          formValidator.formItemValidate(this, 'riskPointList', 'ruleForm')
        },
      });
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