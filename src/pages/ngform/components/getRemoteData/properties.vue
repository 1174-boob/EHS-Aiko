<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'getRemoteData'">
      <div>
        <div>请输入远程接口路径</div>
        <a-input v-model="selectItem.options.interfacePath" placeholder="请输入远程接口路径"></a-input>
        <div>标识字段名</div>
        <a-input v-model="selectItem.options.key" placeholder="请输入标识字段名"></a-input>
        <div>展示字段名</div>
        <a-input v-model="selectItem.options.value" placeholder="展示字段名"></a-input>
        <div>模糊查询字段名</div>
        <a-input v-model="selectItem.options.searchKey" placeholder="展示字段名"></a-input>
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
import { postRemoteInterface } from "@/services/api.js";

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
  created() {
    this.dict = this.dictTypeData;
  },
  
  methods: {
    toRequestInterface() {
      console.log(this.selectItem.options.interfacePath);
      if (!this.selectItem.options.interfacePath) {
        this.$antMessage.error("请给组件填写远程接口路径");
        return;
      }
      postRemoteInterface(this.selectItem.options.interfacePath, {pageNo: 1, pageSize: 10}).then(res => {
        console.log(res);
        this.selectItem.options.dataList = res.data;
      }).catch(e => console.log(e))
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