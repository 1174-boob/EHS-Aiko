<template>
  <a-dropdown :overlayClassName="'header-avatar-box'">
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" shape="circle" :src="avatarUrl" />
      <!-- <span class="name">{{user.name}}</span> -->
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <!-- 头像 -->
      <a-menu-item>
        <div class="avatar-menu-header-avatar" style="cursor: pointer">
          <a-avatar :size="90" class="avatar" shape="circle" :src="avatarUrl" />
          <span class="name"></span>
          <!-- <span class="name">{{ userInfo.nickName }}</span> -->
        </div>
        <div class="company">
          <div class="company-name">当前公司：{{company?company.companyName:'您尚未进行企业认证'}}</div>
          <span style="color:#0067cc" @click="changeCompany">切换</span>
        </div>
      </a-menu-item>
      <a-menu-divider />
      <!-- 中间信息按钮 -->
      <a-menu-item class="avatar-menu-header-item" @click="goMyInfo">
        <div class="avatar-menu-header-ico-box">
          <a-icon class="avatar-menu-header-ico" style="color: #0bb2fb" type="user" />
        </div>
        <span class="avatar-menu-header-ico-text">我的信息</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item class="avatar-menu-header-item" @click="goHelpCenter">
        <div class="avatar-menu-header-ico-box avatar-menu-header-ico-box2">
          <a-icon class="avatar-menu-header-ico" style="color: #39cb7f" type="question-circle" />
        </div>
        <span class="avatar-menu-header-ico-text">帮助中心</span>
      </a-menu-item>
      <a-menu-divider />

      <!-- 退出登录 -->
      <a-menu-item @click="logout" class="avatar-menu-logout">
        <a-button type="primary" class="avatar-menu-logout-btn" block>退出登录</a-button>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { logout, changeCompany } from "@/services/api";
// import { logout } from '@/services/user'
import headFile from "@/assets/updateHead/headFile.js";
import dImg from "@/assets/images/overview/morentouxiang.png";
export default {
  name: "HeaderAvatar",
  data() {
    return {
      dImg,
      // 待支付订单
      notPayNum: 0,
      // 待续费产品
      notRenewNum: 10,
      // 是否已认证
      isAttestation: false,
      headFile,
    };
  },

  computed: {
    ...mapGetters("account", ["user"]),
    userInfo() {
      console.log("------", this.$store.state.userInfo.userInfo.company);
      return this.$store.state.userInfo.userInfo.user;
    },
    company() {
      return this.$store.state.userInfo.userInfo.company
    },
    avatarUrl() {
      let avatarUrl = "";
      avatarUrl = this.headFile.filter((item) => {
        return item.id == this.userInfo.avatorId;
      });
      avatarUrl = avatarUrl.length ? avatarUrl[0].url : this.dImg;
      return avatarUrl;
    },
  },
  methods: {
    // 退出
    logout() {
      this.logoutFn();
    },
    changeCompany() {
      changeCompany().then(res => {
        if (res.code == 20000) {
          this.$router.push("/login");
          // window.location.href =
          //   process.env.VUE_APP_LOGIN_URL +
          //   "client_id=" +
          //   process.env.VUE_APP_CLIENTID +
          //   "&response_type=" +
          //   process.env.VUE_APP_RESPONSE_TYPE +
          //   "&redirect_uri=" +
          //   process.env.VUE_APP_REDIRECT_URI;
        }
      })
    },
    logoutFn() {
      this.$antConfirm({
        title: "确认退出登录？",
        onOk: () => {
          sessionStorage.clear();
          if (process.env.NODE_ENV === "production") {
            this.$router.push("/login");
            // window.location.href =
            //   process.env.VUE_APP_LOGIN_URL +
            //   "client_id=" +
            //   process.env.VUE_APP_CLIENTID +
            //   "&response_type=" +
            //   process.env.VUE_APP_RESPONSE_TYPE +
            //   "&redirect_uri=" +
            //   process.env.VUE_APP_REDIRECT_URI +
            //   "&isLogout=true";
          } else {
            this.$router.push("/login");
          }
        },
        onCancel() { },
      });
    },
    // 跳转帮助中心
    goHelpCenter() {
      window.location.href = process.env.VUE_APP_ZCLOUD_URL + "/#/documentCenter";
    },
    // 跳转我的信息-账号信息
    goMyInfo() {
      this.$router.push({ path: "/account/accountInfo" });
    },
    // 跳转企业信息
    goCompanyInfo() {
      this.$antMessage.info("此功能暂未开通");
    },
    // 切换角色
    switchRolesShowFn() {
      this.$emit("switchRolesShowFn");
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin: 0 16px 0 41px;
    width: 40px;
    height: 40px;
  }
  .name {
    font-weight: 500;
  }
}
.ant-dropdown-menu-item:hover,
.ant-dropdown-menu-submenu-title:hover {
  background-color: #fff !important;
}
.avatar-menu {
  width: 3.5rem;
  padding: 0 0.25rem !important;
  .ant-dropdown-menu-item {
    padding: 0px 12px;
  }
  // menu头像
  .avatar-menu-header-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.24rem 0.1rem 0;
    .name {
      margin: 0.1rem 0 0 0;
      font-size: 0.18rem;
      font-weight: 500;
    }
  }
  .company {
    margin-bottom: 0.2rem;
    color: #333;
    position: relative;
    height: 0.15rem;
    display: flex;
    align-items: center;
    .company-name {
      display: inline-block;
      max-width: 2.4rem;
      margin-right: 0.04rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  // 未启用
  .avatar-menu-header-item-box {
    height: 210px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .avatar-menu-header-item {
    font-size: 0.16rem;
    height: 0.8rem;
    display: flex;
    align-items: center;
    &:hover {
      background: rgba(0, 0, 0, 0.025) !important;
    }
    .avatar-menu-header-ico-box {
      border-radius: 0.05rem;
      background-color: #e6f4ff;
      border-color: #e6f4ff;
      display: flex;
      align-self: center;
      justify-content: center;
      width: 0.4rem;
      height: 0.4rem;
      &:hover {
        background-color: #0bb2fb;
        border-color: #0bb2fb;
        .avatar-menu-header-ico {
          color: #fff !important;
        }
      }
      i {
        display: flex;
        align-self: center;
        justify-content: center;
      }
    }
    .avatar-menu-header-ico-box2 {
      background-color: #ebfaf2;
      border-color: #ebfaf2;
      &:hover {
        background-color: #39cb7f;
        border-color: #39cb7f;
      }
    }
    .avatar-menu-header-ico-text {
      margin-left: 0.25rem;
    }
  }
  // 退出按钮
  .avatar-menu-logout {
    padding: 0.3rem 0 !important;
    .avatar-menu-logout-btn {
      height: 0.5rem;
      & > span {
        font-size: 0.16rem;
      }
    }
  }
  .ant-dropdown-menu-item-divider {
    margin: 0 !important;
  }
}
</style>
