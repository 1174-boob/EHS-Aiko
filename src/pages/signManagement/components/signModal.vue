<template>
  <CommonModal :title="'绘制签名'" :visible="signModalShow" :cancelFn="closeModel" id="signComp-model">
    <template slot="form">
      <a-form-model ref="editForm" :model="editForm" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <a-form-model-item class="flex" label="绘制区域" prop="sealData">
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
import { addSignManagementDataApi, editSignManagementDataApi } from "@/services/safetyEduArchives"
import cancelLoading from "@/mixin/cancelLoading";
import SignComp from '@/components/signComp/index.vue'
export default {
  components: { SignComp },
  mixins: [cancelLoading],
  model: {
    prop: 'signModalShow',
  },
  props: ['signModalShow', 'sealDataId'],
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
    };
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
      const apiName = this.sealDataId ? editSignManagementDataApi : addSignManagementDataApi

      let params = {
        sealData: base64UrlWithoutPrefix,
        sealDataId: this.sealDataId,
      }
      apiName(params)
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
#signComp-model {
  ::v-deep .ant-modal {
    min-width: 800px !important;
  }
}
</style>
