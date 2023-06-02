<template>
  <div class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="flex-1 position-rel pd-b-100">
      <div class="scroll-center-box">
        <PageTitle>变岗申请</PageTitle>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="变岗人员">
              <a-select :disabled="disabled" v-model="formInline.personId" placeholder="请选择人员" show-search :filter-option="filterOptionMixin">
                <a-select-option v-for="item in staffList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <!-- 搜索栏按钮需要加固定的float-right类名 -->
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="iSearch(true)" :disabled="disabled">确定</a-button>
              <a-button @click="iRest" :disabled="disabled">取消</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <div class="pd-l-20 pd-r-20 border-f4 pd-t-20">
          <div class="border-b-f6 pd-b-20">
            <span class="color-000">姓名：{{staffMsg.name}}</span>
            <span class="color-000 pd-l-20">工号：{{staffMsg.workNum}}</span>
          </div>
          <div class="staff-msg m-t-20 flex">
            <div>
              <p>
                <span>性别：</span>
                <span>{{getMappingValue(genderList, "key", staffMsg.sex).value}}</span>
              </p>
              <p>
                <span>籍贯：</span>
                <span>{{staffMsg.nativePlace}}</span>
              </p>
              <p>
                <span>入司时间：</span>
                <span>{{staffMsg.joyCompanyTime ? staffMsg.joyCompanyTime.join('-') : ''}}</span>
              </p>
              <p>
                <span>文化程度：</span>
                <span>{{getMappingValue(education, "key", staffMsg.degreeEducation).value}}</span>
              </p>
              <p>
                <span>身份证号：</span>
                <span>{{staffMsg.certificateNum}}</span>
              </p>
            </div>
            <div>
              <p>
                <span>年龄：</span>
                <span>{{staffMsg.age}}</span>
              </p>
              <p>
                <span>手机号：</span>
                <span>{{staffMsg.phone}}</span>
              </p>
              <p>
                <span>出生年月：</span>
                <span>{{staffMsg.birthTime ? staffMsg.birthTime.join('-') : ''}}</span>
              </p>
              <p>
                <span>婚姻状况：</span>
                <span>{{getMappingValue(marriage, "key", staffMsg.maritalStatus).value}}</span>
              </p>
              <p>
                <span>从业年数：</span>
                <span>{{staffMsg.yearsEmployment}}</span>
              </p>
            </div>
            <div>
              <p>
                <span>工龄：</span>
                <span>{{staffMsg.workAge ? staffMsg.workAge + "月" : ""}}</span>
              </p>
              <p>
                <span>岗位：</span>
                <span>{{staffMsg.postName}}</span>
              </p>
              <p>
                <span>嗜好：</span>
                <span>{{staffMsg.hobby}}</span>
              </p>
              <p>
                <span>接害工龄：</span>
                <span>{{staffMsg.harmfulAge ? staffMsg.harmfulAge + "月" : ""}}</span>
              </p>
              <p>
                <span>所属部门：</span>
                <span>{{staffMsg.deptName}}</span>
              </p>
            </div>
          </div>
          <div class="m-b-20">
            <p>
              <span>接触危害：</span>
              <span>{{staffMsg.hazardFactors}}</span>
            </p>
          </div>
        </div>
        <div class="post-main">
          <h3 class="font-16 color-000 m-t-20 pd-t-22 pd-b-20 border-b-f6 m-b-20">变岗信息填写</h3>
          <a-form-model ref="ruleForm" :model="form" :rules="rulesChangePost" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
              <a-col :span="20">
                <a-form-model-item label="变动形式" prop="variation">
                  <a-select :disabled="disabled" v-model="form.variation" placeholder="请选择变动形式" @change="changeTypeFn">
                    <a-select-option v-for="item in changeTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <CommonDept
                  ref="commonDept"
                  :CommonFormInline="form"
                  :rules="rulesChangePost"
                  :notTablePage="true"
                  :hasDepartment="true"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :disabled="disabled"
                  @corporationChange="corporationChange"
                  @corporationDeptChange="corporationDeptChange"
                ></CommonDept>
                <!-- 1：调岗2：离岗 -->
                <template v-if="form.variation == 'change_post'">
                  <a-form-model-item label="调岗原因" prop="transfer">
                    <a-select :disabled="disabled" v-model="form.transfer" placeholder="请选择调岗原因">
                      <a-select-option v-for="item in changeReasonList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item v-if="form.transfer == 'reason2'" label="危害因素" prop="hazardFactors">
                    <a-select showSearch :disabled="disabled" mode="multiple" v-model="form.hazardFactors" placeholder="请选择危害因素，可多选" :filter-option="filterOptionMixin">
                      <a-select-option v-for="item in endangerFactorsList" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="调岗类型" prop="transferType">
                    <a-select :disabled="disabled" v-model="form.transferType" placeholder="请选择调岗类型">
                      <a-select-option v-for="item in postTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="调岗后部门" prop="postTransferDepartmentId">
                    <a-tree-select
                      :treeDefaultExpandAll="false"
                      :disabled="disabled"
                      v-model="form.postTransferDepartmentId"
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
                      :tree-data="treeData"
                      placeholder="请输入调岗后部门"
                      tree-default-expand-all
                      @change="deptChange"
                    ></a-tree-select>
                  </a-form-model-item>
                  <a-form-model-item label="调岗岗位是否为危害岗位" prop="isHazardousPost">
                    <a-select :disabled="disabled" v-model="form.isHazardousPost" placeholder="请选择调岗岗位是否为危害岗位">
                      <a-select-option v-for="item in isDangerList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item v-if="form.isHazardousPost == 2" label="调整后岗位名称" prop="afterAdjustment">
                    <a-input :disabled="disabled" v-model="form.afterAdjustment" placeholder="请输入调整后岗位名称" />
                  </a-form-model-item>
                  <a-form-model-item v-if="form.isHazardousPost == 1" label="调整后岗位名称" prop="afterAdjustment">
                    <a-select showSearch :disabled="disabled" v-model="form.afterAdjustment" placeholder="请选择调整后岗位" @change="getRelevantInfo" :filter-option="filterOptionMixin">
                      <a-select-option v-for="item in dangerPostList" :key="item.dangerousStationId" :value="item.dangerousStationId">{{item.dangerousStationName}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item v-show="form.isHazardousPost == 1 || 2" label="调岗岗位危害因素">
                    <div>{{form.isHazardousPost == 1 ? relevantInfo.harmFactorList : "无"}}</div>
                  </a-form-model-item>
                  <!-- 危害岗位需要显示体检相关内容 -->
                  <a-form-model-item v-show="form.isHazardousPost == 1" label="体检项目">
                    <div>{{relevantInfo.physicalExaminationProject}}</div>
                  </a-form-model-item>
                  <a-form-model-item v-if="isShowTime" label="调岗体检时间" prop="transferTime">
                    <a-date-picker :disabled="Boolean(disabled && dataMsg.transferTime)" placeholder="请选择时间" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-model="form.transferTime" />
                  </a-form-model-item>
                  <a-form-model-item v-if="isShowUpLoad" label="体检报告" prop="fileId">
                    <UploadEhs
                      :limit="1"
                      :onlyShow="Boolean(disabled && (dataMsg.medicalNode || dataMsg.medicalReport))"
                      :accept="accept"
                      @handleSuccess="handleSuccess"
                      :fileLists="Array.isArray(form.fileId) ? form.fileId : []"
                    ></UploadEhs>
                  </a-form-model-item>
                </template>
                <template v-if="form.variation == 'quit_post'">
                  <a-form-model-item label="离岗原因" prop="reasonLeaving">
                    <a-select :disabled="disabled" v-model="form.reasonLeaving" placeholder="请选择离岗原因">
                      <a-select-option v-for="item in quitReasonList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="期望离岗时间" prop="expectedTime">
                    <a-date-picker :disabled="disabled" placeholder="请选择时间" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-model="form.expectedTime" />
                  </a-form-model-item>
                  <a-form-model-item v-if="isShowTime" label="离岗体检时间" prop="expectedMedicalTime">
                    <a-date-picker :disabled="Boolean(disabled && dataMsg.expectedMedicalTime)" placeholder="请选择时间" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-model="form.expectedMedicalTime" />
                  </a-form-model-item>
                  <!-- 正常离岗:体检报告 旷离：体检通知单 -->
                  <a-form-model-item v-if="isShowUpLoad" :label="form.reasonLeaving == 'reason2' ? '体检报告' : '体检通知单'" prop="fileId">
                    <UploadEhs
                      :limit="1"
                      :onlyShow="Boolean(disabled && (dataMsg.medicalNode || dataMsg.medicalReport))"
                      :accept="accept"
                      @handleSuccess="handleSuccess"
                      :fileLists="Array.isArray(form.fileId) ? form.fileId : []"
                    ></UploadEhs>
                  </a-form-model-item>
                </template>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <CommonModal title="办理" :visible="chooseStaffVisible" :cancelFn="chooseStaffCancle">
          <div>
            <div>办理人：</div>
            <a-checkbox-group v-model="staffArr" :options="plainOptions" />
          </div>
          <template slot="btn">
            <a-button type="primary" :loading="loading" @click="chooseStaffConfirm">发送</a-button>
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
      </div>
      <div slot="fixedBottom" v-if="!isResolve && !disabled">
        <FixedBottom>
          <div>
            <a-button @click="onCancle">取消</a-button>
            <a-button v-if="!isResolve" @click="onSave">保存</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
          </div>
        </FixedBottom>
      </div>
      <div slot="fixedBottom" v-if="isResolve">
        <FixedBottom>
          <div>
            <!-- 离岗没有驳回按钮 -->
            <a-button v-if="!isHiddenRejectBtn" @click="reject">驳回</a-button>
            <a-button type="primary" @click="approved">通过</a-button>
          </div>
        </FixedBottom>
      </div>
    </div>
    <Log v-if="logData.length" :flowLogList="logData"></Log>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom"
import Log from "@/components/flowLog/flowLog.vue"

import { formValidator } from "@/utils/clx-form-validator.js"
import UploadEhs from "@/components/upload/uploadBtnStyle.vue"
import dictionary from '@/utils/dictionary'
import cancelLoading from '@/mixin/cancelLoading'

import { getSelectStaffList, getStaffDetail, getDangerousPost, getAllFactor, postSave, postUpdate, postDetail, getIsSafety, postEndEvent, GetFirstNode, selectNodeUser, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail, RejectedTask, getFlowLogApi, PushTask } from '@/services/api'
import { getQueryVariable } from "@/utils/util.js";
import { debounce } from 'lodash'
export default {
  components: { FixedBottom, UploadEhs, Log },
  mixins: [cancelLoading],
  data() {
    return {
      deployIdList: [],
      deployId: "",
      dataMsg: {},
      isSafety: "",
      isShowTime: false,
      isShowUpLoad: false,
      labelCol: { span: 8 }, // 设置左边label宽度
      wrapperCol: { span: 16 }, // 设置右边表单宽度
      formInline: {},
      staffList: [],
      staffMsg: {},
      accept: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt'],
      changeTypeList: [],
      changeReasonList: [],
      quitReasonList: [],
      endangerFactorsList: [],
      marriage: [],
      education: [],
      postTypeList: [],
      departmentList: [],
      relevantInfo: {}, // 选择岗位后，对应的体检等信息
      isDangerList: [],
      dangerPostList: [],
      form: {
        fileId: [],
      },
      rulesChangePost: { // 调岗
        variation: [
          { required: true, message: "变动形式不能为空", trigger: "change" },
        ],
        transfer: [
          { required: true, message: "调岗原因不能为空", trigger: "change" },
        ],
        transferType: [
          { required: true, message: "调岗类型不能为空", trigger: "change" },
        ],
        postTransferDepartmentId: [
          { required: true, message: "调岗后部门不能为空", trigger: "change" },
        ],
        isHazardousPost: [
          { required: true, message: "调岗岗位是否为危害岗位不能为空", trigger: "change" },
        ],
        afterAdjustment: [
          { required: true, message: "危害岗位不能为空", trigger: "change" },
        ],
        transferTime: [
          { required: true, message: "调岗体检时间不能为空", trigger: "change" },
        ],
        fileId: [
          { required: true, message: "上传文件不能为空", trigger: "change" },
        ],
        reasonLeaving: [
          { required: true, message: "离岗原因不能为空", trigger: "change" },
        ],
        expectedTime: [
          { required: true, message: "期望离岗时间不能为空", trigger: "change" },
        ],
        expectedMedicalTime: [
          { required: true, message: "离岗体检时间不能为空", trigger: "change" },
        ],
      },
      treeData: [],
      rebackVisable: false,
      rebackMsg: '',
      chooseStaffVisible: false,
      staffArr: [],
      plainOptions: [],
      status: '',//审批状态
      processId: "",
      docNumber: '',
      isHiddenRejectBtn: false, // 是都隐藏驳回按钮，true隐藏  false展示

      // 节点信息
      taskId: null,
      infoStatus: null,
      logData: [], // 日志数据
      userId: "",
      defaultGet: false,
      userIdT: '',
    };
  },
  async created() {
    this.setRouterCode("postChange");
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId;
    this.deployIdList = this.getDictItemList("approvalType") || [];
    this.genderList = dictionary("sex");
    this.postTypeList = dictionary("postTransfer"); // 调岗类型
    this.changeTypeList = dictionary("post_apply"); // 变岗形式
    this.changeReasonList = dictionary("change_post_reason"); // 调岗原因
    this.quitReasonList = dictionary("quit_reason"); // 离岗原因
    this.isDangerList = dictionary("is_danger");
    this.marriage = dictionary("marriage"); // 婚姻状况
    this.education = dictionary("education"); // 文化程度
    this.getTaskList();
    this.getAllFactor();
    if (!this.isCreate) {
      // 编辑 | 查看 | 处理，回显
      this.getEchoData();
    } else {
      this.defaultGet = true;
    }
    let result = await getIsSafety();
    this.isSafety = result.data;
  },
  computed: {
    disabled() {
      return this.$route.meta && (this.$route.meta.isView || this.$route.meta.isResolve)
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    }
  },
  methods: {
    corporationChange(a, b) {
      this.$set(this.form, "postTransferDepartmentId", undefined);
      this.$set(this.form, "postTransferDepartment", undefined);
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
    },
    deptChange(a, b, c) {
      this.$set(this.form, "postTransferDepartment", b && b[0]);
      this.getDangerousPost();
    },
    // 查询
    iSearch(flag) {
      if (!this.formInline.personId) {
        this.$antMessage.error("您还未选择变岗人员");
        return;
      }
      // 调接口查询所选人员信息
      getStaffDetail({ ...this.formInline }).then(res => {
        this.staffMsg = res.data || {};
        if (res.data && flag) {//flag 新增编辑时为真
          this.userIdT = res.data.id
        }
      }).catch(err => console.log(err))
    },
    // 重置
    iRest() {
      this.formInline = {};
      this.staffMsg = {};
    },
    // 变动形式，离岗2或者调岗1
    changeTypeFn(val) {
      if (val == "quit_post") { // 离岗
        this.deployId = this.getMappingValue(this.deployIdList, "dictLabel", "DEMOBILIZED").dictValue;
      } else {
        this.deployId = this.getMappingValue(this.deployIdList, "dictLabel", "POSTTRANSFER").dictValue;
      }
    },
    // // 编辑 | 查看 | 处理，获取回显数据
    async getEchoData() {
      let para = {
        id: this.$route.query.id || getQueryVariable('id')
      }
      postDetail(para).then(res => {
        let data = res.data;
        this.infoStatus = data.nodeStatus;
        this.taskId = data.taskId;
        this.processId = data.processId;
        this.docNumber = data.code;
        if(data.transferTime) {
          data.transferTime = data.transferTime.join('-');
        }
        if(data.expectedTime) {
          data.expectedTime = data.expectedTime.join('-');
        }
        if(data.expectedMedicalTime) {
          data.expectedMedicalTime = data.expectedMedicalTime.join('-');
        }
        this.form = { ...data };
        this.dataMsg = { ...data };
        this.changeTypeFn();
        if (!this.isEdit) {
          this.userIdT = data.healthyUserId//处理
          let handler = data.handler ? data.handler.split(',') : [];
          this.getLogData(handler);
        } else {

        }
        if (this.dataMsg.nodeStatus.indexOf("__002") > -1) {
          this.isShowTime = true;
        } else {
          if (this.dataMsg.transferTime || this.dataMsg.expectedMedicalTime) {
            this.isShowTime = true;
          } else {
            this.isShowTime = false;
          }
        }
        if (this.dataMsg.nodeStatus.indexOf("__011") > -1) {
          this.isShowUpLoad = true;
          this.isHiddenRejectBtn = true;
        } else {
          if (this.dataMsg.medicalNode || this.dataMsg.medicalReport) {
            this.isShowUpLoad = true;
          } else {
            this.isShowUpLoad = false;
          }
        }
        this.formInline = {
          personId: this.dataMsg.healthyUserId
        }
        this.iSearch(this.isEdit);
        let fileId = data.medicalNode || data.medicalReport;
        if (fileId && typeof fileId === 'string') {
          this.form.fileId = JSON.parse(fileId) || []
        } else {
          this.form.fileId = data.fileId || [];
        }

        if (this.form.isHazardousPost == 1) {
          this.getDangerousPost();
        }
        this.$refs.commonDept.corporationChange(this.form.corporationId, this.form.postTransferDepartmentId);
      })
        .catch(() => { })
    },
    getLogData(handler) {
      let para = {
        processInstanceId: this.processId,
        handler: handler
      }
      getFlowLogApi(para).then(res => {
        this.logData = res.data || [];
      }).catch(err => {
        console.log(err);
      })
    },
    // 上传回调
    handleSuccess(file) {
      this.form.fileId = file = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || [];
      this.form = { ...this.form };
    },
    // 查询变岗人员
    getTaskList() {
      getSelectStaffList().then(res => {
        this.staffList = res.data || [];
        for (let i = 0; i < this.staffList.length; i++) {
          this.staffList[i].name = this.staffList[i].workNum ? (this.staffList[i].name + "/" + this.staffList[i].workNum) : this.staffList[i].name;
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取组织机构
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'postTransferDepartmentId', 'ruleForm');
    },
    // 获取所有危害岗位
    getDangerousPost(afterAdjustment, value, extra) {
      if (Array.isArray(value)) {
        this.form.postTransferDepartment = value[0];
      }
      getDangerousPost({
        deptId: this.form.postTransferDepartmentId,
      }).then(res => {
        this.dangerPostList = res.data;
        if (this.form.afterAdjustment) {
          this.getRelevantInfo(this.form.afterAdjustment);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 通过危害岗位获取体检等信息
    getRelevantInfo(val) {
      this.relevantInfo = this.getMappingValue(this.dangerPostList, "dangerousStationId", val)
    },
    // 获取所有危害因素
    getAllFactor() {
      getAllFactor().then(res => {
        this.endangerFactorsList = res.data;
      }).catch(err => {
        console.log(err);
      })
    },
    // 提交 新建
    async onSubmit() {
      if (!this.isChooseStaff()) return;
      try {
        let valid = await this.validate(); // 表单项校验
        if (!valid) {
          return
        }
        const { data } = await this.getFirstNode(); // 获取第一个节点
        this.infoStatus = data.id
        let res = await this.createProcessData(this.infoStatus)
        this.taskId = (res.data || {}).taskId;
        this.processId = (res.data || {}).processId;
        this.docNumber = (res.data || {}).code;
        // console.log(this.isCreate,this.isEdit,this.form.variation,'987654');
        if (!((this.isCreate || this.isEdit) && this.form.variation == 'change_post')) {//调岗
          this.getUserNodeInfo(this.infoStatus);
        } else {//离岗
          const { code, data } = await this.getNextTask(this.taskId, this.infoStatus)
          if (+code !== 20000) {
            return
          }
          this.infoStatus = data.id || ''//更新获取下一节点
          this.getUserNodeInfo(this.infoStatus);
        }
      } catch (e) { }
    },
    //保存
    async onSave() {
      if (!this.isChooseStaff()) return;
      let valid = await this.validate()
      if (!valid) {
        return
      }
      let para = {
        ...this.form,
        isDraft: 1,
      }
      if (this.isEdit) {
        para.id = this.$route.query.id || getQueryVariable('id')
      }
      Object.assign(para, {
        name: this.staffMsg.name,
        phone: this.staffMsg.phone,
        workNum: this.staffMsg.workNum,
        deptId: this.staffMsg.deptId,
        deptName: this.staffMsg.deptName,
        originalPositionName: this.staffMsg.post,
        healthyUserId: this.staffMsg.id
      });
      if (this.form.fileId && this.form.fileId.length > 0) {
        if (this.form.variation == "quit_post") { // 离岗
          if (this.form.reasonLeaving == "reason2") { // 正常离岗
            para.medicalReport = JSON.stringify(this.form.fileId);
          } else { // 旷离
            para.medicalNode = JSON.stringify(this.form.fileId);
          }
        } else {
          para.medicalReport = JSON.stringify(this.form.fileId);
        }
      }
      const { code } = await postSave(para)
      if (+code === 20000) {
        this.$router.push({
          path: '/occupationHealth/postChangeDraftList'
        })
      }
    },

    // 驳回按钮
    async reject() {
      let valid = await this.validate(); // 表单项校验
      if (!valid) {
        return
      }
      if (!this.isChooseStaff()) return;
      this.status = 0;
      this.rebackMsg = '';
      this.rebackVisable = true;
    },
    // 通过按钮
    async approved() {
      let valid = await this.validate(); // 表单项校验
      if (!valid) {
        return
      }
      if (!this.isChooseStaff()) return;
      this.status = 1;
      this.rebackVisable = true;
    },
    // 驳回/通过弹框-取消按钮
    nextCancle() {
      this.rebackVisable = false;
    },
    // 驳回/通过弹框-下一步按钮
    async nextConfirm() {
      this.rebackVisable = false;
      if (this.status === 0) {
        //驳回
        try {
          let para = {
            ...this.form,
          }
          if(para.transferTime) {
            para.transferTime = para.transferTime.split('-').map((item)=>{
              return Number(item)
            })
          }
          if(para.expectedTime) {
            para.expectedTime = para.expectedTime.split('-').map((item)=>{
              return Number(item)
            })
          }
          if(para.expectedMedicalTime) {
            para.expectedMedicalTime = para.expectedMedicalTime.split('-').map((item)=>{
              return Number(item)
            })
          }
          if (this.isEdit) {
            para.id = this.$route.query.id || getQueryVariable('id')
          }
          if (this.infoStatus == "POSITION_011__2") {
            // 调驳回接口
            let resultReject = await RejectedTask({
              taskId: this.taskId
            });
            para.taskId = resultReject.data.taskId;
            para.handler = resultReject.data.userId;
            para.nodeStatus = resultReject.data.id;
          } else {
            para.isDraft = 1;
          }
          para.medicalNode = null;
          para.medicalReport = null;
          para.fileId = null;
          await postUpdate(para);
          this.$router.push({
            path: '/occupationHealth/postChange'
          })
        } catch (e) { }
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
        id: this.$route.query.id || getQueryVariable('id'),
      }
      if(para.transferTime) {
        para.transferTime = para.transferTime.split('-').map((item)=>{
          return Number(item)
        })
      }
      if(para.expectedTime) {
        para.expectedTime = para.expectedTime.split('-').map((item)=>{
          return Number(item)
        })
      }
      if(para.expectedMedicalTime) {
        para.expectedMedicalTime = para.expectedMedicalTime.split('-').map((item)=>{
          return Number(item)
        })
      }
      const { code, data } = await postEndEvent(para)
      if (+code === 20000) {
        this.$antMessage.success('归档成功')
        this.$router.push({
          path: '/occupationHealth/postChange'
        })
      }
    },

    // 获取首节点信息
    getFirstNode() {
      let para = {
        deployId: this.deployId
      }
      return GetFirstNode(para)
    },
    // 处理 获取下一节点infoStatus信息
    getNextTask(taskId, infoStatus) {
      let para = {
        taskId: taskId,
        param: {}
      }
      if (this.form.variation == 'change_post') {
        para.param = {
          ...this.form
        }
      }
      para.param[infoStatus] = infoStatus;
      para.param["isSafety"] = this.isSafety;
      return GetNextTask(para)
    },
    // 节点详情
    getNodeDetail(infoStatus) {
      let para = {
        deploymentId: this.deployId,
        nodeId: infoStatus
      }
      return GetNodeDetail(para)
    },
    // 获取下一节点审批人
    async getUserNodeInfo(infoStatus) {
      let para = {
        createUserId: (this.isCreate || this.isEdit) ? "" : this.dataMsg.createUserId,
        userId: this.userIdT,
        node: infoStatus,
        postTransferDepartmentId: this.dataMsg.postTransferDepartmentId,
        deptId: this.staffMsg.deptId,
        corporationId: this.form.corporationId
      }
      const { code, data } = await selectNodeUser(para)
      if (+code === 20000) {
        this.chooseStaffVisible = true;
        this.plainOptions = (data || []).map(item => {
          const { userId: value, name: label } = item
          return {
            value,
            label
          }
        })
      }
    },
    // 创建流程
    createProcessData(infoStatus) {
      //根据infoStatus获取taskId
      let para = {
        deployId: this.deployId,
        module: new Date().getTime(),
        map: {}
      }
      para.map[infoStatus] = infoStatus
      return CreateProcess(para)
    },
    // 选完下级节点审批人之后点击弹框按钮-发送
    chooseStaffConfirm: debounce(async function () {
      if (!this.staffArr.length) {
        this.$antMessage.warning('请选择办理人');
        return
      }
      if (!this.staffMsg.id) {
        this.$antMessage.warning('所选人员没有唯一标识字段');
        return
      }
      this.handleLoading();
      if (this.isResolve || ((this.isCreate || this.isEdit) && this.form.variation == 'change_post')) { // 调岗&新建需要调审核通过接口
        // if (this.isResolve) { // 调岗&新建需要调审核通过接口
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
        taskId: this.taskId,
        nodeStatus: this.infoStatus,
        isDraft: 0,
        handler: this.staffArr.join()//处理人
      }
      if(para.transferTime) {
        para.transferTime = para.transferTime.split('-').map((item)=>{
          return Number(item)
        })
      }
      if(para.expectedTime) {
        para.expectedTime = para.expectedTime.split('-').map((item)=>{
          return Number(item)
        })
      }
      if(para.expectedMedicalTime) {
        para.expectedMedicalTime = para.expectedMedicalTime.split('-').map((item)=>{
          return Number(item)
        })
      }
      if (this.isEdit || this.isResolve) {
        para.id = this.$route.query.id || getQueryVariable('id')
      }
      if (this.isResolve) {
        para.opinion = this.rebackMsg
      }
      Object.assign(para, {
        name: this.staffMsg.name,
        phone: this.staffMsg.phone,
        workNum: this.staffMsg.workNum,
        deptId: this.staffMsg.deptId,
        deptName: this.staffMsg.deptName,
        originalPositionName: this.staffMsg.post,
        healthyUserId: this.staffMsg.id,
        processId: this.processId,
        docNumber: this.docNumber
      });
      if (this.form.fileId && this.form.fileId.length > 0) {
        if (this.form.variation == "quit_post") { // 离岗
          if (this.form.reasonLeaving == "reason2") { // 正常离岗
            para.medicalReport = JSON.stringify(this.form.fileId);
          } else { // 旷离
            para.medicalNode = JSON.stringify(this.form.fileId);
          }
        } else {
          para.medicalReport = JSON.stringify(this.form.fileId);
        }
      }
      let api = (this.isEdit || this.isResolve) ? postUpdate : postSave;//编辑更新 | 新建保存
      const { code, data } = await api(para)
      //处理的发送
      if (+code === 20000) {
        let msg = this.isEdit ? '提交成功' : '通过成功'
        let id = data.id;
        if (id) {
          this.pushTask(id);
        }
        this.$antMessage.success(msg)
        this.chooseStaffVisible = false
        this.$router.push({
          path: '/occupationHealth/postChange'
        })
      }
    }, 300),
    async pushTask(id) {
      // 消息推送
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/postChangeResolve&id=${id}`
      const pushTask = await PushTask({
        title: "变岗申请处理",
        approval: 'movement',
        userId: this.staffArr.join(),
        docId: this.processId,
        taskId: this.taskId,
        url: url,
        docNumber: this.docNumber,
      })
    },
    // 取消
    chooseStaffCancle() {
      this.chooseStaffVisible = false;
      this.cancelLoading();
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
      if (this.form.variation == 'change_post') {
        para.param = {
          ...this.form
        }
      }
      para.param[infoStatus] = infoStatus;
      para.param[infoStatus] = this.staffArr.join();
      para.param["isSafety"] = this.isSafety;
      return ApprovedTask(para)
    },
    // 表单校验
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate(valid => {
          resolve(valid)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 校验是否选人
    isChooseStaff() {
      if (!this.staffMsg.id) {
        this.$antMessage.error("变岗人员信息必须点击确定查询");
        return false;
      }
      return true;
    },
    // 取消
    onCancle() {
      this.setKeepalive(true)
      this.$router.push("/occupationHealth/postChange");
    },
  },
};
</script>

<style scoped lang='less'>
.scroll-center-box {
  overflow: auto;
  height: 100%;
}
.width-70 {
  width: 70px;
}
.staff-msg {
  & > div {
    width: 33%;
    margin-right: 1%;
    &:last-child {
      margin-right: 0;
    }
    p {
      display: flex;
      margin-bottom: 20px;
      span {
        &:nth-child(1) {
          width: 70px;
          text-align: right;
          color: #999;
        }
        &:nth-child(2) {
          flex: 1;
          color: #333;
        }
      }
    }
  }
}
.title-h3 {
  display: flex;
  align-items: center;
}
.post-wrapper {
  /deep/ .fixed-bottom {
    bottom: 0;
    margin: 0;
    left: 0;
  }
  /deep/ .log {
    flex: none;
  }
}
</style>