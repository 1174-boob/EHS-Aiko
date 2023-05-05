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
                <a-col :span="24">
                  <CommonSearchItem ref="commonSearchItem" :CommonFormInline="iFrom" :rules="iRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="true" :hasDepartment="true" deptLabel="申请人部门"></CommonSearchItem>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="title" label="标题" prop="title">
                    <a-input disabled v-model.trim="iFrom.title" :maxLength="30" placeholder="请输入标题"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <!-- <a-form-model-item ref="boeAssume" label="BOE担当" prop="boeAssume">
                    <a-tree-select
                      disabled
                      show-search
                      allowClear
                      multiple
                      :filterTreeNode="filterUserTree"
                      v-model="iFrom.boeAssume"
                      :replaceFields="userTreeFields"
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '260px', overflow: 'auto' }"
                      :tree-data="userTreeData"
                      placeholder="请选择BOE担当"
                    ></a-tree-select>
                  </a-form-model-item> -->
                  <staffOrDept :labelTitle="'BOE担当'" :checkedTreeNode="checkedTreeNode" :treeRoles="iRules" :propKey="'boeAssume'" :onPreview="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="tradeName" label="厂商名称" prop="tradeName">
                    <a-input disabled v-model.trim="iFrom.tradeName" :maxLength="30" placeholder="请输入厂商名称"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="transportPerson" label="厂商化学品运送人员" prop="transportPerson">
                    <a-input disabled v-model.trim="iFrom.transportPerson" :maxLength="30" placeholder="请输入厂商化学品运送人员"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="tradeTel" label="厂商联系方式" prop="tradeTel">
                    <a-input disabled v-model.trim="iFrom.tradeTel" :maxLength="30" placeholder="请输入厂商联系方式"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="intoFactoryDate" label="化学品入厂日期" prop="intoFactoryDate">
                    <a-date-picker disabled style="width: 100%;" v-model="iFrom.intoFactoryDate" format="YYYY-MM-DD" placeholder="请选择化学品入厂日期" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>

            <template title="临时化学品信息">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>临时化学品信息</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="temporaryFactoryChemicals" label=" " prop="temporaryFactoryChemicals" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable :noPaging="true">
                  <a-table
                    style="width:100%;"
                    :columns="columns"
                    :scroll="{ x: 1960 }"
                    :locale="{emptyText: emptyText}"
                    :data-source="iFrom.temporaryFactoryChemicals"
                    :rowKey="(record, index)=>{return index}"
                    :pagination="false"
                  ></a-table>
                </CommonTable>
              </a-form-model-item>

              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="referencesAttachmentList" label="资料附件" prop="referencesAttachmentList" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                    <UploadBtnStyle :accept="['.doc', '.docx','.pdf','.ppt']" :fileLists="iFrom.echoReferencesAttachmentList" :onlyShow="true" @handleSuccess="handleSuccessReferencesAttachment"></UploadBtnStyle>
                  </a-form-model-item>
                </a-col>
              </a-row>
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
      :temporaryEntryId="temporaryEntryId"
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
import { addTransientChemicalsApi, getTransientChemicalsAddDetailApi, changeTransientChemicalsApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail, DeptUserTree, getFlowLogApi } from '@/services/api'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveNodeUser, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import HandleModel from './components/handleModel.vue';
import OperationLog from '@/components/flowLog/flowLog.vue'
import staffOrDept from "@/components/staffOrDept";
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: { FixedBottom, UploadBtnStyle, HandleModel, OperationLog,staffOrDept },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      // userTreeFields: { value: 'key' },
      checkedTreeNode:[],
      // 通过、驳回弹窗-显示隐藏
      handleModelShow: false,
      // 弹窗类型 通过、驳回
      modelType: 'pass',
      spinning: true,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      iFrom: {
        deptId: undefined,
        title: undefined,
        boeAssume: undefined,
        tradeName: undefined,
        transportPerson: undefined,
        tradeTel: undefined,
        intoFactoryDate: undefined,
        temporaryFactoryChemicals: [],
        referencesAttachmentList: undefined,
        echoReferencesAttachmentList: [],
      },
      iRules: {
        deptId: [{ required: true, message: "使用部门不能为空", trigger: "change" },],
        title: [{ required: true, message: "标题不能为空", trigger: "change" },],
        boeAssume: [{ required: true, message: "BOE担当不能为空", trigger: "change" },],
        tradeName: [{ required: true, message: "厂商名称不能为空", trigger: "change" },],
        transportPerson: [{ required: true, message: "厂商化学品运送人员不能为空", trigger: "change" },],
        tradeTel: [{ required: true, message: "厂商联系方式不能为空", trigger: "change" },],
        intoFactoryDate: [{ required: true, message: "化学品入厂日期不能为空", trigger: "change" },],
        temporaryFactoryChemicals: [{ required: true, message: "临时化学品信息不能为空", trigger: "change" },],
        referencesAttachmentList: [{ required: false, message: "资料附件不能为空", trigger: "change" },],
      },
      // 化学品名称list
      chemicalsList: [],
      // 主要成分table
      columns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalsId",
          key: "chemicalsId",
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
          title: "化学品组分",
          dataIndex: "chemicalComposition",
          key: "chemicalComposition",
        },
        {
          title: "化学品用途",
          dataIndex: "chemicalUse",
          key: "chemicalUse",
        },
        {
          title: "入厂数量",
          dataIndex: "intoFactoryNum",
          key: "intoFactoryNum",
        },
        {
          title: "单位",
          dataIndex: "chemicalsUnit",
          key: "chemicalsUnit",
        },
        {
          title: "是否出厂",
          dataIndex: "outFactory",
          key: "outFactory",
          customRender: (text) => {
            text = dictionary('required', text)
            return text;
          },
        },
        {
          title: "化学品出厂日期",
          dataIndex: "outFactoryDate",
          key: "outFactoryDate",
          width: 160,
        },
        {
          title: "化学品危险性",
          dataIndex: "hazardousProperties",
          key: "hazardousProperties",
        },
        {
          title: "化学品使用地点",
          dataIndex: "useLocation",
          key: "useLocation",
          width: 180,
        },
        {
          title: "化学品使用防护措施",
          dataIndex: "protectiveMeasures",
          key: "protectiveMeasures",
          width: 200,
        },
        {
          title: "化学品使用人员",
          dataIndex: "usePerson",
          key: "usePerson",
          width: 180,
        },
        {
          title: "化学品临时储存位置",
          dataIndex: "storageLocation",
          key: "storageLocation",
          width: 200,
        },
      ],
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
      // 流程审批日志信息
      flowLogList: [],
      // 是否出厂
      requiredList: [],
      // 主键id
      temporaryEntryId: undefined,
      // 详情信息
      detailObj: {},
      // 通过时选择的人员列表
      plainOptions: [],
      // 下一个节点
      nextInfoStatus: undefined,
      nextInfoStatusName: '',
      // userTreeData: [],
    }
  },
  created() {
    // 是否出厂字典
    this.requiredList = dictionary("required");
    // 页面初始化
    this.temporaryEntryId = this.$route.query.temporaryEntryId || getQueryVariable("temporaryEntryId");
  },
  mounted() {
    this.initPage()
  },
  computed: {
    // 当前页面是否为处理
    isHandlePage() {
      return this.$route.path.indexOf('transientChemicalsHandle') != -1
    },
    // 是否为最后一个节点
    isEnd() {
      let end = this.nextInfoStatus.indexOf('end') == 0
      return end
    },
  },
  methods: {
    // 测试人员模糊筛选
    // filterUserTree(inputValue, treeNode) {
    //   return treeNode.data.props.title.includes(inputValue)
    // },
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
      // 获取页面详情
      Promise.all([this.getPageDetail()])
        .finally(() => {
          this.spinning = false
        })
    },
    // 获取页面详情
    getPageDetail() {
      let apiData = { temporaryEntryId: this.temporaryEntryId }
      return new Promise((resolve, rej) => {
        getTransientChemicalsAddDetailApi(apiData)
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
            iFrom.temporaryFactoryChemicals.forEach(item => {
              item.guid = this.guid()
            })
            // BOE担当处理
            iFrom.boeAssume = JSON.parse(iFrom.boeAssume)
            this.checkedTreeNode = iFrom.boeAssume;
            // 资料附件-回显
            iFrom.referencesAttachmentList = this.handleFileIdS(iFrom.echoReferencesAttachmentList)
            iFrom.echoReferencesAttachmentList = this.handleFileRedisplay(iFrom.echoReferencesAttachmentList)
            this.iFrom = iFrom
            // 获取已选择的组织机构回显
            this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptId)
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
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.uid = item.id
        item.name = item.sourceFileName
        item.status = 'done'
        item.url = item.filePath
      })
      return fileList
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // 添加一行
    openAddCasNoModel(row) {
      this.addCasNoModelData = row ? row : {}
      this.addCasNoModelShow = true;
    },
    // 返回
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 修改主要成分table数据-添加一行
    changeModuleList(moduleDataList) {
      this.iFrom.temporaryFactoryChemicals = moduleDataList
    },
    // 资料附件-文件上传
    handleSuccessReferencesAttachment(fileList) {
      this.iFrom.referencesAttachmentList = fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'referencesAttachmentList', 'ruleForm')
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