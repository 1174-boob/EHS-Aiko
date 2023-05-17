<template>
  <HasFixedBottomWrapper>
    <!-- <PageTitle>新建提案</PageTitle> -->
    <div class="form-content">
      <a-form-model ref="emForm" :model="emForm" :rules="emRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row class="m-t-20">
          <a-col :span="11">
            <a-form-model-item class="flex" label="起草人">
              <span>{{emForm.draftPersonName}}</span>/<span>{{emForm.draftPersonJobNumber}}</span>
            </a-form-model-item>
            <CommonDept ref="commonSearchItem" :disabled="disabled" :CommonFormInline="emForm" :rules="emRules" :notTablePage="true" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonDept>
            <a-form-model-item class="flex" label="所属部门" prop="deptId">
              <dept-tree :disabled="disabled" :placeholder="'请选择所属部门'" v-model="emForm.deptId" :deptData="deptData" @change="(id,name)=>draftChange(id,name,'deptName')" allowClear></dept-tree>
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :push="1">
            <a-form-model-item class="flex" :label="action=='add'?' ':'创建时间'" >
              <span v-if="action != 'add'">{{emForm.createTime}}</span>
            </a-form-model-item>
            <a-form-model-item class="flex" label="提案名称" prop="proposalName">
              <a-input :disabled="disabled" v-model="emForm.proposalName" placeholder="请输入提案名称" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="flex" label="提案级别">
              <a-select v-model="emForm.proposalLevel" placeholder="请选择提案级别" disabled>
                <a-select-option v-for="item in proposalLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div>
          <div class="m-t-20 border-b-e7">
            <PageTitle>提案描述</PageTitle>
          </div>
          <div class="m-t-20"></div>
        </div>
        <a-row class="m-t-20">
          <a-col :span="23">
            <a-form-model-item class="flex" label="改善背景" prop="improveBackground">
              <a-textarea
                :disabled="disabled"
                v-model="emForm.improveBackground"
                placeholder="简述改善提出背景介绍，字数不超过200字"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item label="改善前照片" class="flex">
              <upload-can-remove ref="editModel" :maxSize="5" :limit="20" :headImgs="beforeImprovePhotoList" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess" :disabled="disabled"></upload-can-remove>
            </a-form-model-item>
            <a-form-model-item class="flex" label="改善措施" prop="improveMeasures">
              <a-textarea
                :disabled="disabled"
                v-model="emForm.improveMeasures"
                placeholder="简述改善措施，字数不超过500字"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item class="flex" label="改善效果" prop="improveEffect">
              <a-textarea
                :disabled="disabled"
                v-model="emForm.improveEffect"
                placeholder="简述改善效果，字数不超过200字"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item label="改善后照片" class="flex">
              <upload-can-remove ref="editModel1" :maxSize="5" :limit="20" :headImgs="afterImprovePhotoList" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="afterImproveSuccess" :disabled="disabled"></upload-can-remove>
            </a-form-model-item>
            <staffOrDept class="staff-Dept" ref="improveProposalMemberList" :onPreview="disabled" :labelTitle="'提案完善小组成员'" :treeRoles="emRules" :propKey="'improveProposalMemberList'" :checkedTreeNode="improveProposalMemberList" @getTreeData="getImproveProposalMemberList" :label-col="labelCol" :wrapper-col="wrapperCol"></staffOrDept>
            <staffOrDept class="staff-Dept" ref="departmentReviewerList" :onPreview="(action=='edit' || action=='preview') ? true : false" :labelTitle="'科室级评审员'" :treeRoles="emRules" :propKey="'departmentReviewerList'" :checkedTreeNode="departmentReviewerList" @getTreeData="getReviewerList" :comment="comment" :label-col="labelCol" :wrapper-col="wrapperCol"></staffOrDept>
            <staffOrDept v-if="action=='edit'" :onPreview="(emForm.proposalLevel =='1' && action=='edit') ? false : true" class="staff-Dept" ref="deptReviewerList" :labelTitle="'部门级评审员'" :treeRoles="emRules" :propKey="'deptReviewerList'" :checkedTreeNode="deptReviewerList" @getTreeData="getTreeData" :comment="comment1" :label-col="labelCol" :wrapper-col="wrapperCol"></staffOrDept>
          </a-col>
        </a-row>
      </a-form-model>
      <div v-if="Object.keys(recordsVo1).length !=0">
        <div class="m-t-20 border-b-e7">
          <PageTitle>科室级评审记录</PageTitle>
        </div>
        <div class="m-t-20"></div>
        <ReviewRecord :recordsVo="recordsVo1"></ReviewRecord>
      </div>
      <div v-if="Object.keys(recordsVo2).length !=0">
        <div class="m-t-20 border-b-e7">
          <PageTitle>部门级评审记录</PageTitle>
        </div>
        <div class="m-t-20"></div>
        <ReviewRecord :recordsVo="recordsVo2"></ReviewRecord>
      </div>
      <!-- <div v-if="(!reviewStatus && Object.keys(recordsVo3).length !=0 ) || (reviewStatus && recordsVo3.reviewStatus )"> -->
      <div v-if="Object.keys(recordsVo3).length !=0">
        <div class="m-t-20 border-b-e7">
          <PageTitle>公司级评审记录</PageTitle>
        </div>
        <div class="m-t-20"></div>
        <ReviewRecord :recordsVo="recordsVo3"></ReviewRecord>
      </div>
      <div v-if="Object.keys(recordsVo4).length !=0">
        <div class="m-t-20 border-b-e7">
          <PageTitle>事业级评审记录</PageTitle>
        </div>
        <div class="m-t-20"></div>
        <ReviewRecord :recordsVo="recordsVo4"></ReviewRecord>
      </div>
    </div>
    
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">取消</a-button>
          <a-button v-if="action != 'preview'" type="primary" class="m-r-15" :loading="loading" @click="submit">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import dictionary from '@/utils/dictionary';
import moment from "moment";
import chemicalDict from "@/mixin/chemicalDict.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import staffOrDept from "@/components/staffOrDept";
import ReviewRecord from "./reviewRecord.vue"
import { proposalAdd,proposalDetail, proposalDataDetail,proposalUpdate,PushTask } from "@/services/api.js";
export default {
  mixins:[chemicalDict],
  components: {
    FixedBottom,
    UploadCanRemove,
    staffOrDept,
    ReviewRecord
  },
  props: {
    action: {
      type: String,
      default:'add'
    },
    reviewStatus: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      emForm: {
        proposalLevel: '1',
        deptId: undefined
      },
      comment: "说明：至少选择3名评委，需要包括起草人的科长、部长，其他评委需要Band8以上",
      comment1:'说明：所在部门部长及科室科长为评委',
      portalStatus: "",
      deptData:[],
      proposalLevel: [],
      improveProposalMemberList: [],
      departmentReviewerList: [],
      deptReviewerList: [],
      beforeImprovePhotoList: [],
      afterImprovePhotoList: [],
      loading: false,
      loadingConfirm: false,
      visible: false,
      emergencyLevel: undefined,
      emergencyForm: undefined,
      drill_type: undefined,
      labelCol: { style: { width: '160px' } },
      wrapperCol: { style: { width: 'calc(100% - 160px)' } },
      recordsVo1: {},
      recordsVo2: {},
      recordsVo3: {},
      recordsVo4: {},
      emRules: {
        deptId: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        proposalName: [
          { required: true, validator:(rule, value, callback)=> this.inputValidator(rule, value, callback,50), trigger: ['blur', 'change'] },
        ],
        improveBackground: [
          { required: true, validator:(rule, value, callback)=> this.inputValidator(rule, value, callback,200), trigger: ['blur', 'change'] },
        ],
        improveMeasures: [
          { required: true,  validator:(rule, value, callback)=> this.inputValidator(rule, value, callback,500), trigger: ['blur', 'change'] },
        ],
        improveEffect: [
          { required: true, validator:(rule, value, callback)=> this.inputValidator(rule, value, callback,200), trigger: ['blur', 'change'] },
        ],
        improveProposalMemberList: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        departmentReviewerList: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        deptReviewerList: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      },
      proposalCode: ''
    }
  },
  computed: {
    disabled() {
      return this.action=='preview' ? true : false;
    }
  },
  
  created() {
    this.proposalLevel = dictionary('proposalLevel'); //提案级别 1-科室级 2-部门级 3-公司级 4-事业级
    this.initProposal();
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    initProposal() {
      if(this.action == 'edit' || this.action == 'preview') {
        const proposalId = this.$route.query.proposalId;
        const api = this.reviewStatus ? proposalDataDetail : proposalDetail
        api({proposalId }).then(res=>{
          const data = res.data;
          this.emForm = data;
          const beforeImprovePhotoList = data.beforeImprovePhotoList;
          const afterImprovePhotoList = data.afterImprovePhotoList;
          this.$refs.commonSearchItem.corporationChange(data.corporationId,data.deptId);
          this.improveProposalMemberList = data.improveProposalMemberList || [];
          this.departmentReviewerList = data.departmentReviewerList || [];
          this.deptReviewerList = data.deptReviewerList || [];
          if( beforeImprovePhotoList && beforeImprovePhotoList.length > 0) {
            const fileLists = [];
            const photoList = [];
            for (let index = 0; index < beforeImprovePhotoList.length; index++) {
              const item = beforeImprovePhotoList[index];
              let fileObj = {
                uid: item.id,
                id: item.id,
                name: item.fileName,
                url: item.filePath,
                status: 'done',
              };
              fileLists.push(fileObj);
              photoList.push(item.id);
            }
            this.beforeImprovePhotoList = fileLists;
            this.emForm.beforeImprovePhotoList = photoList;
          }
          if(afterImprovePhotoList && afterImprovePhotoList.length > 0) {
            const fileLists = [];
            const photoList = [];
            for (let index = 0; index < afterImprovePhotoList.length; index++) {
              const item = afterImprovePhotoList[index];
              let fileObj = {
                uid: item.id,
                id: item.id,
                name: item.fileName,
                url: item.filePath,
                status: 'done',
              };
              fileLists.push(fileObj);
              photoList.push(item.id);
            }
            this.afterImprovePhotoList = fileLists;
            this.emForm.afterImprovePhotoList = photoList;
          }
          const recordsVoList = data.recordsVoList;
          for(let ele of recordsVoList) {
            let level = ele.proposalLevel;
            this['recordsVo'+level] = ele; //proposalLevel 1-科室级评审记录 2-部门级评审记录 3-公司级评审记录
          }
        }).catch(err=>{
          console.log(err);
        })
      } else {
        const user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
        this.emForm.draftPersonId = user.userId ? user.userId : ''; //起草人id
        this.emForm.draftPersonName = user.name ? user.name : '';
        this.emForm.draftPersonJobNumber = user.jobNumber ? user.jobNumber : '';
      }
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    // 组织改变
    corporationChange(val, deptId) {
      this.emForm.corporationDeptId = deptId;
      this.emForm.deptId = undefined;
      this.emForm.deptName = "";
    },
    // 部门改变
    draftChange(id,name,key) {
      this.emForm[key] = name.join();
    },
    // 改善前照片上传
    async addFormUploadSuccess(fileList) {
      let photoList = [];
      for(let item of fileList) {
        photoList.push(item.id)
      }
      this.emForm.beforeImprovePhotoList = photoList;
      this.beforeImprovePhotoList = fileList;
    },
    // 改善后照片上传
    async afterImproveSuccess(fileList) {
      let photoList = [];
      for(let item of fileList) {
        photoList.push(item.id)
      }
      this.emForm.afterImprovePhotoList = photoList;
      this.afterImprovePhotoList = fileList;
    },
    getImproveProposalMemberList(value) {
      this.emForm.improveProposalMemberList = value.treeIdList;
      if (!formValidator.formItemValidate(this, "improveProposalMemberList", "emForm")) {
        return;
      }
    },
    // 科级评审员
    getReviewerList(value) {
      this.emForm.departmentReviewerList = value.treeIdList;
      if (!formValidator.formItemValidate(this, "departmentReviewerList", "emForm")) {
        return;
      }
      if(value.treeIdList && value.treeIdList.length<3) {
        this.$antMessage.warn("科级评审员至少需要3人")
      }
    },
    getTreeData(value) {
      this.emForm.deptReviewerList = value.treeIdList;
      if (!formValidator.formItemValidate(this, "deptReviewerList", "emForm")) {
        return;
      }
    },
    // 提交
    submit() {
      if (!formValidator.formAll(this, 'emForm')) {
        return;
      }
      if(this.emForm.departmentReviewerList.length < 3) {
        this.$antMessage.warn("科级评审员至少需要3人");
        return
      }
      this.loading = true
      const api = this.action == 'edit' ? proposalUpdate : proposalAdd;
      if(this.action == 'edit') {
        delete this.emForm.recordsVoList;
      }
      if(this.action == 'edit') {
        this.emForm.jahbb = this.getChemicalDictText('jahbb', this.emForm.corporationId);
        this.emForm.factoryCenter = this.getChemicalDictText('factoryCenter', 'deptId');
      }
      api(this.emForm).then(res=>{
        // let proposalId = res.data.proposalId;
        // this.proposalId = proposalId;
        // let handlerList = res.data.handlerList;
        // this.proposalCode = res.data.proposalCode;
        // this.pushTask(proposalId, handlerList);
        // this.pushTask(handlerList);
        this.$antMessage.success("操作成功");
        this.loading = false;
        this.$router.replace("/safeManage/securityThinkTank/improveProposalManagement/myProposal")
      }).catch(err=>{
        console.log(err);
        this.loading = false;
      })
    },
    // 代办推送
    async pushTask(id, handler) {
      // const title = this.action == 'add' ? '科室级提案评审' :  this.emForm.proposalLevel == '1' ? "部门级提案评审" :  this.emForm.proposalLevel == '2' ?"公司级提案分配" : this.emForm.proposalLevel == '3' ? '事业级提案分配' : "";
      const title = this.action == 'add' ? 'proposalDept' :  this.emForm.proposalLevel == '1' ? "proposalDeptment" :  this.emForm.proposalLevel == '2' ?"distributionCompany" : this.emForm.proposalLevel == '3' ? 'distributionCareer' : "";
      const redirectUrl = this.action == 'edit' && (this.emForm.proposalLevel == '2' || this.emForm.proposalLevel == '3') ? '/safeManage/securityThinkTank/improveProposalManagement/proposalApprove&proposalTab=3' : `/safeManage/securityThinkTank/improveProposalManagement/approveScoring&proposalId=${id}`
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + redirectUrl;
      const pushTask = await PushTask({
        title: title,
        approval: 'proposal',
        userId: handler.join(),
        url: url,
        docId: this.proposalId,
        docNumber: this.proposalCode || ''
      })
    },
    inputValidator(rule, value, callback, num) {
      if (!value) {
        return Promise.reject("不能为空");
      } else if (value && value.length > num) {
        return Promise.reject(`不能超过${num}字`);
      } else {
        callback();
      }
    },
  }
}
</script>

<style lang="less" scoped>
.form-content {
  .staff-Dept {
    ::v-deep .ant-form-item {
      display: flex;
    }
  }
}
</style>