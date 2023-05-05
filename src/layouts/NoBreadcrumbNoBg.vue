<template>
  <!-- 没有面包屑的页面 没有背景的页面 -->
  <div class="no-breadcrumb">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
};
</script>

<style lang="less">
.no-breadcrumb {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
}
</style>
