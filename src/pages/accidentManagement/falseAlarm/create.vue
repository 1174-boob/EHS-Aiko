<template>
  <div class="pe-book-container" :class="[showRightLog ? 'resolve-page' : '']">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <HasFixedBottomContainer>
        <a-form-model ref="ruleForm" class="ant-form-custom-disabled" :model="iFrom" :rules="rules" :colon="false">
          <a-row>
            <a-col :span="12">
              <!-- <CommonSearchItem
                  ref="commonSearchItem"
                  :disabled="disabled"
                  :CommonFormInline="iFrom"
                  :rules="rules"
                  :notTablePage="true"
                  :hasDepartment="true"
                  deptLabel="起草人部门"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  @corporationDeptChange="corporationDeptChange"
                  @departmentChange="departmentChange"
              ></CommonSearchItem>-->

              <CommonDept
                ref="commonSearchItem"
                :disabled="disabled"
                :CommonFormInline="iFrom"
                :rules="rules"
                :notTablePage="true"
                :hasDepartment="true"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                @corporationDeptChange="corporationDeptChange"
                @corporationChange="corporationChange"
              ></CommonDept>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="责任部门" prop="responseDeptId" :label-col="labelCol" :wrapper-col="wrapperCol">
                <DeptTree
                  :disabled="disabled"
                  :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'"
                  v-model="iFrom.responseDeptId"
                  :deptData="deptData"
                  @change="(id,name)=>saveDeptChange(id,name)"
                  allowClear
                ></DeptTree>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="deptId" label="起草人部门" prop="deptId" :label-col="labelCol" :wrapper-col="wrapperCol">
                <DeptTree :disabled="disabled" :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'" v-model="iFrom.deptId" :deptData="deptData" @change="departmentChange"></DeptTree>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="起草人" prop="applicant" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input disabled v-model="applicant" placeholder="请输入起草人"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="12">
              <a-form-model-item label="事件日期" prop="eventDate" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-date-picker :disabled="disabled" v-model="iFrom.eventDate" placeholder="请选择事件日期" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="事件时间" prop="eventTime" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-time-picker :disabled="disabled" v-model="iFrom.eventTime" format="HH:mm" valueFormat="HH:mm"></a-time-picker>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="事件地点" prop="eventLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input :disabled="disabled" v-model="iFrom.eventLocation" placeholder="请输入事件地点" :maxLength="255"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="事件类型" prop="eventType" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select :disabled="disabled" v-model="iFrom.eventType" placeholder="请选择事件类型">
                  <a-select-option v-for="item in eventTypeOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="事件经过" prop="eventHistory" :label-col="labelColAlone" :wrapper-col="wrapperColAlone">
                <a-textarea autoSize :maxLength="1000" :disabled="disabled" v-model="iFrom.eventHistory" placeholder="请输入事件经过"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="现场图片" prop="eventScenePicList" :label-col="labelCol" :wrapper-col="wrapperCol">
                <UploadCanRemove :disabled="disabled" ref="pictureListUploadCanRemove" :maxSize="5" :limit="1" :headImgs="iFrom.eventScenePicList" @handleSuccess="handleSceneSuccess"></UploadCanRemove>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="分析示意图" prop="eventAnalysisPicList" :label-col="labelCol" :wrapper-col="wrapperCol">
                <UploadCanRemove :disabled="disabled" ref="pictureListUploadCanRemove" :maxSize="5" :limit="1" :headImgs="iFrom.eventAnalysisPicList" @handleSuccess="handleAnalysisSuccess"></UploadCanRemove>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <h3 class="title-h3">
              <i class="v-line-icon"></i>事件原因分析和整改措施
            </h3>
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
                <div slot="reasonType" slot-scope="record">{{record.reasonType | userFilter('event_reason_type')}}</div>
                <div slot="action" slot-scope="text,record,index">
                  <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="edit(record, index)">编辑</span>
                  <span class="color-0067cc cursor-pointer" v-if="disabled" @click="edit(record, index)">查看</span>
                  <span class="color-ff4d4f cursor-pointer" v-if="!disabled" @click="deleteRow(record, index)">删除</span>
                </div>
              </a-table>
            </CommonTable>
          </div>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="举一反三" prop="eventExpand" :label-col="labelColAlone" :wrapper-col="wrapperColAlone">
                <a-textarea autoSize :disabled="disabled" v-model="iFrom.eventExpand" placeholder="请输入举一反三排查"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="附件" prop="enclosureList" :label-col="labelCol" :wrapper-col="wrapperCol">
                <UploadBtnStyle :maxSize="20" :onlyShow="disabled" :accept="accept" @handleSuccess="handleFileSuccess" :fileLists="iFrom.enclosureList"></UploadBtnStyle>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>

        <template slot="fixedBottom" v-if="!isResolve && !disabled">
          <FixedBottom class="fixed-button-container">
            <a-button @click="reback">返回</a-button>
            <a-button type="primary" @click="onSave(1)">保存</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
          </FixedBottom>
        </template>
        <template slot="fixedBottom" v-if="isResolve">
          <FixedBottom class="fixed-button-container">
            <a-button @click="reback">返回</a-button>
            <a-button type="primary" @click="showReject">驳回</a-button>
            <a-button type="primary" @click="showApproved">通过</a-button>
          </FixedBottom>
        </template>
        <template slot="fixedBottom" v-if="isView">
          <FixedBottom class="fixed-button-container">
            <a-button @click="reback">返回</a-button>
          </FixedBottom>
        </template>
      </HasFixedBottomContainer>
    </a-spin>

    <div class="right-side" v-if="showRightLog">
      <OPLog :data="opData" />
    </div>

    <AddEditModal :disabled="disabled" ref="addModuleRef" :moduleVisible.sync="moduleVisible" @callback="moduleCallback" />
    <ApproveModal @doApprove="doApprove" @doReject="doReject" :isReject="isReject" ref="approveModal" :approveVisible.sync="approveVisible" />
  </div>
</template>

<script>
import OPLog from './comp/OPLog'
import FixedBottom from "@/components/commonTpl/fixedBottom"
import ApproveModal from './comp/ApproveModal'
import { formValidator } from "@/utils/clx-form-validator.js"
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue"
import AddEditModal from './comp/AddEditModal'
import oldDictionary from '@/utils/dictionary'
import dictionary from '@/utils/newDictionary'
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue'
import { msdsGetUserInfo } from '@/services/chemicalMsds'
import { PushTask } from '@/services/api'
import { getQueryVariable } from "@/utils/util.js"
import { falseAlarmAdd, falseAlarmUpdate, falseAlarmDetail, falseAlarmProcess, falseAlarmLog } from '@/services/accident'
import { debounce } from 'lodash'
import moment from 'moment'
// const DEPLOYID = '6bea8bfa-29c6-11ed-aa43-144f8a5f2397'//'abf92aa9-283e-11ed-82ff-144f8a5f2397'
// const DEPLOYID = process.env.VUE_APP_MSDS_APPROVE_DEPLOYID
export default {
  components: { FixedBottom, UploadBtnStyle, AddEditModal, OPLog, UploadCanRemove, ApproveModal },
  data() {
    return {
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      labelColAlone: { span: 3 },
      wrapperColAlone: { span: 21 },
      accept: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt'],
      curIndex: -1,
      rebackVisable: false,
      rebackMsg: '',
      tableDataList: [],
      staffArr: [],
      plainOptions: [],
      status: '',//审批状态
      nodeName: '',
      spinning: true,
      approveVisible: false,
      isReject: false,//是否是驳回，否则通过
      opData: [],
      deptData: [],//责任部门选项
      iFrom: {
        enclosureList: [],
        eventScenePicList: [],
        eventAnalysisPicList: []
      },
      userId: '',
      treeData: [],
      orgnizeOptions: dictionary('organize'),
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      moduleVisible: false,
      moduleData: {},
      taskId: null,
      infoStatus: null,
      consoleOrganizeTreeList: [],
      columns: [
        {
          title: '原因类型',
          scopedSlots: { customRender: 'reasonType' },
          width: 150
        }, {
          title: '事件原因分析',
          dataIndex: 'reasonAnalysis',
          width: 150
        }, {
          title: '事件整改措施',
          dataIndex: 'rectificationMeasures',
          width: 150
        }, {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      DEPLOYIDOption: dictionary('approvalType') || [],
      createUserId: '',
      processId: '',
      rules: {
        responseDeptId: [
          { required: true, message: "请选择责任部门", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "请选择起草人部门", trigger: "change" },
        ],
        eventDate: [
          { required: true, message: "请选择事件日期", trigger: "change" },
        ],
        eventTime: [
          { required: true, message: "请选择事件时间", trigger: "change" },
        ],
        eventLocation: [
          { required: true, message: "请选择事件地点", trigger: "change" },
        ],
        eventType: [
          { required: true, message: "请选择事件类型", trigger: "change" },
        ],
        eventHistory: [
          { required: true, message: "请选择事件经过", trigger: "change" },
        ],
        eventExpand: [
          { required: true, message: "请输入举一反三排查", trigger: "change" },
        ]
      },

    };
  },
  created() {
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      let adminDeptName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptName;
      // this.iForm.deptId = adminDeptId ?[adminDeptId] : []
      // this.$set(this.iFrom, 'deptId', adminDeptId ? adminDeptId : []);
      // this.$set(this.iFrom, 'deptName', adminDeptName ? adminDeptName : []);
      this.iFrom.deptId = adminDeptId ? adminDeptId: ''
      this.iFrom.deptName = adminDeptName ? adminDeptName: ''
      console.log(this.iFrom.deptId,this.iFrom.deptName,'xxx');
    }
    this.setRouterCode('falseAlarm')
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
    },
    accidentId() {
      return this.$route.query.id || getQueryVariable('falseAlarmId')
    },
    applicant() {
      return this.iFrom.workNum ? this.iFrom.userName + '/' + this.iFrom.workNum : this.iFrom.userName
    },
    eventTypeOptions() {
      return dictionary('event_type')
    }
  },
  methods: {
    async init() {
      if (this.isCreate) {
        //新建赋默认值
        this.getUserInfo()
        this.spinning = false;
      }
      if (!this.isCreate) {
        Promise.all([this.getFastAlarmDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
        //编辑 | 查看 | 处理，回显
      }
    },
    // 组织机构-改变
    corporationChange(val, corporationDeptId) {
      this.$set(this.iFrom, 'responseDeptId', undefined)
      // this.$set(this.iFrom, 'deptId', undefined)
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'applicationDepartmentId', 'ruleForm')
    },
    getFormLabel(val) {
      return ((this.formOptions || []).find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
    departmentChange(value, label, extra) {
      let labelStr = Array.isArray(label) ? label.join(",") : label
      this.$set(this.iFrom, 'deptName', labelStr)
    },
    //所属组织变化获取起草人部门数据
    corporationDeptChange(value) {
      this.deptData = value
    },
    //保管部门change
    saveDeptChange(id, name) {
      //设置责任部门名称
      this.$set(this.iFrom, 'responseDept', name.join())
    },
    getUserInfo() {
      let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
      let user = userInfo.user || {}
      this.iFrom.applicant = user.jobNumber ? user.name + '/' + user.jobNumber : user.name
      this.iFrom.userId = user.userId
      this.iFrom.userName = user.name
      this.iFrom.workNum = user.jobNumber
      this.iFrom.applicationDepartmentId = user.adminDeptId || undefined
      if (this.getCommonAddOrgnizeList && this.getCommonAddOrgnizeList.length > 0) {
        this.iFrom.corporationId = this.getCommonAddOrgnizeList[0].orgId;
        // this.iFrom.deptId = user.adminDeptId || undefined
        // this.iFrom.deptName = user.adminDeptName || undefined
        this.$refs.commonSearchItem.corporationChange(this.getCommonAddOrgnizeList[0].orgId, user.adminDeptId)
      }
      this.iFrom = { ...this.iFrom }
    },
    // 代办推送
    async pushTask(id, userId, docNumber) {
      id = id || this.accidentId
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/emergencyManagement/accidentManagement/falseAlarmResolve&falseAlarmId=${id}`
      const pushTask = await PushTask({
        title: "虚惊未遂审批",
        approval: 'falseAlarmScrap',
        userId: userId,
        docId: id,
        taskId: id,
        url: url,
        docNumber: docNumber || '',   //业务id
      })
    },
    async getOrgTreeData() {
      const { code, data } = await getOrganizeList()
      if (+code === 20000) {
        this.treeData = [data]
      }
    },
    async getFastAlarmDetail() {
      let para = {
        accidentId: this.accidentId
      }
      const { code, data } = await falseAlarmDetail(para)
      if (+code === 20000) {
        let iFrom = {
          corporationId: data.corporationId,
          centerId: data.centerId,
          eventDate: data.eventDate,
          eventTime: data.eventTime,
          eventLocation: data.eventLocation,
          eventType: data.eventType,
          eventHistory: data.eventHistory,
          deptId: data.deptId,
          userName: data.userName,
          workNum: data.workNum,
          userId: data.userId,
          responseDeptId: data.responseDeptId,
          responseDept: data.responseDept
        }
        iFrom.eventScenePicList = (data.eventScenePicList || []).map(item => {
          return {
            id: item.id,
            uid: item.id,
            url: item.filePath,
            name: item.sourceFileName
          }
        })
        iFrom.eventAnalysisPicList = (data.eventAnalysisPicList || []).map(item => {
          return {
            id: item.id,
            uid: item.id,
            url: item.filePath,
            name: item.sourceFileName
          }
        })
        iFrom.enclosureList = (data.enclosureList || []).map(item => {
          return {
            id: item.id,
            uid: item.id,
            url: item.filePath,
            name: item.sourceFileName
          }
        })
        this.tableDataList = data.accidentsData || []
        iFrom.eventExpand = data.eventExpand
        if (this.showRightLog) {
          this.getOpLog()
        }
        // this.processId = data.processId
        // if (data.fileId && typeof data.fileId === 'string') {
        //   this.iFrom.fileId = JSON.parse(data.fileId) || []
        // } else {
        //   this.iFrom.fileId = JSON.parse(data.fileId) || []
        // }
        // this.infoStatus = data.infoStatus
        // this.taskId = data.taskId
        this.iFrom = { ...iFrom }
        return this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptId)
      }
      return this.$refs.commonSearchItem.corporationChange("");
    },
    async getOpLog(processId) {
      let para = {
        operateId: this.accidentId
      }
      const { data } = await falseAlarmLog(para)
      this.opData = data || []
    },
    addRow() {
      this.moduleData = {}
      this.curIndex = -1
      this.moduleVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addModuleRef.initData()
      // })
    },
    deleteRow(row, index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: () => {
          this.tableDataList.splice(index, 1)
        }
      })
    },
    reback() {
      this.setKeepalive(true)
      if(this.isEdit){
        this.$router.go(-1)
      }else{
        this.$router.push({
          path: '/safeManage/emergencyManagement/accidentManagement/falseAlarm'
        })
      }
    },
    showApproved() {
      this.isReject = false
      this.approveVisible = true
    },
    showReject() {
      this.isReject = true
      this.approveVisible = true
    },
    async approveProcess(approvalStatus = 1, remake = '') {
      let para = {
        operateId: this.accidentId,
        handerId: this.iFrom.userId,
        remake: remake,
        approvalStatus: approvalStatus
      }
      const { data } = await falseAlarmProcess(para)
      let msg = approvalStatus === 1 ? '审核通过成功' : '审核已驳回'
      this.$antMessage.success(msg)
      this.approveVisible = false
      if (approvalStatus === 1) {
        if (data && data.handler) {
          this.pushTask(null, data.handler, data.accidentCode)
        }
        this.$router.push({
          path: '/safeManage/emergencyManagement/accidentManagement/falseAlarm'
        })
      } else {
        this.$router.push({
          path: '/safeManage/emergencyManagement/accidentManagement/falseAlarmDarft'
        })
      }
    },
    //审核通过
    doApprove(remake) {
      this.approveProcess(1, remake)
    },
    //审核驳回
    doReject(remake) {
      this.approveProcess(2, remake)
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
    handleFileSuccess(file) {
      this.iFrom.enclosureList = file.map(item => {
        return {
          uid: item.uid,
          id: item.id,
          url: item.url,
          name: item.name
        }
      }) || []
    },
    handleSceneSuccess(file) {
      this.iFrom.eventScenePicList = file.map(item => {
        return {
          uid: item.uid,
          id: item.id,
          url: item.url,
          name: item.name
        }
      }) || []
    },
    handleAnalysisSuccess(file) {
      this.iFrom.eventAnalysisPicList = file.map(item => {
        return {
          uid: item.uid,
          id: item.id,
          url: item.url,
          name: item.name
        }
      }) || []
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            resolve(valid)
            return
          }
          if (!this.tableDataList.length) {
            this.$antMessage.warning('请添加事件原因分析和整改措施')
            resolve(false)
            return
          }
          resolve(true)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    //提交
    async onSubmit() {
      this.onSave(2)
    },

    //保存
    onSave: debounce(async function (draftStatus = 1) {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      let para = {
        ...this.iFrom,
        draftStatus: draftStatus,
        accidentsData: this.tableDataList,
      }
      para.eventDate = moment(this.iFrom.eventDate).format('YYYY-MM-DD')
      para.eventScenePicList = this.iFrom.eventScenePicList.map(item => {
        return item.id
      })
      para.eventAnalysisPicList = this.iFrom.eventAnalysisPicList.map(item => {
        return item.id
      })
      para.enclosureList = this.iFrom.enclosureList.map(item => {
        return item.id
      })
      if (this.isEdit) {
        para.accidentId = this.accidentId
      }
      let api = this.isEdit ? falseAlarmUpdate : falseAlarmAdd //编辑更新 | 新建保存
      const { data } = await api(para)
      if (draftStatus === 1) {
        this.$router.push({
          path: '/safeManage/emergencyManagement/accidentManagement/falseAlarmDarft'
        })
      } else {
        if (data) {
          this.pushTask(data.accidentId, data.handler, data.accidentCode)
        }
        this.$router.push({
          path: '/safeManage/emergencyManagement/accidentManagement/falseAlarm'
        })
      }
    }, 250, { leading: true, trailing: false }),

  },
};
</script>

<style scoped lang='less'>
/deep/.ant-calendar-picker {
  display: block;
}
/deep/.ant-time-picker {
  display: block;
  width: 100%;
  input {
    border: 1px solid #b0b0b0;
  }
}
.pe-book-container {
  display: flex;
  width: 100%;
  padding-top: 30px;
}
.right-side {
  flex: none;
  width: 426px;
  background: #fcfcfc;
  border: 1px solid rgba(244, 244, 244, 1);
  border-radius: 4px 0px 0px 4px;
  margin-left: 20px;
  overflow: auto;
}
@media screen and (max-width: 1366px) {
  .right-side {
    width: 270px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1620px) {
  .right-side {
    width: 326px;
  }
}
.arc {
  margin-top: 40px;
  width: 100%;
}
.table-container {
  width: calc(100vw - 300px);
  margin-top: 10px;
}
.resolve-page.table-container {
  width: calc(100vw - 700px);
}
.title-h3 {
  display: flex;
  align-items: center;
}
.fixed-button-container {
  // .ant-btn + .ant-btn {
  //   margin-left: 20px;
  // }
}
.overdue-date {
  color: #f00;
}
.v-line-icon {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-right: 5px;
  background: #0067cc;
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