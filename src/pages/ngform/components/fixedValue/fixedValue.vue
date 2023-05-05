<template>
  <div id="fixedValue" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-input :disabled="true" v-model="models[record.model]"></a-input>
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
  data() {
    return {

    }
  },
  computed: {
    val() {
      let arr = this.record.options.dataPath.split(".");
      let dataVal = "";
      for (let i = 0; i < arr.length; i++) {
        dataVal = this.record.options.result[arr[i]];
      }
      return dataVal;
    }
  },
  methods: {
  }
}
</script>
<style scoped>
</style>