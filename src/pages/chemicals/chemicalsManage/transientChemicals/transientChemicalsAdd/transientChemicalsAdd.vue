<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
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
              <CommonSearchItem
                ref="commonSearchItem"
                :CommonFormInline="iFrom"
                :rules="iRules"
                :notTablePage="true"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :hasDepartment="true"
                deptLabel="申请人部门"
                @corporationChange="corporationChange"
              ></CommonSearchItem>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item ref="title" label="标题" prop="title">
                <a-input v-model.trim="iFrom.title" :maxLength="30" placeholder="请输入标题"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <StaffOrDept
                :labelTitle="'业务担当'"
                :checkedTreeNode="checkedTreeNode"
                :treeRoles="iRules"
                :propKey="'boeAssume'"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :onPreview="!iFrom.corporationId"
                :treePlaceholder="iFrom.corporationId?'请选择' : '请先选择所属组织'"
                :deptTreeId="deptTreeId"
                @getTreeData="getTreeData"
              ></StaffOrDept>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item ref="tradeName" label="厂商名称" prop="tradeName">
                <a-input v-model.trim="iFrom.tradeName" :maxLength="30" placeholder="请输入厂商名称"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item ref="transportPerson" label="厂商化学品运送人员" prop="transportPerson">
                <a-input v-model.trim="iFrom.transportPerson" :maxLength="30" placeholder="请输入厂商化学品运送人员"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item ref="tradeTel" label="厂商联系方式" prop="tradeTel">
                <a-input v-model.trim="iFrom.tradeTel" :maxLength="30" placeholder="请输入厂商联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item ref="intoFactoryDate" label="化学品入厂日期" prop="intoFactoryDate">
                <a-date-picker style="width: 100%;" v-model="iFrom.intoFactoryDate" format="YYYY-MM-DD" placeholder="请选择化学品入厂日期" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="临时化学品信息">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>
                临时化学品信息
                <DashBtn>
                  <div style="margin-top:10px;">
                    <a-button type="dashed" @click="openAddCasNoModel()">
                      <a-icon type="plus" />新增一行
                    </a-button>
                  </div>
                </DashBtn>
              </PageTitle>
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
              >
                <div slot="action" slot-scope="record">
                  <span class="color-0067cc cursor-pointer m-r-15" @click="tableRowEdit(record)">编辑</span>
                  <span class="color-0067cc cursor-pointer" @click="tableRowRm(record)">删除</span>
                </div>
              </a-table>
            </CommonTable>
          </a-form-model-item>

          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="referencesAttachmentList" label="资料附件" prop="referencesAttachmentList" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                <UploadBtnStyle
                  :accept="['.doc', '.docx','.pdf','.xls','.xlsx','.ppt']"
                  :maxSize="20"
                  :limit="20"
                  :fileLists="iFrom.echoReferencesAttachmentList"
                  @handleSuccess="handleSuccessReferencesAttachment"
                ></UploadBtnStyle>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    </a-spin>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="saveChemicalIdentSafetyTips">保存</a-button>
          <a-button type="primary" class="m-r-15" :loading="loading" @click="submitBeforeFlow">提交</a-button>
        </div>
      </FixedBottom>
    </div>

    <!-- 添加列表弹窗 -->
    <AddCasNoModel
      v-model="addCasNoModelShow"
      :addCasNoModelData="addCasNoModelData"
      :moduleList="iFrom.temporaryFactoryChemicals"
      :requiredList="requiredList"
      :intoFactoryDate="iFrom.intoFactoryDate"
      @changeModuleList="changeModuleList"
      @intoFactoryDateAutoValidate="intoFactoryDateAutoValidate"
    />
    <!-- 流程选择人员弹窗 -->
    <SelNodeUser v-model="selNodeUserModelShow" :plainOptions="plainOptions" />
  </HasFixedBottomWrapper>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import AddCasNoModel from "./components/addCasNoModel.vue";
import SelNodeUser from "./components/selNodeUser.vue";
import { addTransientChemicalsApi, getTransientChemicalsAddDetailApi, changeTransientChemicalsApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail,PushTask } from '@/services/api'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveNodeUser, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import StaffOrDept from "@/components/staffOrDept";

export default {
  components: { FixedBottom, AddCasNoModel, UploadBtnStyle, SelNodeUser, StaffOrDept },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      deptTreeId: undefined,
      userTreeFields: { value: 'key' },
      checkedTreeNode: [],
      DEPLOYID: '',
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
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
        boeAssume: [{ required: true, message: "业务担当不能为空", trigger: "change" },],
        tradeName: [{ required: true, message: "厂商名称不能为空", trigger: "change" },],
        transportPerson: [{ required: true, message: "厂商化学品运送人员不能为空", trigger: "change" },],
        tradeTel: [{ required: true, message: "厂商联系方式不能为空", trigger: "change" },],
        intoFactoryDate: [{ required: true, validator: this.intoFactoryDateValidator, trigger: "change" },],
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
          title: "化学品用途",
          dataIndex: "chemicalUse",
          key: "chemicalUse",
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
          title: "入厂数量",
          dataIndex: "intoFactoryNum",
          key: "intoFactoryNum",
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
          dataIndex: "chemicalsUnit",
          key: "chemicalsUnit",
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
          title: "化学品使用地点",
          dataIndex: "useLocation",
          key: "useLocation",
          width: 180,
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
          title: "化学品使用防护措施",
          dataIndex: "protectiveMeasures",
          key: "protectiveMeasures",
          width: 200,
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
          title: "化学品使用人员",
          dataIndex: "usePerson",
          key: "usePerson",
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
          width: 180,
        },
        {
          title: "化学品临时储存位置",
          dataIndex: "storageLocation",
          key: "storageLocation",
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
          width: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
      // 是否出厂
      requiredList: [],
      // 流程人员
      plainOptions: [],
      // 流程选择人员弹窗
      selNodeUserModelShow: false,
      // 提交所需要的流程节点信息
      flowData: {},
    }
  },
  created() {
    // 是否出厂字典
    this.requiredList = dictionary("required");
    // console.log('是否出厂字典', this.requiredList);
    // 流程key
    this.DEPLOYID = this.getChemicalDictValue("approvalType", 'TEMPAPPROVAL');
    this.userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      let adminDeptName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptName;
      this.iFrom.deptId = adminDeptId ? adminDeptId: ''
      this.$set(this.iFrom, 'deptName', adminDeptName ? adminDeptName : '');
    }
    this.userId = this.userInfo.userId;
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.$route.query.temporaryEntryId
    },
    // 列表化学品出厂日期
    outFactoryDateLatter() {
      let outDataList = cloneDeep(this.iFrom.temporaryFactoryChemicals)
      let outData = undefined
      outDataList = outDataList.filter(item => {
        return item.outFactoryDate
      })
      if (outDataList.length) {
        //倒序
        outDataList.sort(function (a, b) {
          return a.outFactoryDate < b.outFactoryDate ? 1 : -1;
        })
        outData = outDataList[0].outFactoryDate
      }
      return outData
    },
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  methods: {
    getTreeData(value) {
      this.iFrom.boeAssume = value.treeIdList;
      if (!formValidator.formItemValidate(this, "boeAssume", "ruleForm")) {
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
      let temporaryEntryId = this.$route.query.temporaryEntryId
      let apiData = { temporaryEntryId }
      return new Promise((resove, rej) => {
        getTransientChemicalsAddDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.temporaryFactoryChemicals.forEach(item => {
              item.guid = this.guid()
            })
            // 业务担当处理
            iFrom.boeAssume = JSON.parse(iFrom.boeAssume)
            this.checkedTreeNode = iFrom.boeAssume;
            // 资料附件-回显
            iFrom.referencesAttachmentList = this.handleFileIdS(iFrom.echoReferencesAttachmentList)
            iFrom.echoReferencesAttachmentList = this.handleFileRedisplay(iFrom.echoReferencesAttachmentList)
            this.iFrom = iFrom
            return iFrom
          })
          .then(resIFrom => {
            // 获取已选择的组织机构回显
            return this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptId)
          })
          .then(() => {
            resove()
          })
          .catch(err => {
            rej()
          })
      })
    },
    // 所属组织修改
    corporationChange(val, deptId) {
      this.deptTreeId = deptId
      this.checkedTreeNode = []
      this.$set(this.iFrom, 'boeAssume', [])
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
      let apiData = {
        ...this.iFrom,
        handler: handler.join(),
        ...this.flowData,
      }
      // 草稿 1-是，2-否
      apiData.draftStatus = 2
      // 业务担当处理
      apiData.boeAssume = JSON.stringify(apiData.boeAssume)
      apiData.intoFactoryDate = dayJs(apiData.intoFactoryDate).format("YYYY-MM-DD")
      console.log(555555555, this.isAddPage)
      const apiName = this.isAddPage ? addTransientChemicalsApi : changeTransientChemicalsApi
      return apiName(apiData)
        .then(res => {
          let id = res.data.id;
          if (id) {
            this.pushTask(id, handler);
          }
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/transientChemicals' })
        })
        .catch(err => {
          // 失败-保存到草稿箱
          this.saveChemicalIdentSafetyTips()
        })
        .finally(() => {
          // this.cancelLoading();
        })
    },
    // 代办推送
    async pushTask(id, handler) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/ehsGerneralManage/cooperationPartner/transientChemicalsHandle&temporaryEntryId=${id}`
      const pushTask = await PushTask({
        title: "临时化学品入厂审批",
        approval: 'transientChemicals',
        userId: handler.join(),
        docId: this.flowData.processId,
        taskId: this.flowData.taskId,
        url: url,
        docNumber: this.flowData.docCode || '',
      })
    },
    // 保存api
    saveChemicalIdentSafetyTips() {
      // console.log(this.iFrom);
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }
      let apiData = { ...this.iFrom }
      // 草稿 1-是，2-否
      apiData.draftStatus = 1
      // 业务担当处理
      apiData.boeAssume = JSON.stringify(apiData.boeAssume)
      apiData.intoFactoryDate = dayJs(apiData.intoFactoryDate).format("YYYY-MM-DD")
      const apiName = this.isAddPage ? addTransientChemicalsApi : changeTransientChemicalsApi
      this.handleLoadingTwo();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/transientChemicalsDraft' })
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
    // 化学品入厂日期
    intoFactoryDateValidator(rule, value, callback) {
      let { required } = rule
      if (!value) {
        required ? callback(new Error(`化学品入厂日期不能为空`)) : callback();
      } else if (this.outFactoryDateLatter) {
        if (dayJs(this.outFactoryDateLatter).diff(dayJs(value).format('YYYY-MM-DD'), 'hour') < 0) {
          required ? callback(new Error(`入厂日期不能晚于出场日期`)) : callback();
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 化学品入厂日期主动校验
    intoFactoryDateAutoValidate() {
      setTimeout(() => {
        this.iFrom.intoFactoryDate && formValidator.formItemValidate(this, 'intoFactoryDate', 'ruleForm')
      }, 100);
    },
    // 添加一行
    openAddCasNoModel(row) {
      this.addCasNoModelData = row ? row : {}
      this.addCasNoModelShow = true;
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
    // 修改表格某一行
    tableRowEdit(row) {
      this.addCasNoModelData = row
      this.addCasNoModelShow = true;
    },
    // 删除表格某一行
    tableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.temporaryFactoryChemicals = this.iFrom.temporaryFactoryChemicals.filter(item => {
            return item.guid != row.guid
          })
          formValidator.formItemValidate(this, 'temporaryFactoryChemicals', 'ruleForm')
        },
      });
    },
    // 修改主要成分table数据-添加一行
    changeModuleList(moduleDataList) {
      this.iFrom.temporaryFactoryChemicals = moduleDataList
      formValidator.formItemValidate(this, 'temporaryFactoryChemicals', 'ruleForm')
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