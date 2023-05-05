<template>
  <!-- 树组件 -->
  <div class="tree-box">
    <a-tree
      :selectable="false"
      :defaultCheckedKeys="defaultCheckedKeys"
      :defaultExpandAll="defaultExpandAll"
      checkable
      :tree-data="treeDataConvertKeyFn(treeData, id)"
      @check="onCheck"
    />
  </div>
</template>

<script>
import treeMixin from "@/mixin/tree";
const treeData = [
  {
    title: "0-0",
    id: "1",
    children: [
      {
        title: "0-0-0",
        id: "11",
        children: [
          { title: "0-0-0-0", id: "111" },
          { title: "0-0-0-1", id: "112" },
          { title: "0-0-0-2", id: "113" },
        ],
      },
      {
        title: "0-0-0",
        id: "21",
        children: [
          { title: "0-0-0-0", id: "211" },
          { title: "0-0-0-1", id: "212" },
          { title: "0-0-0-2", id: "213" },
        ],
      },
    ],
  },
];
export default {
  mixins: [treeMixin],
  props: {
    // 组件大小
    treeData: {
      type: Array,
      default: () => treeData,
    },
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => ["112"],
    },
    id: {
      type: String,
      default: "id",
    },
  },
  methods: {
    // 将id转换为 key
    treeDataConvertKeyFn(treeData, id = "id") {
      treeData.forEach((item) => {
        item.key = item[id];
        if (item.children && item.children.length) {
          this.treeDataConvertKeyFn(item.children, id);
        }
      });
      return treeData;
    },
  },
};
</script>

<style lang="less" scoped>
.tree-box {
}
</style>
