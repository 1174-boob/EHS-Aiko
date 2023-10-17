<template>
  <CommonModal :title="'添加'" :visible="inspectionRecordModelShowFire" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="handlingSituation" label="发现问题描述" prop="handlingSituation">
          <a-textarea v-model.trim="formModel.handlingSituation" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="handlingSituation" label="问题处理情况" prop="handlingSituation">
          <a-textarea v-model.trim="formModel.handlingSituation" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <StaffOrDept
          :labelTitle="'处理人'"
          :propKey="'dutyUserIdList'"
          :checkedTreeNode="checkedTreeNode"
          @getTreeData="getTreeData"
        ></StaffOrDept>
        <a-form-model-item ref="startTime" label="处理时间" prop="startTime">
          <a-time-picker style="width: 100%;" v-model="formModel.startTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择" />
        </a-form-model-item>
        <StaffOrDept
          :labelTitle="'处理人'"
          :propKey="'dutyUserIdList'"
          :checkedTreeNode="checkedTreeNode"
          @getTreeData="getTreeData"
        ></StaffOrDept>
        <a-form-model-item ref="endTime" label="处理时间" prop="endTime">
          <a-time-picker style="width: 100%;" v-model="formModel.endTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择" />
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
import dictionary from "@/utils/dictionary.js";
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { StaffOrDept },
  mixins: [cancelLoading, chemicalDict],
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
    dutyId: {},
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      // 新增、修改表单
      formModel: {},
      // 表单验证
      fireRoomList: [
        { key: '1', value: '一期' },
        { key: '2', value: '二期' }
      ],
      rules: {
        fireRoom: [{ required: true, message: "不能为空", trigger: "blur" }],
        normal: [{ required: true, message: "不能为空", trigger: "blur" }],
        failure: [{ required: true, message: "不能为空", trigger: "blur" }],
        fireAlarm: [{ required: true, message: "不能为空", trigger: "blur" }],
        faultAlarm: [{ required: true, message: "不能为空", trigger: "blur" }],
        supervisionAlarm: [{ required: true, message: "不能为空", trigger: "blur" }],
        omissionOfReport: [{ required: true, message: "不能为空", trigger: "blur" }],
        handlingSituation: [{ required: true, message: "不能为空", trigger: "blur" }],
        startTime: [{ required: true, message: "不能为空", trigger: "change" }],
        endTime: [{ required: true, message: "不能为空", trigger: "change" }],
        dutyUserIdList: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      dicOnly: [],
      checkedTreeNode: []
    };
  },
  created() {
    this.dicOnly = dictionary('only');
  },
  methods: {
    getTreeData(value) {
      this.formModel.dutyUserIdList = value.treeIdList;
      this.formModel.dutyUserNameList = value.treeNameAndCodeList.map((item)=>{
        return item.treeName
      });
      this.checkedTreeNode = value.treeIdList;
      if (!formValidator.formItemValidate(this, "dutyUserIdList", "ruleForm")) {
        return;
      }
    },
    // 确定
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      if(this.fireType == '编辑') {
        this.$emit('changeModuleList', this.formModel)
      } else {
        this.formModel.fireTimeStamp = new Date().getTime() + '';
        this.$emit('addModuleList', this.formModel)
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
        this.checkedTreeNode = this.formModel.dutyUserIdList;
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
