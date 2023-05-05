<template>
  <!-- 自定义组件的属性配置 -->
  <div v-if="selectItem.type == 'radioList'">
    <div>
      <div>
        <div>选择题目组</div>
        <div>
          <a-select mode="multiple" placeholder="请选择题目组（可多选）" v-model="selectItem.options.radioList" @change="handleChange">
            <a-select-option v-for="item in dictTypeData" :key="item.dictType" :value="item.dictType">{{item.dictName}}</a-select-option>
          </a-select>
        </div>
      </div>
      <div>操作属性</div>
      <a-checkbox v-model="selectItem.options.disabled" @change="onChangeDisabled">禁用</a-checkbox>
      <a-checkbox v-model="selectItem.options.hidden" @change="onChangeHide">隐藏</a-checkbox>
    </div>
  </div>
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
  computed: {
    ...mapState("setting", ["dictTypeData"])
  },
  methods: {
    handleChange(value) {
      let arr = [];
      for (let i = 0; i < this.dictTypeData.length; i++) {
        if (value.indexOf(this.dictTypeData[i].dictType) != -1) {
          arr.push(this.dictTypeData[i]);
        }
      }
      this.selectItem.options.radioList = value;
      this.selectItem.options.renderData = arr;
      this.selectItem.options = { ...this.selectItem.options }
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