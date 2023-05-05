<template>
  <div class="organizetree" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-tree-select
        :disabled="record.options.disabled"
        showSearch
        v-model="models[record.model]"
        :filterTreeNode="filterUserTree"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="treeData"
        placeholder="请选择组织部门"
        :replaceFields="replaceFields"
        @change="treeChange"
      ></a-tree-select>
    </div>
  </div>
</template>
<script>
import { getOrganizeList } from "@/services/api.js";
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
      default: false
    },
    preview: {// 是否当前是预览
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      treeData: [],
      value: ""
    }
  },
  created() {
    this.getOrganizeTree();
  },
  methods: {
    // 获取组织机构树
    getOrganizeTree() {
      getOrganizeList().then(res => {
        this.treeData = [res.data];
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取组织机构树
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    // 机构选择改变
    treeChange(value, label) {
      this.models[this.record.model + "_label"] = label[0];
    },
  }
}
</script>
<style lang="less" scoped>
</style>