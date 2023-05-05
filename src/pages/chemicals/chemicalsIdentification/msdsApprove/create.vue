<template>
<div class="pe-book-container" :class="[showRightLog ? 'resolve-page' : '']">
  <HasFixedBottomWrapper>
    <div class="arc">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="申请人" prop="applicant" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input disabled v-model="form.applicant" placeholder="请输入申请人"></a-input>
            </a-form-model-item>
            <CommonSearchItem ref="commonSearchItem" :disabled="disabled" :CommonFormInline="form" :rules="rules" @corporationDeptChange="corporationDeptChange"
            :notTablePage="true" :hasDepartment="true" deptLabel="申请人部门" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonSearchItem>
            <a-form-model-item label="标题" prop="title" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model="form.title" placeholder="请输入标题" :maxLength="30" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <h3 class="title-h3"><i class="v-line-icon"></i>MSDS资料信息</h3>
          <DashBtn v-if="!disabled">
            <div>
              <a-button type="dashed" size="small" @click="addRow">
                <a-icon type="plus" />新增一行
              </a-button>
            </div>
          </DashBtn>
        </a-row>
          <div class="table-container" :class="[showRightLog ? 'resolve-page' : '']">
            <CommonTable :noPaging="true">
              <a-table :columns="columns" :scroll="{ x: 600 }" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
                <div slot="chemicalLabel" slot-scope="record">
                  {{getChemicalLabel(record.chemicalName)}}
                </div>
                <div slot="formLabel" slot-scope="record">
                  {{getFormLabel(record.form)}}
                </div>
                <div slot="userDepartment" slot-scope="record">
                  {{(record.userDepartment || []).join()}}
                </div>
                <div slot="validityTime" :class="[isOverdue(record.validityTime) ? 'overdue-date' : '']" slot-scope="record">
                  {{record.validityTime}}
                </div>
                <div slot="action" slot-scope="text,record,index">
                  <!-- <span class="color-0067cc cursor-pointer" @click="upload(record, index)">资料上传</span> -->
                  <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="edit(record, index)">编辑</span>
                  <span class="color-0067cc cursor-pointer" v-if="disabled" @click="edit(record, index)">查看</span>
                  <span class="color-ff4d4f cursor-pointer" v-if="!disabled" @click="deleteRow(record, index)">删除</span>
                  
                </div>
              </a-table>
            </CommonTable>
          </div>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="附件" prop="fileId" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadEhs :maxSize="20" :onlyShow="disabled" :accept="accept" @handleSuccess="handleSuccess" :fileLists="form.fileId"></UploadEhs>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      </a-spin>
    </div>
    <div slot="fixedBottom" v-if="!isResolve && !disabled">
      <FixedBottom class="fixed-button-container">
        <a-button @click="reback">返回</a-button>
        <a-button type="primary" @click="onSave">保存</a-button>
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </FixedBottom>
    </div>
    <div slot="fixedBottom" v-if="isResolve">
      <FixedBottom class="fixed-button-container">
        <a-button @click="reback">返回</a-button>
        <a-button type="primary" @click="reject">驳回</a-button>
        <a-button type="primary" @click="approved">通过</a-button>
      </FixedBottom>
    </div>
    <div slot="fixedBottom" v-if="isView">
      <FixedBottom class="fixed-button-container">
        <a-button @click="reback">返回</a-button>
      </FixedBottom>
    </div>
    <AddEditModal :disabled="disabled" :treeData="treeData" ref="addModuleRef" :moduleVisible.sync="moduleVisible" @callback="moduleCallback"/>
    <CommonModal title="办理" :visible="chooseStaffVisible" :cancelFn="chooseStaffCancle">
      <div v-show="nodeName" class="pd-b-16">下一节点：{{ nodeName }}</div>
      <div>
        <div>办理人：</div>
        <a-checkbox-group v-model="staffArr" :options="plainOptions" />
      </div>
      <template slot="btn">
        <a-button type="primary" @click="chooseStaffConfirm">发送</a-button>
        <a-button class="m-l-15" @click="chooseStaffCancle">取消</a-button>
      </template>
    </CommonModal>
    <CommonModal title="办理" :visible="rebackVisable" :cancelFn="nextCancle">
      <div class="pd-b-16">状态：{{status == "0" ? "审批驳回" : "审批通过"}}</div>
      <div>
        <div>审批意见</div>
        <a-textarea placeholder="请输入审批意见" v-model="rebackMsg" allowClear :maxLength="500" />
      </div>
      <template slot="btn">
        <a-button type="primary" @click="nextConfirm">下一步</a-button>
        <a-button class="m-l-15" @click="nextCancle">取消</a-button>
      </template>
    </CommonModal>
  </HasFixedBottomWrapper>
  <div class="right-side" v-if="showRightLog">
    <OPLog :data="opData"/>
  </div>
</div>
</template>

<script>
import OPLog from '@/pages/occupationHealth/physicalExam/physicalExamManage/comp/OPLog'
import FixedBottom from "@/components/commonTpl/fixedBottom"
import { formValidator } from "@/utils/clx-form-validator.js"
import UploadEhs from "@/components/upload/uploadBtnStyle.vue"
import AddEditModal from './comp/AddEditModal'
import oldDictionary from '@/utils/dictionary'
import dictionary from '@/utils/newDictionary'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveNodeUser, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail, getFlowLogApi,PushTask } from '@/services/api'
import { getQueryVariable } from "@/utils/util.js";
import { debounce } from 'lodash'
import moment from 'moment'
// const DEPLOYID = '6bea8bfa-29c6-11ed-aa43-144f8a5f2397'//'abf92aa9-283e-11ed-82ff-144f8a5f2397'
// const DEPLOYID = process.env.VUE_APP_MSDS_APPROVE_DEPLOYID
export default {
  components: { FixedBottom, UploadEhs, AddEditModal, OrganizeLazyTree, OPLog },
  data() {
    return {
      labelCol: { span: 7 }, // 设置左边label宽度
      wrapperCol: { span: 15 }, // 设置右边表单宽度
      accept: ['.doc', '.docx' ,'.pdf', '.xls', '.xlsx', '.ppt'],
      curIndex: -1,
      rebackVisable: false,
      rebackMsg: '',
      chooseStaffVisible: false,
      tableDataList: [],
      staffArr: [],
      plainOptions: [],
      status: '',//审批状态
      nodeName: '',
      spinning: true,
      opData: [],
      form: {
        fileId: [],
        applicant: undefined,
        title: undefined,
        applicationDepartmentId: undefined,
        siteCode: undefined
      },
      userId: '',
      treeData: [],
      orgnizeOptions: dictionary('organize'),
      chemicalNameOptions: dictionary('chemical'),
      formOptions: dictionary('form'),
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      moduleVisible: false,
      moduleData: {},
      taskId: null,
      infoStatus: null,
      consoleOrganizeTreeList:[],
      columns:  [
        {
          title: '化学品名称',
          scopedSlots: { customRender: 'chemicalLabel' },
          width: 150
        },{
          title: '形态',
          scopedSlots: { customRender: 'formLabel' },
          width: 150
        },{
          title: '主要成分',
          dataIndex: 'mainComponents',
          width: 150
        },{
          title: '危险性',
          dataIndex: 'danger',
          width: 150
        },{
          title: '使用部门',
          scopedSlots: { customRender: 'userDepartment' },
          width: 150
        },{
          title: '供应厂商',
          dataIndex: 'supplier',
          width: 150
        },{
          title: '资料名称',
          dataIndex: 'infoName',
          width: 150
        },{
          title: '版本',
          dataIndex: 'version',
          width: 150
        },{
          title: '有效期',
          scopedSlots: { customRender: 'validityTime' },
          width: 150
        },{
          title: '资料文件',
          dataIndex: 'infoFile',
          width: 150
        },{
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      treeData: [],
      DEPLOYIDOption: dictionary('approvalType') || [],
      createUserId: '',
      processId: '',
      docCode: '',
      rules: {
        applicant: [
          { required: true, maxLength: 30, minLength: 2, text: "申请人名称", trigger: "blur" },
        ],
        applicationDepartmentId: [
          { required: true, message: "申请人部门不能为空", trigger: "change" },
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "change" },
        ],
        siteCode: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ]
      },
      
    };
  },
  created() {
    this.setRouterCode('msdsApprove')
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
  },
  mounted() {
    this.init()
  },
  computed: {
    DEPLOYID() {
      return (this.DEPLOYIDOption.find(item => {
        return item.dictLabel === 'MSDSAPPROVAL'
      }) || {}).dictValue
    },
    showRightLog() {
      return this.isResolve || this.$route.query.type === 'approveView'
    },
    corporationList() {
      return this.$store.state.setting.corporationList
    },
    // MSDSAPPROVAL() {
    //   return this.$store.state.setting.MSDSAPPROVAL
    // },
    disabled() {
      return this.$route.meta && (this.$route.meta.isView || this.$route.meta.isResolve)
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    }
  },
  methods: {
    async init() {
      if (this.isCreate) {
        //新建赋默认值
        this.getUserInfo()
        this.spinning = false
      }
      if (!this.isCreate) {
        Promise.all([this.getMsdsApproveDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
        //编辑 | 查看 | 处理，回显
      }
        // 获取页面详情和组织机构
      
      // this.getOrgTreeData()
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'applicationDepartmentId', 'ruleForm')
    },
    isOverdue(date) {
      if (!date || typeof date !== 'string') {
        return false
      }
      let todateStr = moment().format("YYYY-MM-DD")
      let todate = new Date(todateStr).getTime()
      let targetDate = new Date(date).getTime()
      if (targetDate < todate) {
        return true
      }
      return false
    },
    getChemicalLabel(val) {
      return ((this.chemicalNameOptions || []).find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
    getFormLabel(val) {
      return ((this.formOptions || []).find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
    getUserInfo() {
      let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
      let user = userInfo.user || {}
      this.form.applicant = user.jobNumber ? user.name + '/' + user.jobNumber : user.name
      this.form.applicantId = user.userId
      this.form.applicationDepartmentId = user.adminDeptId || undefined
      if (this.getCommonAddOrgnizeList && this.getCommonAddOrgnizeList.length > 0) {
        this.form.corporationId = this.getCommonAddOrgnizeList[0].id;
        this.form.deptId = user.adminDeptId || undefined
        this.form.deptName = user.adminDeptName || undefined
        this.$refs.commonSearchItem.corporationChange(this.getCommonAddOrgnizeList[0].id, user.adminDeptId)
      }
      this.form = { ...this.form }
    },
    async getOrgTreeData() {
      const { code, data } = await getOrganizeList()
      if (+code === 20000) {
        this.treeData = [data]
      }
    },
    treeChange(value) {
      this.form.applicationDepartmentId = value
    },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // handleSiteChange(val) {
    //   this.form.site = (this.orgnizeOptions.find(item => {
    //     return item.dictValue === val
    //   }) || {}).dictLabel
    // },
    async getMsdsApproveDetail() {
      let para = {
        id: this.$route.query.id || getQueryVariable("msdsApproveId")
      }
      const { code, data } = await msdsApproveDetail(para)
      if (+code === 20000) {
        // const { applicant, applicantId, applicationDepartmentId, applicationDepartment, chemicalList, siteCode, fileId } = data
        this.form.applicant = data.applicant
        this.form.applicantId = data.applicantId
        this.form.applicationDepartmentId = data.applicationDepartmentId
        this.form.applicationDepartment = data.applicationDepartment
        this.tableDataList = data.chemicalList || []
        this.form.siteCode = data.siteCode
        this.form.title = data.title
        this.form.centerId = data.centerId;
        this.form.corporationId = data.corporationId;
        this.form.deptId = data.deptId;
        
        this.createUserId = data.createUserId
        if (this.showRightLog) {
          let handler = data.handler ? data.handler.split(',') : []
          this.getOpLog(data.processId, handler)
        }
        this.docCode = data.code;
        this.processId = data.processId
        if (data.fileId && typeof data.fileId === 'string') {
          this.form.fileId = JSON.parse(data.fileId) || []
        } else {
          this.form.fileId = JSON.parse(data.fileId) || []
        }
        this.infoStatus = data.infoStatus
        this.taskId = data.taskId
        this.form = { ...this.form };
        return this.$refs.commonSearchItem.corporationChange(this.form.corporationId, this.form.deptId)
      }
    },
    async getOpLog(processId, handler) {
      let para = {
        processInstanceId: processId,
        handler: handler
      }
      const { code, data } = await getFlowLogApi(para)
      if (+code === 20000) {
        this.opData = data || []
        console.log(data, 'data')
      }
    },
    addRow() {
      this.moduleData = {}
      this.curIndex = -1
      this.moduleVisible = true
      this.$nextTick(() => {
        this.$refs.addModuleRef.initData()
      })
    },
    deleteRow(row, index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: ()=> {
          this.tableDataList.splice(index, 1)
        }
      })
    },
    reject() {
      this.status = 0
      this.rebackMsg = ''
      this.rebackVisable = true
    },
    nextCancle() {
      this.rebackVisable = false
    },
    reback() {
      this.setKeepalive(true)
      if(this.isEdit){
        this.$router.go(-1)
      }else{
        this.$router.push({
          path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApprove'
        })
      }
    },
    async nextConfirm() {
      this.rebackVisable = false
      if (this.status === 0) {
        //驳回
        const { code } = await this.approveSavaDraft()
        if ( code === 20000) {
          this.$antMessage.success('驳回成功')
          this.$router.push({
            path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApprove'
          })
        }
      } else {
        // 处理通过下一步
        const { code, data } = await this.getNextTask(this.taskId, this.infoStatus)
        if (+code !== 20000) {
          return
        }
        this.infoStatus = data.id || ''//更新获取下一节点
        if (this.infoStatus.indexOf('endEvent_') !== -1) {
          //最后一个节点通过后走归档操作
          this.lastNodeAction()
          //归档
        } else {
          //根据下一节点获取处理人员
          this.getUserNodeInfo(this.infoStatus)
          this.chooseStaffVisible = true
        }
        
      }
    },
    // 最后一个节点审批通过 + 归档
    async lastNodeAction() {
      const { code: resolveCode, data: resolveData } = await this.approvedTask(this.taskId, this.infoStatus)
      if (+resolveCode !== 20000) {
        return
      }
      this.taskId = resolveData.taskId//更新taskId
      //归档
      let para = {
        ...this.form,
        id: this.$route.query.id || getQueryVariable("msdsApproveId"),
        chemicalList: this.tableDataList,
      }
      const { code, data } = await msdsApproveSaveFiling(para)
      if (+code === 20000) {
        this.$antMessage.success('归档成功')
        this.$router.push({
          path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApprove'
        })
      }
    },
    approved() {
      this.status = 1
      this.rebackVisable = true
    },
    chooseStaffCancle() {
      this.chooseStaffVisible = false
    },
    edit(row, index) {
      this.curIndex = index
      this.moduleVisible = true
      this.$nextTick(item => {
        this.$refs.addModuleRef.loadData({ ...row })
      })
    },
    moduleCallback(data) {
      if (this.curIndex !== -1) {
        //编辑
        this.tableDataList.splice(this.curIndex, 1, data)
      } else {
        //新建
        this.tableDataList.push(data)
      }
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData
    },
    handleSuccess(file) {
      this.form.fileId = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate(valid => {
          // resolve(valid)
          if (!valid) {
            resolve(valid)
            return
          }
          if (!this.tableDataList.length) {
            this.$antMessage.warning('请添加MSDS资料信息')
            resolve(false)
            return 
          }
          resolve(true)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    
    //驳回存草稿
    approveSavaDraft() {
      let para = {
        id: this.$route.query.id || getQueryVariable("msdsApproveId"),
        opinion: this.rebackMsg
      }
      return msdsApproveSavaDraft(para)
    },
    //新建页面获取infoStatus
    getNodeDetail(infoStatus) {
      let para = {
        deploymentId: this.DEPLOYID,
        nodeId: infoStatus
      }
      return GetNodeDetail(para)
    },
    //获取首节点信息
    getFirstNode() {
      let para = {
        deployId: this.DEPLOYID
      }
      return GetFirstNode(para)
    },
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
    async getUserNodeInfo(infoStatus) {
      //根据状态获取下一节点用户信息
      let para = {
        node: infoStatus,
        userId: this.createUserId || '',
        corporationId:this.form.corporationId || undefined
      }
      const {code, data} = await msdsApproveNodeUser(para)
      if (+code === 20000) {
        this.plainOptions = (data || []).map(item => {
          const { userId: value, name: label } = item 
          return {
            value,
            label
          }
        })
      }
    },
    //处理 获取下一节点infoStatus信息
    getNextTask(taskId, infoStatus) {
      let para = {
        taskId: taskId,
        param: {}
      }
      para.param[infoStatus] = infoStatus
      return GetNextTask(para)
    },
    /**
     * @description: 审批通过
     */    
    approvedTask(taskId, infoStatus) {
      let para = {
        taskId: taskId,
        param: {},
        userId: this.userId,
        msg: this.rebackMsg
      }
      para.param[infoStatus] = infoStatus
      return ApprovedTask(para)
    },
    //发送
    chooseStaffConfirm: debounce(async function() {
      if (!this.staffArr.length) {
        this.$antMessage.warning('请选择办理人')
        return
      }
      if (this.isResolve) {
        //处理的话走一个审批通过
        const { code: resolveCode, data: resolveData } = await this.approvedTask(this.taskId, this.infoStatus)
        if (+resolveCode !== 20000) {
          return
        }
        this.taskId = resolveData.taskId//更新taskId
      }
      //提交 | 通过 发送(新建|编辑|处理，发送)
      let para = {
        ...this.form,
        chemicalList: this.tableDataList,
        taskId: this.taskId,
        infoStatus: this.infoStatus,
        isDraft: 0,
        processId: this.processId,
        handler: this.staffArr.join()//处理人
      }
      if (this.isEdit || this.isResolve) {
        para.id = this.$route.query.id || getQueryVariable("msdsApproveId")
      }
      if (this.isResolve) {
        para.opinion = this.rebackMsg
      }
      let api = (this.isEdit || this.isResolve) ? msdsApproveUpdate : msdsApproveSave //编辑更新 | 新建保存
      const { code,data } = await api(para)
      //处理的发送
      if (+code === 20000) {
        let msg = this.isEdit ? '提交成功' : '通过成功'
        this.$antMessage.success(msg)
        let id = data.id;
        console.log("----------",id);
        if(id) {
          this.pushTask(id);
        }
        this.chooseStaffVisible = false
        this.$router.push({
          path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApprove'
        })
      }
    },300),
    // 代办推送
    async pushTask(id) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApproveResolve&msdsApproveId=${id}`
      const pushTask = await PushTask({
        title: "化学品MSDS审批",
        approval:'msdsApprove',
        userId: this.staffArr.join(),
        docId: this.processId,
        taskId: this.taskId,
        url: url,
        docNumber: this.docCode || '',   //业务id
      })
    },
    //提交
    async onSubmit() {
      console.log(this.form)
      let valid = await this.validate()
      if (!valid) {
        return
      }
      const { code, data } = await this.getFirstNode()
      if (+code !== 20000) {
        return
      }
      this.infoStatus = data.id
      this.getNodeDetail(this.infoStatus).then(res => {
        if (+res.code === 20000) {
          this.nodeName = data.nodeName
        }
      })
      this.getUserNodeInfo(this.infoStatus)
      let res = await this.createProcessData(this.infoStatus)
      if (+res.code === 20000) {
        this.chooseStaffVisible = true
        this.processId = (res.data || {}).processId
        this.taskId = (res.data || {}).taskId
      }
    },
    //保存
    async onSave() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      let para = {
        ...this.form,
        isDraft: 1,
        chemicalList: this.tableDataList,
      }
      if (this.isEdit) {
        para.id = this.$route.query.id || getQueryVariable("msdsApproveId")
      }
      let api = this.isEdit ? msdsApproveUpdate : msdsApproveSave //编辑更新 | 新建保存
      const { code } = await api(para)
      if (+code === 20000) {
        this.$router.push({
          path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApproveDraftList'
        })
      }
    },
  },
};
</script>

<style scoped lang='less'>
.resolve-page{
  /deep/.fixed-bottom{
    width: calc(100vw - 812px);
  }
}
.pe-book-container{
  display: flex;
  width:100%;
}
.left-side{
  flex:1;
  width:0;
}
.right-side{
  margin-top:40px;
  flex-basis: 426px;
  background: #FCFCFC;
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px 0px 0px 4px;
  margin-left: 20px;
  overflow: auto;
}
.arc {
  margin-top:40px;
  width: 100%;
}
.table-container{
  width: calc(100vw - 340px);
  margin-top: 10px;
}
.resolve-page.table-container{
  width: calc(100vw - 740px);
}
.title-h3{
  display: flex;
  align-items: center;
}
.overdue-date{
  color: #f00;
}
.v-line-icon{
  display: inline-block;
  width:2px;
  height: 14px;
  margin-right:5px;
  background:#0067cc;
}
.active {
  background: #e9f4ff;
  color: #0067cc;
  font-weight: 600;
  &:before {
    border-color: transparent transparent transparent #e9f4ff;
  }
}
</style>