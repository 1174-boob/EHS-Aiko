<template>
  <CommonModal :title="engineType + '消防主机日检查情况记录'" :visible="inspectionRecordModelShowEngine" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="fireRoom" label="消防室" prop="fireRoom">
          <a-select v-model="formModel.fireRoom" placeholder="请选择">
            <a-select-option v-for="item in fireRoomList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="fireEngineOne" label="消防系统设备名称一" prop="fireEngineOne">
          <a-input v-model="formModel.fireEngineOne" placeholder="请输入消防主机型号一" />
        </a-form-model-item>
        <a-form-model-item ref="fireEngineTwo" label=" " :colon="false" prop="fireEngineTwo">
          <a-input v-model="formModel.fireEngineTwo" placeholder="请输入消防主机型号二" />
        </a-form-model-item>
        <a-form-model-item label="检查内容"></a-form-model-item>
        <a-form-model-item ref="selfTest" label="自检" prop="selfTest">
          <a-radio-group v-model="formModel.selfTest">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">异常</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="silencing" label="消音" prop="silencing">
          <a-radio-group v-model="formModel.silencing">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">异常</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="reset" label="复位" prop="reset">
          <a-radio-group v-model="formModel.reset">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">异常</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="mainPower" label="主电源" prop="mainPower">
          <a-radio-group v-model="formModel.mainPower">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">异常</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="standbyPower" label="备用电源" prop="standbyPower">
          <a-radio-group v-model="formModel.standbyPower">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">异常</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="handlingSituation" label="故障及处理情况" prop="handlingSituation">
          <a-textarea v-model.trim="formModel.handlingSituation" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="checkTime" label="检查时间" prop="checkTime">
          <a-date-picker
            v-model="formModel.checkTime"
            format="YYYY-MM-DD HH:mm:ss"
            show-time
            placeholder="请选择检查时间"
          />
        </a-form-model-item>
        
        <!-- <a-form-model-item ref="startTime" label="值班开始时间" prop="startTime">
          <a-time-picker style="width: 100%;" v-model="formModel.startTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择" />
        </a-form-model-item>
        <a-form-model-item ref="endTime" label="值班始时间" prop="endTime">
          <a-time-picker style="width: 100%;" v-model="formModel.endTime" format="HH:mm:ss" valueFormat="HH:mm:ss" placeholder="请选择" />
        </a-form-model-item> -->
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
import dayJs from "dayjs";
export default {
  components: { StaffOrDept },
  mixins: [cancelLoading, chemicalDict],
  model: {
    prop: 'inspectionRecordModelShowEngine',
  },
  props: {
    inspectionRecordModelShowEngine: {
      type: Boolean,
      default: false,
    },
    formModelOldData: {
      default: () => {}
    },
    engineType: {},
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
        fireEngineOne: [{ required: true, message: "不能为空", trigger: "blur" }],
        selfTest: [{ required: true, message: "不能为空", trigger: "blur" }],
        silencing: [{ required: true, message: "不能为空", trigger: "blur" }],
        reset: [{ required: true, message: "不能为空", trigger: "blur" }],
        mainPower: [{ required: true, message: "不能为空", trigger: "blur" }],
        standbyPower: [{ required: true, message: "不能为空", trigger: "blur" }],
        handlingSituation: [{ required: true, message: "不能为空", trigger: "blur" }],
        checkTime: [{ required: true, message: "不能为空", trigger: "change" }],
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
      console.log(this.formModel)
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      this.formModel.checkTime = dayJs(this.formModel.checkTime).format("YYYY-MM-DD HH:mm:ss")
      if(this.roomType == '编辑') {
        this.$emit('changeModuleList', this.formModel)
      } else {
        this.formModel.engineTimeStamp = new Date().getTime() + '';
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
    inspectionRecordModelShowEngine(newVal) {
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
