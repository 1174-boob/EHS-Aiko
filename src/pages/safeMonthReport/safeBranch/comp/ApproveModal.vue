<template>
  <CommonModal :title="title" :visible="approveVisible" :cancelFn="cancelFn">
      <div>
        <div class="pd-b-16">状态：{{isReject ? "审批驳回" : "审批通过"}}</div>
          <div>
            <div>审批意见</div>
            <a-textarea placeholder="请输入审批意见" v-model="rebackMsg" allowClear :maxLength="500" />
          </div>
      </div>
      <template slot="btn">
        <a-button  @click="cancelFn">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="confirmSend">发送</a-button>
      </template>
  </CommonModal>
</template>

<script>
import { debounce } from 'lodash'
export default {
  props: {
    approveVisible: {
      type: Boolean,
      default: false
    },
    isReject: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rebackMsg: ''
    }
  },
  computed: {
    title() {
      return this.isReject ? '驳回' : '办理'
    }
  },
  created() {
  },
  methods: {
    cancelFn() {
      this.rebackMsg = ''
      this.$emit('update:approveVisible', false)
    },
    confirmSend() {
      if (this.isReject) {
        this.doReject()
      } else {
        this.doApprove()
      }
    },
    doReject() {
      this.$emit('doReject', this.rebackMsg)
    },
    doApprove() {
      this.$emit('doApprove', this.rebackMsg)
    }
  }
}
</script>

<style scoped lang="less">
</style>