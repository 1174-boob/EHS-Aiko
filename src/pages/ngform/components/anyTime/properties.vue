<template>
  <!-- 自定义组件的属性配置 -->
  <div v-if="selectItem.type == 'anyTime'">
    <div>
      <div>操作属性</div>
      <a-checkbox v-model="selectItem.options.disabled" @change="onChangeDisabled">禁用</a-checkbox>
      <a-checkbox v-model="selectItem.options.hidden" @change="onChangeHide">隐藏</a-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectItem: { // 当前选择的组件
      type: Object,
      required: true
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChangeDisabled(e) {
      this.selectItem.options.disabled = e.target.checked;
    },
    onChangeHide(e) {
      this.selectItem.options.hidden = e.target.checked;
    }
  }
}
</script>