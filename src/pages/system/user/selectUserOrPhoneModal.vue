<template>
  <!-- 用户名和手机号是否有重复 -->
  <div>
    <a-modal class="clx-model user-select-Modal" centered title="提示" :visible="selectUserOrPhoneModalShow" :footer="null" @cancel="closeSelectUserOrPhoneModal" :maskClosable="false" destroyOnClose>
      <div class="clx-model-body user-select-Modal-body beauty-scroll">
        <div class="user-select-Modal-body-top">
          <span>
            <template v-if="selectUserOrPhoneModalObj.userName">用户名({{selectUserOrPhoneModalObj.userName}})</template>
            <template v-if="selectUserOrPhoneModalObj.phone">手机号({{selectUserOrPhoneModalObj.phone}})</template>
            <template>已存在，您可以直接将已有用户直接加为企业子用户</template>
          </span>
        </div>
        <!-- 重复类型 1-用户名，2-手机号 -->
        <a-radio-group v-model="overwriteType">
          <a-radio v-if="selectUserOrPhoneModalObj.userName" :value="1" :style="radioStyle">用户名({{selectUserOrPhoneModalObj.userName}})</a-radio>
          <a-radio v-if="selectUserOrPhoneModalObj.phone" :value="2" :style="radioStyle">手机号({{selectUserOrPhoneModalObj.phone}})</a-radio>
        </a-radio-group>
      </div>

      <!-- clx-model-btn -->
      <div class="clx-model-btn">
        <a-button type="dashed" @click="closeSelectUserOrPhoneModal">返回重填</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="submitSelectUserOrPhoneModal">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'selectUserOrPhoneModalShow',
  },
  props: ['selectUserOrPhoneModalShow', 'selectUserOrPhoneModalObj'],
  data() {
    return {
      // 选择作为用户唯一标识的弹框选择值 1-用户名，2-手机号
      overwriteType: 1,
      // 单选框样式
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      overwriteObj: {
        1: 'userName',
        2: 'phone',
      }
    }
  },
  mounted() {
    this.overwriteType = this.selectUserOrPhoneModalObj.userName ? 1 : 2
    this.overwriteObj[1] = this.selectUserOrPhoneModalObj.userName
    this.overwriteObj[2] = this.selectUserOrPhoneModalObj.phone
  },
  methods: {
    // 取消-关闭model
    closeSelectUserOrPhoneModal() {
      this.$emit('input', false)
    },
    // 确定-提交
    submitSelectUserOrPhoneModal() {
      this.handleLoading()
      let overwriteType = this.overwriteType
      let overwriteInfo = this.overwriteObj[this.overwriteType]
      this.$emit('onSubmit', { overwriteType, overwriteInfo })
      setTimeout(() => {
        this.cancelLoading()
      }, 600);
    }
  }

};
</script>

<style lang="less" scoped>
.user-select-Modal-body-top {
  margin-bottom: 15px;
}
</style>
