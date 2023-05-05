<template>
  <div class="flex-1 flex flex-direction-column">
    <div class="pd-b-100 clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <slot></slot>
    </div>
    <slot name="fixedBottom"></slot>
  </div>
</template>
<style lang="less" scoped>
.flex {
  overflow: hidden;
}
</style>