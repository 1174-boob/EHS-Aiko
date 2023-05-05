<template>
  <div>
    <a-button @click="intoEdit">进入修改</a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {
    intoEdit() {
      this.$router.push({path: '/testpage/testpagefirst/testedit'});
    }
  }
};
</script>

<style lang='less' scoped>

</style>