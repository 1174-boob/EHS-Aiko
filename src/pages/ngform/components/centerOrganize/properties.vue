<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'centerOrganize'">
      <div>
        <div>请输入系统字典字段编码</div>
        <a-input placeholder="请输入系统字典字段编码" v-model="dictCode" @change="setDictItem" />
      </div>
      <div>
        <div>操作属性</div>
        <a-checkbox v-model="selectItem.options.disabled" @change="onChangeDisabled">禁用</a-checkbox>
        <a-checkbox v-model="selectItem.options.hidden" @change="onChangeHide">隐藏</a-checkbox>
      </div>
    </template>
    <!-- TCustom  end -->
  </el-form>
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
  data() {
    return {
      dictCode: "",
    }
  },
  created() {
    this.dict = this.dictTypeData;
  },
  methods: {
    setDictItem() {
      this.selectItem.options.dictCode = this.dictCode;
    },
    onChangeDisabled(e) {
      this.selectItem.options.disabled = e.target.checked;
    },
    onChangeHide(e) {
      this.selectItem.options.hidden = e.target.checked;
    }
  }
}
</script>