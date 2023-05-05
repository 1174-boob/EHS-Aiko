<template>
  <!-- 修改邮箱组件 -->
  <div class="emailAndPhoneNumber-box clx-flex-1 clx-show-scroll beauty-scroll">
    <!-- title -->
    <div class="title">
      <back :color="'rgb(226, 232, 246)'" />
      <p>修改邮箱</p>
    </div>
    <!-- 步骤条 -->
    <div class="steps">
      <span :class="step >= 1 ? 'active' : ''">1.验证身份</span>
      <span :class="step >= 2 ? 'active' : ''">2.修改邮箱</span>
      <span :class="step >= 3 ? 'active' : ''">3.完成</span>
    </div>
    <!-- 警告-提醒 -->
    <div class="warning" v-if="step === 1">
      <a-icon type="exclamation-circle" theme="filled" style="color: #faad14" />
      <p>为确认是您本人操作，请完成以下验证</p>
    </div>
    <!-- 修改邮箱 -->
    <!-- 验证的信息 step1 -->
    <div class="target-info" v-if="step === 1">
      <p>
        绑定邮箱 :
        <span>{{ userInfo.email || "" }}</span>
      </p>
    </div>
    <!-- 验证的信息 step2-- -->
    <div class="target-info" v-if="step === 2">
      <!-- <p>
        原邮箱 :
        <span>{{userInfo.email}}</span>
      </p>-->
    </div>
    <!-- form--邮箱 step1 -->
    <div class="phone-auth" v-if="step === 1">
      <a-form-model ref="rulesCode" :model="formCode" :rules="rulesCode" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="邮箱验证码" prop="code" ref="code">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="formCode.code" @change="
                () => {
                  $refs.code.onFieldChange();
                }
              " />
            <a-button style="margin-left: 5%; width: 130px" type="primary" :disabled="isGetCodeNumber !== 60" @click="sendEmailCodeFn">
              {{
              isGetCodeNumber !== 60 ? isGetCodeNumber + "s" : "获取验证码"
              }}
            </a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label=" " :colon="false">
          <a-button type="primary" @click="stepFn">下一步</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- form--邮箱 step2-->
    <div class="phone-auth" v-if="step === 2">
      <a-form-model ref="rulesEmail" :model="formEmail" :rules="rulesEmail" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="新邮箱地址" prop="email">
          <a-input v-model="formEmail.email" placeholder="请输入新邮箱地址" />
        </a-form-model-item>
      </a-form-model>
      <a-form-model ref="rulesCode" :model="formCode" :rules="rulesCode" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="邮箱验证码" prop="code" ref="code2">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="formCode.code" @change="
                () => {
                  $refs.code2.onFieldChange();
                }
              " placeholder="请输入邮箱验证码" />
            <a-button style="margin-left: 5%; width: 130px" type="primary" :disabled="isGetCodeNumber !== 60" @click="sendEmailCodeFn">
              {{
              isGetCodeNumber !== 60 ? isGetCodeNumber + "s" : "获取验证码"
              }}
            </a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label=" " :colon="false">
          <a-button type="primary" @click="changeEmailFn">确定</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- form--邮箱 step3-->
    <div class="auto-back" style="text-align: center; margin-top: 1rem" v-if="step === 3">
      <img src="../../assets/img/bianzu.svg" alt />
      <span style="
          display: inline-block;
          margin: 0 0.1rem 0 0.2rem;
          font-size: 0.18rem;
        ">修改邮箱成功</span>
      <span style="font-size: 0.14rem">({{ isGetCodeNumberT }}s后自动关闭)</span>
    </div>
  </div>
</template>

<script>
import Back from "@/components/back/back.vue";
import {
  sendEmailCode,
  checkEmailCode,
  changeEmail,
  getUserInfo,
} from "@/services/api";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { clxTools } from "@/utils/clx-tools.js"; //引入跳转接收参数方法

export default {
  components: { Back },
  data() {
    return {
      step: 1,
      isGetCodeNumber: 60, //倒计时
      isGetCodeNumberT: 5,
      timerT: null,
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      // 步骤1
      formCode: {
        code: "",
      },
      rulesCode: {
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
      formEmail: {
        email: "",
      },
      rulesEmail: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "change" },
          { type: "email", message: "必须为邮箱格式", trigger: "blur" },
        ],
      },
      userInfo: null,
      timer: null,
      email: "",
    };
  },
  created() {
    let paramsObj = clxTools.hasRouteParams(this, "wxt_changeemail"); //列表页跳转过来的参数
    this.userInfo = paramsObj.userInfo;
  },
  methods: {
    // 发送手机验证码
    sendEmailCodeFn() {
      if (this.step == 2 && !formValidator.formAll(this, "rulesEmail")) {
        return;
      }
      let email = this.step == 2 ? this.formEmail.email : this.userInfo.email;
      let edit = this.step == 2 ? 3 : 4;
      let apiData = { email, edit };
      sendEmailCode(apiData)
        .then((res) => {
          if (res.code != 20001) {
            // 倒计时
            this.countDown();
          }
        })
        .catch((err) => { });
    },
    // step1 下一步 验证验证码
    stepFn() {
      if (!formValidator.formAll(this, "rulesCode")) return;
      // 接口
      let apiData = { source: this.userInfo.email, code: this.formCode.code };
      checkEmailCode(apiData)
        .then((res) => {
          if (res.code != 500) {
            this.$antMessage.success("验证通过");
            this.step++;
          }
          // this.step++;
        })
        .catch((err) => { });
    },
    // step2 确定修改邮箱
    async changeEmailFn() {
      let apiData = {
        email: this.formEmail.email,
        emailCode: this.formCode.code,
        usserId: this.userInfo.userId,
      };
      let result = await changeEmail(apiData);
      if (result.code == "20000") {
        this.step++;
        this.countDownT();
      }
    },

    //完成后倒计时
    countDownT() {
      this.isGetCodeNumberT = 4;
      if (this.timerT) window.clearInterval(this.timerT);
      this.timerT = setInterval(() => {
        this.isGetCodeNumberT--;
        if (this.isGetCodeNumberT === 0) {
          this.clearTimerT();
        }
      }, 1000);
    },
    clearTimerT() {
      this.isGetCodeNumberT = 5;
      if (this.timerT) window.clearInterval(this.timerT);
      this.$router.push("/account/accountInfo");
    },

    // 倒计时
    countDown() {
      this.isGetCodeNumber = 59;
      if (this.timer) window.clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.isGetCodeNumber--;
        if (this.isGetCodeNumber === 0) {
          this.clearTimer();
        }
      }, 1000);
    },
    clearTimer() {
      this.isGetCodeNumber = 60;
      if (this.timer) window.clearInterval(this.timer);
    },
  },
  watch: {
    step() {
      this.formCode = {
        code: "",
      };
      this.clearTimer();
    },
  },
  beforeDestroy() {
    if (this.timer) window.clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
