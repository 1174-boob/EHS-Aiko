<template>
  <CommonModal title="消防系统CRT每日检测" :visible="troubleShootingModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="detectionTime" label="检测时间" prop="detectionTime">
          <span>{{formModel.detectionTime}}</span>
        </a-form-model-item>
        <a-form-model-item ref="fire" label="火警系统" prop="fire">
          <a-radio-group v-model="formModel.fire">
            <a-radio value="1">√</a-radio>
            <a-radio value="2">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="tgms" label="TGMS系统" prop="tgms">
          <a-radio-group v-model="formModel.tgms">
            <a-radio value="1">√</a-radio>
            <a-radio value="2">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="vesda" label="VESDA系统" prop="vesda">
          <a-radio-group v-model="formModel.vesda">
            <a-radio value="1">√</a-radio>
            <a-radio value="2">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="gas" label="可燃气探测系统" prop="gas">
          <a-radio-group v-model="formModel.gas">
            <a-radio value="1">√</a-radio>
            <a-radio value="2">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="radio" label="消防广播系统" prop="radio">
          <a-radio-group v-model="formModel.radio">
            <a-radio value="1">√</a-radio>
            <a-radio value="2">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="video" label="视频监控系统" prop="video">
          <a-radio-group v-model="formModel.video">
            <a-radio value="1">√</a-radio>
            <a-radio value="2">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="checkPerson" label="检查人" prop="checkPerson">
          <a-input v-model.trim="formModel.checkPerson" :maxLength="100" placeholder="请输入检查人"></a-input>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">提交</a-button>
    </template>
  </CommonModal>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isEmpty } from "lodash";
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'troubleShootingModelShow',
  },
  props: {
    troubleShootingModelShow: {
      type: Boolean,
      default: false,
    },
    formModelOldData: {
      default: () => { }
    },
    dutyId: {},
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      // 新增、修改表单
      formModel: {},
      // 表单验证
      rules: {
        fire: [{ required: true, message: "火警系统不能为空", trigger: "change" }],
        tgms: [{ required: true, message: "TGMS系统不能为空", trigger: "change" }],
        vesda: [{ required: true, message: "VESDA系统不能为空", trigger: "change" }],
        gas: [{ required: true, message: "可燃气探测系统不能为空", trigger: "change" }],
        radio: [{ required: true, message: "消防广播系统不能为空", trigger: "change" }],
        video: [{ required: true, message: "视频监控不能为空", trigger: "change" }],
        checkPerson: [{ required: true, message: "检查人不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 提交
    onSubmit() {
      // console.log(this.formModel)
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.$emit('fireFightingSystemChange', false, { ...this.formModel })
      this.closeModel()
    },
  },
  watch: {
    troubleShootingModelShow(newVal) {
      if (newVal) {
        this.formModel = isEmpty(this.formModelOldData) ? {} : cloneDeep(this.formModelOldData)
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
</style>
