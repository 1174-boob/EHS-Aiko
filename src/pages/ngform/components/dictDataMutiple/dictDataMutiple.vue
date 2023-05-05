<template>
  <div id="dictDataMutiple" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-select mode="multiple" :disabled="record.options.disabled" v-model="modelVal" placeholder="请选择" @change="handleChange">
        <a-select-option v-for="item in record.options.dictOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
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
  created() {
    // this.$
  },
  computed: {
    modelVal: {
      get () {
        return this.models[this.record.model] ? this.models[this.record.model] : [];
      },
      set (val) {
        this.models[this.record.model] = val;
      }
    }
  },
  methods: {
    handleChange() {
      // this.models[this.record.model + "_label"] = this.findDictValue(this.models[this.record.model]);
      console.log(this.models[this.record.model])
      let str = "";
      for(let i = 0; i < this.models[this.record.model].length; i++) {
        str += this.findDictValue(this.models[this.record.model][i]) + "，";
      }
      this.models[this.record.model + "_label"] = str.slice(0, -1);
    },
    findDictValue(key) {
      let arr = this.record.options.dictOptions;
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