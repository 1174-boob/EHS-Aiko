<template>
  <CommonModal :title="fireType" :visible="inspectionRecordModelShowFire" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="description" label="异常问题描述" prop="description">
          <a-textarea v-model.trim="formModel.description" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="dealWith" label="异常问题处理情况" prop="dealWith">
          <a-textarea v-model.trim="formModel.dealWith" :maxLength="300" placeholder="请输入" allowClear></a-textarea>
        </a-form-model-item>
        <StaffOrDept
          :treeType="'user'"
          :propKey="'handleUserId'"
          :labelTitle="'处理人'"
          @getTreeData="personThingOne"
          :checkedTreeNode="formModel.handleUserId"
        ></StaffOrDept>
        <a-form-model-item ref="handleDate" label="处理时间" prop="handleDate">
          <a-date-picker style="width: 100%;" v-model="formModel.handleDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="请选择"/>
        </a-form-model-item>
        <StaffOrDept
          :treeType="'user'"
          :labelTitle="'安全管理员'"
          :propKey="'secureManageUserId'"
          @getTreeData="personThingTwo"
          :checkedTreeNode="formModel.secureManageUserId"
        ></StaffOrDept>
        <a-form-model-item ref="secureManageHandleDate" label="处理时间" prop="secureManageHandleDate">
          <a-date-picker style="width: 100%;" v-model="formModel.secureManageHandleDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="请选择"/>
        </a-form-model-item>
        <a-form-model-item ref="remark" label="备注" prop="remark">
          <a-input style="width: 100%;" v-model="formModel.remark" placeholder="请输入" />
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
      rules: {
        description: [{ required: true, message: "不能为空", trigger: "change" }],
        dealWith: [{ required: true, message: "不能为空", trigger: "change" }],
        handleUserId: [{ required: true, message: "不能为空", trigger: "change" }],
        secureManageUserId: [{ required: true, message: "不能为空", trigger: "change" }],
        handleDate: [{ required: true, message: "不能为空", trigger: "change" }],
        secureManageHandleDate: [{ required: true, message: "不能为空", trigger: "change" }],
      },
      dicOnly: [],
      checkedTreeNode: []
    };
  },
  created() {
    this.dicOnly = dictionary('only');
  },
  methods: {
    // 处理人
    personThingOne(data) {
      this.formModel.handleUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.formModel.handleUserName = this.getName(list);
      this.formModel.handleUserJobNumber = this.getWorkNum(list);
    },
    // 安全管理员
    personThingTwo(data) {
      this.formModel.secureManageUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.formModel.secureManageUserName = this.getName(list);
      this.formModel.secureManageUserJobNumber = this.getWorkNum(list);
    },
    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },
    //获取工号
    getWorkNum(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeCode);
        }
      }
      return listName;
    },
    // 确定
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      if(this.formModel.handleUserId.length > 1){
        this.$antMessage.warn('只能选择一名处理人！');
        return
      }
      if(this.formModel.secureManageUserId.length > 1){
        this.$antMessage.warn('只能选择一名安全管理员！');
        return
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
        // this.checkedTreeNode = this.formModel.dutyUserIdList;
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
