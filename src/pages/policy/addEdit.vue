<template>
  <div class="form-wrapper">
    <PageTitle>新建</PageTitle>
    <div class="form-content">
      <a-form-model ref="ruleForm" :model="policyForm" :rules="policyRules" :colon="false">
        <a-row>
          <a-col :span="12">
            <CommonSearchItem :CommonFormInline="policyForm" :rules="policyRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonSearchItem>
            <a-form-model-item label="类型" prop="policyLawType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="policyForm.policyLawType" placeholder="请选择类型" allowClear>
                <a-select-option v-for="policy of policyLowType" :value="policy.key" :key="policy.id">{{policy.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="标题" prop="policyLawSubject" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="policyForm.policyLawSubject" placeholder="请输入" allowClear />
            </a-form-model-item>
            <a-form-model-item label="副标题" prop="subTitle" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="policyForm.subTitle" placeholder="请输入" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="内容" prop="content" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
              <Editor :height="height" v-model="editContent" :isClear="isClear" @submitEditor="submitEditor"></Editor>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="发布日期" prop="releaseTime" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker v-model="policyForm.releaseTime" @change="onPubTimeChange" :disabled-date="disabledDate" />
            </a-form-model-item>
            <a-form-model-item class="height-unset" label="文件" prop="file" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadEhs @handleSuccess="handleSuccess" :fileLists="fileLists"></UploadEhs>
            </a-form-model-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
      </a-form-model>
    </div>
    <FixedBottom>
      <a-button type="primary" @click="policySubmit">提交</a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="policyPreview">预览</a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="policyCancel">返回</a-button>
    </FixedBottom>
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import Editor from '@/components/editor/wangEditor.vue';
import dayJs from 'dayjs';
import moment from 'moment';
import UploadEhs from "@/components/upload/uploadEhs.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { InsertPolicyLaw, SelectPolicylawDetail, UpdatePolicyLaw } from "@/services/api.js";
import dictionary from "@/utils/dictionary.js";
export default {
  components: { Editor, UploadEhs, FixedBottom },
  data() {
    return {
      height: '300px',
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      labelColEditor: { span: 2 },
      wrapperColEditor: { span: 20 },
      policyLawId: null,
      isClear: false,
      editContent: '',
      policyLowType: [], //政策法规类型
      fileDetail: [],
      fileLists: [
      ],
      policyForm: {
        centerId: undefined,
        corporationId: undefined,
        policyLawSubject: '',
        subTitle: '',
        policyLawType: undefined,
        releaseTime: "",
        content: '',
        fileId: []
      },
      policyRules: {
        policyLawType: [
          { required: true, message: '类型不能为空', trigger: 'change' },
        ],
        policyLawSubject: [
          { required: true, validator: this.titleValidator, trigger: 'blur' },
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'change' },
        ],
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    if (id) {
      next(vm => {
        vm.setRouterCode("policy");
        vm.getPolicyDetail(id);
      })
    } else if (from.path == '/safeManage/securityThinkTank/policyPreview') {
      next(vm => {
        vm.setRouterCode("policy");
        vm.editPolicy();
      })
    } else {
      next()
    }
  },
  created() {
    this.setRouterCode("policy");
    // 政策法规类型
    this.policyLowType = dictionary('policyLowType');
  },
  methods: {
    onPubTimeChange(value) {
      if (!value) {
        this.policyForm.releaseTime = '';
      } else {
        this.policyForm.releaseTime = dayJs(value).format('YYYY-MM-DD') + ' 00:00:00';
      }
    },
    // 不可选时间
    disabledDate(current) {
      return current && current > moment().endOf('day');
    },
    submitEditor(value) {
      this.policyForm.content = value;
    },
    // 标题校验
    titleValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("标题不能为空")
      } else if (value && value.length > 100) {
        return Promise.reject("不能超过100字")
      } else {
        callback()
      }
    },
    // 提交
    policySubmit() {
      console.log(this.policyForm)
      if (!formValidator.formAll(this, 'ruleForm')) {
        return
      }
      this.onPubTimeChange(this.policyForm.releaseTime);
      if (this.policyLawId) {
        const params = {
          ...this.policyForm,
          id: this.policyLawId
        }
        UpdatePolicyLaw(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.$router.replace("/safeManage/securityThinkTank/policy");
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        InsertPolicyLaw(this.policyForm).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.$router.replace("/safeManage/securityThinkTank/policy");
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 预览
    policyPreview() {
      if (!formValidator.formAll(this, 'ruleForm')) {
        return
      }
      this.onPubTimeChange(this.policyForm.releaseTime);
      this.$store.commit("setting/policyMsg", { ...this.policyForm, fileDetail: this.fileDetail });
      this.$router.push("/safeManage/securityThinkTank/policyPreview");
    },
    // 从预览页返回编辑时候回填信息
    editPolicy() {
      const msg = this.$store.state.setting.policyMsg;
      this.policyForm.policyLawSubject = msg.policyLawSubject;
      this.policyForm.subTitle = msg.subTitle;
      this.policyForm.policyLawType = msg.policyLawType;
      this.fileLists = msg.fileDetail;
      this.policyForm.releaseTime = msg.releaseTime.split(" ")[0];
      console.log(msg)
      this.policyForm.centerId = msg.centerId;
      this.policyForm.corporationId = msg.corporationId;
      this.editContent = msg.content;
      this.handleSuccess(msg.fileDetail)
    },
    // 取消
    policyCancel() {
      this.setKeepalive(true)
      this.$router.replace("/safeManage/securityThinkTank/policy")
    },
    // 获取编辑详情
    getPolicyDetail(policyLawId = null) {
      SelectPolicylawDetail({ policyLawId }).then(res => {
        const policyMsg = res.data;
        this.policyLawId = policyLawId;
        this.fileLists = policyMsg.fileId ? policyMsg.fileId : [];
        this.policyForm.policyLawSubject = policyMsg.policyLawSubject;
        this.policyForm.subTitle = policyMsg.subTitle;
        this.policyForm.policyLawType = policyMsg.policyLawType;
        this.policyForm.releaseTime = policyMsg.releaseTime ? policyMsg.releaseTime.split(" ")[0] : '';
        console.log(policyMsg)
        this.policyForm.centerId = policyMsg.centerId;
        this.policyForm.corporationId = policyMsg.corporationId;
        this.editContent = policyMsg.content;
        this.handleSuccess(this.fileLists)
      }).catch(err => {
        console.log(err);
      })
    },
    // 文件上传成功
    handleSuccess(data) {
      this.fileDetail = [];
      this.policyForm.fileId = [];
      for (let value of data) {
        const detail = {};
        let id = value.response ? value.response.data.id : value.uid;
        detail.uid = value.response ? value.response.data.id : value.uid;
        detail.url = value.response ? value.response.data.url : value.url;
        detail.name = value.name;
        this.fileDetail.push(detail)
        this.policyForm.fileId.push(id)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.form-wrapper {
  width: 100%;
  background: #fff;
  overflow-y: auto;
  padding-bottom: 60px;
  .ecertificateFileId-main {
    position: relative;
    display: flex;

    .ecertificateFileId-item2 {
      margin-left: 20px;
      height: 114px;
      width: 160px;
      position: relative;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .main-tishi {
    font-size: 12px;
    color: #ccc;
    margin-top: 5px;
    display: block;
    line-height: 16px;
  }
  .action-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    right: 0.18rem;
    padding-right: 0.5rem !important;
    height: 0.6rem;
    padding-left: 0.4rem !important;
    background: #fff;
    z-index: 1;
    ::v-deep .ant-checkbox-wrapper {
      display: inline-block;
      margin-right: 6px;
      line-height: 0.6rem !important;
    }
    .promotion-agreement {
      color: #0067cc;
      cursor: pointer;
    }
  }
  ::v-deep .ant-input {
    color: #000;
  }
  .btn-content {
    display: flex;
    justify-content: left;
    padding: 30px 0 0;
    ::v-deep .ant-btn {
      margin-right: 20px;
    }
  }
}
.hover-box {
  padding: 10px 16px 4px;
  .fweight-p {
    font-weight: bold;
    font-size: 14px;
    margin: 0;
    text-align: center;
  }
  p {
    text-align: left;
    font-size: 12px;
  }
}
</style>