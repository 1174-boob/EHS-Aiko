<template>
  <CommonModal :title="modelTitle" :visible="signModalShow" :cancelFn="closeModel" id="signComp-model">
    <template slot="form">
      <a-form-model ref="editForm" :model="editForm" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <a-form-model-item class="flex" label="签名区域" prop="sealData">
          <SignComp ref="signRef" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="发送短信手机号">
          <span style="font-Size:24px">{{userPhone}}</span>
        </a-form-model-item>
        <a-form-model-item class="flex" label="验证码" prop="code">
          <a-input allowClear :maxLength="8" style="width: 220px; margin-right: 15px" v-model="formModel.code" placeholder="请输入验证码"></a-input>
          <SendCodeButton/>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" :loading="loading" @click="onSubmit">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { signBatchSafetyEduApi, signSingleSafetyEduApi } from "@/services/safetyEduArchives"
import cancelLoading from "@/mixin/cancelLoading";
import SignComp from '@/components/signComp/index.vue'
import { debounce, cloneDeep } from 'lodash'
import { responsibilitySendCode } from "@/services/api.js";
import SendCodeButton from '@/components/sendCodeButton/index.vue'
export default {
  components: { SignComp,SendCodeButton },
  mixins: [cancelLoading],
  model: {
    prop: 'signModalShow',
  },
  props: ['signModalShow', 'signTargetData'],
  data() {
    return {
      editForm: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      rules: {
        shanggangyijian: [{ required: true, message: "不能为空", trigger: "change" }],
      },
      // 新增、修改表单
      formModel: {},
      userPhone: undefined,
    };
  },
  created() {
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userPhone = zconsole_userInfo.user.phone
  },
  computed: {
    // 是否批量签署
    isBatch() {
      return Array.isArray(this.signTargetData)
    },
    modelTitle() {
      return this.isBatch ? '批量签署' : '签署'
    },
  },
  methods: {
    // 发送验证码
    sendCode1: debounce(function () {
      responsibilitySendCode({})
        .then((res) => {
          this.$antMessage.success("发送成功！");
        })
        .catch((err) => { })
    }, 250, { leading: true, trailing: false }),
    // 提交
    onSubmit() {
      const { base64UrlWithoutPrefix } = this.$refs.signRef.getSignBase64() || {}
      if (!base64UrlWithoutPrefix) {
        this.$antMessage.warn('请签署姓名!')
        return
      }
      if (!this.formModel.code) {
        this.$antMessage.warn('请输入验证码!')
        return
      }
      this.handleLoading()
      const apiMethodsName = this.isBatch ? 'signBatchSafetyEdu' : 'signSingleSafetyEdu'
      this[apiMethodsName](base64UrlWithoutPrefix)
        .then(res => {
          this.$emit('signOnOk')
          this.closeModel()
        })
        .catch(err => { })
        .finally(() => {
          setTimeout(() => {
            this.changeLoading()
          }, 300);
        })
    },
    // 批量签署api
    async signBatchSafetyEdu(sealData) {
      let params = {
        idList: this.signTargetData,
        sealData,
      }
      await signBatchSafetyEduApi(params)
    },
    // 单独签署api
    async signSingleSafetyEdu(sealData) {
      let params = {
        phone: this.userPhone,
        id: this.signTargetData.id,
        sealData,
        code: this.formModel.code
      }
      await signSingleSafetyEduApi(params)
    },
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
  },
  watch: {
    signModalShow(newVal) {
      if (newVal) {

      } else {
        setTimeout(() => {
          this.formModel = {}
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .ant-modal-content {
  .model-content-form {
    padding: 0 111px 0 102px !important;
  }
}
</style>
