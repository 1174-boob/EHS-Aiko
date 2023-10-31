<template>
  <CommonModalSpin class="table-modal" :title="modelTitle" :visible="addChangeModelShow" :cancelFn="closeModel" :spinning="spinning">
    <template slot="form">
      <a-form-model
        ref="ruleForm"
        :model="formModel"
        :rules="editFormRules"
        :label-col="{ style: { width: '94px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 94px)' } }"
        :colon="false"
        labelAlign="left"
      >
        <a-form-model-item class="flex" label="设立目的" prop="purposeOfEstablishment">
          <a-input v-model="formModel.purposeOfEstablishment" :maxLength="200" placeholder="请输入设立目的"></a-input>
        </a-form-model-item>

        <a-form-model-item class="flex" label="项目" prop="project">
          <a-input v-model="formModel.project" :maxLength="200" placeholder="请输入项目"></a-input>
        </a-form-model-item>

        <a-form-model-item class="flex" label="定义" prop="definition">
          <a-textarea v-model="formModel.definition" :maxLength="300" placeholder="请输入定义"></a-textarea>
        </a-form-model-item>

        <!-- 分值 -->
        <a-form-model-item class="flex" label="分值" prop="score">
          <a-input-number v-model="formModel.score" :min="0" :step="0.1" placeholder="请输入分值" :precision="1" />
        </a-form-model-item>
        <div class="m-b-20">
          <vxe-table
            class="vxe-scrollbar beauty-scroll-fireBox"
            border
            align="center"
            ref="xTable"
            show-overflow
            :edit-config="{trigger: 'click', mode: 'cell'}"
            :column-config="{resizable: true}"
            :row-config="{height: 60, isHover: true}"
            :data="modalTableData"
          >
            <vxe-column field="calculationDetails" title="计算明细" min-width="200" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入计算明细'}">
              <template #edit="{ row }">
                <vxe-input maxlength="100" v-model="row.calculationDetails" type="text" placeholder="请点击输入计算明细" allowClear></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="indicatorUnit" title="指标单位" width="180" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入指标单位'}">
              <template #edit="{ row }">
                <vxe-input v-model="row.indicatorUnit" type="text" maxlength="10" placeholder="请点击输入指标单位" allowClear></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="pointsDeductions" title="扣分分值" width="180" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入扣分分值'}">
              <template #edit="{ row }">
                <vxe-input v-model="row.pointsDeductions" placeholder="请点击输入扣分分值" type="float" min="0" digits="1" clearable></vxe-input>
              </template>
            </vxe-column>
            <vxe-column title="操作" field="action" width="140" align="center" fixed="right">
              <template #default="{ row , rowIndex}">
                <a-button class="m-r-15" @click="insertDeductPoints(row.purposeCode, rowIndex)">+</a-button>
                <a-button class="color-red" @click="deleteEvent(row.purposeCode, rowIndex)" v-if="checkTypeNum > 1">-</a-button>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <a-form-model-item class="flex" label="备注" prop="remarks">
          <a-input v-model="formModel.remarks" :maxLength="300" placeholder="请输入备注"></a-input>
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
import { cloneDeep, isEmpty } from "lodash";
import { addMaturityEvalua, editMaturityEvaluaEdit, getMaturityEvaluaItemDetails } from "@/services/maturityEvaluation.js";
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'addChangeModelShow',
  },
  props: ['addChangeModelShow', 'addChangeModelOldData'],
  data() {
    return {
      spinning: false,
      formModel: {},
      modalTableData: [
        {
          calculationDetails: "",
          indicatorUnit: "",
          pointsDeductions: ""
        }
      ],
      // 表单验证
      editFormRules: {
        purposeOfEstablishment: [
          { required: true, message: "设立目的不能为空", trigger: "blur" },
        ],
        project: [
          { required: true, message: "项目不能为空", trigger: "blur" },
        ],
        definition: [
          { required: true, message: "定义不能为空", trigger: "blur" },
        ],
        score: [
          { required: true, message: "分值不能为空", trigger: "blur" },
        ],
        remarks: [
          { required: false, message: "备注不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    isEdit() {
      return Boolean(this.addChangeModelOldData?.maturityEvaluationIndexId)
    },
    modelTitle() {
      return this.isEdit ? '编辑' : '新增'
    },
    checkTypeNum() {
      return this.modalTableData.length;
    }
  },
  methods: {
    // 新增弹框-新增计算明细按钮
    insertDeductPoints(index) {
      let record = {
        calculationDetails: "",
        indicatorUnit: "",
        pointsDeductions: ""
      };
      this.modalTableData.splice(index + 1, 0, record);
    },

    deleteEvent(index) {
      this.modalTableData.splice(index, 1);
    },

    // 获取详情
    getEditDetails() {
      const { maturityEvaluationIndexId } = this.addChangeModelOldData
      getMaturityEvaluaItemDetails({ maturityEvaluationIndexId })
        .then(res => {
          this.formModel = res.data
          this.modalTableData = res.data.itemList
        })
        .catch(err => { })
        .finally(()=>{
          this.spinning = false
        })
    },
    
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      let hasEmpty = this.modalTableData.some(i => !(i.calculationDetails && i.indicatorUnit && i.pointsDeductions))
      if (hasEmpty) {
        this.$antMessage.warn("请正确填写计算明细！");
        return false
      }

      let apiData = {
        ...this.formModel,
        itemList: this.modalTableData
      }
      this.handleLoading()
      const apiFn = this.isEdit ? editMaturityEvaluaEdit : addMaturityEvalua
      apiFn(apiData)
        .then(res => {
          this.$antMessage.success(`${this.modelTitle}成功`);
          this.closeModel()
          this.$emit('getTableList')
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoading()
        })
    },

    closeModel() {
      this.$emit('input', false)
    },
  },
  watch: {
    addChangeModelShow(newVal) {
      if (newVal) {
        if(this.isEdit){
          this.spinning = true
          this.getEditDetails()
        }else{
          this.spinning = false
        }
      } else {
        setTimeout(() => {
          this.formModel = {}
          this.modalTableData = [
            {
              calculationDetails: "",
              indicatorUnit: "",
              pointsDeductions: ""
            }
          ]
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
