<template>
  <div id="centerOrganize" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div v-if="$route.path.split('/')[this.$route.path.split('/').length - 1].indexOf('standbook') > -1">
      <div>
        <a-select :disabled="record.options.disabled" v-model="models[record.model]" placeholder="请选择所属中心" @change="handleChange">
          <a-select-option v-for="item in dictOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
        </a-select>
      </div>
      <div>
        <a-select :disabled="record.options.disabled" v-model="models[record.model]" placeholder="请选择所属组织" @change="handleChange">
          <a-select-option v-for="item in dictOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
        </a-select>
      </div>
    </div>
    <div v-else>
      <!-- <a-select :disabled="record.options.disabled" v-model="models[record.model]" placeholder="请选择所属中心" @change="handleChange">
        <a-select-option v-for="item in dictOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
      </a-select> -->
      <a-select :disabled="record.options.disabled" v-model="models[record.model]" placeholder="请选择所属组织" @change="handleChange">
        <a-select-option v-for="item in dictOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
import dictionary from '@/utils/dictionary'

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
  watch: {
    record: {
      handler(val, val1) {
        if (val && val.options && val.options.dictCode) {
          this.dictOptions = dictionary(val.options.dictCode);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange() { 
      this.models[this.record.model + "_label"] = this.getMappingValue(this.dictOptions, "key", this.models[this.record.model]).value;
    }
  }
}
</script>
<style scoped>
</style>