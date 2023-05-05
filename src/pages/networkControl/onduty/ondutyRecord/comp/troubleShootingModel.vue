<template>
  <CommonModal title="故障维修记录" :visible="troubleShootingModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="maintenance" label="故障维修人员" prop="maintenance">
          <a-input v-model.trim="formModel.maintenance" :maxLength="100" placeholder="请输入故障维修人员" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item ref="spareParts" label="所用备件" prop="spareParts">
          <a-textarea v-model.trim="formModel.spareParts" :maxLength="100" placeholder="请输入所用备件" allowClear></a-textarea>
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
import { editOndutyTroubleShootingApi } from '@/services/networkControl/onduty.js'
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
        maintenance: [{ required: true, message: "故障维修人员不能为空", trigger: "blur" }],
        spareParts: [{ required: true, message: "所用备件不能为空", trigger: "blur" }],
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
      this.handleLoading()
      let apiData = {
        equipFireId: this.formModel.equipFireId,
        maintenance: this.formModel.maintenance,
        spareParts: this.formModel.spareParts,
        type: this.formModel.type,
        dutyId: this.dutyId,
      }
      editOndutyTroubleShootingApi(apiData)
        .then(res => {
          this.$emit('troubleShootingChange', false, { ...this.formModel })
          this.closeModel()
        })
        .finally(() => {
          this.cancelLoading()
        })
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
