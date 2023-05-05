<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'dictData'">
      <div>
        <div>请选择字典项</div>
        <a-select showSearch :filterOption="filterOption" v-model="selectItem.options.dictKey" placeholder="请选择字典数据">
          <a-select-option v-for="item in dict" :key="item.dictName" :value="item.dictType">{{item.dictName}}</a-select-option>
        </a-select>
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
import { mapState } from "vuex";

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
      dict: [],
    }
  },
  computed: {
    ...mapState("setting", ["dictTypeData"]),
  },
  created() {
    this.dict = this.dictTypeData;
  },
  methods: {
    filterOption(inputValue, option) {
      return option.data.key.includes(inputValue)
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