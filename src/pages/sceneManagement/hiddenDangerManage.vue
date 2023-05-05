<template>
  <div class="page-view">
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

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;
  img {
    width: 100%;
  }
}
.page-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .breadcrumb {
    margin-bottom: 10px;
    flex: none;
  }
  .page-view-main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
}
</style>