<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <div :class="['admin-header-left']">
        <img
          src="@/assets/header/logo.svg"
          alt="logo"
          class="admin-header-left-logo"
          @click="goUrlOut"
        />
        <!-- <h1 class="admin-header-left-title" @click="goUrlOut">工业互联网控制台</h1> -->
        <div
          class="admin-header-left-menu"
          @click="drawerOpen"
          @mouseenter="advEnter"
          @mouseleave="advOut"
        >
          <div ref="refMenu" id="refMenu"></div>
        </div>

        <!-- <span class="admin-header-left-menu-title">点击您要查找的产品...</span> -->
      </div>

      <!-- 折叠按钮 -->
      <!-- <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/> -->
      <div
        v-if="layout !== 'side' && !isMobile"
        class="admin-header-menu"
        :style="`width: ${menuWidth};`"
      >
        <i-menu
          class="head-menu"
          :theme="headerTheme"
          mode="horizontal"
          :options="menuData"
          @select="onSelect"
        />
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <!-- <fullscreen v-model="isFullscreen" /> -->
        <p class="font-btn" @click="goHelpCenter">帮助中心</p>
        <!-- <p class="font-btn" @click="goHome">总览</p> -->
        <header-avatar
          class="header-item"
          @switchRolesShowFn="switchRolesShowFn"
        />
      </div>
    </div>
    <menu-drawer ref="menuDrawer" />

    <switchRoles
      :switchRolesShow="switchRolesShow"
      @switchRolesShowFn="switchRolesShowFn"
    />
  </a-layout-header>
</template>

<script>
import HeaderAvatar from "./components/HeaderAvatar/HeaderAvatar";
import MenuDrawer from "./components/MenuDrawer/MenuDrawer.vue";
import switchRoles from "./components/switchRoles/switchRoles.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "AdminHeader",
  components: { HeaderAvatar, MenuDrawer, switchRoles },
  props: ["collapsed", "menuData"],
  data() {
    return {
      langList: [
        { key: "CN", name: "简体中文", alias: "简体" },
        { key: "HK", name: "繁體中文", alias: "繁體" },
        { key: "US", name: "English", alias: "English" },
      ],
      searchActive: false,
      isFullscreen: false,
      // 切换角色弹窗
      switchRolesShow: false,
      timer: null,
      timerout: null,
      timeStep: 20,
    };
  },
  computed: {
    ...mapState("setting", [
      "theme",
      "isMobile",
      "layout",
      "systemName",
      "lang",
      "pageWidth",
    ]),
    headerTheme() {
      if (
        this.layout == "side" &&
        this.theme.mode == "dark" &&
        !this.isMobile
      ) {
        return "light";
      }
      return this.theme.mode;
    },
    langAlias() {
      let lang = this.langList.find((item) => item.key == this.lang);
      return lang.alias;
    },
    menuWidth() {
      const { layout, searchActive } = this;
      const headWidth = layout === "head" ? "100% - 188px" : "100%";
      const extraWidth = searchActive ? "600px" : "400px";
      return `calc(${headWidth} - ${extraWidth})`;
    },
  },
  methods: {
    // 鼠标移入事件
    advEnter() {
      let offsetP = 0;
      clearInterval(this.timerout);
      this.timer = setInterval(() => {
        if (offsetP >= -450) {
          document.getElementById("refMenu").style.backgroundPositionY =
            offsetP + "px";
          offsetP -= 18;
        } else {
          clearInterval(this.timer);
        }
      }, this.timeStep);
    },
    // 鼠标移出事件
    advOut() {
      clearInterval(this.timer);
      let pos = -450;
      this.timerout = setInterval(() => {
        if (pos <= 0) {
          document.getElementById("refMenu").style.backgroundPositionY =
            pos + "px";
          pos += 18;
        } else {
          clearInterval(this.timerout);
        }
      }, this.timeStep);
    },
    // 标题 跳转外部链接
    goUrlOut() {
      window.open(process.env.VUE_APP_ZCLOUD_URL);
    },
    // 切换角色弹窗
    switchRolesShowFn() {
      this.switchRolesShow = !this.switchRolesShow;
    },
    // 跳转帮助中心
    goHelpCenter() {
      window.location.href = process.env.VUE_APP_ZCLOUD_URL + "/#/documentCenter";
    },
    // 跳转首页
    goHome() {
      this.$router.push({ path: "/overview/preview" });
    },
    drawerOpen() {
      this.$refs.menuDrawer.drawerOpen();
    },
    toggleCollapse() {
      this.$emit("toggleCollapse");
    },
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
    ...mapMutations("setting", ["setLang"]),
  },
  beforeDestroy() {
    this.timerout && clearInterval(this.timerout);
    this.timer && clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
@import "index";
.font-btn {
  height: 100%;
  margin-left: 28px;
  cursor: pointer;
  margin-bottom: 0em;
}
</style>
