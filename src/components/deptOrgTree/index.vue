<template>
  <div>
    <a-form-model-item :label="labelTitle" :prop="propKey ? propKey : ''" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-tree-select
        :class="scroll ? 'dept-tree' : ''"
        tree-checkable
        show-checked-strategy
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
    </a-form-model-item>
  </div>
</template>

<script>
import { getDepartmentTree } from "@/services/api";
export default {
  model: {
    prop: 'deptValue',
    event: 'deptInput',
  },
  props: {
    labelTitle: {
      type: String,
      default: ''
    },
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
    deptValue: {
      type: String | Array,
      default: undefined,
    },
    // 接收校验参数
    propKey: {
      type: String,
      default: '',
    },
    // 定义组件的label展示样式
    labelCol: {
      type: Object,
      default: () => { span: 4 }
    },
    // 定义组件的input展示样式
    wrapperCol: {
      type: Object,
      default: () => { span: 20 }
    },
  },
  data() {
    return {
      value: undefined,
      companyId: null,
      companyName: "",
      replaceFields: { title: 'name',value:'id',key:'id'},
      deptData: [],
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
  created() {
    this.getDepartmentTree();
  },
  methods: {
    // 选项改变
    treeChange(id,name) {
      this.$emit('deptInput',id);
      this.$emit('change',id,name);
    },
    filterTreeNode(inputValue, treeNode){
      return treeNode.data.props.title && treeNode.data.props.title.indexOf(inputValue) > -1;
    },
    getDepartmentTree() {
      let apiData = {
        companyId: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId,
        companyName: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyName,
      };
      return getDepartmentTree(apiData).then((res) => {
        this.deptData = res.data ? [res.data] : [];
      })
    },
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