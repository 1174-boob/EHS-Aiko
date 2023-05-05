<template>
  <CommonModal :title="'巡检记录' + modelTitle" :visible="inspectionRecordModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="problemDescription" label="问题描述" prop="problemDescription">
          <a-textarea v-model.trim="formModel.problemDescription" :maxLength="300" placeholder="请输入问题描述" allowClear></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="result" label="处理方法及结果" prop="result">
          <a-textarea v-model.trim="formModel.result" :maxLength="300" placeholder="请输入处理方法及结果" allowClear></a-textarea>
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
import chemicalDict from "@/mixin/chemicalDict.js";
import { addInspectionRecordApi, editInspectionRecordApi } from '@/services/networkControl/onduty.js'
export default {
  mixins: [cancelLoading, chemicalDict],
  model: {
    prop: 'inspectionRecordModelShow',
  },
  props: {
    inspectionRecordModelShow: {
      type: Boolean,
      default: false,
    },
    formModelOldData: {
      default: () => { }
    },
    // 全部数据
    moduleList: {
      type: Array,
      default: () => [],
    },
    dutyId: {},
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      // 新增、修改表单
      formModel: {},
      // 表单验证
      rules: {
        problemDescription: [{ required: true, message: "问题描述不能为空", trigger: "blur" }],
        result: [{ required: true, message: "处理方法及结果不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.formModelOldData.historyId ? '编辑' : '新增'
    },
  },
  methods: {
    addInspectionRecordApi,
    editInspectionRecordApi,
    // 确定
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let methodsName = this.formModelOldData.historyId ? 'editInspectionRecordApi' : 'addInspectionRecordApi'
      let apiData = { ...this.formModel, type: '1', dutyId: this.dutyId }   //1-巡检记录；2-事件记录
      this[methodsName](apiData)
        .then(res => {
          // console.log('确定', this.formModel)
          let moduleListNew = cloneDeep(this.moduleList)
          if (this.formModel.historyId) {   // 修改
            let index = moduleListNew.findIndex(item => item.historyId == this.formModel.historyId)
            moduleListNew.splice(index, 1, { ...this.formModel })
          } else {   // 新增
            if (res.data) {
              let formModel = cloneDeep(this.formModel)
              formModel.historyId = res.data
              formModel.type = '1'
              moduleListNew.unshift(formModel)
            } else {
              this.$antMessage.warn(`新增失败`)
              return
            }
          }
          this.$emit('changeModuleList', moduleListNew)
          this.closeModel()
        })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
  },
  watch: {
    inspectionRecordModelShow(newVal) {
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
