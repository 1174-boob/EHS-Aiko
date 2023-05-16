<template>
  <a-layout :class="['admin-layout', 'beauty-scroll', 'height-all']">
    <a-layout class="admin-layout-main beauty-scroll">
      <boeplat-header
        :nodeEnv="nodeEnv"
        :userInfo="userInfo"
        :headerMenuShow="false"
        :showSwitch="false"
        :dropDownShow="false"
        :headerMenuList="headerMenuList"
        :logoObjCustom="logoObjCustom"
        :loginInfos="loginInfos"
        :showTitleAndIdTips="false"
        :promote="false"
        :applicationList="applicationList"
        @logout="logoutFn"
        @hoverIn="hoverIn"
        @searchKeyword="searchKeyword"
      ></boeplat-header>
      <a-layout class="admin-layout-main-main">
        <!-- 菜单 -->
        <drawer v-if="isMobile" v-model="drawerOpen" class="menu-top">
          <side-menu
            :theme="theme.mode"
            :menuData="menuData"
            :collapsed="false"
            :collapsible="false"
            @menuSelect="onMenuSelect"
          />
        </drawer>
        <side-menu
          @toggleCollapse="toggleCollapse"
          :class="[fixedSideBar ? 'fixed-side' : '']"
          :theme="theme.mode"
          v-else-if="(layout === 'side' || layout === 'mix') && showMenu"
          :menuData="sideMenuData"
          :collapsed="collapsed"
          :collapsible="true"
          :sideMenuWidth="sideMenuWidth"
        />
        <!-- 主要内容区域 -->
        <a-layout-content
          class="admin-layout-content"
          :class="!showMenu ? 'admin-layout-content-left' : ''"
        >
          <slot></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/breadcrumb.vue";
import AdminHeader from "./header/AdminHeader";
// import PageFooter from './footer/PageFooter'
import Drawer from "../components/tool/Drawer";
import SideMenu from "../components/menu/SideMenu";
// import Setting from '../components/setting/Setting'
import { mapState, mapMutations, mapGetters } from "vuex";
import { changeCompany,getHeaderList,GetUpcomingNum,selectByNameOrWokerNum } from "@/services/api";
import headFile from "@/assets/updateHead/headFile.js";
import dImg from "@/assets/images/overview/morentouxiang.png";
// const minHeight = window.innerHeight - 64 - 122

export default {
  name: "AdminLayout",
  components: { SideMenu, Drawer, AdminHeader, Breadcrumb },
  data() {
    return {
      dImg,
      headFile,
      dropDownShow: true,
      applicationList:[],
      minHeight: window.innerHeight - 64 - 122,
      collapsed: false,
      showSetting: false,
      drawerOpen: false,
      menuShow: true,
      nodeEnv: process.env,
      logoObjCustom: require("@/assets/header/ehs.svg"),
      // userInfo: {
        // portrait: this.avatarUrl,
      // },
      loginInfos: [],
      // id匹配title规则：1：BOE工业互联网平台; 2：控制台;3：工单;4：文档;5：消息;6：用户
      headerMenuList: [
        // {
        //   id: 1,
        //   title: "BOE工业互联网平台",
        //   url: process.env.VUE_APP_API_BASE_URL,
        //   path: "",
        // },
        // {
        //   id: 2,
        //   title: "控制台",
        //   url:process.env.VUE_APP_LOGIN_URL +
        //     "client_id=" +
        //     process.env.VUE_APP_ZICONSOLE_CLIENTID +
        //     "&response_type=" +
        //     process.env.VUE_APP_ZICONSOLE_RESPONSE_TYPE +
        //     "&redirect_uri=" +
        //     process.env.VUE_APP_ZICONSOLE_REDIRECT_URI,
        //   path: "",
        // },
        // {
        //   id: 3,
        //   title: "工单",
        //   url:process.env.VUE_APP_LOGIN_URL +
        //     "client_id=" +
        //     process.env.VUE_APP_ZICONSOLE_CLIENTID +
        //     "&response_type=" +
        //     process.env.VUE_APP_ZICONSOLE_RESPONSE_TYPE +
        //     "&redirect_uri=" +
        //     process.env.VUE_APP_ZICONSOLE_REDIRECT_URI +
        //     "&route_url=" +
        //     "/work/workOrder",
        //   path: "",
        // },
        // {
        //   id: 4,
        //   title: "文档",
        //   url:process.env.VUE_APP_API_BASE_URL +'#/documentCenter',
        //   path: "",
        // },
        // {
        //   id: 5,
        //   title: "消息",
        //   url:process.env.VUE_APP_API_BASE_URL + '/html/ziconsole/preview' +'#/news/newsList',
        //   path: "",
        // },
        // {
        //   id: 6,
        //   title: "用户",
        //   url:'',
        //   path: "/systemManagement/organization",
        // },
      ],
    };
  },
  provide() {
    return {
      adminLayout: this,
    };
  },
  watch: {
    $route(val) {
      this.setActivated(val);
    },
    layout() {
      this.setActivated(this.$route);
    },
    isMobile(val) {
      if (!val) {
        this.drawerOpen = false;
      }
    },
  },
  computed: {
    ...mapState("setting", [
      "isMobile",
      "theme",
      "layout",
      "footerLinks",
      "copyright",
      "fixedHeader",
      "fixedSideBar",
      "fixedTabs",
      "hideSetting",
      "multiPage",
    ]),
    ...mapGetters("setting", ["firstMenu", "subMenu", "menuData"]),
    sideMenuWidth() {
      return this.collapsed ? "60px" : "225px";
    },
    headerStyle() {
      let width =
        this.fixedHeader && this.layout !== "head" && !this.isMobile
          ? `calc(100% - 0%)`
          : "100%";
      let position = this.fixedHeader ? "fixed" : "static";
      return `width: ${width}; position: ${position};`;
    },
    headMenuData() {
      const { layout, menuData, firstMenu } = this;
      return layout === "mix" ? firstMenu : menuData;
    },
    sideMenuData() {
      const { layout, menuData, subMenu } = this;
      let data = layout === "mix" ? subMenu : menuData
      return data;
    },
    showMenu() {
      let showMenu = true;
      let hideMenuPathArr = [
        "/orderPay/packageSelect",
        "/orderPay/pay",
        "/orderPay/paySuccess",
        "/orderPay/payTry",
        "/orderPay/payTrySuccess",
        "/orderPay/upgrade",
        "/orderPay/renew",
        "/orderPay/renewSuccess",
        "/orderPay/upgradeSuccess",
        "/orderPay/offlinePaySuccess",
      ];
      if (hideMenuPathArr.includes(this.$route.path)) showMenu = false;
      return showMenu;
    },
    userInfoall() {
      return JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
    },
    userInfo() {
      let portrait = "";
      let obj = {};
      if (this.userInfoall.user && this.userInfoall.user.profilePath) {
        portrait = this.userInfoall.user.profilePath;
      } else {
        portrait = "";
      }
      obj.portrait = portrait; //头像
      obj.company = this.userInfoall.company
        ? this.userInfoall.company.companyName
        : ""; //企业名称
      obj.username = this.userInfoall.user ? this.userInfoall.user.name : ""; //用户名称
      return obj;
    },
    showSwitch() {
      if (this.userInfoall.company && this.userInfoall.company.companyName) {
        return true;
      } else {
        return false;
      }
    },
    // avatarUrl() {
    //   let avatarUrl = "";
    //   avatarUrl = this.headFile.filter((item) => {
    //     return item.id == this.userInfo.avatorId;
    //   });
    //   avatarUrl = avatarUrl.length ? avatarUrl[0].url : this.dImg;
    //   return avatarUrl;
    // },
  },
  methods: {
    ...mapMutations("setting", ["correctPageMinHeight", "setActivatedFirst"]),
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    hoverIn() {
      let obj = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
      // if (obj.user && obj.user.type == "0") {
      //   GetUpcomingNum().then((res) => {
      //     this.loginInfos.forEach((item) => {
      //       if (item.name == "订单") {
      //         item.amount = res.data.orderNum;
      //       }
      //       if (item.name == "优惠券") {
      //         item.amount = res.data.couponNum;
      //       }
      //       if (item.name == "企链") {
      //         item.amount = res.data.partnerNum;
      //       }
      //     });
      //   });
      // }
    },
    // 根据工号查询个人台账id
    getUserDetail() {
      let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo'));
      const workNum = userInfo.user.jobNumber;
      if(workNum) {
        selectByNameOrWokerNum({workNum}).then(res=>{
          const data = res.data[0];
          if(data && data.id) {
            let standingId = data.id;
            const obj = {
              name: "个人信息",
              path: `/occupationHealth/standingBookDetail?id=${standingId}`,
              url: ``,
              amount: "",
              iconUrl: "account",
            };
            // this.loginInfos.push(obj);
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    },
    // 产品方块下拉列表搜索关键字
    searchKeyword(val) {
      // this.getHeaderListFn(val);
    },
    // 请求列表
    // getHeaderListFn(val) {
    //   let params = { productName: val ? val : "" };
    //   getHeaderList(params)
    //     .then((res) => {
    //       let applicationList = res.data;
    //       applicationList = applicationList.filter((item) => {
    //         return (
    //           (item.children && item.children.length) ||
    //           (item.products && item.products.length)
    //         );
    //       });

    //       this.applicationList = applicationList;
    //     })
    //     .catch((err) => { });
    // },
    //切换
    // switchRole() {
    //   changeCompany().then((res) => {
    //     // 清空本地存储，举例中为全部清除，如需要保留所需数据，请自行处理
    //     localStorage.clear();
    //     sessionStorage.clear();
    //     // let replaceUrl = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" +process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + 
    //     // process.env.VUE_APP_REDIRECT_URI;
    //     // window.location.replace(replaceUrl)
    //     this.$router.push("/login");
    //   }).catch(err=>{})
    // },
    onMenuSelect() {
      this.toggleCollapse();
    },
    setActivated(route) {
      if (this.layout === "mix") {
        let matched = route.matched;
        matched = matched.slice(0, matched.length - 1);
        const { firstMenu } = this;
        for (let menu of firstMenu) {
          if (matched.findIndex((item) => item.path === menu.fullPath) !== -1) {
            this.setActivatedFirst(menu.fullPath);
            break;
          }
        }
      }
    },
    // logout() {
    //   this.logoutFn();
    // },
    logoutFn() {
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
    //获取头部下拉菜单权限
    // getheaderlist() {
    //   let userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
    //   let loginInfos = [
    //     {
    //       name: "账号",
    //       path: "",
    //       url:
    //         process.env.VUE_APP_LOGIN_URL +
    //         "client_id=" +
    //         process.env.VUE_APP_ZICONSOLE_CLIENTID +
    //         "&response_type=" +
    //         process.env.VUE_APP_ZICONSOLE_RESPONSE_TYPE +
    //         "&redirect_uri=" +
    //         process.env.VUE_APP_ZICONSOLE_REDIRECT_URI +
    //         "&route_url=" +
    //         "/account/accountInfo",
    //       amount: "",
    //       iconUrl: "account",
    //     },
    //     {
    //       name: "订单",
    //       path: "",
    //       url: process.env.VUE_APP_LOGIN_URL +
    //         "client_id=" +
    //         process.env.VUE_APP_ZICONSOLE_CLIENTID +
    //         "&response_type=" +
    //         process.env.VUE_APP_ZICONSOLE_RESPONSE_TYPE +
    //         "&redirect_uri=" +
    //         process.env.VUE_APP_ZICONSOLE_REDIRECT_URI +
    //         "&route_url=" +
    //         "/orderManage/orderList",
    //       amount: "",
    //       iconUrl: "order",
    //     },
    //     {
    //       name: "企链",
    //       path: "/cooperationPartner/partnerList",
    //       url: process.env.VUE_APP_LOGIN_URL +
    //         "client_id=" +
    //         process.env.VUE_APP_ZICONSOLE_CLIENTID +
    //         "&response_type=" +
    //         process.env.VUE_APP_ZICONSOLE_RESPONSE_TYPE +
    //         "&redirect_uri=" +
    //         process.env.VUE_APP_ZICONSOLE_REDIRECT_URI +
    //         "&route_url=" +
    //         "/cooperation/cooperationPartner",
    //       amount: "",
    //       iconUrl: "parter",
    //     },
    //     {
    //       name: "优惠券",
    //       path: "",
    //       url: process.env.VUE_APP_LOGIN_URL +
    //         "client_id=" +
    //         process.env.VUE_APP_ZICONSOLE_CLIENTID +
    //         "&response_type=" +
    //         process.env.VUE_APP_ZICONSOLE_RESPONSE_TYPE +
    //         "&redirect_uri=" +
    //         process.env.VUE_APP_ZICONSOLE_REDIRECT_URI +
    //         "&route_url=" +
    //         "/couponManage/couponManageList",
    //       amount: "",
    //       iconUrl: "coupon",
    //     },
    //     {
    //       name: "帮助",
    //       path: "",
    //       url: process.env.VUE_APP_API_BASE_URL +'#/documentCenter',
    //       amount: "",
    //       iconUrl: "help",
    //     },
    //   ];
    //   if (userInfo.user.type === '0') { //管理员全部能查看
    //     this.loginInfos = loginInfos;
    //   } else {
    //     this.loginInfos = loginInfos.slice(0,1);
    //   }
    // },
  },
  created() {
    // const userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
    // this.userInfo.company = userInfo.company
    //   ? userInfo.company.companyName
    //   : "";
    // this.userInfo.username = userInfo.user.name;
    this.correctPageMinHeight(this.minHeight - 24);
    this.setActivated(this.$route);
    // this.getHeaderListFn();
    // this.getheaderlist();
    // this.getUserDetail();
  },
  beforeDestroy() {
    this.correctPageMinHeight(-this.minHeight + 24);
  },
};
</script>

<style lang="less" scoped>
.admin-layout {
  .side-menu {
    &.fixed-side {
      position: fixed;
      height: 100vh;
      left: 0;
      top: 74px !important;
    }
  }
  .virtual-side {
    transition: all 0.2s;
  }
  .virtual-header {
    transition: all 0.2s;
    opacity: 0;
    &.fixed-tabs.multi-page:not(.fixed-header) {
      height: 0;
    }
  }
  .admin-layout-main {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    .admin-header {
      flex: 0;
      top: 0;
      right: 0;
      overflow: hidden;
      transition: all 0.2s;
      z-index: 10;
      // box-shadow: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      &.fixed-tabs.multi-page:not(.fixed-header) {
        height: 0;
      }
    }
    .admin-layout-main-main {
      padding-top: 80px;
      display: flex;
    }
    .ant-layout {
      flex: 1;
    }
  }
  .admin-layout-content {
    flex: 1;
    margin-right: 16px;
    margin-bottom: 16px;
    overflow: hidden;
    // height: calc(100vh - 64px - 16px - 20px);
    display: flex;
    position: relative;
    overflow-y: auto;
    div {
      width: 100%;
    }
  }
  .admin-layout-content-left {
    margin-left: 16px;
  }
  .setting {
    background-color: @primary-color;
    color: @base-bg-color;
    border-radius: 5px 0 0 5px;
    line-height: 40px;
    font-size: 22px;
    width: 40px;
    height: 40px;
    box-shadow: -2px 0 8px @shadow-color;
  }

  .ant-layout-header {
    margin-bottom: 16px;
    padding: 0;
  }
}
</style>
