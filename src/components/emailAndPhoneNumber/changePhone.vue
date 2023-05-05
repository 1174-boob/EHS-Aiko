<template>
  <!-- 修改手机号组件 -->
  <div class="emailAndPhoneNumber-box clx-flex-1 clx-show-scroll beauty-scroll">
    <!-- title -->
    <div class="title">
      <back :color="'rgb(226, 232, 246)'" />
      <p>修改手机号</p>
    </div>
    <!-- 步骤条 -->
    <div class="steps">
      <span :class="step >= 1 ? 'active' : ''">1.验证身份</span>
      <span :class="step >= 2 ? 'active' : ''">2.修改手机号码</span>
      <span :class="step >= 3 ? 'active' : ''">3.完成</span>
    </div>
    <!-- 警告-提醒 -->
    <div class="warning" v-if="step === 1">
      <a-icon type="exclamation-circle" theme="filled" style="color: #faad14" />
      <p>为确认是您本人操作，请完成以下验证</p>
    </div>
    <!-- 修改手机号 -->
    <!-- 验证的信息 step1 -->
    <div class="target-info" v-if="step === 1">
      <p>
        已验证手机 :
        <span>{{ userInfo.phone }}</span>
      </p>
    </div>
    <!-- 验证的信息 step2-- -->
    <div class="target-info" v-if="step === 2">
      <p>
        原手机号码 :
        <span>{{ userInfo.phone }}</span>
      </p>
    </div>
    <!-- form--手机号 step1 -->
    <div class="phone-auth" v-if="step === 1">
      <a-form-model ref="rulesCode" :model="formCode" :rules="rulesCode" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="短信验证码" prop="code" ref="code">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="formCode.code" @change="
                () => {
                  $refs.code.onFieldChange();
                }
              " />
            <a-button style="margin-left: 5%; width: 130px" type="primary" :disabled="isGetCodeNumber !== 60" @click="sendPhoneCodeFn">
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
    <!-- form--手机号 step2-->
    <div class="phone-auth" v-if="step === 2">
      <a-form-model ref="rulesPhone" :model="formPhone" :rules="rulesPhone" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="新手机号码" prop="phone">
          <a-input v-model="formPhone.phone" placeholder="请输入新手机号码" />
        </a-form-model-item>
      </a-form-model>
      <a-form-model ref="rulesCode" :model="formCode" :rules="rulesCode" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="短信验证码" prop="code" ref="code2">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="formCode.code" @change="
                () => {
                  $refs.code2.onFieldChange();
                }
              " placeholder="请输入短信验证码" />
            <a-button style="margin-left: 5%; width: 130px" type="primary" :disabled="isGetCodeNumber !== 60" @click="sendPhoneCodeFn">
              {{
              isGetCodeNumber !== 60 ? isGetCodeNumber + "s" : "获取验证码"
              }}
            </a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label=" " :colon="false">
          <a-button type="primary" @click="changePhoneFn">确定</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- form--手机号 step3-->
    <div class="auto-back" style="text-align: center; margin-top: 1rem" v-if="step === 3">
      <img src="../../assets/img/bianzu.svg" alt />
      <span style="
          display: inline-block;
          margin: 0 0.1rem 0 0.2rem;
          font-size: 0.18rem;
        ">修改手机号成功</span>
      <span style="font-size: 0.14rem">({{ isGetCodeNumberT }}s后自动关闭)</span>
    </div>
  </div>
</template>

<script>
import Back from "@/components/back/back.vue";
import { sendPhoneCode, checkPhoneCode, changePhone } from "@/services/api";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { clxTools } from "@/utils/clx-tools.js"; //引入跳转接收参数方法

export default {
  components: { Back },
  data() {
    return {
      step: 1,
      isGetCodeNumber: 60, //倒计时
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      isGetCodeNumberT: 5,
      timerT: null,
      // 步骤1
      formCode: {
        code: "",
      },
      rulesCode: {
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
      formPhone: {
        phone: "",
      },
      rulesPhone: {
        phone: [
          {
            required: true,
            validator: formValidator.texTphoneNumber,
            trigger: "change",
          },
        ],
      },
      userInfo: null,
      timer: null,
      phone: "",
    };
  },
  created() {
    let paramsObj = clxTools.hasRouteParams(this, "wxt_changetel"); //列表页跳转过来的参数
    this.userInfo = paramsObj.userInfo;
    // this.userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user;
    // this.phone = this.$route.query.phone;
    console.log(paramsObj, "...paramsObj");
  },
  methods: {
    // 发送手机验证码
    sendPhoneCodeFn() {
      if (this.step == 2 && !formValidator.formAll(this, "rulesPhone")) {
        return;
      }
      let phone = this.step == 2 ? this.formPhone.phone : this.userInfo.phone;
      let apiData = { phone };
      sendPhoneCode(apiData)
        .then((res) => {
          // 倒计时
          this.countDown();
        })
        .catch((err) => { });
    },

    // step1 下一步 验证验证码
    stepFn() {
      if (!formValidator.formAll(this, "rulesCode")) return;
      // 接口
      let apiData = {
        phone: this.step == 2 ? this.formPhone.phone : this.userInfo.phone,
        phoneCode: this.formCode.code,
      };
      checkPhoneCode(apiData)
        .then((res) => {
          if (res.code != 500) {
            this.$antMessage.success("验证通过");
            this.step++;
          }
        })
        .catch((err) => { });
    },
    // step2 确定修改手机号完成
    changePhoneFn() {
      let apiData = {
        phone: this.formPhone.phone,
        phoneCode: this.formCode.code,
        userId: this.userInfo.userId,
      };
      changePhone(apiData)
        .then((res) => {
          if (res.code == "20000") {
            this.step++;
            this.countDownT();
          }
        })
        .catch((err) => { });
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
