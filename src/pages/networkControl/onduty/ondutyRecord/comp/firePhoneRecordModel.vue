<template>
  <CommonModal :title="'消防业务电话记录表' + modelTitle" :visible="firePhoneRecordModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="telName" label="来电人姓名" prop="telName">
          <a-input v-model.trim="formModel.telName" :maxLength="30" placeholder="请输入来电人姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="telJobNumber" label="员工编号" prop="telJobNumber">
          <a-input v-model.trim="formModel.telJobNumber" :maxLength="30" placeholder="请输入员工编号"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="telDept" label="所属部门" prop="telDept">
          <a-input v-model.trim="formModel.telDept" :maxLength="30" placeholder="请输入所属部门"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="telNum" label="来电号码" prop="telNum">
          <a-input v-model.trim="formModel.telNum" :maxLength="30" placeholder="请输入来电号码"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="telDate" label="来电时间" prop="telDate">
          <a-date-picker v-model.trim="formModel.telDate" valueFormat="YYYY-MM-DD hh:mm:ss" style="width:100%" :allowClear="false" show-time placeholder="请选择来电时间" />
        </a-form-model-item>
        <a-form-model-item ref="description" label="主要业务描述" prop="description">
          <a-textarea v-model.trim="formModel.description" :maxLength="100" placeholder="请输入主要业务描述"></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="answer" label="电话接听人" prop="answer">
          <a-input v-model.trim="formModel.answer" :maxLength="30" placeholder="请输入电话接听人"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="remark" label="备注" prop="remark">
          <a-textarea v-model.trim="formModel.remark" :maxLength="100" placeholder="请输入备注" allowClear></a-textarea>
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
import { addFirePhoneRecordListApi, editFirePhoneRecordListApi } from '@/services/networkControl/onduty.js'
export default {
  mixins: [cancelLoading,],
  model: {
    prop: 'firePhoneRecordModelShow',
  },
  props: {
    firePhoneRecordModelShow: {
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
        telName: [{ required: true, message: "来电人姓名不能为空", trigger: "blur" }],
        telJobNumber: [{ required: true, message: "员工编号不能为空", trigger: "blur" }],
        telDept: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
        telNum: [{ required: true, message: "来电号码不能为空", trigger: "blur" }],
        telDate: [{ required: true, message: "来电时间不能为空", trigger: "change" }],
        description: [{ required: true, message: "主要业务描述不能为空", trigger: "blur" }],
        answer: [{ required: true, message: "电话接听人不能为空", trigger: "blur" }],
        remark: [{ required: false, message: "备注不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.formModelOldData.telId ? '编辑' : '新增'
    },
  },
  methods: {
    addFirePhoneRecordListApi,
    editFirePhoneRecordListApi,
    // 确定
    onSubmit() {
      console.log(this.formModel);
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let methodsName = this.formModelOldData.telId ? 'editFirePhoneRecordListApi' : 'addFirePhoneRecordListApi'
      let apiData = { ...this.formModel, dutyId: this.dutyId }
      this[methodsName](apiData)
        .then(res => {
          // console.log('确定', this.formModel)
          let moduleListNew = cloneDeep(this.moduleList)
          if (this.formModel.telId) {   // 修改
            let index = moduleListNew.findIndex(item => item.telId == this.formModel.telId)
            moduleListNew.splice(index, 1, { ...this.formModel })
          } else {   // 新增
            if (res.data) {
              let formModel = cloneDeep(this.formModel)
              formModel.telId = res.data
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
    firePhoneRecordModelShow(newVal) {
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
