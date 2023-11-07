<template>
  <CommonModalSpin title="数据填报" :visible="checkFillModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="editFormRules" :label-col="{ style: { width: '94px' } }" :wrapper-col="{ style: { width: 'calc(100% - 94px)' } }" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formModel" :rules="editFormRules" :notTablePage="true" :hasDepartment="true" deptLabel="部门"></CommonSearchItem>

        <a-form-model-item class="flex" label="年份" prop="year">
          <el-date-picker v-model="formModel.year" type="year" style="width:100%" value-format="yyyy" placeholder="请选择年份" :clearable="false"></el-date-picker>
        </a-form-model-item>

        <a-form-model-item class="flex" label="月度" prop="month">
          <a-select v-model="formModel.month" placeholder="请选择月度">
            <a-select-option v-for="(i,index) in monthOption" :key="index" :value="i.value">{{i.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" :loading="loading" @click="onSubmit">确定</a-button>
    </template>
  </CommonModalSpin>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import { getMaturityEvaDataConfigDetails } from "@/services/maturityEvaluation.js";
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'checkFillModelShow',
  },
  props: ['checkFillModelShow'],
  data() {
    return {
      formModel: {},
      editFormRules: {
        corporationId: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        year: [
          { required: true, message: "年份不能为空", trigger: "change" },
        ],
        month: [
          { required: true, message: "月度不能为空", trigger: "change" },
        ],
      },
      monthOption: [
        { name: '1月', value: 1 },
        { name: '2月', value: 2 },
        { name: '3月', value: 3 },
        { name: '4月', value: 4 },
        { name: '5月', value: 5 },
        { name: '6月', value: 6 },
        { name: '7月', value: 7 },
        { name: '8月', value: 8 },
        { name: '9月', value: 9 },
        { name: '10月', value: 10 },
        { name: '11月', value: 11 },
        { name: '12月', value: 12 },
      ],
    };
  },
  methods: {
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      let apiData = {
        ...this.formModel,
      }
      this.handleLoading()
      getMaturityEvaDataConfigDetails(apiData)
        .then(res => {
          if(res.data.finalSocre || res.data.finalSocre === 0){
            this.$antMessage.warn('当前部门在该月份已填报，请重新选择！')
            return
          }
          sessionStorage.setItem('ehs_aiko_maturityEvaluationDataFilling',JSON.stringify(apiData))
          this.$router.push({
            path: "/ehsGerneralManage/maturityEvaluation/maturityEvaluationDataFilling"
          })
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoading(300)
        })
    },

    closeModel() {
      this.$emit('input', false)
    },
  },
  watch: {
    checkFillModelShow(newVal) {
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
</style>
