<template>
  <div id="radio-list" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div v-for="item in models[record.model]" :key="item.dictType">
      <div class="radio-group-title">{{item.dictName}}</div>
      <div v-for="(obj, index) in item.dictItem" :key="obj.dictValue">
        <div class="radio-title">{{index + 1}}、{{obj.dictLabel}}</div>
        <a-radio-group v-model="obj.checkedRadio" @change="onChange" :defaultValue="3">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="2">否</a-radio>
          <a-radio :value="3">不涉及</a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import deepClone from 'lodash.clonedeep'

export default {
  props: {
    record: {// 组件数据
      type: Object,
      required: true
    },
    models: {// 表单数组 
      type: Object,
      required: true
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: true
    },
    preview: {// 是否当前是预览
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radioList: []
    }
  },
  created() {
    if (this.models[this.record.model] == null) { // 新建的时候
      this.models[this.record.model] = deepClone(this.record.options.renderData);
    }
  },
  computed: {
    ...mapState("setting", ["dictTypeData"]),
  },
  methods: {
    onChange() {
    }
  }
}
</script>
<style scoped>
</style>