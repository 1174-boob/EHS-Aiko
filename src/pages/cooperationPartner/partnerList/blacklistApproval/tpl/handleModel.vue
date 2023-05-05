<template>
  <CommonModal :title="modelTitle" :visible="handleModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formRole" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- <a-form-model-item ref="opinion" :label="modelTitle+'原因'" prop="opinion">
          <a-textarea :maxLength="300" v-model="formRole.opinion" :placeholder="`请输入${modelTitle}原因`"></a-textarea>
        </a-form-model-item>-->

        <template v-if="users">
          <a-form-model-item ref="handler" label="办理人" prop="handler">
            <a-checkbox-group v-model="formRole.handler">
              <a-checkbox v-for="item in users" :key="item.userId" :value="item.userId">{{item.name}}</a-checkbox>
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
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  mixins: [fromMaxLength, cancelLoading],
  model: {
    prop: 'handleModelShow',
  },
  props: ['handleModelShow', 'modelType', 'users',],
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 新增、修改表单
      formRole: {},
      userId: null,
    };
  },
  mounted() {
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
  },
  computed: {
    // 弹窗title
    modelTitle() {
      if (this.modelType == 'pass') {
        return '通过'
      } else {
        return '驳回'
      }
    },
    // 表单验证
    rules() {
      let rules = {
        opinion: [{ required: true, message: "原因不能为空", trigger: "blur" }],
      }
      if (this.modelType == 'pass') {
        rules.opinion[0].required = false
        if (this.users.length) {
          rules.handler = [{ required: true, message: "办理人不能为空", trigger: "change" }]
        }
      }
      return rules
    },
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      this.$emit('resolveFn', this.formRole.handler.toString())
    },
  },
  watch: {
    handleModelShow(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.formRole = {}
          this.cancelLoading()
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
