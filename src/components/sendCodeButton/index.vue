<template>
  <!-- 发送短信按钮组件 -->
  <a-button :type="type" @click="sendCode" :disabled="countdownNumber !== 60" :style="btnStyle">{{ countdownNumber !== 60 ? countdownNumber + "s" : "发送短信" }}</a-button>
</template>

<script>
import { debounce } from 'lodash'
import { responsibilitySendCode } from "@/services/api.js";
export default {
  props: {
    type: {
      default: 'default',
    },
    btnStyle:{
      default:()=>{
        return {
          flex:1,
          minWidth:'90px',
        }
      }
    },
    // 开始倒计时
    startCountDown: {
      type: Boolean,
      default: false,
    },
    // 结束倒计时
    endCountDown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      countdownNumber: 60,
      countdownTimer: null,
    }
  },
  methods: {
    // 发送验证码
    sendCode: debounce(function () {
      if (this.$listeners.sendCode) {
        this.$emit('sendCode')
      } else {
        responsibilitySendCode({})
          .then((res) => {
            this.countDown()
            this.$antMessage.success("发送成功！");
          })
          .catch((err) => { })
      }
    }, 300, { leading: true, trailing: false }),

    // 开始倒计时
    countDown() {
      this.countdownNumber = 59;
      this.countdownTimer && window.clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.countdownNumber--;
        if (this.countdownNumber === 0) {
          this.clearTimer();
        }
      }, 1000);
    },

    // 清除倒计时
    clearTimer() {
      this.countdownNumber = 60;
      this.countdownTimer && window.clearInterval(this.countdownTimer);
    },
  },
  watch:{
    startCountDown(newVal){
      newVal && this.countDown()
    },
    endCountDown(newVal){
      newVal && this.clearTimer()
    },
  }
}
</script>

<style lang="less" scoped>
</style>
