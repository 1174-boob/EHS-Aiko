<template>
  <!-- 小标题装饰组件 -->
  <div class="one-title-main">
    <span class="one-bs"></span>
    <span class="one-title">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
.one-title-main {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
  .one-bs {
    width: 0.08rem;
    height: 0.15rem;
    background: #0067cc;
    border-radius: 0.04rem;
    margin-right: 0.1rem;
  }
  .one-title {
    font-size: 0.2rem;
    color: #333333;
  }
}
</style>
