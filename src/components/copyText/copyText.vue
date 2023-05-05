<template>
  <!-- 返回组件 -->
  <div class="copy-text-box" @click="iBack"></div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#181818'
    },
    fontSize: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    iBack() {
      this.$router.go(-1)
    }
  },
}
</script>

<style lang="less" scoped>
.back-box {
  cursor: pointer;
  display: inline-block;
  font-size: 0;
}
</style>
