<template>
  <a-modal class="clx-model" centered :title="title" :visible="visible" @cancel="cancelFn" :maskClosable="false" destroyOnClose :footer="null">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="clx-model-body clx-show-scroll clx-flex-1 beauty-scroll">
        <div class="model-content-form" :style="setStyle">
          <slot name="form"></slot>
        </div>
        <div class="model-content">
          <slot></slot>
        </div>
        <div class="flex justify-content-center m-t-20">
          <slot name="btn"></slot>
        </div>
      </div>
      <div class="flex justify-content-center pos-btn">
        <slot name="btn1"></slot>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
// 全局组件-弹框
export default {
  props: {
    title: {},
    visible: {},
    cancelFn: {},
    setStyle: {},
    spinning: {
      type: Boolean,
      default: false
    },
  },
}
</script>
