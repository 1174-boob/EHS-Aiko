<template>
  <CommonModal :title="modelTitle" :visible="handleModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formRole" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="opinion" :label="modelTitle+'原因'" prop="opinion">
          <a-textarea :maxLength="300" v-model="formRole.opinion" :placeholder="`请输入${modelTitle}原因`"></a-textarea>
        </a-form-model-item>
        <!-- <a-form-model-item ref="opinion" :label="'下一节点'" v-if="modelType == 'pass'">
          <span>{{nextInfoStatusName}}</span>
        </a-form-model-item>-->
        <template v-if="step==1 && modelType == 'pass' && plainOptions.length">
          <a-form-model-item ref="securityUser" label="办理人" prop="securityUser">
            <a-checkbox-group v-model="formRole.securityUser">
              <a-checkbox v-for="item in plainOptions" :key="item.value" :value="item.value">{{item.label}}</a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
        </template>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">提交</a-button>
    </template>
  </CommonModal>
</template>

<script>
import fromMaxLength from "@/mixin/fromMaxLength";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  mixins: [fromMaxLength, cancelLoading],
  model: {
    prop: 'handleModelShow',
  },
  props: ['handleModelShow', 'modelType', 'nextInfoStatusName', 'step', 'plainOptions'],
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 新增、修改表单
      formRole: {},
    };
  },
  mounted() {
  },
  computed: {
    // 弹窗title
    modelTitle() {
      if (this.modelType == 'pass') {
        return '通过'
      } else if (this.modelType == 'reject') {
        return '驳回'
      } else {
        return '关闭'
      }
    },
    // 表单验证
    rules() {
      let rules = {
        opinion: [{ required: true, message: "原因不能为空", trigger: "blur" }],
      }
      if (this.modelType == 'pass' || this.modelType == 'close') {
        rules.opinion[0].required = false
      }
      if (this.step == 1 && this.modelType == 'pass') {
        rules.securityUser = [{ required: true, message: "办理人不能为空", trigger: "change" }]
      }
      return rules
    },
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let methodsName = this.modelType == 'pass' ? 'iSaveApi' : (this.modelType == 'reject' ? 'iRejectApi' : 'iEndCloseApi')
      let securityUser = this.formRole.securityUser ? this.formRole.securityUser.join() : undefined
      this.$parent[methodsName](this.formRole.opinion, securityUser)
        .finally(() => {
          this.cancelLoading()
        })
    },
  },
  watch: {
    handleModelShow(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.formRole = {}
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}
</style>
