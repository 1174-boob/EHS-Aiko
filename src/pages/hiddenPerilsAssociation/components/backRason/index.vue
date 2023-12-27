<template>
  <CommonModal :title="outTitle" :visible="backFlag" :cancelFn="cancleBackFlag">
    <template slot="form">
      <a-form-model
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        :label-col="{ style: { width: '130px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
        :colon="false"
        labelAlign="left"
      >
        <a-form-model-item class="flex" :label="title" prop="withdrawInfo">
          <a-textarea
            placeholder="最多可输入100字"
            v-model="addForm.withdrawInfo"
            allowClear
            :maxLength="100"
          />
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="cancleBackFlag">取消</a-button>
      <a-button class="m-l-15" type="primary" @click="submitDict"
        >确定</a-button
      >
    </template>
  </CommonModal>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";

export default {
  props: {
    outTitle: {
      type: String,
      default: "驳回申请",
    },
    title: {
      type: String,
      default: "驳回原因",
    },
    backFlag: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      addForm: {},
      addFormRules: {
        withdrawInfo: [
          {
            required: true,
            message: `${this.title}不能为空`,
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //驳回弹窗关闭
    cancleBackFlag() {
      this.$emit("cancleBackFlag");
      this.addForm = {};
    },

    //驳回弹窗确认
    submitDict() {
      if (!formValidator.formAll(this, "addForm")) {
        return;
      }
      this.$emit("cancleBackFlag", this.addForm);
      this.addForm = {};
    },
  },
};
</script>

<style>
</style>