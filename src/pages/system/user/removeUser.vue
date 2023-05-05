<template>
  <div class="remove-user-box">
    <!-- 删除弹窗 -->
    <CommonModal
      :title="'删除用户'"
      :visible="removeUserModelShow"
      :cancelFn="handleCancel"
    >
    <!-- <a-modal class="clx-model" centered title="删除用户" :visible="removeUserModelShow" :footer="null" @cancel="handleCancel" :maskClosable="false" destroyOnClose> -->
      <!-- clx-model-body -->
      <div class="clx-model-body clx-modal-body-no-form beauty-scroll">
        <div class="box">
          <p :style="{
              fontSize: '14px',
              color: '#666',
              paddingLeft: '15px',
            }">将永久删除所选用户（包括用户数据等），删除后将带来以下影响：</p>
          <div class="margin-center">
            · 移除关联的权限策略
            <br />· 退出所有用户组
            <br />· 用户不能以当前企业的身份登录BOE工业互联网平台
            <br />· 删除的数据无法恢复
          </div>
          <div :style="{ margin: '0 auto', width: '350px', padding: '20px 0' }">
            <a-checkbox v-model="checked">
              <span :style="{ color: 'red' }">我已知晓上述风险，并同意{{isDelAll?'批量':''}}删除</span>
            </a-checkbox>
          </div>
        </div>
      </div>
      <!-- clx-model-btn -->
      <!-- <div class="clx-model-btn"> -->
      <div slot="btn">
        <a-button type="dashed" :loading="loading" @click="handleCancel">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" :disabled="!checked" :loading="loading" @click="onSubmitFrom">提交</a-button>
      </div>
    <!-- </a-modal> -->
    </CommonModal>
  </div>
</template>

<script>
export default {
  props: ["removeUserModelShow", 'isDelAll'],
  data() {
    return {
      checked: false,
      loading: false,
    };
  },
  mounted() { },
  methods: {
    handleCancel() {
      this.$emit("closeRemoveUserModelShow");
    },
    onSubmitFrom() {
      this.isDelAll ? this.$emit("delall") : this.$emit("delUserItem")
    },
  },
  watch: {},
};
</script>

<style lang="less">
.margin-center {
  padding: 15px;
  color: #333;
  // background: rgba(250, 173, 20, 0.14);
}
</style>
