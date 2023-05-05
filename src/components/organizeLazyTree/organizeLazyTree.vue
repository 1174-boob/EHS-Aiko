<template>
  <a-tree-select
    id="auctionTimesCode"
    :class="[disabledExtend && multiple? 'organize-lazyT-tree':'']"
    dropdownClassName="organize-lazy-tree-dropdown-2145415113242"
    :showSearch="false"
    v-model="organizeSelData"
    :allowClear="allowClear"
    :disabled="disabled"
    :multiple="multiple"
    tree-data-simple-mode
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="consoleOrganizeTreeList"
    :replaceFields="replaceFields"
    :load-data="getLoadDataFn"
    :placeholder="placeholder"
    @change="deptChange"
  ></a-tree-select>
</template>

<script>
import { getConsoleOrganizeLazyLoadListApi, getEmersionTreeDataApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { cloneDeep } from 'lodash'
export default {
  model: {
    prop: "deptList",
  },
  props: {
    // 默认数据
    deptList: {
      type: Array | String | Number,
      default: undefined,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否可清除
    allowClear: {
      type: Boolean,
      default: true
    },
    // 默认获取
    defaultGet: {
      type: Boolean,
      default: false
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 禁用展开
    disabledExtend: {
      type: Boolean,
      default: true
    },
    // 默认提示文字
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 使用外部树结构列表数据
    useOutOrganizeTreeList: {
      type: Boolean,
      default: false
    },
    // 外部树结构列表数据
    outOrganizeTreeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      organizeSelData: [],
      // 使用部门树
      consoleOrganizeTreeList: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
    }
  },
  created() {
    if (!this.useOutOrganizeTreeList) {
      this.defaultGet && this.getOrganizeLazyTree()
    }
  },
  mounted() {
    // 禁用输入功能
    const auctionTimesCode = document.querySelector('#auctionTimesCode .ant-select-search__field');
    auctionTimesCode && auctionTimesCode.setAttribute('readonly', 'true');
  },
  computed: {
    // 目前存在的数据id集合
    organizeIdS() {
      let ids = this.consoleOrganizeTreeList.map(item => {
        return item.id
      })
      return ids
    },
  },
  methods: {
    // 获取初始组织机构树-api
    getOrganizeLazyTree(deptId, isClear = false) {
      let apiData = deptId ? { deptId } : { deptId: '-1' }
      return getConsoleOrganizeLazyLoadListApi(apiData)
        .then(res => {
          const newTreeData = res.data || []
          if (isClear) {
            this.consoleOrganizeTreeList = newTreeData
          } else {
            this.concatOrganizeTreeList(newTreeData)
          }
          return Promise.resolve(newTreeData)
        })
        .catch(err => Promise.reject(err))
    },
    // 数据回显获取组织机构树-api
    getOrganizeEmersionTree(deptList, parentDeptId) {
      if (typeof deptList === 'string') {
        deptList = [deptList]
      }
      let apiData = { deptIdList: deptList, parentDeptId: parentDeptId }
      return getEmersionTreeDataApi(apiData)
        .then(res => {
          let newTreeData = res.data || []
          // 去重
          newTreeData = this.rmDuplicatesByKey(newTreeData, 'id')
          this.concatOrganizeTreeList(newTreeData)
          return Promise.resolve(newTreeData)
        })
        .catch(err => Promise.reject(err))
    },
    // 去重
    rmDuplicatesByKey(arr, key) {
      let obj = {};
      let reduce = [];
      reduce = arr.reduce(function (item, next) {
        obj[next[key]] ? '' : (obj[next[key]] = true && item.push(next));
        return item;
      }, []);
      return reduce
    },
    // 展开节点-懒加载-api
    getLoadDataFn(treeNode) {
      let apiData = { deptId: treeNode.dataRef.id }
      return getConsoleOrganizeLazyLoadListApi(apiData)
        .then(res => {
          let newTreeData = res.data || []
          this.concatOrganizeTreeList(newTreeData)
        })
        .catch(err => { })
    },
    // 合并懒加载数据
    concatOrganizeTreeList(newTreeData) {
      newTreeData = newTreeData.filter(item => {
        return !this.organizeIdS.includes(item.id)
      })
      this.consoleOrganizeTreeList = this.consoleOrganizeTreeList.concat(newTreeData)
    },
    // 选择组织-下拉框改变事件
    deptChange(value, label, extra) {
      this.$emit("input", value);
      // 表单检验
      this.$emit('deptFormValidator')
      this.$emit('change', value, label, extra)
    },
  },
  watch: {
    deptList: {
      handler(newVal) {
        this.organizeSelData = cloneDeep(newVal)
      },
      immediate: true,
      deep: true,//true为进行深度监听,false为不进行深度监听
    },
    outOrganizeTreeList: {
      handler(newVal) {
        if (this.useOutOrganizeTreeList) {
          this.consoleOrganizeTreeList = cloneDeep(newVal)
        }
      },
      immediate: true,
      deep: true,//true为进行深度监听,false为不进行深度监听
    },
  }
}
</script>

<style lang="less" scoped>
.organize-lazyT-tree {
  ::v-deep .ant-select-selection {
    max-height: 36px !important;
    overflow: hidden;
    .ant-select-selection__rendered {
      display: flex;
      overflow: hidden;
      padding-right: 30px;
      & > li {
        flex: none;
      }
      .ant-select-selection__choice {
        max-width: 86%;
      }
    }
    .ant-select-selection__clear {
      right: 7px;
    }
  }
}
#auctionTimesCode {
  display: block;
}
</style>
<style lang="less">
@media screen and (max-height: 860px) {
  .organize-lazy-tree-dropdown-2145415113242 {
    max-height: 37vh !important;
  }
}
</style>
