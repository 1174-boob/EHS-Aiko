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
                <a-col :span="12">
                  <CommonSearchItem
                    ref="commonSearchItem"
                    :CommonFormInline="iFrom"
                    :rules="iRules"
                    :notTablePage="true"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :hasDepartment="true"
                    :disabled="true"
                    deptLabel="所属部门"
                    @corporationChange="corporationChange"
                  ></CommonSearchItem>
                  <a-form-model-item ref="companyName" label="企业全称" prop="companyName">
                    <a-input disabled v-model.trim="iFrom.companyName" :maxLength="50" placeholder="请输入企业全称"></a-input>
                  </a-form-model-item>
                  <a-form-model-item ref="companyCode" label="统一社会信用代码" prop="companyCode">
                    <a-input disabled v-model.trim="iFrom.companyCode" :maxLength="50" placeholder="请输入统一社会信用代码"></a-input>
                  </a-form-model-item>

                  <a-form-model-item ref="contractNo" label="安全协议合同号" prop="contractNo">
                    <a-input disabled v-model.trim="iFrom.contractNo" :maxLength="50" placeholder="请输入安全协议合同号"></a-input>
                  </a-form-model-item>
                  <a-form-model-item ref="supplierDirector" label="企业负责人" prop="supplierDirector">
                    <a-input disabled v-model.trim="iFrom.supplierDirector" :maxLength="50" placeholder="请输入企业负责人"></a-input>
                  </a-form-model-item>
                  <a-form-model-item ref="supplierSafeDirector" label="企业安全负责人" prop="supplierSafeDirector">
                    <a-input disabled v-model.trim="iFrom.supplierSafeDirector" :maxLength="50" placeholder="请输入企业安全负责人"></a-input>
                  </a-form-model-item>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item ref="createTime" label="创建日期"  prop="createTime">
                    <a-input disabled v-model.trim="iFrom.createTime"></a-input>
                  </a-form-model-item>

                  <StaffOrDept
                    :labelTitle="'所属担当'"
                    :checkedTreeNode="checkedTreeNode"
                    :treeRoles="iRules"
                    :propKey="'toBear'"
                    :labelCol="labelCol"
                    :onPreview="true"
                    :wrapperCol="wrapperCol"
                    :treePlaceholder="iFrom.corporationId?'请选择' : '请先选择所属组织'"
                    :deptTreeId="deptTreeId"
                    @getTreeData="getTreeData"
                  ></StaffOrDept>
                  <a-form-model-item ref="companyAbbreviation" label="企业简称" prop="companyAbbreviation">
                    <a-input disabled v-model.trim="iFrom.companyAbbreviation" :maxLength="50" placeholder="请输入企业简称"></a-input>
                  </a-form-model-item>

                  <a-form-model-item ref="mainBusiness" label="主营业务" prop="mainBusiness">
                    <a-input disabled v-model.trim="iFrom.mainBusiness" :maxLength="50" placeholder="请输入主营业务"></a-input>
                  </a-form-model-item>

                  <a-form-model-item ref="contractExpirationDate" label="安全协议到期日" prop="contractExpirationDate">
                    <a-date-picker disabled style="width: 100%;" v-model="iFrom.contractExpirationDate" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="请选择安全协议到期日" />
                  </a-form-model-item>
                  
                  <a-form-model-item ref="supplierDirectorPhone" label="负责人联系方式" prop="supplierDirectorPhone">
                    <a-input disabled v-model.trim="iFrom.supplierDirectorPhone" :maxLength="50" placeholder="请输入负责人联系方式"></a-input>
                  </a-form-model-item>

                  <a-form-model-item ref="supplierSafeDirectorPhone" label="安全负责人联系方式" prop="supplierSafeDirectorPhone">
                    <a-input disabled v-model.trim="iFrom.supplierSafeDirectorPhone" :maxLength="50" placeholder="请输入安全负责人联系方式"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
            

            <a-row>
              <a-col :span="24">
                <a-form-model-item label="作业内容" :label-col="labelColAlone" :wrapper-col="wrapperColAlone" prop="jobContent">
                  <a-textarea
                    disabled
                    :maxLength="500"
                    class="flex"
                    v-model="iFrom.jobContent"
                    placeholder="简述作业内容，字数不超过500字"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            
            <a-row>
              <a-col :span="24">
                <a-form-model-item label="备注" :label-col="labelColAlone" :wrapper-col="wrapperColAlone" prop="remarks">
                  <a-textarea
                    :maxLength="500"
                    disabled
                    v-model="iFrom.remarks"
                    placeholder="简述备注，字数不超过500字"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            
            <a-row>
              <a-col :span="24">
                <a-form-model-item ref="fileIds" label="资料附件" prop="fileIds" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                  <UploadBtnStyle
                    :accept="['.doc', '.docx','.pdf','.xls','.xlsx','.ppt']"
                    :maxSize="20"
                    :limit="20"
                    :onlyShow="true"
                    :fileLists="iFrom.fileIdList"
                    @handleSuccess="handleSuccessReferencesAttachment"
                  ></UploadBtnStyle>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <div class="right-box" v-if="flowLogList.length">
      <OperationLog :flowLogList="flowLogList" />
    </div>
    <!-- 流程选择人员弹窗 -->
    <SelNodeUser v-model="selNodeUserModelShow" :plainOptions="plainOptions" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import OperationLog from '@/components/flowLog/flowLog.vue'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import SelNodeUser from "./components/selNodeUser.vue";
import { enterpriseInsert, enterpriseDetail, enterpriseUpdate } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail,PushTask ,getFlowLogApi} from '@/services/api'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveNodeUser, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import { getQueryVariable } from "@/utils/util.js";
import StaffOrDept from "@/components/staffOrDept";

export default {
  components: { FixedBottom, UploadBtnStyle, SelNodeUser, StaffOrDept ,OperationLog},//, AddCasNoModel
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      labelColAlone: { span: 3 },
      // 通过、驳回弹窗-显示隐藏
      handleModelShow: false,
      // 弹窗类型 通过、驳回
      modelType: 'pass',
      // 下一个节点
      nextInfoStatus: undefined,
      nextInfoStatusName: '',
      // 主键id
      invitationId: undefined,
      // 详情信息
      detailObj: {},
      wrapperColAlone: { span: 21 },
      deptTreeId: undefined,
      userTreeFields: { value: 'key' },
      checkedTreeNode: [],
      DEPLOYID: '',
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {
        departmentId: undefined,
        deptId: undefined,
        companyName: undefined,
        companyCode: undefined,
        contractNo: undefined,
        supplierDirector: undefined,
        supplierSafeDirector: undefined,
        toBear: undefined,
        companyAbbreviation: undefined,
        mainBusiness: undefined,
        contractExpirationDate: undefined,
        supplierDirectorPhone: undefined,
        supplierSafeDirectorPhone: undefined,
        jobContent: undefined,
        remarks: undefined,
        fileIds: undefined,
        fileIdList: [],
      },
      iRules: {
        deptId: [{ required: true, message: "所属部门不能为空", trigger: "change" },],
        companyName: [{ required: true, message: "企业全称不能为空", trigger: "change" },],
        companyCode: [{ required: true, message: "统一社会信用代码不能为空", trigger: "change" },],
        contractNo: [{ required: true, message: "安全协议合同号不能为空", trigger: "change" },],
        supplierDirector: [{ required: true, message: "企业负责人不能为空", trigger: "change" },],
        supplierSafeDirector: [{ required: true, message: "企业安全负责人不能为空", trigger: "change" },],
        toBear: [{ required: true, message: "所属担当不能为空", trigger: "change" },],
        companyAbbreviation: [{ required: true, message: "企业简称不能为空", trigger: "change" },],
        mainBusiness: [{ required: true, message: "主营业务不能为空", trigger: "change" },],
        contractExpirationDate: [{ required: true, message: "安全协议到期日不能为空", trigger: "change" },],
        supplierDirectorPhone: [{ required: true, message: "负责人联系方式不能为空", trigger: "change" },],
        supplierSafeDirectorPhone: [{ required: true, message: "安全负责人联系方式不能为空", trigger: "change" },],
        jobContent: [{ required: true, message: "作业内容不能为空", trigger: "change" },],
        fileIds: [{ required: false, message: "资料附件不能为空", trigger: "change" },],
      },
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
      // 流程人员
      plainOptions: [],
      // 流程选择人员弹窗
      selNodeUserModelShow: false,
      // 提交所需要的流程节点信息
      flowData: {},
      // 流程审批日志信息
      flowLogList: [],
    }
  },
  created() {
    // 流程key
    this.DEPLOYID = this.getChemicalDictValue("approvalType", 'ENTAPPROVAL');
    this.userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.userId = this.userInfo.userId;
    // 页面初始化
    this.invitationId = this.$route.query.invitationId || getQueryVariable("invitationId");
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.$route.query.invitationId
    },
    // 是否为最后一个节点
    isEnd() {
      let end = this.nextInfoStatus.indexOf('end') == 0
      return end
    },
  },
  mounted() {
    // 页面初始化
    this.initPage()
    // 获取当前创建日期
    this.getDate()
  },
  methods: {
    getDate(){
      // 创建一个 Date 对象
      const currentDate = new Date();
      // 获取年、月、日、时、分、秒
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hour = String(currentDate.getHours()).padStart(2, '0');
      const minute = String(currentDate.getMinutes()).padStart(2, '0');
      const second = String(currentDate.getSeconds()).padStart(2, '0');
      // 拼接成 YYYY-MM-DD HH:mm:ss 的形式
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      this.iFrom.createTime = formattedDate
    },
    getTreeData(value) {
      // this.iFrom.toBear = value.treeIdList;
      this.iFrom.toBear = value.treeNameAndCodeList[0].id
      this.iFrom.toBearWorkNum = value.treeNameAndCodeList[0].treeCode
      this.iFrom.toBearName = value.treeNameAndCodeList[0].treeName
      if (!formValidator.formItemValidate(this, "toBear", "ruleForm")) {
        return;
      }
    },
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情
        Promise.all([this.getPageDetail()])
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 获取页面详情
    getPageDetail() {
      let invitationId = this.$route.query.invitationId
      let apiData = { invitationId }
      return new Promise((resove, rej) => {
        enterpriseDetail(apiData)
          .then(res => {
            // 节点相关
            if (this.isHandlePage) {
              let detailObj = res.data ? res.data : {}
              let { taskId, infoStatus } = detailObj
              this.detailObj = cloneDeep(detailObj)
              this.getNextTask(taskId, infoStatus)
            }
            let iFrom = res.data
            // 所属担当处理
            iFrom.toBear = JSON.parse(iFrom.toBear)
            this.checkedTreeNode = [iFrom.toBear];

            // 资料附件-回显
            iFrom.fileIds = this.handleFileIdS(iFrom.fileIdList)
            iFrom.fileIdList = this.handleFileRedisplay(iFrom.fileIdList)
            this.iFrom = iFrom
            if (iFrom.processId) {
              this.getflowLog(iFrom.processId, iFrom.handler)
            }
            return iFrom
          })
          .then(resIFrom => {
            // 获取已选择的组织机构回显
            return this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.departmentId)
          })
          .then(() => {
            resove()
          })
          .catch(err => {
            rej()
            console.log(err,'...cv');
          })
      })
    },
    // 所属组织修改
    corporationChange(val, deptId) {
      this.deptTreeId = deptId
      this.iFrom.departmentId = val
      this.checkedTreeNode = []
      this.$set(this.iFrom, 'toBear', [])
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
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'deptId', 'ruleForm')
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
    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
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
      let formAll = false
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        } else {
          formAll = true
        }
      });
      return formAll
    },
    //获取首节点信息
    getFirstNode() {
      let para = {
        deployId: this.DEPLOYID
      }
      return GetFirstNode(para)
    },
    //新建页面获取infoStatus
    getNodeDetail(infoStatus) {
      let para = {
        deploymentId: this.DEPLOYID,
        nodeId: infoStatus
      }
      return GetNodeDetail(para)
    },
    // 创建流程-获取taskId
    createProcessData(infoStatus) {
      //根据infoStatus获取taskId
      let para = {
        deployId: this.DEPLOYID,
        module: new Date().getTime(),
        map: {}
      }
      para.map[infoStatus] = infoStatus
      return CreateProcess(para)
    },
    //获取节点用户信息
    getUserNodeInfo(infoStatus) {
      console.log('infoStatus', infoStatus);
      let para = {
        node: infoStatus,
        createUserId:this.iFrom.createUserId ? this.iFrom.createUserId: this.userId,
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
        .catch(err => { console.log(err,'msdsApproveNodeUser...err');})
    },
    // 提交之前的流程api
    submitBeforeFlow() {
      if (!this.formValidate() || this.loadingTwo || this.spinning) {
        return
      }
      this.handleLoading();
      // 获取首节点
      this.getFirstNode()
        .then(res => {
          return res
        })
        .then(firstNodeData => {  //创建流程
          // console.log('获取首节点信息', firstNodeData);
          const { id } = firstNodeData.data
          return Promise.all([this.createProcessData(id), this.getUserNodeInfo(id)])
            .then(resArr => {
              console.log(resArr,'...resArr');
              let { taskId, processId, code } = resArr[0].data
              this.flowData = {
                infoStatus: id,
                taskId,
                processId,
                docCode: code
              }
              this.cancelLoading();
              this.selNodeUserModelShow = true
            }).catch(err=>{
              console.log(err,'....err');
            })
        })
        .catch(err => {
          // 任何一步失败 保存到草稿箱
          this.saveChemicalIdentSafetyTips()
        })
    },
    // 提交api
    submitChemicalIdentSafetyTips(handler) {
      console.log(this.iFrom,'this.iFrom');
      let apiData = {
        ...this.iFrom,
        handler: handler.join(),
        ...this.flowData,
      }
      console.log(this.iFrom,'this.iFrom');
      // 1-保存 2-提交 标识参数
      apiData.approvalStatus = 2
      // 所属担当处理
      apiData.departmentId = this.iFrom.deptId;
      apiData.departmentName = this.iFrom.deptName;
      // apiData.toBear = JSON.stringify(apiData.toBear)
      // apiData.intoFactoryDate = dayJs(apiData.intoFactoryDate).format("YYYY-MM-DD")
      console.log(555555555, this.isAddPage)
      const apiName = this.isAddPage ? enterpriseInsert : enterpriseUpdate
      return apiName(apiData)
        .then(
          res => {
          // let id = res.data.id;
          // if (id) {
          //   this.pushTask(id, handler);   // 前端无需推送代办
          // }
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examine' })
        })
        .catch(err => {
          // 失败-保存到草稿箱
          console.log(err);
          // this.saveChemicalIdentSafetyTips()
        })
        .finally(() => {
          // this.cancelLoading();
        })
    },
    // 代办推送
    // async pushTask(id, handler) {
    //   const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/ehsGerneralManage/cooperationPartner/transientChemicalsHandle&invitationId=${id}`
    //   const pushTask = await PushTask({
    //     title: "相关方审批",
    //     approval: 'transientChemicals',
    //     userId: handler.join(),
    //     docId: this.flowData.processId,
    //     taskId: this.flowData.taskId,
    //     url: url,
    //     docNumber: this.flowData.docCode || '',
    //   })
    // },
    // 保存api
    saveChemicalIdentSafetyTips() {
      // console.log(this.iFrom);
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }
      let apiData = { ...this.iFrom
      }
      apiData.departmentId = this.iFrom.deptId;
      apiData.departmentName = this.iFrom.deptName;
      //  1-保存 2-提交 标识参数
      apiData.approvalStatus = 1
      // 所属担当处理
      // apiData.toBear = JSON.stringify(apiData.toBear)
      // apiData.intoFactoryDate = dayJs(apiData.intoFactoryDate).format("YYYY-MM-DD")
      const apiName = this.isAddPage ? enterpriseInsert : enterpriseUpdate
      this.handleLoadingTwo();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          // this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examineAdd' })
          this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examine' }) //保存成功后跳转到列表页
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    
    // 取消
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
    // 资料附件-文件上传
    handleSuccessReferencesAttachment(fileList) {
      this.iFrom.fileIds = fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'fileIds', 'ruleForm')
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