<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="iForm" :model="iForm" :rules="rules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- <CommonDept :CommonFormInline="iForm" :rules="rules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="disabled"  @corporationChange="corporationChange"></CommonDept> -->
        <a-form-model-item class="flex" ref="onceEnteredSite" label="曾经入场现地" prop="onceEnteredSite">
          <a-input :disabled="disabled" v-model.trim="iForm.onceEnteredSite" placeholder="请输入曾经入场现地"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="jobContent" label="作业内容" prop="jobContent">
          <a-input :disabled="disabled" v-model.trim="iForm.jobContent" placeholder="请输入作业内容"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="contractNo" label="安全协议合同号" prop="contractNo">
          <a-input :disabled="disabled" v-model.trim="iForm.contractNo" placeholder="请输入安全协议合同号"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="contractExpirationDate" label="安全协议到期日" prop="contractExpirationDate">
          <a-date-picker :disabled="disabled" style="width: 100%;" v-model="iForm.contractExpirationDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="请选择安全协议到期日" />
        </a-form-model-item>
        <a-form-model-item class="flex" ref="supplierDirector" label="厂商负责人" prop="supplierDirector">
          <a-input :disabled="disabled" v-model.trim="iForm.supplierDirector" placeholder="请输入厂商负责人"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="supplierDirectorPhone" label="厂商负责人电话" prop="supplierDirectorPhone">
          <a-input :disabled="disabled" v-model.trim="iForm.supplierDirectorPhone" placeholder="请输入厂商负责人电话"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="supplierSafeDirector" label="厂商安全负责人" prop="supplierSafeDirector">
          <a-input :disabled="disabled" v-model.trim="iForm.supplierSafeDirector" placeholder="请输入厂商安全负责人"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="supplierSafeDirectorPhone" label="厂商安全负责人电话" prop="supplierSafeDirectorPhone">
          <a-input :disabled="disabled" v-model.trim="iForm.supplierSafeDirectorPhone" placeholder="请输入厂商安全负责人电话"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" ref="fileIdList" label="附件" prop="fileIdList">
          <UploadBtnStyle
            v-if="!disabled"
            :accept="['.doc', '.docx','.pdf','.xls','.xlsx','.ppt']"
            :maxSize="20"
            :limit="20"
            :fileLists="iForm.echoFileList"
            @handleSuccess="handleSuccessReferencesAttachment"
          ></UploadBtnStyle>
          <div class="file-list font-size-14" v-else>
            <div v-if="(iForm.echoFileList && iForm.echoFileList.length == 0) || !iForm.echoFileList">暂无数据</div>
            <div v-else class="file-item" v-for="item in iForm.echoFileList" :key="item.id" @click="openFile(item.url)">{{item.name}}</div>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <!-- status:1查看，展示返回 -->
          <a-button v-if="status != 2" @click="onCancle">{{status == 1 ? "返回" : "取消"}}</a-button>
          <a-button v-if="status == 2" type="primary" :loading="submitLoading" @click="onSubmit(1)">通过</a-button>
          <a-button v-if="status == 2" type="primary" :loading="submitLoading" @click="onSubmit(2)">驳回</a-button>
          <a-button v-if="status == 3 || status == 4" type="primary" :loading="submitLoading" @click="onSubmit(3)">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom"
import { PerfectInformation, ChangeInformation, InvitationToExamine, rejectInvitation } from "@/services/api.js";
import { isEmpty } from 'lodash'

export default {
  components: { UploadBtnStyle, FixedBottom },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    invitationId: {
      type: String
    },
    echoMsg: {
      type: Object,
      default: () => { }
    },
    status: { // 1查看  2审核  3完善信息  4变更信息
      type: String | Number,
      default: () => ""
    },
  },
  data() {
    return {
      spinning: false,
      labelCol: { style: { width: '150px' } },
      wrapperCol: { style: { width: 'calc(100% - 150px)' } },
      iForm: {},
      rules: {
        onceEnteredSite: [{ required: true, message: "曾经入场现地不能为空", trigger: "change" }],
        jobContent: [{ required: true, message: "作业内容不能为空", trigger: "blur" }],
        contractNo: [{ required: true, message: "安全协议合同号不能为空", trigger: "blur" }],
        contractExpirationDate: [{ required: true, message: "安全协议到期日不能为空", trigger: "change" }],
        supplierDirector: [{ required: true, message: "厂商负责人不能为空", trigger: "blur" }],
        supplierDirectorPhone: [{ required: true, message: "厂商负责人电话不能为空", trigger: "blur" }],
        supplierSafeDirector: [{ required: true, message: "厂商安全负责人不能为空", trigger: "change" }],
        supplierSafeDirectorPhone: [{ required: true, message: "厂商安全负责人电话不能为空", trigger: "blur" }],
      },
      submitLoading: false,
    }
  },
  created() {
    console.log(1111, this.invitationId);
    console.log(222, this.disabled)

  },
  watch: {
    echoMsg: {
      handler(val, oldVal) {
        console.log(val, oldVal);
        let fileList = val.fileList || []
        let echoFileList = this.dealImgEcho(fileList, 'fileName', 'filePath')
        this.iForm = { ...this.echoMsg, echoFileList };
      },
      deep: true
    },

  },
  computed: {
    isView() {
      return this.$route.query && this.$route.query.isView
    }
  },
  methods: {
    // corporationChange(a, b) {
    //     this.$set(this.iForm, "deptId", undefined);
    // },
    init() {

    },
    handleSuccessReferencesAttachment(fileIdList) {
      this.iForm.fileIdList = fileIdList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'fileIdList', 'iForm');
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
      let fileIdList = []
      list.forEach(item => {
        let itemObj = {
          id: item.id,
          uid: item.id,
          name: item.sourceFileName,
          status: 'done',
          url: item.filePath,
        }
        fileIdList.push(itemObj)
      })
      return fileIdList
    },
    onCancle() {
      this.setKeepalive(true)
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerInvitation"
      })
    },
    onSubmit(type) {
      this.submitLoading = true;
      console.log({
        invitationId: this.invitationId,
        ...this.iForm
      })
      let promiseFn = (this.status == 3 && isEmpty(this.echoMsg)) ? PerfectInformation : ChangeInformation;// 3完善信息 4变更信息
      if (type == 1) { // 审核通过
        promiseFn = InvitationToExamine;
      } else if (type == 2) { // 驳回
        promiseFn = rejectInvitation;
      }
      promiseFn({
        invitationId: this.invitationId,
        ...this.iForm
      })
        .then(res => {
          console.log(res);
          this.$antMessage.success("成功");
          this.$router.push({
            path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerInvitation"
          })
        })
        .catch(err => { console.log(err) })
        .finally(() => { this.submitLoading = false; })
    },
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
  }
}
</script>

<style lang="less">
.file-item {
  color: #0067cc;
  cursor: pointer;
}
</style>