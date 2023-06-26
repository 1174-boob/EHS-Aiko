<template>
  <CommonModal :title="roomType + '控制室内其他消防系统运行情况'" :visible="inspectionRecordModelShowRoom" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="fireRoom" label="消防室" prop="fireRoom">
          <a-select v-model="formModel.fireRoom" placeholder="请选择">
            <a-select-option v-for="item in fireRoomList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="deviceName" label="消防系统设备名称" prop="deviceName">
          <a-input v-model="formModel.deviceName" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item ref="controlState" label="控制状态" prop="controlState">
          <a-radio-group v-model="formModel.controlState">
            <a-radio value="0">手动</a-radio>
            <a-radio value="1">自动</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="runningState" label="运行状态" prop="runningState">
          <a-radio-group v-model="formModel.runningState">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">故障</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="handlingSituation" label="故障及处理情况" prop="handlingSituation">
          <a-textarea v-model.trim="formModel.handlingSituation" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="startTime" label="值班开始时间" prop="startTime">
          <a-time-picker style="width: 100%;" v-model="formModel.startTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择" />
        </a-form-model-item>
        <a-form-model-item ref="endTime" label="值班结束时间" prop="endTime">
          <a-time-picker style="width: 100%;" v-model="formModel.endTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择" />
        </a-form-model-item>
          <!-- :checkedTreeNode="checkedTreeNode"
          :treeRoles="iRules"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :onPreview="!iFrom.corporationId"
          :treePlaceholder="iFrom.corporationId?'请选择' : '请先选择所属组织'"
          :deptTreeId="deptTreeId"
            -->
          <StaffOrDept
            :labelTitle="'值班员'"
            :propKey="'dutyUserIdList'"
            :checkedTreeNode="checkedTreeNode"
            @getTreeData="getTreeData"
          ></StaffOrDept>
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
    prop: 'inspectionRecordModelShowRoom',
  },
  props: {
    inspectionRecordModelShowRoom: {
      type: Boolean,
      default: false,
    },
    formModelOldData: {
      default: () => {}
    },
    roomType: {},
    dutyId: {},
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      // 新增、修改表单
      formModel: {},
      fireRoomList: [
        { key: '1', value: '一期' },
        { key: '2', value: '二期' }
      ],
      // 表单验证
      rules: {
        fireRoom: [{ required: true, message: "不能为空", trigger: "blur" }],
        deviceName: [{ required: true, message: "不能为空", trigger: "blur" }],
        controlState: [{ required: true, message: "不能为空", trigger: "blur" }],
        runningState: [{ required: true, message: "不能为空", trigger: "blur" }],
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
      if(this.roomType == '编辑') {
        this.$emit('changeModuleList', this.formModel)
      } else {
        this.formModel.roomTimeStamp = new Date().getTime() + '';
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
    inspectionRecordModelShowRoom(newVal) {
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
