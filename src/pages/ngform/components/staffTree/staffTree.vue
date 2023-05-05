<template>
  <div class="staff">
    <a-tree-select
      :disabled="record.options.disabled"
      multiple
      allow-clear
      :filterTreeNode="filterUserTree"
      v-model="models[record.model]"
      :tree-data="userTreeData"
      :treeDefaultExpandedKeys="treeDefaultExpandedKeys"
      @search="onSearch"
      @change="onChange"
      :replaceFields="replaceFields"
    ></a-tree-select>
  </div>
</template>
<script>
import { DeptUserTree } from "@/services/api.js";
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
      toBear: [],
      userTreeData: [],
      treeDefaultExpandedKeys: [],
      searchValue: undefined,
      replaceFields: { children: 'children', title: 'title', key: 'key', value: 'key' },
    }
  },

  created() {
    this.getDeptUserTree();
  },
  methods: {
    // 获取用户组织树
    getDeptUserTree() {
      DeptUserTree().then(res => {
        // this.initTreeValue(res.data);
        this.userTreeData = [res.data];
      }).catch(err => {
        console.log(err);
      })
    },
    // initTreeValue(arr) {
    //   for (let i = 0; i < arr.length; i++) {
    //     if (arr[i].children) {
    //       arr[i].selectable = false;
    //       arr[i].disabled = false;
    //       this.initTreeValue(arr[i].children);
    //     } else {
    //       arr[i].isLeaf = true
    //     }
    //   }
    // },
    // 获取组织机构树
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    onChange(value, label, extra) {
      this.models[this.record.model + "_label"] = label.join(",");
    },
    onSearch(value) {
      this.searchValue = value;
    },
  }
}
</script>
<style lang="less" scoped>
.radio-no-check,
.radio-check {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(~@/assets/hideDanger/radionocheck.svg) no-repeat;
}
.radio-check {
  background: url(~@/assets/hideDanger/radiocheck.svg) no-repeat;
}
</style>