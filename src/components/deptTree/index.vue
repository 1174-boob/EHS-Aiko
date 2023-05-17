<template>
  <a-tree-select
    :class="scroll ? 'dept-tree' : ''"
    v-model="value"
    :allow-clear="allowClear"
    :show-search="showSearch"
    style="width: 100%"
    :tree-data="deptData"
    :multiple="multiple"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :placeholder="placeholder"
    :disabled="disabled"
    :replaceFields="replaceFields"
    :filterTreeNode="filterTreeNode"
    @change="treeChange"
  >
  </a-tree-select>
</template>

<script>

export default {
  model: {
    prop: 'deptValue',
    event: 'deptInput',
  },
  props: {
    placeholder: {
      type: String,
      default:'请选择'
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    scroll: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    deptData: {
      type: Array,
      default:()=>[]
    },
    deptValue: {
      type: String | Array,
      default: undefined,
    }
  },
  data() {
    return {
      value: undefined,
      replaceFields: { title: 'name',value:'id',key:'id'},
    }
  },
  watch: {
    deptValue: {
      handler(val) {
        this.value = val;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 选项改变
    treeChange(id,name) {
      this.$emit('deptInput',id);
      this.$emit('change',id,name);
    },
    filterTreeNode(inputValue, treeNode){
      return treeNode.data.props.title && treeNode.data.props.title.indexOf(inputValue) > -1;
    }
  }
}
</script>

<style lang="less" scoped>
.dept-tree {
  height: 38px;
  ::v-deep .ant-select-selection {
    height: 100%;
    .ant-select-selection__rendered {
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>