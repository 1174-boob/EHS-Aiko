<template>
  <CommonModal :title="modelTitle" :visible="signModalShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="editForm" :model="editForm" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <a-form-model-item class="flex" label="签名区域" prop="sealData">
          <SignComp ref="signRef" />
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
import { signBatchSafetyEduApi,signSingleSafetyEduApi } from "@/services/safetyEduArchives"
import cancelLoading from "@/mixin/cancelLoading";
import SignComp from '@/components/signComp/index.vue'
export default {
  components: { SignComp },
  mixins: [cancelLoading],
  model: {
    prop: 'signModalShow',
  },
  props: ['signModalShow', 'signTargetData'],
  data() {
    return {
      editForm: {},
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      rules: {
        shanggangyijian: [{ required: true, message: "不能为空", trigger: "change" }],
      },
      // 新增、修改表单
      formModel: {},
    };
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
    // 提交
    onSubmit() {
      const { base64UrlWithoutPrefix } = this.$refs.signRef.getSignBase64() || {}
      if (!base64UrlWithoutPrefix) {
        this.$antMessage.warn('请签署姓名!')
        return
      }
      this.handleLoading()
      const apiMethodsName = this.isBatch ? 'signBatchSafetyEdu' : 'signSingleSafetyEdu'
      this[apiMethodsName](base64UrlWithoutPrefix)
      .then(res=>{
        this.$emit('signOnOk')
        this.closeModel()
      })
      .catch(err=>{})
      .finally(()=>{
        setTimeout(() => {
          this.changeLoading()
        }, 300);
      })
    },
    // 批量签署api
    async signBatchSafetyEdu(sealData){
      let params = {
        idList: this.signTargetData,
        sealData,
      }
      await signBatchSafetyEduApi(params)
    },
    // 单独签署api
    async signSingleSafetyEdu(sealData){
      let params = {
        idList: this.signTargetData,
        sealData,
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
::v-deep .ant-modal-content {
  .model-content-form {
    padding: 0 111px 0 102px !important;
  }
}
<style lang="less" scoped></style>
