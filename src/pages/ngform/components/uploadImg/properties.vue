<template>
  <!-- 自定义组件的属性配置 -->
  <!-- <div :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''"> -->
  <!-- 属性配置里中间两条线中间的内容 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <!-- TCustom   start-->
    <template v-if="selectItem.type == 'uploadimg'">
      <!-- 开关的label -->
      <div>
        <div>图片最大体积</div>
        <el-input type="number" placeholder="请输入" v-model="selectItem.options.maxSize" :style="selectItem.options.style" :maxLength="selectItem.options.maxlength" />M
      </div>
      <div>
        <div>操作属性</div>
        <a-checkbox v-model="selectItem.options.disabled" @change="onChangeDisabled">禁用</a-checkbox>
        <a-checkbox v-model="selectItem.options.hidden" @change="onChangeHide">隐藏</a-checkbox>
      </div>
    </template>
    <!-- TCustom  end -->
  </el-form>
  <!-- </div> -->
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