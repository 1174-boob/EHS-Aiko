<template>
  <div></div>
</template>

<script>
export default {
  name: 'blankPage',
  created() {
    var _this = this;
    // if(this.$route.redirectedFrom == '/' && this.$route.redirectedFrom != this.$route.path) {
    if(this.$route.name == 'blankPage' && this.$route.path) {
      console.log('进入跳转', this.$route.path, 'path')
      this.$router.push({ path: _this.$route.path, query: _this.$route.query });
    }
  }
}
</script>

<style scoped lang="less">
</style>
