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
              <dept-tree :disabled="disabled" :placeholder="'请选择所属部门'" v-model="emForm.deptId" :deptData="deptData" disabled></dept-tree>
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :push="1">
            <a-form-model-item class="flex" label=" ">
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
                :maxLength="200"
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
                :maxLength="500"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item class="flex" label="改善效果" prop="improveEffect">
              <a-textarea
                :disabled="disabled"
                v-model="emForm.improveEffect"
                placeholder="简述改善效果，字数不超过200字"
                :maxLength="200"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item label="改善后照片" class="flex">
              <upload-can-remove ref="editModel1" :maxSize="5" :limit="20" :headImgs="afterImprovePhotoList" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="afterImproveSuccess" :disabled="disabled"></upload-can-remove>
            </a-form-model-item>
            <staffOrDept class="staff-Dept" ref="improveProposalMemberList" :onPreview="disabled" :labelTitle="'提案完善小组成员'" :treeRoles="emRules" :propKey="'improveProposalMemberList'" :checkedTreeNode="improveProposalMemberList" :deptTreeId="deptTreeId" @getTreeData="getImproveProposalMemberList" :label-col="labelCol" :wrapper-col="wrapperCol"></staffOrDept>
          </a-col>
        </a-row>
      </a-form-model>
      <div>
        <div class="m-t-20 border-b-e7">
          <PageTitle>评审</PageTitle>
        </div>
        <div class="m-t-20"></div>
      </div>
    </div>
    <a-form-model ref="approveForm" :model="approveForm" :rules="approveRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row class="m-t-20">
          <a-col :span="23">
            <vxe-table
              border
              align="center"
              ref="xTable"
              show-overflow
              :column-config="{resizable: true}"
              :row-config="{height: 100, isHover: true}"
              :data="tableData">
              <vxe-column field="aa"
                  title="项目"
                  min-width="80">
              </vxe-column>
              <vxe-column
                  title="评分标准"
                  width="700">
                  <template #default="{ row }">
                  <div class="flex"><span class="standard-evaluation">{{row.b1}}</span> <span>{{row.c1}}</span></div>
                  <div class="flex"><span class="standard-evaluation">{{row.b2}}</span> <span>{{row.c2}}</span></div>
                  <div class="flex"><span class="standard-evaluation">{{row.b3}}</span> <span>{{row.c3}}</span></div>
                </template>
              </vxe-column>
              <vxe-column field="score" title="分值" min-width="80">
                <template #default="{ row }">
                  <a-input v-model="row.score" placeholder="请输入分值" @blur="scoreBlur(row)" allowClear></a-input>
                </template>
              </vxe-column>
            </vxe-table>
            <div class="m-t-20"></div>
            <a-form-model-item class="flex" label="评审意见" prop="reviewComments">
              <a-textarea
                v-model="approveForm.reviewComments"
                placeholder="请输入评审意见"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
    </a-form-model>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">取消</a-button>
          <a-button type="primary" class="m-r-15" @click="submit" :loading="loading">确定</a-button>
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
import { proposalReview,proposalDetail } from "@/services/api.js";
import { getQueryVariable } from "@/utils/util.js";
export default {
  mixins:[chemicalDict],
  components: {
    FixedBottom,
    UploadCanRemove,
    staffOrDept,
  },
  props: {
    action: {
      type: String,
      default:'score'
    }
  },
  data() {
    return {
      emForm: {},
      approveForm: {},
      proposalId: null,
      reviewerId: "",
      disabled: true,
      portalStatus: "",
      deptTreeId: "",
      deptData:[],
      improveProposalMemberList: [],
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
      deptId: undefined,
      tableData: [
        {code:'innovationScore',aa:"创新性",b1:'0-10分',c1:"一般，已普遍使用的工作方法或解决方案",b2:'11-20分',c2:"较好，具有一定的管理创新性或技术创新解决方案",b3:'21-30分',c3:'优秀，思路新颖，业内首创或对优秀安全管理或技术方案进行进一步创新优化',score:''},
        {code:'practicabilityScore',aa:"实用性",b1:'0-10分',c1:"可解决一般性的安全管理问题",b2:'11-30分',c2:"可解决安全管理过程中的实际困难，有效提升整体安全管理绩效",b3:'31-40分',c3:'可解决重点安全问题或有效管控重要危险源，有效降低基地运行安全风险',score:''},
        {code:"generalizationScore",aa:"可推广性",b1:'0-10分',c1:"仅可对单一区域或特定因素有效",b2:'11-20分',c2:"经过细化可在本基地内推广",b3:'21-30分',c3:'安全管理方法或技术解决方案可在集团内各工厂进行推广实施，可全面提升集团整体安全管控水平',score:''},
      ],
      approveRules: {
        reviewComments: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      },
      emRules: {
        deptId: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        proposalName: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        improveBackground: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        improveMeasures: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        improveEffect: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
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
      }
    }
  },

  created() {
    this.proposalLevel = dictionary('proposalLevel'); //提案级别 1-部门级 2-工厂级 3-基地级 4-集团级
    this.initProposal();
    const user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.reviewerId = user.userId ? user.userId : ''; //评审人id
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    initProposal() {
      const queryVariableProposalId = getQueryVariable("proposalId");
      const proposalId = this.$route.query.proposalId || queryVariableProposalId;
      this.proposalId = proposalId;
      proposalDetail({proposalId }).then(res=>{
        const data = res.data;
        if( data.processStatus && queryVariableProposalId) {
          console.log("已处理过");
          this.$antMessage.warn("该提案已完成评审")
          this.$router.push({ path: '/safeManage/securityThinkTank/improveProposalManagement/previewProposal', query: { proposalId:queryVariableProposalId }})
        } else {
          this.emForm = data;
          const beforeImprovePhotoList = data.beforeImprovePhotoList;
          const afterImprovePhotoList = data.afterImprovePhotoList;
          this.$refs.commonSearchItem.corporationChange(data.corporationId);
          this.improveProposalMemberList = data.improveProposalMemberList || [];
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
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    scoreBlur(row) {
      const maxScore = row.aa == '实用性' ? 40 : 30
      const score = row.score;
      if (!/^\d+(\.\d{0,1})?$/.test(score)) {
        this.$antMessage.warn("只能输入整数或最多一位小数");
        row.score = '';
      } else if(score.slice(score.length-1)=='.') {
        this.$antMessage.warn("只能输入整数或最多一位小数");
        row.score = '';
      } else if(score< 0 || score > maxScore ) {
        this.$antMessage.warn(`该分值范围0-${maxScore}`);
        row.score = '';
      }
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    // 组织改变
    corporationChange(val, deptId) {
      this.deptTreeId = deptId;
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
    // 提交
    submit() {
      if (!formValidator.formAll(this, 'approveForm')) {
        return;
      }
      const params = {
        proposalId: this.proposalId,
        reviewerId: this.reviewerId,
        proposalLevel: this.emForm.proposalLevel,
        ...this.approveForm,
      }
      for(let item of this.tableData) {
        let code = item.code;
        let score = item.score;
        if(!score) {
          this.$antMessage.warn(`${item.aa}的分值不能为空`)
          return
        }
        this.$set(params,code,score);
      }
      this.loading = true;
      proposalReview(params).then(res=>{
        this.loading = false;
        this.$antMessage.success("操作成功");
        this.$router.replace("/safeManage/securityThinkTank/improveProposalManagement/proposalApprove")
      }).catch(err=>{
        console.log(err);
        this.loading = false;
      })
    }
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
.standard-evaluation {
  display: inline-block !important;
  width: 70px;
}
</style>