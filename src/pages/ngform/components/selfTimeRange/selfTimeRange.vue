<template>
  <div id="self-time-range" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <el-time-picker is-range v-model="models[record.model]" value-format="HH:mm:ss" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="handleChange"></el-time-picker>
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
  },
  methods: {
    handleChange(arr) {
      this.models[this.record.model + "_label"] = arr[0] + "至" + arr[1];
    }
  }
}
</script>
<style scoped>
</style>