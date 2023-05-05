<template>
  <a-drawer class="a-drawer-a-drawer" :title="title" :visible="visible" @close="cancelFn" destroyOnClose :zIndex="zIndex" :width="width" :placement="placement">
    <div class="clx-drawer-body clx-show-scroll clx-flex-1 beauty-scroll">
      <div class="drawer-content-form">
        <slot name="form"></slot>
      </div>
      <div class="drawer-content">
        <slot></slot>
      </div>
    </div>
    <div class="flex justify-content-center bbbtn">
      <slot name="btn"></slot>
    </div>
  </a-drawer>
</template>

<script>
// 全局组件-抽屉
export default {
  props: {
    title: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
    cancelFn: {

    },
    width: {
      type: String | Number,
      default: '500px'
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    placement: {
      type: String,
      default: 'right'
    },
  }
}
</script>

<style lang="less">
.a-drawer-a-drawer {
  .ant-drawer-title {
    font-weight: bold;
  }
  .ant-drawer-wrapper-body {
    display: flex;
    flex-direction: column;
  }
  .ant-drawer-body {
    padding: 24px 0px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &:hover {
      .beauty-scroll::-webkit-scrollbar-thumb {
        background: #eee;
      }
    }
    .beauty-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .clx-drawer-body {
      flex: 1;
      padding: 0px 24px;
    }
    .bbbtn {
      flex: none;
      height: 70px;
      padding: 15px 16px;
      border-top: 1px solid #e8e8e8;
    }
  }
}
</style>
