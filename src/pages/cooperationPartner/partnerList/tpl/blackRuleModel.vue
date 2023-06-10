<template>
  <CommonModalSpin title="黑名单规则" :visible="blackRuleModelShow" :cancelFn="closeModel" :spinning="spinning">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="rule" label=" " prop="rule">
          <span>违章处罚达</span>
          <a-input-number class="rule-class" v-model="formModel.rule" :min="1" :max="9999" @blur="() => {$refs.rule.onFieldBlur()}" />
          <span>次的企业列入基地黑名单。</span>
        </a-form-model-item>
        <!-- <a-form-model-item ref="boeRule" label=" " prop="boeRule">
          <span>违章处罚达</span>
          <a-input-number class="rule-class" v-model="formModel.boeRule" :min="1" :max="9999" @blur="() => {$refs.boeRule.onFieldBlur()}" />
          <span>次的供应商列入B0E黑名单。</span>
        </a-form-model-item> -->
        <div>备注：列入基地黑名单的企业将无法被推送对应基地的安全培训与考核。</div>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">提交</a-button>
    </template>
  </CommonModalSpin>
</template>

<script>
import { selectBlacklistRuleDetail, saveBlacklistRule } from "@/services/api.js";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isEmpty } from "lodash";
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'blackRuleModelShow',
  },
  props: {
    blackRuleModelShow: {
      type: Boolean,
      default: false,
    },
    formModelOldData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      spinning: true,
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      // 表单验证
      rules: {
        rule: [
          { required: true, validator: this.ruleFormValidator, trigger: "blur" },
        ]
      },
      // 新增、修改表单
      formModel: {},
      ruleId: undefined,
    };
  },
  methods: {
    // 获取黑名单规则
    selectBlacklistRuleDetail() {
      selectBlacklistRuleDetail()
        .then(res => {
          let { rule, ruleId } = res.data
          this.formModel = { rule }
          this.ruleId = ruleId
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 包含0的非负整数
    ruleFormValidator(rule, value, callback) {
      let { required } = rule
      let { boeRule } = this.formModel
      if (!value && value !== 0) {
        required ? callback(new Error(`次数不能为空`)) : callback();
      } else if ((boeRule || boeRule === 0) && value >= boeRule) {
        required ? callback(new Error(`现地黑名单不能大于等于B0E黑名单次数`)) : callback();
      } else {
        callback();
      }
    },
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 提交
    onSubmit() {
      console.log(this.formModel)
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let apiData = {
        ... this.formModel,
        ruleId: this.ruleId
      }
      saveBlacklistRule(apiData)
        .then(() => {
          this.closeModel()
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
  },
  watch: {
    blackRuleModelShow(newVal) {
      if (newVal) {
        this.formModel = isEmpty(this.formModelOldData) ? {} : cloneDeep(this.formModelOldData)
        this.selectBlacklistRuleDetail()
      } else {
        setTimeout(() => {
          this.spinning = true
          this.formModel = {}
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.rule-class {
  width: 80px;
  margin: 0 10px;
}
</style>
