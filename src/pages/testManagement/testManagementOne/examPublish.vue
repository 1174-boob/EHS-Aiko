<template>
  <div class="exam-publish">
    <div class="publish-main">
      <h1 style="font-size: 16px">发布设置</h1>
      <a-form-model
        ref="ruleForm"
        :model="publishForm"
        :rules="publishRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :colon="false"
      >
        <a-form-model-item label="发布设置" prop="status">
          <a-radio-group v-model="publishForm.status">
            <a-radio value="1">立即发布</a-radio> <br />
            <a-radio value="2">暂不发布 <span class="tips">选择后无法推送考试提醒</span></a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="bottom_btnDiv">
      <a-button :style="{ marginLeft: '8px' }" @click="backStep"
        >上一步</a-button
      >
      <a-button type="primary" @click="completeExam">完成</a-button>
    </div>
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  data() {
    return {
      labelCol: { span: 1 },
      wrapperCol: { span: 17 },
      publishForm: {
        status:'1' //立即发布1====暂不发布2
      },
    }
  },
  computed: {
    publishRules() {
      let publishRules = {
        status: [
          { required: true, message: '发布设置不能为空', trigger: 'change' },
        ],
      }
      return publishRules
    },
  },
  methods: {
    backStep() {
      this.$emit("jumpPage",{page:2})
    },
    completeExam() {
      if (!formValidator.formAll(this, 'ruleForm')) {
        return
      }
      const data = {
        ...this.publishForm,
      }
      this.$emit("jumpPage",{data,page:'publish'})
    }
  }
};
</script>

<style lang='less' scoped>
.exam-publish {
  .publish-main {
    min-height: calc(100vh - 320px);
    ::v-deep .ant-form {
      .ant-radio-wrapper {
        margin-left: 10px;
      }
    }
    .tips {
      font-size: 12px;
      color: #7F7F7F;
    }
  }
  .bottom_btnDiv {
    text-align: right;
    padding: 0 20px;
    button {
      margin-right: 20px;
    }
}
}
</style>