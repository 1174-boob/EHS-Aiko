<template>
  <CommonModal :title="modelTitle" :visible="addChangeModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- <a-form-model-item ref="corporationId" label="所属组织" prop="corporationId">
          <a-select v-model="formModel.corporationId" placeholder="请选择" show-search :filter-option="filterOption">
            <a-select-option v-for="item in corporationList" :key="item.corporationId" :value="item.corporationId">{{item.orgAbbrName}}</a-select-option>
          </a-select>
        </a-form-model-item> -->
        <CommonSearchItem :CommonFormInline="formModel" :rules="rules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonSearchItem>
        <a-form-model-item ref="ppeType" label="PPE类型" prop="ppeType">
          <a-select v-model="formModel.ppeType" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in ppeTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="materialName" label="物料名称" prop="materialName">
          <a-input v-model.trim="formModel.materialName" :maxLength="30" placeholder="请输入物料名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item ref="brand" label="品牌/型号" prop="brand">
          <a-input v-model.trim="formModel.brand" :maxLength="30" placeholder="请输入品牌/型号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item ref="amount" label="数量" prop="amount">
          <a-input v-model.trim="formModel.amount" :maxLength="30" placeholder="请输入数量" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item ref="unit" label="单位" prop="unit">
          <a-select v-model="formModel.unit" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in unitList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
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
import { addPpeDepositoryApi, changePpeDepositoryApi } from "@/services/chemicalIdentSafetyTipsAdd.js";
import fromMaxLength from "@/mixin/fromMaxLength";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isEmpty } from "lodash";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  mixins: [fromMaxLength, cancelLoading, chemicalDict],
  model: {
    prop: 'addChangeModelShow',
  },
  props: ['addChangeModelShow', 'ppeTypeList', 'formModelOldData'],
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表单验证
      rules: {
        // corporationId: [{ required: true, message: "所属组织不能为空", trigger: "change" }],
        ppeType: [{ required: true, message: "PPE类型不能为空", trigger: "change" }],
        materialName: [{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        brand: [{ required: true, message: "品牌/型号不能为空", trigger: "blur" }],
        amount: [{ required: true, validator: formValidator.texTonlyNumberContainZero, trigger: "blur", text: '数量' }],
        unit: [{ required: true, message: "单位不能为空", trigger: "change" }],
      },
      // 新增、修改表单
      formModel: {},
      // 单位列表
      unitList: [],
    };
  },
  computed: {
    // 弹窗title
    modelTitle() {
      if (this.formModelOldData.inventoryId) {
        return '编辑'
      } else {
        return '新增'
      }
    },
  },
  methods: {
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
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
      let methodsName = this.formModelOldData.inventoryId ? 'changeDataFn' : 'addDataFn'
      this[methodsName]()
        .then(res => {
          this.closeModel()
          this.$emit('getTableList')
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 新增
    addDataFn() {
      let apiData = { ...this.formModel }
      apiData.corporationName = this.getMappingValue(this.corporationList, 'corporationId', this.formModel.corporationId).orgAbbrName
      return addPpeDepositoryApi(apiData)
        .then(res => {
          this.$antMessage.success(`新增成功`);
        })
        .catch(err => {
          return Promise.reject()
        })
    },
    // 编辑
    changeDataFn() {
      let apiData = { ...this.formModel }
      let orgAbbrNameObj = this.corporationList.find(item => item.corporationId == this.formModel.corporationId)
      apiData.corporationName = orgAbbrNameObj ? orgAbbrNameObj.orgAbbrName : ''
      return changePpeDepositoryApi(apiData)
        .then((res) => {
          this.$antMessage.success(`编辑成功`);
        })
        .catch(err => {
          return Promise.reject()
        })
    }
  },
  watch: {
    addChangeModelShow(newVal) {
      if (newVal) {
        // 单位字典
        this.unitList = this.getChemicalDictList('PPE_unit')
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
