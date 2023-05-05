<template>
  <div class="flex-1 flex flex-direction-column has-fixed-bottom-container">
    <div class="pd-b-100 clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <slot></slot>
    </div>
    <slot name="fixedBottom"></slot>
  </div>
</template>

<style lang="less" scoped>
.has-fixed-bottom-container {
  overflow: hidden;
  position: relative;
}
</style>