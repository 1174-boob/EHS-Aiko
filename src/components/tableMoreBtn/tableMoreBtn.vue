<template>
  <!-- 表格内更多按钮-组件 -->
  <a-popover v-model="isOpen" placement="bottom" overlayClassName="table-more-btn-box-03020203" trigger="click">
    <ul v-if="!useCustomSlot" slot="content" class="table-more-btn-box-03020203-top" @click="bubbleClick">
      <slot></slot>
    </ul>
    <template slot="content" v-else>
      <slot></slot>
    </template>
    <div class="table-more-btn color-0067cc cursor-pointer">
      更多
      <a-icon class="table-more-btn-icon" :class="isOpen?'table-more-btn-icon-top':''" type="caret-down" />
    </div>
  </a-popover>
</template>

<script>
export default {
  props: {
    // 是否自定义插槽
    useCustomSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    // 利用冒泡原理
    bubbleClick() {
      // this.isOpen = false
    }
  },
}
</script>

<style lang="less" scoped>
// 更多按钮
.table-more-btn {
  display: inline-flex;
  align-items: center;
  .table-more-btn-icon {
    transition: all 0.3s;
  }
  .table-more-btn-icon-top {
    transform: rotate(180deg);
  }
}
</style>
<style lang="less">
// 不能添加scoped
.table-more-btn-box-03020203 {
  z-index: 100;
  .table-more-btn-box-03020203-top {
    & > li {
      font-size: 14px;
      color: #000;
      font-weight: 400;
      // padding-bottom: 12px;
      text-align: center;
      border-bottom: 1px solid #efefef;
      padding: 12px 0;
      cursor: pointer;
      &:hover {
        color: #0067cc;
      }
      &:first-child {
        padding: 0px 0 12px;
      }
      &:last-child {
        padding: 12px 0 0;
        border-bottom: 0px solid #efefef;
      }
    }
  }
  // 隐藏ant-popover箭头
  .ant-popover-arrow {
    display: none !important;
  }
}
</style>
