<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'dictDataMutiple'">
      <div>
        <div>请选择字典项</div>
        <a-select showSearch :filterOption="filterOption" v-model="selectItem.options.dictKey" placeholder="请选择字典数据" @change="handleChange">
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
import { getDictDataAll } from "@/services/api.js";
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
      page: {
        pageNo: 1,
        pageSize: 10
      },
    }
  },
  computed: {
    ...mapState("setting", ["dictTypeData"]),
  },
  created() {
    this.dict = this.dictTypeData;
  },
  methods: {
    handleChange(value) {
      let arr = this.dict.filter(item => {
        return item.dictType == value;
      })
      this.selectItem.options.dictOptions = arr[0] ? arr[0].dictItem : [];
    },
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