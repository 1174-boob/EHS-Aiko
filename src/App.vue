<template>
  <div>
    <!-- 使用缓存的页面 -->
    <a-config-provider :locale="locale" :get-popup-container="popContainer">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
    </a-config-provider>
    <!-- 不使用缓存的页面 -->
    <a-config-provider :locale="locale" :get-popup-container="popContainer">
      <router-view v-if="!$route.meta.keepAlive" />
    </a-config-provider>
  </div>
</template>

<script>
import Vue from 'vue'
import { enquireScreen } from "./utils/util";
import { mapState, mapMutations, mapGetters } from "vuex";
import themeUtil from "@/utils/themeUtil";
import { getI18nKey } from "@/utils/routerUtil";
// <router-view v-if="!$route.meta.keepAlive" />
let _VUE
export default {
  name: "App",
  data() {
    return {
      locale: {},
    };
  },
  created() {
    console.log('App.vue')
    this.setHtmlTitle();
    this.setLanguage(this.lang);
    enquireScreen((isMobile) => this.setDevice(isMobile));
  },
  mounted() {
    this.setWeekModeTheme(this.weekMode);
    window.addEventListener("beforeunload", this.addEventListenerBeforeunload)
    Vue.filter('userFilter', function (code, orgCode) { // 注册全局code码转换filter
      return _VUE.getUserCodeName(code, orgCode) || ''
    })
    Vue.filter('systemFilter', function (code, orgCode) { // 注册全局code码转换filter
      return _VUE.getSystemCodeName(code, orgCode) || ''
    })
    Vue.filter('corporationFilter', function (code) {
      return _VUE.getCorporationName(code) || ''
    })
    //监听浏览器返回
    if (window.history && window.history.pushState) {
      // history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goPageBefore, false);
    }
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val);
    },
    lang(val) {
      this.setLanguage(val);
      this.setHtmlTitle();
    },
    $route() {
      this.setHtmlTitle();
    },
    "theme.mode": function (val) {
      let closeMessage = this.$antMessage.loading(
        `您选择了主题模式 ${val}, 正在切换...`
      );
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage);
    },
    "theme.color": function (val) {
      let closeMessage = this.$antMessage.loading(
        `您选择了主题色 ${val}, 正在切换...`
      );
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage);
    },
    layout: function () {
      window.dispatchEvent(new Event("resize"));
    },
  },
  computed: {
    ...mapState("setting", ["layout", "theme", "weekMode", "lang"]),
    ...mapGetters('setting', ['getUserCodeName', 'getSystemCodeName', 'getCorporationName']),
  },
  beforeCreate() {
    _VUE = this
  },
  methods: {
    ...mapMutations("setting", ["setDevice"]),
    ...mapMutations("system", ['setIsBOMPopstate']),
    goPageBefore() {
      console.log('浏览器返回事件触发');
      this.setIsBOMPopstate(true)
    },
    // 监听浏览器刷新事件
    addEventListenerBeforeunload() {
      sessionStorage.setItem('console_isRefresh', 'true')
    },
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add("week-mode");
      } else {
        document.body.classList.remove("week-mode");
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang;
      switch (lang) {
        case "CN":
          this.locale =
            require("ant-design-vue/es/locale-provider/zh_CN").default;
          break;
        case "HK":
          this.locale =
            require("ant-design-vue/es/locale-provider/zh_TW").default;
          break;
        case "US":
        default:
          this.locale =
            require("ant-design-vue/es/locale-provider/en_US").default;
          break;
      }
    },
    setHtmlTitle() {
      const route = this.$route;
      const key =
        route.path === "/"
          ? "home.name"
          : getI18nKey(route.matched[route.matched.length - 1].path);
      // document.title = process.env.VUE_APP_NAME + " | " + this.$t(key);
    },
    popContainer() {
      return document.getElementById("popContainer");
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goPageBefore, false);
  }
};
</script>

<style lang="less" scoped>
.height-all {
  height: 100vh;
}
#id {
}
/deep/.table-draggable-handle {
  border: 1px solid red;
  height: 100% !important;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  border: none;
  position: absolute;
  transform: none !important;
  bottom: 0;
}
/deep/.resize-table-th {
  position: relative;
}
</style>
