<template>
  <common-layout>
    <div v-if="!showCompany" class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
    </div>
    <div v-if="!showCompany" class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{ textAlign: 'center' }" style="padding: 0 2px">
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入账户名"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                    initialValue: '13801010103',
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <!-- type="password" -->
              <a-input-password
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                    initialValue: 'a123456',
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input-password>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input size="large" placeholder="mobile number">
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="captcha">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a style="float: left">忘记密码</a>
          <router-link style="float: right" to="/dashboard/workplace">注册账户</router-link>
        </div>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%; margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 选择公司模块 -->
    <div v-if="showCompany">
      <a-page-header title="选择业务所在组织" @back="() => showCompany=false" style="width: 4.28rem;margin: 0 auto;">
        <div v-for="(item, index) in companyList" :key="index">
          <a-button key="1" type="primary" @click="handlSelectOrg(item)">{{ item.companyName }}</a-button>
        </div>
      </a-page-header>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations, mapActions } from "vuex";
import { getPublicKey, getDevToken, getDevCompany, getDevMessageBOE } from '@/services/api'
import JSEncrypt from 'jsencrypt'

export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      encrypt: new JSEncrypt(),
      showCompany: false,
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    async getPublicKey() {
      // 获取公钥加密
      try {
        const result = await getPublicKey();
        if (result.code == "20000") {
          let key = "-----BEGIN PUBLIC KEY-----" + result.data + "-----END PUBLIC KEY-----";
          sessionStorage.setItem("PUBLICKEY_Ziid", key);
          this.encrypt.setPublicKey(key);
        }
      } catch (e) {
        const _message = e?.response?.data?.msg;
        // this.$antMessage.error(_message, 2);
      }
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          this.loginIn()
        }
      })
    },
    async loginIn() {
      var _this = this;
      let params = {
        username: _this.form.getFieldValue("name"),
        password: _this.encrypt.encrypt(this.form.getFieldValue('password')),
        clientId: process.env.VUE_APP_CLIENTID,
        grant_type: 'password',
        scope: 'all',
        loginType: 0,
      }
      const formData = new FormData();
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
      this.formData = formData;
      try {
        let result = await getDevToken(formData);
        if (result.code == 20000) {
          // 存储跳转系统页的相关信息
          sessionStorage.setItem('access_token', result.access_token);
          sessionStorage.setItem('refresh_token', result.refresh_token);
          sessionStorage.setItem('token_type', result.token_type);
          sessionStorage.setItem('userName', result.userName);
          sessionStorage.setItem('userId', result.userId);
          // 查询系统list
          this.getCompanyList();
        } else if (result.code == 20004) {
          // 暂时提示
          //注册
          Modal.warning({
            title: result.message,
            onOk() {
              window.open('http://dev.boeplat.com.cn/html/zconsole/register');
            },
          });
        } else if (result.code == 20009) {
          // 暂时提示
          // 绑定手机号
          sessionStorage.setItem("userName", form.getFieldsValue().username);
          Modal.warning({
            title: result.message,
            onOk() {
              window.open(consoleBase + "/bindPhone");
            },
          });
        }
        this.logging = false
      } catch (e) {
        this.logging = false
      }
      // this.afterLogin(res)
    },

    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code >= 0) {
        const { user, permissions, roles } = loginRes.data;
        this.setUser(user);
        this.setPermissions(permissions);
        this.setRoles(roles);
        // 获取路由配置
        // this.getRoutesConfig(loginRes);
      } else {
        this.error = loginRes.message;
      }
    },
    // 开发内部控制台页面，暂时保留
    async getRoutesConfig(loginRes) {
      // let res = await getRoutesConfig();
      const routesConfig = res.data.data
      // loadRoutes(routesConfig)
      this.$router.push({ path: '/dashboard/workplace' }, () => { })
      // this.$router.push('/dashboard/workplace')
      this.$antMessage.success(loginRes.message, 3)
    },
    // 获取系统list
    async getCompanyList() {
      let resultCompany = await getDevCompany();
      if (resultCompany.code == 20000) {
        if (resultCompany.data.length >= 1) {
          this.companyList = resultCompany.data;
          this.showCompany = true;
        } else {
          this.showCompany = false;
          //企业认证，去控制台登录
          this.$antMessage.error('暂无租户，可去控制台登录进行企业认证绑定租户')
        }
      } else {
        this.showCompany = false;
      }
    },
    handlSelectOrg(item) {
      this.getUserMessage(item.companyId, item.type)
    },
    async getUserMessage(companyId, type) {
      let userId = sessionStorage.getItem('userId');
      let params = {
        companyId: companyId,
        userId: userId,
        type: type,
        clientId: process.env.VUE_APP_CLIENTID,
        isFindAdminInfo: false,
      };
      let result = await getDevMessageBOE(params);
      if (result.code == 20000) {
        sessionStorage.setItem('zconsole_userInfo', JSON.stringify(result.data));
        sessionStorage.setItem('userName', result.data.userName);
        this.$router.push("/overview/preview");
      } else {

      }
    }
  },
  mounted() {
    sessionStorage.clear();
    this.getPublicKey();
  }
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}

.ant-row {
  display: block !important;
}
.ant-page-header-heading {
  justify-content: flex-start !important;
}
</style>
<style>
</style>