<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'passReference'">
      <div>
        <div>接口路径</div>
        <a-input placeholder="请输入接口路径" v-model="selectItem.options.interfacePath"></a-input>
      </div>
      <div>
        <div>请输入关联数字字段</div>
        <a-input placeholder="请输入关联数字字段" v-model="selectItem.options.parameter"></a-input>
      </div>
      <div>
        <div>请按输入的关联数据字段输入各个label名及对应的展示字段</div>
        <a-input placeholder="请输入label名" v-model="selectItem.options.relationLabel"></a-input>
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