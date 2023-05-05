<template>
  <!-- 该组件的父组件最外层必须加上类名pd-b-100否则可能会出现问题 -->
  <div class="fixed-bottom position-fix width-100 bg-f9">
    <div class="flex justify-content-between align-items-center pd-l-20 pd-r-20">
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
// 全局组件-虚线按钮
export default {}
</script>
<style lang="less" scoped>
.fixed-bottom{
  bottom: 10px;
  left: 0;
  z-index: 999;
  &>.flex{
    height: 62px;
  }
}
</style>
