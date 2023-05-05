<template>
  <div id="getRemoteData" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-select show-search :disabled="record.options.disabled" v-model="models[record.model]" placeholder="请选择" @change="handleChange" @popupScroll="handlePopupScroll" @search="handleSearch">
        <a-select-option v-for="item in supplyBatch" :key="item[record.options.key]" :value="item[record.options.key]">{{item[record.options.value]}}</a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
import { postRemoteInterface } from "@/services/api.js";
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
    this.getTaskList();
  },
  data() {
    return {
      supplyBatch: [],
      selectPage: 1,
      selectSize: 10,
      selectTotal: 1,
    }
  },
  watch: {
    record: {
      handler(val, oldVal) {
        console.log(val, oldVal);
        if (val && oldVal && val.options.interfacePath && val.options.key && val.options.value && ((val.options.interfacePath != oldVal.options.interfacePath) || (val.options.key != oldVal.options.key) || (val.options.value != oldVal.options.value))) {
          this.getList(this.myDate);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange(val) {
      let checkObj = this.supplyBatch.filter(item => {
        return item[this.record.options.key] == val;
      })[0]
      console.log(checkObj, checkObj && checkObj[this.record.options.value])
      this.models[this.record.model + "_label"] = checkObj && checkObj[this.record.options.value];
    },
    handleSearch(val) {
      console.log(val);
      this.getTaskList(val)
    },
    /** 滚动事件 */
    handlePopupScroll(e) {
        const { scrollHeight, scrollTop, clientHeight } = e.target
        if (scrollHeight - scrollTop === clientHeight) {
          console.log('触底了')
          this.selectPage = this.selectPage + 1
          if(this.selectPage <= this.selectTotal){
            this.getTaskList()
          }
        }
    },
    getTaskList (val) {
      let para = {
        pageNo: this.selectPage,
        pageSize: this.selectSize
      }
      para[this.record.options.searchKey] = val;
      postRemoteInterface(this.record.options.interfacePath, para).then(res => {
        console.log(res)
          this.supplyBatch = this.supplyBatch.concat((res.data) || [])
          // this.supplyBatch = this.supplyBatch.concat(res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data)
          console.log(this.supplyBatch);
          // this.selectTotal = 100;
      }).catch(err => {
    
      })
    },
  }
}
</script>
<style scoped>
</style>