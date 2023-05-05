<template>
  <div id="dict" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-select :disabled="record.options.disabled" v-model="models[record.model]" placeholder="请选择" @change="handleChange">
        <a-select-option v-for="item in dictOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
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
      dictOptions: []
    }
  },
  computed: {
    ...mapState("setting", ["dictTypeData"]),
  },
  watch: {
    record: {
      handler(val, val1) {
        if (val && val.options && val.options.dictKey) {
          let arr = this.dictTypeData.filter(item => {
            return item.dictType == val.options.dictKey;
          })
          this.dictOptions = arr[0] ? arr[0].dictItem : [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange() {
      this.models[this.record.model + "_label"] = this.findDictValue(this.models[this.record.model]);
    },
    findDictValue(key) {
      let arr = this.dictOptions;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].dictValue == key) {
          return arr[i].dictLabel;
        }
      }
    },
  }
}
</script>
<style scoped>
</style>