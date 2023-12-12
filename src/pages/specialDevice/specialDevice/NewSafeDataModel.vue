<template>
  <CommonModal :title="fireType" :visible="inspectionRecordModelShowFire" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="附件类型" prop="annexType">
          <a-select :disabled="disabled" v-model="formModel.annexType" placeholder="请选择附件类型" show-search :filter-option="filterOption">
            <a-select-option v-for="item in annexTypeOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="annexNum" label="附件编号" prop="annexNum">
          <a-input v-model.trim="formModel.annexNum" :maxLength="300" placeholder="附件编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item ref="modelNum" label="型号" prop="modelNum">
          <a-input v-model.trim="formModel.modelNum" :maxLength="300" placeholder="请输入型号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="设备状态" prop="annexStatus">
          <a-select :disabled="disabled" v-model="formModel.annexStatus" placeholder="请选择设备状态" show-search :filter-option="filterOption">
            <a-select-option v-for="item in annexStatusOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
          </a-select>
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
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isEmpty } from "lodash";
import chemicalDict from "@/mixin/chemicalDict.js";
import mixin from '../mixin'
import dictionary from "@/utils/dictionary.js";
import StaffOrDept from "@/components/staffOrDept";
export default {
  mixins: [mixin,cancelLoading, chemicalDict],
  model: {
    prop: 'inspectionRecordModelShowFire',
  },
  props: {
    inspectionRecordModelShowFire: {
      type: Boolean,
      default: false,
    },
    formModelOldData: {
      default: () => {}
    },
    fireType: {},
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      // 新增、修改表单
      formModel: {},
      rules: {
        annexNum: [{ required: true, message: "附件编号不能为空", trigger: "change" }],
        // modelNum: [{ required: true, message: "不能为空", trigger: "change" }],
        annexType: [
          { required: true, message: '请选择附件类型', trigger: ['blur', 'change'] },
        ],
        annexStatus: [
          { required: true, message: '请选择设备状态', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  created() {
  },
  methods: {
    
    // 确定
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      
      this.handleLoading()
      if(this.fireType == '编辑') {
        this.$emit('changeModuleList', this.formModel)
        console.log('编辑',this.formModel);
      } else {
        this.formModel.fireTimeStamp = new Date().getTime() + '';
        this.$emit('addModuleList', this.formModel)
        console.log('新增',this.formModel);
      }
      this.cancelLoading()
      this.closeModel()
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
  },
  watch: {
    inspectionRecordModelShowFire(newVal) {
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
