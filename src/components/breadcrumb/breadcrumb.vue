<template>
  <!-- 面包屑组件 -->
  <div class="breadcrumb-box">
    <a-breadcrumb>
      <a-breadcrumb-item :key="index" v-for="(item, index) in breadcrumb">
        <template v-if="item.title">
          <span class="breadcrumb-box-item" @click="goTarget(item)">{{item.title}}</span>
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
        return this.getRouteBreadcrumb()
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
      return this.$store.getters['breadcrumb/breadcrumb']
    },
    getRouteBreadcrumb() {
      let routes = this.$route.matched
      // console.log('面包屑routes', routes);
      let breadcrumb = []
      routes.forEach((item, index) => {
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
      if (routes.length === 3) {
        if (routes[1].redirect === routes[2].path) {
          breadcrumb.pop()
        }
      }
      return breadcrumb
    },
    // 跳转
    goTarget(item) {
      // if (!item.isPage) return
      // this.$router.push({ path: item.path })
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
.breadcrumb-box {
  .ant-breadcrumb {
    color: #666666;
    & > span:nth-last-child(2) {
      .ant-breadcrumb-separator {
        color: #999999;
      }
    }
    & > span:last-child {
      color: #999999;
    }
  }
  .breadcrumb-box-item {
    // &:hover {
    //   cursor: pointer;
    //   color: #007aff;
    // }
  }
}
</style>
