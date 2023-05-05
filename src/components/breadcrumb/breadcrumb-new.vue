<template>
  <!-- 面包屑组件 -->
  <div class="breadcrumb-box">
    <a-breadcrumb>
      <a-breadcrumb-item :key="index" v-for="(item, index) in breadcrumb">
        <template v-if="item.title">
          <span class="breadcrumb-box-item" :class="!item.isPage?'disable-breadcrumb':''" @click="goTarget(item)">{{item.title}}</span>
        </template>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
import { getI18nKey } from '@/utils/routerUtil'
export default {
  data() {
    return {
      page: {},
    }
  },
  computed: {
    breadcrumb() {
      let page = this.page
      let breadcrumb = page && page.breadcrumb
      if (breadcrumb) {
        let i18nBreadcrumb = []
        breadcrumb.forEach(item => {
          i18nBreadcrumb.push(this.$t(item))
        })
        return i18nBreadcrumb
      } else {
        // return this.getRouteBreadcrumb()
        return this.getRouteBreadcrumbVuex()
      }
    },
  },
  mounted() { },
  created() {
    this.page = this.$route.meta.page
  },
  methods: {
    // vuex 版本
    getRouteBreadcrumbVuex() {
      console.log('最终面包屑', this.$store.getters['breadcrumb/breadcrumb']);
      return this.$store.getters['breadcrumb/breadcrumb']
    },
    getRouteBreadcrumb() {
      let routes = this.$route.matched
      // console.log('面包屑routes', routes);
      let breadcrumb = []
      routes.forEach(item => {
        if (item.meta) {
          let obj = {
            path: item.path,
            title: item.meta.title,
            isPage: item.meta.isPage,
          }
          if (obj.title === '总览') obj.path = '/overview/preview'
          breadcrumb.push(obj)
        }
      })
      // console.log('面包屑breadcrumb', breadcrumb);
      return breadcrumb
    },
    // 跳转
    goTarget(item) {
      if (!item.isPage) return
      this.$router.push({ path: item.path })
    }
  },
  watch: {
    $route() {
      this.page = this.$route.meta.page
    }
  }

}
</script>

<style lang="less" scoped>
.dis-hover {
  &:hover {
    cursor: default !important;
    color: #999999;
  }
}
.breadcrumb-box {
  .breadcrumb-box-item {
    &:hover {
      cursor: pointer;
      color: #0067cc;
    }
  }
  .ant-breadcrumb {
    color: #666666;
    & > span:last-child {
      color: #999999;
      .breadcrumb-box-item {
        .dis-hover;
      }
    }
    .disable-breadcrumb {
      color: #999999;
      .dis-hover;
    }
  }
}
</style>
