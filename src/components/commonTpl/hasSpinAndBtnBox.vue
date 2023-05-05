<template>
  <div class="flex-1 flex has-spin-and-btn-box">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="has-spin-and-btn-main clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <slot></slot>
      </div>
      <slot name="fixedBottom"></slot>
    </a-spin>
  </div>
</template>

<script>
export default {
  props: {
    spinning: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style lang="less" scoped>
.has-spin-and-btn-box {
  overflow: hidden;
  position: relative;
  .has-spin-and-btn-main {
    padding-bottom: 76px;
  }
}
</style>