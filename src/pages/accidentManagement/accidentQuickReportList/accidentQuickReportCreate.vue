<template>
  <div class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="flex-1 position-rel pd-b-100">
      <div class="scroll-center-box">
        <PageTitle>事故快报</PageTitle>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <div class="post-main">
            <a-form-model ref="iForm" :model="iForm" :rules="rules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row>
                <a-col :span="12">
                  <CommonDept ref="commonDept" :CommonFormInline="iForm" :rules="rules" :notTablePage="true" :hasDepartment="true" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="disabled"  @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
                  <a-form-model-item ref="applicant" label="申请人" prop="applicant">
                    <a-input disabled v-model="iForm.applicant" placeholder="请输入申请人"></a-input>
                  </a-form-model-item>
                  <a-form-model-item ref="deptId" label="申请人部门" prop="deptId">
                    <DeptTree
                      :disabled="disabled"
                      :placeholder="iForm.corporationId ? '请选择':'请输入申请人部门'"
                      v-model="iForm.deptId"
                      :deptData="treeData"
                      @change="applicantDeptChange"
                      allowClear
                    ></DeptTree>
                  </a-form-model-item>
                  <a-form-model-item ref="accidentDate" label="事故日期" prop="accidentDate">
                    <a-date-picker :disabled="disabled" style="width: 100%;" v-model="iForm.accidentDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="请选择事故日期" />
                  </a-form-model-item>
                  <a-form-model-item ref="accidentTime" label="事故具体时间" prop="accidentTime">
                    <a-time-picker :disabled="disabled" style="width: 100%;" v-model="iForm.accidentTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择事故具体时间" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="dutyDeptIdList" label="责任部门" prop="dutyDeptIdList">
                    <DeptTree
                      :disabled="disabled"
                      :placeholder="iForm.dutyDeptIdList ? '请选择':'请输入责任部门'"
                      v-model="iForm.dutyDeptIdList"
                      :deptData="treeData"
                      @change="deptChange"
                      multiple
                      allowClear
                    ></DeptTree>
                  </a-form-model-item>
                  <a-form-model-item ref="accidentLocation" label="事故地点" prop="accidentLocation">
                    <a-select :disabled="disabled" v-model="iForm.accidentLocation" placeholder="请选择事故地点">
                      <a-select-option v-for="item of accidentLocation" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item ref="propertyLoss" label="直接经济损失(元)" prop="propertyLoss">
                    <a-input :disabled="disabled" prefix="￥" placeholder="请输入直接经济损失(元)" v-model.trim="iForm.propertyLoss" @change="limitNumber('propertyLoss')" />
                  </a-form-model-item>
                  <a-form-model-item ref="accidentLevel" label="事故等级" prop="accidentLevel">
                    <a-select v-model="iForm.accidentLevel" placeholder="请选择事故等级" :disabled="disabled" allowClear>
                      <a-select-option v-for="notice of accidentLevelList" :value="notice.dictValue" :key="notice.dictValue">{{notice.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="accidentProcess" label="事故发生简要经过" prop="accidentProcess" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea :disabled="disabled" v-model.trim="iForm.accidentProcess" :maxLength="1000" placeholder="请输入事故发生简要经过"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="fileIdList" label="事故发生位置图片" prop="fileIdList" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <UploadCanRemove :disabled="disabled" key="1" ref="uploadPictureList1" :maxSize="5" :limit="20" :headImgs="iForm.fileReportIdList" @handleSuccess="handleSuccessPictograms(1)"></UploadCanRemove>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <StaffOrDept
                    ref="discoveryUserId"
                    :labelTitle="'事故发现人员'"
                    :treeRoles="rules"
                    :propKey="'discoveryUserId'"
                    :onPreview="isView"
                    :treePlaceholder="deptTreeIdFst?'请选择' : '请选择事故发现人员'"
                    :checkedTreeNode="checkedTreeNodeFst"
                    :deptTreeId="deptTreeIdFst"
                    :checkAbel="false"
                    @getTreeData="getTreeDataFst"
                  />
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="machineName" label="事故机器名称" prop="machineName">
                    <a-input :disabled="disabled" v-model="iForm.machineName" placeholder="请输入事故机器名称" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <StaffOrDept
                    ref="regionalDirectorId"
                    :labelTitle="'事发区域主管'"
                    :treeRoles="rules"
                    :propKey="'regionalDirectorId'"
                    :onPreview="isView"
                    :treePlaceholder="deptTreeIdSnd?'请选择' : '请选择事发区域主管'"
                    :checkedTreeNode="checkedTreeNodeSnd"
                    :deptTreeId="deptTreeIdSnd"
                    :checkAbel="false"
                    @getTreeData="getTreeDataSnd"
                  />
                </a-col>
                <a-col :span="12">
                  <StaffOrDept
                    ref="dutyDirectorId"
                    :labelTitle="'事故责任主管'"
                    :treeRoles="rules"
                    :propKey="'dutyDirectorId'"
                    :onPreview="isView"
                    :treePlaceholder="deptTreeIdTrd?'请选择' : '请选择事故责任主管'"
                    :checkedTreeNode="checkedTreeNodeTrd"
                    :deptTreeId="deptTreeIdTrd"
                    :checkAbel="false"
                    @getTreeData="getTreeDataTrd"
                  />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item ref="dutyDirectorContact" label="事故责任主管联系方式" prop="dutyDirectorContact">
                    <a-input :disabled="disabled" v-model="iForm.dutyDirectorContact" placeholder="请输入事故责任主管联系方式" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="personalInjury" label="是否有人员受伤" prop="personalInjury">
                    <a-select v-model="iForm.personalInjury" placeholder="请选择是否有人员受伤" :disabled="disabled" allowClear>
                      <a-select-option v-for="notice of personalInjury" :value="notice.key" :key="notice.key">{{notice.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <template title="受伤人员情况">
                <div>
                  <div class="m-t-20 border-b-e7">
                    <PageTitle>
                      受伤人员情况
                      <DashBtn>
                        <div style="margin-top:10px;">
                          <a-button :disabled="disabled" type="dashed" @click="openAddCasNoModel()">
                            <a-icon type="plus" />新增一行
                          </a-button>
                        </div>
                      </DashBtn>
                    </PageTitle>
                  </div>
                  <div class="m-t-20"></div>
                </div>
                <a-form-model-item ref="accidentAnalyseMeasuresList" label=" " prop="accidentAnalyseMeasuresList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                  <CommonTable :noPaging="true" :class="{'none-events': disabled}">
                    <a-table
                      style="width:100%;"
                      :columns="columns"
                      :scroll="{ x: 800 }"
                      :locale="{emptyText: emptyText}"
                      :data-source="iForm.accidentAnalyseMeasuresList"
                      :rowKey="(record, index)=>{return index}"
                      :pagination="false"
                    >
                      <div slot="reasonType" slot-scope="record">
                        {{getMappingValue(accidentReasonType, "dictValue", record.reasonType).dictLabel}}
                      </div>
                      <div slot="reasonCategory" slot-scope="record">
                        {{getMappingValue(accidentReasonClass, "dictValue", record.reasonCategory).dictLabel}}
                      </div>
                      <div slot="action" slot-scope="record">
                        <span class="color-0067cc cursor-pointer m-r-15" @click="tableRowEdit(record)">编辑</span>
                        <span class="color-0067cc cursor-pointer" @click="tableRowDel(record)">删除</span>
                      </div>
                    </a-table>
                  </CommonTable>
                </a-form-model-item>
              </template>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="measure" label="事故发生后采取措施及事故控制情况" prop="measure" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea :disabled="disabled" v-model.trim="iForm.measure" :maxLength="1000" placeholder="请输入抢救伤员、保护事故现场、才去防范数固扩大措施、事故改善的临时措施等"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </a-spin>
        <CommonModal title="受伤人员情况" :visible="addCasNoModelShow" :cancelFn="addModalCancle">
          <template slot="form">
            <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :colon="false" labelAlign="left">
              <a-form-model-item label="原因类型" prop="reasonType">
                <a-select v-model="addModleForm.reasonType" show-search placeholder="请选择" :filter-option="filterOptionMixin">
                  <a-select-option v-for="item in accidentReasonType" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="原因分类" prop="reasonCategory">
                <a-select v-model="addModleForm.reasonCategory" show-search placeholder="请选择">
                  <a-select-option v-for="item in accidentReasonClass" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="事故原因分析" prop="reasonAnalyse">
                <a-textarea :maxLength="1000" v-model="addModleForm.reasonAnalyse" placeholder="请输入事故原因分析"></a-textarea>
              </a-form-model-item>
              <a-form-model-item label="事故整改措施" prop="rectificationMeasures">
                <a-textarea :maxLength="1000" v-model="addModleForm.rectificationMeasures" placeholder="请输入事故整改措施"></a-textarea>
              </a-form-model-item>
            </a-form-model>
          </template>
          <template slot="btn">
            <a-button @click="addModalCancle">取消</a-button>
            <a-button class="m-l-15" type="primary" @click="addModalConfirm">确定</a-button>
          </template>
        </CommonModal>
      </div>
      <div :class="{'no-padding': !logData.length}" slot="fixedBottom" v-if="isCreate || isEdit || disabled">
        <FixedBottom>
          <div>
            <a-button @click="onCancle">返回</a-button>
            <a-button v-if="isCreate || isEdit" :loading="btnLoading" type="primary" @click="onSave" >保存</a-button>
            <a-button v-if="isCreate || isEdit" :loading="btnLoading" type="primary" @click="onSubmit">提交</a-button>
          </div>
        </FixedBottom>
      </div>
    </div>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom"
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import { formValidator } from "@/utils/clx-form-validator.js"
import { nanoid } from 'nanoid'
import { PushTask } from '@/services/api'
import { accidentReportAdd, accidentReportUpdate, accidentReportDetail, accidentEventHanderInfo } from '@/services/accident';
import { getQueryVariable } from "@/utils/util.js"
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import StaffOrDept from "@/components/staffOrDept";
import dictionary from '@/utils/dictionary'
export default {
  components: { FixedBottom, UploadCanRemove, StaffOrDept},
  mixins: [teableCenterEllipsis],
  data() {
    return {
      deptTreeIdFst: undefined,
      deptTreeIdSnd: undefined,
      deptTreeIdTrd: undefined,
      checkedTreeNodeFst: [],
      checkedTreeNodeSnd: [],
      checkedTreeNodeTrd: [],
      spinning: true,
      accidentType: [],
      accidentLocation: [],
      personalInjury: [],
      propertyLoss: [],
      accidentReasonType: [],
      addCasNoModelShow: false,
      addModleForm: {},
      addModleFormRules: {
        reasonType: [
          { required: true, message: "原因类型不能为空", trigger: "change" },
        ],
        reasonCategory: [
          { required: true, message: "原因分类不能为空", trigger: "change" },
        ],
        reasonAnalyse: [
          { required: true, message: "事故原因分析不能为空", trigger: "blur" },
        ],
        rectificationMeasures: [
          { required: true, message: "事故整改措施不能为空", trigger: "blur" },
        ],
      },
      columns: [
        {
          title: '受伤人员年资',
          scopedSlots: { customRender: 'reasonType' },
        },
        {
          title: '受伤人员',
          scopedSlots: { customRender: 'reasonCategory' },
        },
        {
          title: '初判是否为工伤',
          dataIndex: 'reasonAnalyse',
        },
        {
          title: '伤害部位/程度',
          dataIndex: 'rectificationMeasures',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
        },
      ],

      deployId: "",
      dataMsg: {},
      labelCol: { span: 8 }, // 设置左边label宽度
      wrapperCol: { span: 16 }, // 设置右边表单宽度
      accept: ['.doc', '.docx' ,'.pdf', '.xls', '.xlsx', '.ppt'],
      
      iForm: {
        dutyDeptIdList: [],
        dutyDeptNameList: [],
        injuryList: [],
      },
      rules: { // 调岗
        applicant: [
          { required: true, message: "申请人不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "申请人部门不能为空", trigger: "change" },
        ],
        accidentDate: [
          { required: true, message: "事故日期不能为空", trigger: "change" },
        ],
        accidentTime: [
          { required: true, message: "事故具体时间不能为空", trigger: "change" },
        ],
        accidentLocation: [
          { required: true, message: "事故地点不能为空", trigger: "change" },
        ],
        dutyDeptIdList: [
          { required: true, message: "责任部门不能为空", trigger: "change" },
        ],
        accidentLevelHurt: [
          { required: true, message: "人员伤害不能为空", trigger: "change" },
        ],
        accidentLevelLoss: [
          { required: true, message: "财产损失不能为空", trigger: "change" },
        ],
        accidentType: [
          { required: true, message: "事故类型不能为空", trigger: "change" },
        ],
        accidentProcess: [
          { required: true, message: "事故经过不能为空", trigger: "blur" },
        ],
        propertyLoss: [
          { required: true, message: "财产损失(元)不能为空", trigger: "blur" },
        ],
        oneFactToOther: [
          { required: true, message: "举一反三排查不能为空", trigger: "blur" },
        ],
        accidentDutyHandle: [
          { required: true, message: "事故责任处理不能为空", trigger: "blur" },
        ],
        accidentScenePictureList: [
          { required: true, message: "事故现场图片不能为空", trigger: "change" },
        ],
        fileIdList: [
          { required: true, message: "事故发生位置图片不能为空", trigger: "change" },
        ],
        dutyDirectorContact: [
          { required: true, message: "事故机器名称不能为空", trigger: "blur" },
        ],
        machineName: [
          { required: true, message: "事故责任主管联系方式不能为空", trigger: "blur" },
        ],
        personalInjury: [
          { required: true, message: "是否有人员受伤不能为空", trigger: "blur" },
        ],
        discoveryUserId: [
          { required: true, message: "事故发现人员不能为空", trigger: "blur" },
        ],
        regionalDirectorId: [
          { required: true, message: "事发区域主管不能为空", trigger: "blur" },
        ],
        dutyDirectorId: [
          { required: true, message: "事发区域主管不能为空", trigger: "blur" },
        ],
      },
      
      rebackVisable: false,
      rebackMsg: '',
      chooseStaffVisible: false,
      staffArr: [],
      plainOptions: [],
      approvalStatus: '',//审批状态
      processId: "",
      accidentDutyHandleShow: false,

      // 节点信息
      infoStatus: null,
      logData: [], // 日志数据
      userInfo: {},
      userId: "",
      pushPara: {}, // 推送参数
      treeData: [],
      processNode: "",
      btnLoading: false,
      isReject: false,//是否是驳回，否则通过
      approveVisible: false,
      accidentLevelList: [
        { dictLabel: '轻微事故', dictValue: '1' },
        { dictLabel: '一般事故', dictValue: '2' },
        { dictLabel: '严重事故', dictValue: '3' },
        { dictLabel: '重大事故', dictValue: '4' },
      ]
    };
  },
  async created() {
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      let adminDeptName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptName;
      this.iForm.deptId = adminDeptId ? adminDeptId: ''
      // this.iForm.deptName = adminDeptName ? adminDeptName: ''
      this.$set(this.iForm, 'deptName', adminDeptName ? adminDeptName : '');
      console.log(this.iForm.deptId,this.iForm.deptName,'xxx');
    }
    this.accidentType = this.getDictItemList("accident_type");
    this.accidentLocation = this.getDictItemList("accidentLocation");
    this.personalInjury = dictionary("personalInjury");
    this.propertyLoss = this.getDictItemList("accident_level_money");
    this.accidentReasonType = this.getDictItemList("accident_reason_type");
    this.accidentReasonClass = this.getDictItemList("accident_cause_classification");
    this.userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.userId = this.userInfo.userId;
  },
  mounted() {
    this.init()
  },
  computed: {
    disabled() {
      return this.$route.query && !(this.$route.meta.isCreate || this.$route.meta.isEdit)
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    },
    accidentReportId() {
      return this.$route.query.accidentReportId || getQueryVariable('accidentReportId')
    },
    isView() {
      return Boolean(this.$route.query.isView) || false
    }
  },
  methods: {
    getTreeDataFst(value) {
      let { treeIdList, treeNameAndCodeList } = value
      this.checkedTreeNodeFst = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let discoveryUserId = id
      let discoveryUserName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.iForm, 'discoveryUserId', discoveryUserId)
      this.departOrPerpleChange([discoveryUserName], 'discoveryUserName')
      formValidator.formItemValidate(this, "discoveryUserId", "iForm")
    },
    getTreeDataSnd(value) {
      let { treeIdList, treeNameAndCodeList } = value
      this.checkedTreeNodeSnd = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let regionalDirectorId = id
      let regionalDirectorName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.iForm, 'regionalDirectorId', regionalDirectorId)
      this.departOrPerpleChange([regionalDirectorName], 'regionalDirectorName')
      formValidator.formItemValidate(this, "regionalDirectorId", "iForm")
    },
    getTreeDataTrd(value) {
      let { treeIdList, treeNameAndCodeList } = value
      this.checkedTreeNodeTrd = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let dutyDirectorId = id
      let dutyDirectorName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.iForm, 'dutyDirectorId', dutyDirectorId)
      this.departOrPerpleChange([dutyDirectorName], 'dutyDirectorName')
      formValidator.formItemValidate(this, "dutyDirectorId", "iForm")
    },
    // 各部门改变
    departOrPerpleChange(lab, attrName) {
      this.$set(this.iForm, attrName, lab[0])
    },
    showApproved() {
      this.isReject = false
      this.approveVisible = true
    },
    showReject() {
      this.isReject = true
      this.approveVisible = true
    },
    corporationChange(a, b) {
      this.$set(this.iForm, "dutyDeptIdList", undefined);
      this.$set(this.iForm, "corporationDeptId", b);
      this.$set(this.iForm, "dutyDeptNameList", undefined);
      // this.$set(this.iForm, "deptId", undefined);
      // this.$set(this.iForm, "deptIdName", undefined);
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
    },
    deptChange(a,b,c) {
      // this.$set(this.iForm, "dutyDeptName", b && b[0]);
      this.$set(this.iForm, "dutyDeptNameList", b);
    },
    applicantDeptChange(a,b,c) {
      this.$set(this.iForm, "deptName", b && b[0]);
    },
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
    async init() {
      if (this.isCreate) {
        //新建赋默认值
        this.accidentDutyHandleShow = true;
        this.getUserInfo()
      }
      if (!this.isCreate) {
        Promise.all([this.getEchoData()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    getUserInfo() {
      let iForm = {
        applicant: this.userInfo.jobNumber ? this.userInfo.name + '/' + this.userInfo.jobNumber : this.userInfo.name,
        draftPersonId: this.userInfo.userId,
        draftPersonName: this.userInfo.name,
        draftPersonJobNumber: this.userInfo.jobNumber
      }
      this.iForm = { ...iForm, ...this.iForm };
      this.spinning = false;
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'dutyDeptIdList', 'iForm')
    },
    // 象形图图片上传
    handleSuccessPictograms(num) {
      let arr = [];
      arr = this.$refs.uploadPictureList1.fileList.map(item => {
        return item.id
      })
      this.$set(this.iForm, "fileIdList", arr);
      formValidator.formItemValidate(this, 'fileIdList', 'iForm')
    },
    // 添加一行
    openAddCasNoModel(row) {
      this.addCasNoModelShow = true;
    },
    addModalCancle() {
      this.addModleForm = {};
      this.addCasNoModelShow = false;
    },
    addModalConfirm() {
      if (!formValidator.formAll(this, 'addModleForm')){
        return;
      }
      let arr = this.iForm.accidentAnalyseMeasuresList;
      if (!Array.isArray(arr)) {
        arr = [];
      }
      arr.push({
        ...this.addModleForm,
        _id: nanoid()
      })
      this.$set(this.iForm, 'accidentAnalyseMeasuresList', arr)
      this.addModleForm = {};
      this.addCasNoModelShow = false;
      formValidator.formItemValidate(this, 'accidentAnalyseMeasuresList', 'iForm')
    },
    tableRowEdit(row) {
      this.addModleForm = { ...row };
      this.addCasNoModelShow = true;
    },
    tableRowDel(row) {
      let ind;
      for (let i = 0; i < this.iForm.accidentAnalyseMeasuresList.length; i++) {
        if (this.iForm.accidentAnalyseMeasuresList[i]._id == row._id) {
          ind = i;
          break;
        }
      }
      this.iForm.accidentAnalyseMeasuresList.splice(ind, 1);
    },
    // 编辑 | 查看 | 处理，获取回显数据
    async getEchoData() {
      let para = {
        accidentReportId: this.accidentReportId
      }
      accidentReportDetail(para).then(res => {
        let handleList = res.data.handleList || [];
        this.accidentDutyHandleShow = handleList.indexOf(this.userId) != -1;
        this.processNode = res.data && res.data.processNode;
        let iForm = res.data;
        this.infoStatus = iForm.nodeStatus;
        this.processId = iForm.processId;
        iForm.applicant = iForm.draftPersonJobNumber ? iForm.draftPersonName + '/' + iForm.draftPersonJobNumber : iForm.draftPersonName;
        this.checkedTreeNodeFst = iForm.discoveryUserId ? [iForm.discoveryUserId] : [];
        this.checkedTreeNodeSnd = iForm.regionalDirectorId ? [iForm.regionalDirectorId] : [];
        this.checkedTreeNodeTrd = iForm.dutyDirectorId ? [iForm.dutyDirectorId] : [];
        // 图片回显
        iForm.fileReportIdList = this.handleFileRedisplay(iForm.fileList);
        iForm.fileIdList = this.handleFileIdS(iForm.fileList);

        // 附件回显
        // iForm.echoFileList = this.handleFileRedisplay(iForm.fileList);
        // iForm.fileList = this.handleFileIdS(iForm.fileList);

        // 表格回显
        if (Array.isArray(iForm.accidentAnalyseMeasuresList)) {
          for (let i = 0; i < iForm.accidentAnalyseMeasuresList.length; i++) {
            iForm.accidentAnalyseMeasuresList[i]._id = nanoid();
          }
        }
        this.dataMsg = { ...iForm };
        this.iForm = { ...iForm };
        this.$refs.commonDept.corporationChange(this.iForm.corporationId, this.iForm.deptId);
      }).catch(err => {
        console.log(err);
      })
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
    // 提交 新建
    async onSubmit() {
      this.$refs.iForm.validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, "iForm")) {
        return;
      }
      // 新建就save，编辑就update
      let promiseFn = accidentReportAdd;
      if (!this.isCreate) {
        promiseFn = accidentReportUpdate;
      }
      this.iForm.status = 2;
      this.btnLoading = true;
      console.log(this.iForm, 'this.iFormthis.iFormthis.iForm')
      return promiseFn(this.iForm).then(res => {
        this.pushPara = res.data;
        this.$antMessage.success("成功");
        this.$router.push("/safeManage/emergencyManagement/accidentManagement/accidentQuickReportList");
        Promise.resolve(res);
      }).catch(err => {
        Promise.reject();
      })
      .finally( () => {
        this.btnLoading = false;
      })
    },
    //保存
    onSave() {
      this.$refs.iForm.validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, "iForm")) {
        return;
      }
      let para = {
        ...this.iForm,
        status: 1,
      }
      if (this.isEdit) {
        para.id = this.accidentId
      }
      // 新建就save，编辑就update
      // 新建就save，编辑就update
      let promiseFn = accidentReportAdd;
      if (!this.isCreate) {
        promiseFn = accidentReportUpdate;
      }
      this.btnLoading = true;
      promiseFn(para).then(res => {
        this.$router.push({
          path: '/safeManage/emergencyManagement/accidentManagement/accidentDraft'
        })
      }).catch(err => { })
      .finally( () => {
        this.btnLoading = false;
      })
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
    // 取消
    onCancle() {
      this.setKeepalive(true)
      if(this.isEdit){
        this.$router.go(-1)
      }else{
        this.$router.push("/safeManage/emergencyManagement/accidentManagement/accidentList");
      }
    },  
    limitNumber(key) {
      let val = this.iForm[key];
      let value;
      if (typeof val === "string") {
        if(val === '') {
          value = 0;
        } else {
          value = !isNaN(Number(val)) ? val.replace(/\./g, 0) : 0;
        }
      } else if (typeof val === "number") {
        value = !isNaN(val) ? String(val).replace(/\./g, 0) : 0;
      } else {
        value = 0;
      }
      this.iForm[key] = value;
      this.calculateAccidentLevel()
    },
    calculateAccidentLevel() {
      // 损失工时时间相加
      let lossMoneyPlusTime = (this.iForm.deathLossMoney - 0) + (this.iForm.seriousInjuryLossMoney - 0) + (this.iForm.minorWoundLossMoney - 0) + (this.iForm.minorInjuryLossMoney - 0);
      // 轻伤事故，重伤事故。死亡事故相加
      var backToStart = false;
      if(this.iForm['deathEvilOmen'] > 0 || this.iForm['seriousInjuryEvilOmen'] > 0 || this.iForm['minorWoundEvilOmen'] > 0 || this.iForm['minorInjuryEvilOmen'] > 0 || this.iForm['deathCabinet'] > 0 || this.iForm['seriousInjuryCabinet'] > 0 || this.iForm['minorWoundCabinet'] > 0 || this.iForm['minorInjuryCabinet'] > 0 || (lossMoneyPlusTime > 0 && lossMoneyPlusTime <= 72) || (this.iForm['propertyLoss'] > 0 && this.iForm['propertyLoss'] < 3000)) {
        // 轻微事件
        this.iForm.accidentLevel = '1';
        backToStart = true;
      }
      if((this.iForm['minorWoundNum'] > 0 && this.iForm['minorWoundNum'] < 3) || (this.iForm['propertyLoss'] >= 3000 && this.iForm['propertyLoss'] < 30000)) {
        // 一般事故
        this.iForm.accidentLevel = '2';
        backToStart = true;
      }
      if((this.iForm['minorWoundNum'] >= 3 && this.iForm['minorWoundNum'] < 10) || this.iForm['minorInjuryNum'] > 0 || this.iForm['deathAccStop'] > 0 || this.iForm['seriousInjuryAccStop'] > 0 || this.iForm['minorWoundAccStop'] > 0 || this.iForm['minorInjuryAccStop'] > 0 || (this.iForm['propertyLoss'] >= 30000 && this.iForm['propertyLoss'] < 300000)) {
        // 严重事故
        this.iForm.accidentLevel = '3';
        backToStart = true;
      } 
      if(this.iForm['deathNum'] > 0 || this.iForm['seriousInjuryNum'] > 0 || this.iForm['minorWoundNum'] >= 10 || this.iForm['propertyLoss'] >= 300000 || this.iForm['deathGoverStop'] > 0 || this.iForm['seriousInjuryGoverStop'] > 0 || this.iForm['minorWoundGoverStop'] > 0 || this.iForm['minorInjuryGoverStop'] > 0) {
        // 重大事故
        this.iForm.accidentLevel = '4';
        backToStart = true;
      }
      if(!backToStart) {
        this.iForm.accidentLevel = null;
      }
    }
  },
};
</script>

<style scoped lang='less'>
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

.personal-injury{
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  .personal-injury-title{
    & > div{
      flex: 1;
      background: #fafafa;
      text-align: center;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
  }
  .personal-injury-data, .personal-injury-workhours{
    & > div{
      flex: 1;
      background: #fafafa;
      text-align: center;
      border-right: 1px solid #eee;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    
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