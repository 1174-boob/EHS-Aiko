<template>
  <CommonModal :title="modelTitle + '火灾报警控制运行情况'" :visible="inspectionRecordModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="normal" label="正常" prop="normal">
          <a-select v-model="formModel.normal" placeholder="请选择">
            <a-select-option v-for="item in dicOnly" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="failure" label="故障" prop="failure">
          <a-select v-model="formModel.failure" placeholder="请选择">
            <a-select-option v-for="item in dicOnly" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="fireAlarm" label="火警" prop="fireAlarm">
          <a-radio-group v-model="formModel.fireAlarm">
            <a-radio value="1">√</a-radio>
            <a-radio value="0">×</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="faultAlarm" label="故障报警" prop="faultAlarm">
          <a-select v-model="formModel.faultAlarm" placeholder="请选择">
            <a-select-option v-for="item in dicOnly" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="supervisionAlarm" label="监管报警" prop="supervisionAlarm">
          <a-select v-model="formModel.supervisionAlarm" placeholder="请选择">
            <a-select-option v-for="item in dicOnly" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="omissionOfReport" label="漏报" prop="omissionOfReport">
          <a-select v-model="formModel.omissionOfReport" placeholder="请选择">
            <a-select-option v-for="item in dicOnly" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="handlingSituation" label="报警、故障部位、原因及处理情况" prop="handlingSituation">
          <a-textarea v-model.trim="formModel.handlingSituation" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="startTime" label="值班时段" prop="startTime">
          <a-date-picker v-model.trim="formModel.startTime" valueFormat="YYYY-MM-DD hh:mm:ss" :allowClear="false" show-time placeholder="请选择" />
        </a-form-model-item>
        <a-form-model-item ref="dutyUserNameList" label="值班员" prop="dutyUserNameList">
            <!-- :checkedTreeNode="checkedTreeNode"
            :treeRoles="iRules"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :onPreview="!iFrom.corporationId"
            :treePlaceholder="iFrom.corporationId?'请选择' : '请先选择所属组织'"
            :deptTreeId="deptTreeId"
            @getTreeData="getTreeData" -->
          <StaffOrDept
            :labelTitle="'业务担当'"
            :propKey="'boeAssume'"
          ></StaffOrDept>
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
import { getDictConfigData } from "@/utils/dictionary.js";
import dictionary from "@/utils/dictionary.js";
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { StaffOrDept },
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
      dicOnly: [],
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.formModelOldData.historyId ? '编辑' : '新增'
    },
  },
  created() {
    console.log(dictionary('only'))
    this.dicOnly = dictionary('only');
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
