<template>
  <div class="form-wrapper">
    <PageTitle>新建</PageTitle>
    <div class="form-content">
      <a-form-model ref="ruleForm" :model="noticeForm" :rules="noticeRules" :colon="false">
        <a-row>
          <a-col :span="12">
            <!--  :hasDepartment="true" -->
            <CommonSearchItem :CommonFormInline="noticeForm" :rules="noticeRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonSearchItem>
            <a-form-model-item label="标题" prop="policyLawSubject" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="noticeForm.policyLawSubject" placeholder="请输入" allowClear />
            </a-form-model-item>
            <a-form-model-item label="副标题" prop="subTitle" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="noticeForm.subTitle" placeholder="请输入" allowClear />
            </a-form-model-item>
            <a-form-model-item label="类型" prop="noticeType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="noticeForm.noticeType" placeholder="请选择类型" allowClear>
                <a-select-option v-for="notice of noticeType" :value="notice.dictValue" :key="notice.dictValue">{{notice.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="内容" prop="content" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
              <Editor :height="height" :isClear="isClear" v-model="editContent" @submitEditor="submitEditor"></Editor>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="文件" prop="file" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadEhs @handleSuccess="handleSuccess" :fileLists="fileLists"></UploadEhs>
            </a-form-model-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
      </a-form-model>
    </div>
    <FixedBottom>
      <a-button type="primary" @click="noticeSubmit">提交</a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="noticePreview">预览</a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="noticeCancel">返回</a-button>
    </FixedBottom>
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import Editor from '@/components/editor/wangEditor.vue';
import UploadEhs from "@/components/upload/uploadEhs.vue";
import dayJs from 'dayjs';
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { InsertPolicyLaw, SelectPolicylawDetail, UpdatePolicyLaw, getOrganizeList } from "@/services/api.js";
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
      isClear: false,
      editContent: '',
      policyLawId: null,
      fileLists: [],
      fileDetail: [],
      noticeForm: {
        enterId: undefined,
        corporationId: undefined,
        policyLawSubject: undefined,
        subTitle: undefined,
        noticeType: undefined,
        content: undefined,
        fileId: [],
      },
      noticeRules: {
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
        vm.getNoticeDetail(id);
      })
    } else if (from.path == '/notice/noticePreview') {
      next(vm => {
        vm.editNotice();
      })
    } else {
      next()
    }
  },
  computed: {
    noticeType() {
      const dict = this.$store.state.setting.dictTypeData;
      const noticeInfo = dict.find(item => {
        return item.dictType == 'notification_announcement_type';
      });
      return noticeInfo.dictItem;
    },
  },
  created() {
    // 通知公告类型
    // this.noticeType = dictionary('noticeType');
  },
  methods: {
    submitEditor(value) {
      this.noticeForm.content = value;
      // var reg = /<[^<>]+>/g; //去标签
      // var value = value.replace(reg, "");
      // value = value.replace(/&nbsp;/gi, ""); //将空格全部替换
      // this.editorLength = value.length; //文字长度显示
      // console.log('文字长度显示=',this.editorLength);
      // if (!formValidator.formItemValidate(this, "content", "ruleForm")) {
      //   return;
      // }
    },
    // 提交
    noticeSubmit() {
      if (!formValidator.formAll(this, 'ruleForm')) {
        return
      }
      this.noticeForm.releaseTime = dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss');

      if (this.policyLawId) {
        const params = {
          ...this.noticeForm,
          noticeType: this.noticeForm.noticeType ? this.noticeForm.noticeType : '',
          id: this.policyLawId
        }
        UpdatePolicyLaw(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.$router.replace("/notice/systemNotice");
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        const params = {
          ...this.noticeForm,
          noticeType: this.noticeForm.noticeType ? this.noticeForm.noticeType : ''
        }
        InsertPolicyLaw(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.$router.replace("/notice/systemNotice");
          }
        }).catch(err => {
          console.log(err);
        })
      }
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
    // 预览
    noticePreview() {
      if (!formValidator.formAll(this, 'ruleForm')) {
        return
      }
      this.noticeForm.releaseTime = dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss');
      this.$store.commit("setting/noticeMsg", { ...this.noticeForm, fileDetail: this.fileDetail });
      this.$router.push("/notice/noticePreview");
    },
    // 从预览页返回编辑时候回填信息
    editNotice() {
      const msg = this.$store.state.setting.noticeMsg;
      console.log("iii====", msg);
      this.noticeForm.centerId = msg.centerId;
      this.noticeForm.corporationId = msg.corporationId;
      this.noticeForm.policyLawSubject = msg.policyLawSubject;
      this.noticeForm.subTitle = msg.subTitle;
      this.noticeForm.noticeType = msg.noticeType;
      this.noticeForm.organizationId = msg.organizationId;
      this.editContent = msg.content;
      this.fileLists = msg.fileDetail;
      this.handleSuccess(msg.fileDetail)
    },
    // 取消
    noticeCancel() {
      this.setKeepalive(true)
      this.$router.replace("/notice/systemNotice")
    },
    // 获取编辑详情
    getNoticeDetail(policyLawId = null) {
      SelectPolicylawDetail({ policyLawId }).then(res => {
        const policyMsg = res.data;
        this.policyLawId = policyLawId;
        this.fileLists = policyMsg.fileId ? policyMsg.fileId : [];
        this.noticeForm.policyLawSubject = policyMsg.policyLawSubject;
        this.noticeForm.subTitle = policyMsg.subTitle;
        this.noticeForm.noticeType = policyMsg.noticeType;
        this.noticeForm.organizationId = policyMsg.organizationId;
        this.noticeForm.centerId = policyMsg.centerId;
        this.noticeForm.corporationId = policyMsg.corporationId;
        this.editContent = policyMsg.content;
        this.handleSuccess(this.fileLists)
      }).catch(err => {
        console.log(err);
      })
    },
    // 文件上传成功
    handleSuccess(data) {
      this.fileDetail = [];
      this.noticeForm.fileId = [];
      for (let value of data) {
        const detail = {};
        let id = value.response ? value.response.data.id : value.uid;
        detail.uid = value.response ? value.response.data.id : value.uid;
        detail.url = value.response ? value.response.data.url : value.url;
        detail.name = value.name;
        this.fileDetail.push(detail)
        this.noticeForm.fileId.push(id)
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