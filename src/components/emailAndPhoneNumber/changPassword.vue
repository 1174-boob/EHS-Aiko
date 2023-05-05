<template>
  <!-- 修改手机号组件 -->
  <div class="emailAndPhoneNumber-box clx-flex-1 clx-show-scroll beauty-scroll">
    <!-- title -->
    <div class="title">
      <back :color="'rgb(226, 232, 246)'" />
      <p>修改密码</p>
    </div>
    <!-- 警告-提醒 -->
    <div class="warning" v-if="step === 1">
      <a-icon type="exclamation-circle" theme="filled" style="color: #faad14" />
      <p>为确认是您本人操作，请完成以下验证</p>
    </div>
    <div class="phone-auth" v-if="step === 1">
      <a-form-model ref="rulesCode" :model="formCode" :rules="rulesCode" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="短信验证码" prop="phoneCode" ref="phoneCode">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="formCode.phoneCode" placeholder="请输入短信验证码" @blur="
                () => {
                  $refs.phoneCode.onFieldBlur();
                }
              " />
            <a-button style="margin-left: 5%; width: 130px" type="primary" :disabled="isGetCodeNumber !== 60" @click="sendPhoneCodeFn">
              {{
              isGetCodeNumber !== 60 ? isGetCodeNumber + "s" : "获取验证码"
              }}
            </a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label="原密码" prop="oldPassword" type="password">
          <a-input v-model="formCode.oldPassword" placeholder="请输入原密码" type="password" />
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="newPassword">
          <a-input v-model="formCode.newPassword" placeholder="请输入新密码" type="password" />
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="newPasswordAgain">
          <a-input type="password" v-model="formCode.newPasswordAgain" placeholder="请输入确认密码" />
        </a-form-model-item>

        <a-form-model-item label=" " :colon="false">
          <a-button type="primary" @click="stepFn">确定</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>

    <div class="auto-back" v-if="step === 3">
      <span>s后自动关闭</span>
    </div>
  </div>
</template>

<script>
import Back from "@/components/back/back.vue";
import {
  sendPhoneCode,
  ChangePassword,
  changePhone,
  getPublicKey,
} from "@/services/api";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import JSEncrypt from "jsencrypt";
import { clxTools } from "@/utils/clx-tools.js"; //引入跳转接收参数方法

const encrypt = new JSEncrypt();
export default {
  components: { Back },
  data() {
    return {
      step: 1,
      isGetCodeNumber: 60, //倒计时
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      // 步骤1
      formCode: {
        newPassword: "",
        newPasswordAgain: "",
        oldPassword: "",
        phoneCode: "",
      },
      rulesCode: {
        phoneCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
        newPassword: [
          {
            required: true,
            validator: formValidator.texTiPassword,
            trigger: "blur",
          },
        ],
        newPasswordAgain: [
          {
            required: true,
            validator: formValidator.texTiPasswordAgain,
            trigger: "blur",
            that: this,
          },
        ],
        oldPassword: [
          {
            required: true,
            validator: formValidator.texTiPassword,
            trigger: "blur",
          },
        ],
      },
      formPhone: {
        phone: "",
      },
      userInfo: null,
      timer: null,
    };
  },
  created() {
    let paramsObj = clxTools.hasRouteParams(this, "wxt_changepasswordPhone"); //列表页跳转过来的参数
    this.userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user;
    this.userInfo.phone = paramsObj.phone;
    console.log(this.userInfo, paramsObj, ".....paramsObj");
  },
  mounted() {
    this.getPublicKey();
  },
  methods: {
    async getPublicKey() {
      // 获取公钥加密
      try {
        const result = await getPublicKey();
        if (result.code == "20000") {
          let key = result.data;
          sessionStorage.setItem("PUBLICKEY_Zconsole", key);
        }
      } catch (e) {
        // const _message = e?.response?.data?.msg;
        // this.message.warning(_message, 2);
      }
    },
    // 发送手机验证码
    sendPhoneCodeFn() {
      sendPhoneCode({ phone: this.userInfo.phone })
        .then((res) => {
          // 倒计时
          this.countDown();
        })
        .catch((err) => { });
    },

    // 确定 修改密码
    stepFn() {
      if (!formValidator.formAll(this, "rulesCode")) return;
      // 接口
      let key = sessionStorage.getItem("PUBLICKEY_Zconsole");
      encrypt.setPublicKey(key);
      let apiData = {
        newPassword: encrypt.encrypt(this.formCode.newPassword),
        newPasswordAgain: encrypt.encrypt(this.formCode.newPasswordAgain),
        oldPassword: encrypt.encrypt(this.formCode.oldPassword),
        phone: this.userInfo.phone,
        phoneCode: this.formCode.phoneCode,
        userId: this.userInfo.userId,
      };
      ChangePassword(apiData)
        .then((res) => {
          if (res.code == "20000") {
            this.$antMessage.success("修改密码成功");
            this.$router.history.go(-1);
          }
        })
        .catch((err) => { });
    },

    // 倒计时
    countDown() {
      this.isGetCodeNumber = 59;
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
};
</script>

<style lang="less" scoped>
@import "./index.less";
// .phone-auth {
//   width: 70% !important;
// }
</style>
