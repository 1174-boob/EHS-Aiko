<template>
  <!-- 该组件的父组件最外层必须加上类名pd-b-100否则可能会出现问题 -->
  <div class="fixed-bottom position-abs width-100 bg-fff" :class="{'fixed-bottom-close': isMobile}">
    <div class="flex justify-content-between align-items-center m-r-20 bg-f9 pd-l-20 pd-r-20">
      <div>
        <!-- 固定在底部的左侧内容 -->
        <slot name="leftcontent"></slot>
      </div>
      <div>
        <!-- 默认插槽，固定在底部右侧 -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('setting', ['isMobile'])
  }
}
</script>
<style lang="less" scoped>
.fixed-bottom {
  width: calc(100% - 0px);
  bottom: 0px;
  // left: 20px;
  z-index: 99;
  & > .flex {
    width: 100%;
    height: 62px;
    .ant-btn {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
