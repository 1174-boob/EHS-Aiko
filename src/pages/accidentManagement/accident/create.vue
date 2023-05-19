<template>
  <div class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="flex-1 position-rel pd-b-100">
      <div class="scroll-center-box">
        <PageTitle>事故事件</PageTitle>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <div class="post-main">
            <a-form-model ref="iForm" :model="iForm" :rules="rules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row>
                <a-col :span="12">
                  <a-form-model-item ref="applicant" label="申请人" prop="applicant">
                    <a-input disabled v-model="iForm.applicant" placeholder="请输入申请人"></a-input>
                  </a-form-model-item>
                  <CommonDept ref="commonDept" :CommonFormInline="iForm" :rules="rules" :notTablePage="true" :hasDepartment="true" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="disabled"  @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
                  <a-form-model-item ref="deptId" label="起草人部门" prop="deptId">
                    <DeptTree
                      :disabled="disabled"
                      :placeholder="iForm.corporationId ? '请选择':'请输入起草人部门'"
                      v-model="iForm.deptId"
                      :deptData="treeData"
                      @change="applicantDeptChange"
                      allowClear
                    ></DeptTree>
                    <!-- <a-tree-select
                      :disabled="disabled"
                      v-model="iForm.deptId"
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
                      :tree-data="treeData"
                      placeholder="请输入起草人部门"
                      tree-default-expand-all
                      @change="applicantDeptChange"
                    > -->
                    </a-tree-select>
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
                      :placeholder="iForm.corporationId ? '请选择':'请输入责任部门'"
                      v-model="iForm.dutyDeptIdList"
                      :deptData="treeData"
                      @change="deptChange"
                      multiple
                      allowClear
                    ></DeptTree>
                    <!-- <a-tree-select
                      :disabled="disabled"
                      v-model="iForm.dutyDeptIdList"
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
                      :tree-data="treeData"
                      placeholder="请输入责任部门"
                      tree-default-expand-all
                      @change="deptChange"
                      multiple
                    > -->
                    </a-tree-select>
                  </a-form-model-item>
                  <a-form-model-item ref="accidentLevelHurt" label="人员伤害" prop="accidentLevelHurt">
                    <a-select :disabled="disabled" v-model="iForm.accidentLevelHurt" placeholder="请选择人员伤害">
                      <a-select-option v-for="item of personalInjury" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item ref="accidentLevelLoss" label="财产损失" prop="accidentLevelLoss">
                    <a-select :disabled="disabled" v-model="iForm.accidentLevelLoss" placeholder="请选择财产损失">
                      <a-select-option v-for="item of propertyLoss" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item ref="accidentType" label="事故类型" prop="accidentType">
                    <a-select :disabled="disabled" v-model="iForm.accidentType" placeholder="请选择事故类型">
                      <a-select-option v-for="item of accidentType" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item ref="accidentLocation" label="事故地点" prop="accidentLocation">
                    <a-textarea :disabled="disabled" v-model.trim="iForm.accidentLocation" :maxLength="50" placeholder="请输入事故地点"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="accidentProcess" label="事故经过" prop="accidentProcess" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea :disabled="disabled" v-model.trim="iForm.accidentProcess" :maxLength="1000" placeholder="请输入事故地点"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <PageTitle>
                  人员伤害
                </PageTitle>
                <a-col :span="24">
                  <a-form-model-item ref="safeRemindCas" prop="safeRemindCas" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <div class="personal-injury">
                      <div class="personal-injury-title flex">
                        <div></div>
                        <div>死亡人数</div>
                        <div>重伤人数</div>
                        <div>轻伤人数</div>
                        <div>轻微伤人数</div>
                      </div>
                      <div class="personal-injury-data flex">
                        <div>人员伤害(人)</div>
                        <!--  :formatter="limitNumber" -->
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('deathNum')" v-model.trim="iForm.deathNum" placeholder="请输入"></a-input></div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('seriousInjuryNum')" v-model.trim="iForm.seriousInjuryNum" placeholder="请输入"></a-input></div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('minorWoundNum')" v-model.trim="iForm.minorWoundNum" placeholder="请输入"></a-input></div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('minorInjuryNum')" v-model.trim="iForm.minorInjuryNum" placeholder="请输入"></a-input></div>
                      </div>
                      <div class="personal-injury-workhours flex">
                        <div>损失工时(H)</div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('deathLossMoney')" v-model.trim="iForm.deathLossMoney" placeholder="请输入"></a-input></div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('seriousInjuryLossMoney')" v-model.trim="iForm.seriousInjuryLossMoney" placeholder="请输入"></a-input></div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('minorWoundLossMoney')" v-model.trim="iForm.minorWoundLossMoney" placeholder="请输入"></a-input></div>
                        <div><a-input :disabled="disabled" type="number" :min="0" @change="limitNumber('minorInjuryLossMoney')" v-model.trim="iForm.minorInjuryLossMoney" placeholder="请输入"></a-input></div>
                      </div>
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item ref="propertyLoss" label="财产损失(元)" prop="propertyLoss">
                    <a-input :disabled="disabled" prefix="￥" v-model.trim="iForm.propertyLoss" @change="limitNumber('propertyLoss')" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="accidentScenePictureList" label="事故现场图片" prop="accidentScenePictureList" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <UploadCanRemove :disabled="disabled" key="1" ref="uploadPictureList1" :maxSize="5" :limit="20" :headImgs="iForm.echoPictureList1" @handleSuccess="handleSuccessPictograms(1)"></UploadCanRemove>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="accidentProcessPictureList" label="事故经过示意图及分析图示" prop="accidentProcessPictureList" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <UploadCanRemove :disabled="disabled" key="2" ref="uploadPictureList2" :maxSize="5" :limit="20" :headImgs="iForm.echoPictureList2" @handleSuccess="handleSuccessPictograms(2)"></UploadCanRemove>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <template title="事故原因分析和整改措施">
                <div>
                  <div class="m-t-20 border-b-e7">
                    <PageTitle>
                      事故原因分析和整改措施
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
                  <a-form-model-item ref="oneFactToOther" label="举一反三排查" prop="oneFactToOther" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea :disabled="disabled" v-model.trim="iForm.oneFactToOther" :maxLength="1000" placeholder="请输入举一反三排查"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="accidentRectificationPictureList" label="事故整改措施证明照片" prop="accidentRectificationPictureList" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <UploadCanRemove :disabled="disabled" key="3" ref="uploadPictureList3" :maxSize="5" :limit="20" :headImgs="iForm.echoPictureList3" @handleSuccess="handleSuccessPictograms(3)"></UploadCanRemove>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item v-show="accidentDutyHandleShow || isEdit" ref="accidentDutyHandle" label="事故责任处理" prop="accidentDutyHandle" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea :disabled="disabled" v-model.trim="iForm.accidentDutyHandle" :maxLength="1000" placeholder="请输入事故责任处理"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item ref="fileList" label="附件" prop="fileList">
                    <UploadBtnStyle
                      v-if="!disabled"
                      :accept="['.doc', '.docx','.pdf','.xls','.xlsx','.ppt']"
                      :maxSize="20"
                      :limit="20"
                      :fileLists="iForm.echoFileList"
                      @handleSuccess="handleSuccessReferencesAttachment"
                    ></UploadBtnStyle>
                    <div class="file-list font-size-14" v-else>
                      <div v-if="iForm.echoFileList && iForm.echoFileList.length == 0">暂无数据</div>
                      <div v-else class="file-item" v-for="item in iForm.echoFileList" :key="item.id" @click="openFile(item.url)">{{item.name}}</div>
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </a-spin>
        <CommonModal title="事故原因分析和整改措施" :visible="addCasNoModelShow" :cancelFn="addModalCancle">
          <template slot="form">
            <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :colon="false" labelAlign="left">
              <a-form-model-item label="原因类型" prop="reasonType">
                <a-select v-model="addModleForm.reasonType" show-search placeholder="请选择" :filter-option="filterOptionMixin">
                  <a-select-option v-for="item in accidentReasonType" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
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
            <a-button class="m-l-15" type="primary" :loading="loading" @click="addModalConfirm">确定</a-button>
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
      <div :class="{'no-padding': !logData.length}" slot="fixedBottom" v-if="isResolve">
        <!-- 责任部门部长审议时只有提交按钮 -->
        <FixedBottom>
          <div>
            <a-button @click="onCancle">返回</a-button>
            <a-button v-if="!(dataMsg.processStatus == '3')" type="primary" :loading="btnLoading" @click="reject">驳回</a-button>
            <a-button type="primary" :loading="btnLoading" @click="approved">通过</a-button>
          </div>
        </FixedBottom>
      </div>
    </div>
    <Log v-if="logData.length" :flowLogList="logData" :hiddenRemark="true"></Log>
</div>

</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom"
import Log from "@/components/flowLog/flowLog.vue"
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { formValidator } from "@/utils/clx-form-validator.js"
import UploadEhs from "@/components/upload/uploadBtnStyle.vue"
import dictionary from '@/utils/dictionary'
import cancelLoading from '@/mixin/cancelLoading'
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { nanoid } from 'nanoid'


import {  msdsGetUserInfo } from '@/services/chemicalMsds'
import { PushTask } from '@/services/api'
import { accidentEventAdd, accidentEventUpdate, accidentEventDetail, accidentEventGetLog, accidentEventHanderInfo } from '@/services/accident';


import { debounce } from 'lodash'
import { getQueryVariable } from "@/utils/util.js"
export default {
  components: { FixedBottom, UploadEhs, Log, OrganizeLazyTree, UploadCanRemove, UploadBtnStyle},
  mixins: [cancelLoading, teableCenterEllipsis],
  data() {
    return {
      spinning: true,
      accidentType: [],
      personalInjury: [],
      propertyLoss: [],
      accidentReasonType: [],
      addCasNoModelShow: false,
      addModleForm: {},
      addModleFormRules: {
        reasonType: [
          { required: true, message: "原因类型不能为空", trigger: "change" },
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
          title: '原因类型',
          scopedSlots: { customRender: 'reasonType' },
        },
        {
          title: '事故原因分析',
          dataIndex: 'reasonAnalyse',
        },
        {
          title: '事故整改措施',
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
        deathNum: 0,
        seriousInjuryNum: 0,
        minorWoundNum: 0,
        minorInjuryNum: 0,
        deathLossMoney: 0,
        seriousInjuryLossMoney: 0,
        minorWoundLossMoney: 0,
        minorInjuryLossMoney: 0,
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
        accidentLocation: [
          { required: true, message: "事故地点不能为空", trigger: "blur" },
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
        accidentRectificationPictureList: [
          { required: true, message: "事故整改措施证明照片不能为空", trigger: "change" },
        ],
        accidentAnalyseMeasuresList: [
          { required: true, message: "事故原因分析和整改措施不能为空", trigger: "change" },
        ],
        enclosureList: [
          { required: true, message: "附件不能为空", trigger: "change" },
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
    };
  },
  async created() {
    console.log(this.$route.meta)
    this.accidentType = this.getDictItemList("accident_type");
    this.personalInjury = this.getDictItemList("accident_level_person");
    this.propertyLoss = this.getDictItemList("accident_level_money");
    this.accidentReasonType = this.getDictItemList("accident_reason_type");
    console.log(this.accidentReasonType)
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
    accidentId() {
      return this.$route.query.formId || getQueryVariable('accidentId')
    },
  },
  methods: {
    corporationChange(a, b) {
      this.$set(this.iForm, "dutyDeptIdList", undefined);
      this.$set(this.iForm, "corporationDeptId", b);
      this.$set(this.iForm, "dutyDeptNameList", undefined);
      this.$set(this.iForm, "deptId", undefined);
      this.$set(this.iForm, "deptIdName", undefined);
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
    },
    deptChange(a,b,c) {
      // console.log(a,b,c,'...8989');
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
      console.log(this.userInfo)
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
      console.log(val)
      formValidator.formItemValidate(this, 'dutyDeptIdList', 'iForm')
    },
    // 象形图图片上传
    handleSuccessPictograms(num) {
      let arr = [];
      if (num == 1) {
        arr = this.$refs.uploadPictureList1.fileList.map(item => {
          return item.id
        })
        console.log(arr);
        this.$set(this.iForm, "accidentScenePictureList", arr);
        formValidator.formItemValidate(this, 'accidentScenePictureList', 'iForm')
      } else if (num == 2) {
        arr = this.$refs.uploadPictureList2.fileList.map(item => {
          return item.id
        })
        this.$set(this.iForm, "accidentProcessPictureList", arr);
      } else if (num == 3) {
        arr = this.$refs.uploadPictureList3.fileList.map(item => {
          return item.id
        })
        this.$set(this.iForm, "accidentRectificationPictureList", arr);
        formValidator.formItemValidate(this, 'accidentRectificationPictureList', 'iForm')
      } 
    },
    handleSuccessReferencesAttachment(fileList) {
      this.iForm.fileList = fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'fileList', 'iForm');
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
      console.log(row);
      this.addModleForm = { ...row };
      this.addCasNoModelShow = true;
    },
    tableRowDel(row) {
      console.log(row);
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
        formId: this.accidentId
      }
      accidentEventDetail(para).then(res => {
        let handleList = res.data.handleList || [];
        this.accidentDutyHandleShow = handleList.indexOf(this.userId) != -1;
        this.processNode = res.data && res.data.processNode;
        let iForm = res.data;
        this.infoStatus = iForm.nodeStatus;
        this.processId = iForm.processId;
        iForm.applicant = iForm.draftPersonJobNumber ? iForm.draftPersonName + '/' + iForm.draftPersonJobNumber : iForm.draftPersonName;
        // 日志
        if (!this.isCreate && iForm.formId) {
          this.getLogData(iForm.formId);
        }
        // 图片回显
        iForm.echoPictureList1 = this.handleFileRedisplay(iForm.accidentScenePictureList);
        iForm.accidentScenePictureList = this.handleFileIdS(iForm.accidentScenePictureList);

        iForm.echoPictureList2 = this.handleFileRedisplay(iForm.accidentProcessPictureList);
        iForm.accidentProcessPictureList = this.handleFileIdS(iForm.accidentProcessPictureList);

        iForm.echoPictureList3 = this.handleFileRedisplay(iForm.accidentRectificationPictureList);
        iForm.accidentRectificationPictureList = this.handleFileIdS(iForm.accidentRectificationPictureList);

        // 附件回显
        iForm.echoFileList = this.handleFileRedisplay(iForm.fileList);
        console.log(iForm.echoFileList)
        iForm.fileList = this.handleFileIdS(iForm.fileList);

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
    async getLogData(formId) {
      try {
        let para = {
          formId: formId,
        }
        let idArr = [];
        let result = await accidentEventGetLog(para)
        let list = result.data || [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].hander) {
            if(list[i].hander.indexOf('[') > -1) {
              let parseArr = JSON.parse(list[i].hander);
              for(let o = 0; o < parseArr.length; o++) {
                idArr.push(parseArr[o]);
              }
            } else {
              idArr.push(list[i].hander);
            }
          }
          list[i].logId = list[i].id;
          list[i].endTime = list[i].handerTime;          
        }
        if(idArr.length >= 1) {
          this.getUserAndJobNumber([...new Set(idArr)]).then(res=>{ //全局方法
            let obj = res || {};
            for (let i = 0; i < idArr.length; i++) {
              list[i].assigneeName = list[i].hander ? (obj[idArr[i]] ? obj[idArr[i]].name : "--") : "--";
            }
            this.logData = list;
          }).catch(err=>{
            console.log(err);
          })
        }

      } catch (err) {
        console.log(err);
      }
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
      console.log(this.iForm,'...ii');
      this.$refs.iForm.validate((valid, object) => {
        console.log(this.iForm, valid);
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, "iForm")) {
        return;
      }
      // 新建就save，编辑就update
      let promiseFn = accidentEventAdd;
      if (!this.isCreate) {
        promiseFn = accidentEventUpdate;
      }
      this.iForm.draftStatus = 2;
      this.btnLoading = true;
      return promiseFn(this.iForm).then(res => {
        this.pushPara = res.data;
        this.pushTask();
        this.$antMessage.success("成功");
        this.$router.push("/safeManage/emergencyManagement/accidentManagement/accidentList");
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
        draftStatus: 1,
      }
      if (this.isEdit) {
        para.id = this.accidentId
      }
      // 新建就save，编辑就update
      // 新建就save，编辑就update
      let promiseFn = accidentEventAdd;
      if (!this.isCreate) {
        promiseFn = accidentEventUpdate;
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
    // 待办推送
    async pushTask() {
      console.log(this.dataMsg, this.iForm);
      let formId = this.pushPara.formId || this.accidentId
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/emergencyManagement/accidentManagement/accidentResolve&accidentId=${formId}`
      if (this.pushPara.handle) {
        let handlerUser;
        if(this.pushPara.handle) {
          if(this.pushPara.handle.indexOf('[') > -1) {
            handlerUser = this.pushPara.handle.join(',')
          } else {
            handlerUser = this.pushPara.handle;
          }
        } else {
          handlerUser = this.pushPara.handleId;
        }
        await PushTask({
          title: "事故事件审批",
          approval:'accidentResolve',
          userId: handlerUser,
          docId: formId,
          taskId: formId,
          url: url,
          docNumber: this.pushPara?.accidentCode || '',   //业务id
        })
      } else {
         await PushTask({
          title: "事故事件审批",
          approval:'accidentResolve',
          userId: '',
          docId: formId,
          taskId: formId,
          url: url,
          docNumber: this.pushPara?.accidentCode || '',   //业务id
        })
        this.$router.push("/safeManage/emergencyManagement/accidentManagement/accidentList");
      }
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
    // 驳回按钮
    reject() {
      this.approvalStatus = 3;
      this.resolveFn();
    },
    // 通过按钮
    approved() {
      this.approvalStatus = 2;
      this.resolveFn();
    },
    async resolveFn() {
      try {
        this.btnLoading = true;
        let result = await accidentEventHanderInfo({
          formId: this.dataMsg.formId,
          approvalStatus: this.approvalStatus,
          processNode: this.dataMsg.processStatus
        })
        this.pushPara = result.data;
        this.pushTask();
        this.$antMessage.success(this.approvalStatus == 2 ? "通过成功" : "驳回成功");
        if (this.approvalStatus == 2) {
          this.$router.push("/safeManage/emergencyManagement/accidentManagement/accidentList");
        } else if (this.approvalStatus == 3) {
          this.$router.push({
            path: '/safeManage/emergencyManagement/accidentManagement/accidentDraft'
          })
        }
      } catch (err) {
        console.log(err);
        this.btnLoading = false;
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
        value = !isNaN(Number(val)) ? val.replace(/\./g, "") : 0;
      } else if (typeof val === "number") {
        value = !isNaN(val) ? String(val).replace(/\./g, "") : 0;
      } else {
        value = 0;
      }
      this.iForm[key] = value;
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