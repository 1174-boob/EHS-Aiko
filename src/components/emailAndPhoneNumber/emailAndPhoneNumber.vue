<template>
  <!-- 修改手机号、邮箱组件 -->
  <div class="emailAndPhoneNumber-box clx-flex-1 clx-show-scroll beauty-scroll">
    <!-- title -->
    <div class="title">
      <back :color="'rgb(226, 232, 246)'" />
      <p>修改{{ typeObj[type].targetTitle }}</p>
    </div>
    <!-- 步骤条 -->
    <div class="steps">
      <span :class="step >= 1 ? 'active' : ''">1.验证身份</span>
      <span :class="step >= 2 ? 'active' : ''"
        >2.修改{{ type == 1 ? "手机号码" : "邮箱地址" }}</span
      >
      <span :class="step >= 3 ? 'active' : ''">3.完成</span>
    </div>
    <!-- 警告-提醒 -->
    <div class="warning" v-if="step === 1">
      <a-icon type="exclamation-circle" theme="filled" style="color: #faad14" />
      <p>为确认是您本人操作，请完成以下验证</p>
    </div>
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
        <span>18210250494</span>
      </p>
    </div>
    <!-- form--手机号 step1 -->
    <div class="phone-auth" v-if="step === 1">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="短信验证码" prop="code">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="form.code" />
            <a-button
              style="margin-left: 5%; width: 130px"
              type="primary"
              :disabled="isGetCode"
              @click="sendPhoneCodeFn"
              >{{ isGetCode ? isGetCodeNumber + "s" : "获取验证码" }}</a-button
            >
          </div>
        </a-form-model-item>
        <a-form-model-item label=" " :colon="false">
          <a-button type="primary" @click="stepFn">下一步</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- form--手机号 step2-->
    <div class="phone-auth" v-if="step === 2">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="新手机号码" prop="phone">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="form.phone" placeholder="请输入新手机号码" />
          </div>
        </a-form-model-item>
        <a-form-model-item label="短信验证码" prop="code">
          <div style="display: flex; align-items: center; height: 39px">
            <a-input v-model="form.code" placeholder="请输入短信验证码" />
            <a-button
              style="margin-left: 5%"
              type="primary"
              :disabled="isGetCode"
              @click="sendPhoneCodeFn"
              >{{ isGetCode ? isGetCodeNumber + "s" : "获取验证码" }}</a-button
            >
          </div>
        </a-form-model-item>
        <a-form-model-item label=" " :colon="false">
          <a-button type="primary" @click="stepFn">确定</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- form--手机号 step3-->
    <div class="auto-back" v-if="step === 3">
      <span>s后自动关闭</span>
    </div>
  </div>
</template>

<script>
import Back from "@/components/back/back.vue";
import { sendPhoneCode, checkPhoneCode } from "@/services/api";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  components: { Back },
  data() {
    return {
      step: 2,
      isGetCode: false,
      isGetCodeNumber: 60, //倒计时
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      type: 1, //1手机号  2邮箱
      typeObj: {
        1: {
          targetTitle: "手机号",
        },
        2: {
          targetTitle: "邮箱",
        },
      },
      form: {
        phone: "",
        code: "",
      },
      rules: {
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
      },
      userInfo: null,
    };
  },
  created() {
    this.type = this.$route.params.type;
    this.userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user;
  },
  methods: {
    // 发送手机验证码
    sendPhoneCodeFn() {
      if (!formValidator.formAll(this, "ruleForm")) {
        formValidator.clearFormItemValidate(this, "code", "ruleForm");
        return;
      }
      let apiData = { phone: this.userInfo.phone };
      sendPhoneCode(apiData)
        .then((res) => {
          // 倒计时
          this.countDown();
        })
        .catch((err) => {});
    },
    // 倒计时
    countDown() {
      this.isGetCode = true;
      let timer = setInterval(() => {
        this.isGetCodeNumber--;
        if (this.isGetCodeNumber === 0) {
          this.isGetCodeNumber = 60;
          this.isGetCode = false;
          window.clearInterval(timer);
        }
      }, 1000);
    },
    // 下一步
    stepFn() {
      if (!formValidator.formAll(this, "ruleForm")) return;
      // 接口
      let apiData = { phone: this.userInfo.phone, phoneCode: this.form.name };
      checkPhoneCode(apiData)
        .then((res) => {
          if (res.code != 500) {
            this.step++;
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="less" scoped>
.emailAndPhoneNumber-box {
  // title
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    & > p {
      margin: 0 10px;
      color: #181818;
      font-weight: bold;
    }
  }
  // 步骤条
  .steps {
    color: #2c3e50;
    box-sizing: border-box;
    display: flex;
    .active {
      background: #e9f4ff;
      color: #1890ff;
    }
    & > span {
      width: 25%;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      margin-right: 20px;
      background: #f1f2f9;
      position: relative;
      font-weight: 600;
      &:before {
        content: "";
        width: 0;
        height: 0;
        border: 20px solid;
        border-color: transparent transparent transparent #f1f2f9;
        position: absolute;
        right: -40px;
      }
      &:nth-child(2),
      &:nth-child(3) {
        padding-left: 30px;
        &:after {
          content: "";
          width: 0;
          height: 0;
          border: 20px solid;
          border-color: transparent transparent transparent #fff;
          position: absolute;
          left: 0px;
        }
      }
    }
  }
  // 警告-提醒
  .warning {
    display: flex;
    align-items: center;
    margin: 20px 3% 10px;
    & > p {
      margin: 0 10px;
    }
  }
  // 验证的信息
  .target-info {
    margin: 20px 3%;
    & > p {
      margin: 0 0px;
    }
  }
  // 自动返回
  .auto-back {
    margin: 30px 15px;
    font-size: 16px;
  }
}
</style>
