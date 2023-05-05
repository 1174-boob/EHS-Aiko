<template>
  <div class="page-layout beauty-scroll">
    <!-- 内容区域 -->
    <div ref="page" :class="['page-content', layout, pageWidth]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getI18nKey } from "@/utils/routerUtil";
export default {
  name: "PageLayout",
  props: ["title",],
  data() {
    return {
      page: {},
      pageHeaderHeight: 0,
    };
  },
  watch: {
    $route() {
      this.page = this.$route.meta.page;
    },
  },
  updated() {
    if (!this._inactive) {
      // this.updatePageHeight()
    }
  },
  activated() {
    // this.updatePageHeight()
  },
  deactivated() {
    // this.updatePageHeight(0)
  },
  mounted() {
    // this.updatePageHeight()
  },
  created() {
    this.page = this.$route.meta.page;
  },
  beforeDestroy() {
    // this.updatePageHeight(0)
  },
  computed: {
    ...mapState("setting", [
      "layout",
      "multiPage",
      "pageMinHeight",
      "pageWidth",
      "customTitles",
    ]),
    pageTitle() {
      let pageTitle = this.page && this.page.title;
      return (
        this.customTitle ||
        (pageTitle && this.$t(pageTitle)) ||
        this.title ||
        this.routeName
      );
    },
    routeName() {
      const route = this.$route;
      return this.$t(getI18nKey(route.matched[route.matched.length - 1].path));
    },
    breadcrumb() {
      let page = this.page;
      let breadcrumb = page && page.breadcrumb;
      if (breadcrumb) {
        let i18nBreadcrumb = [];
        breadcrumb.forEach((item) => {
          i18nBreadcrumb.push(this.$t(item));
        });
        return i18nBreadcrumb;
      } else {
        return this.getRouteBreadcrumb();
      }
    },
    marginCorrect() {
      return this.multiPage ? 24 : 0;
    },
  },
  methods: {
    ...mapMutations("setting", ["correctPageMinHeight"]),
    getRouteBreadcrumb() {
      let routes = this.$route.matched;
      const path = this.$route.path;
      let breadcrumb = [];
      routes
        .filter((item) => path.includes(item.path))
        .forEach((route) => {
          const path = route.path.length === 0 ? "/home" : route.path;
          breadcrumb.push(this.$t(getI18nKey(path)));
        });
      let pageTitle = this.page && this.page.title;
      if (this.customTitle || pageTitle) {
        breadcrumb[breadcrumb.length - 1] = this.customTitle || pageTitle;
      }
      return breadcrumb;
    },
    /**
     * 用于计算页面内容最小高度
     * @param newHeight
     */
    updatePageHeight(
      newHeight = this.$refs.pageHeader.$el.offsetHeight + this.marginCorrect
    ) {
      this.correctPageMinHeight(this.pageHeaderHeight - newHeight);
      this.pageHeaderHeight = newHeight;
    },
  },
};
</script>

<style lang="less">
.page-layout {
  flex: 1;
  display: flex;
}
.page-content {
  // width: 100%;
  overflow: hidden;
  position: relative;
  // padding: 24px 0 0;
  display: flex;
  flex: 1;
  &.head.fixed {
    margin: 0 auto;
    max-width: 1400px;
  }
}
</style>
