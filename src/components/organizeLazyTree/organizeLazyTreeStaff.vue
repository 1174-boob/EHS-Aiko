<template>
  <a-tree-select
    id="auctionTimesCode"
    :showSearch="true"
    v-model="organizeSelData"
    :allowClear="allowClear"
    :disabled="disabled"
    :multiple="multiple"
    tree-data-simple-mode
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="consoleOrganizeTreeList"
    :replaceFields="replaceFields"
    :load-data="getOrganizeLazyTree"
    placeholder="请选择"
    @change="deptChange"
  ></a-tree-select>
</template>

<script>
import { getDeptUserTree } from '@/services/api.js'
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
      default: true
    },
    // 是否可清除
    allowClear: {
      type: Boolean,
      default: true
    },
    // 默认获取
    defaultGet: {
      type: Boolean,
      default: true
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
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
    this.defaultGet && this.getOrganizeLazyTree()
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
    // 获取组织机构树api-懒加载
    getOrganizeLazyTree(treeNode) {
      let apiData = treeNode ? { deptId: treeNode.dataRef.id } : { deptId: '-1' }
      return getDeptUserTree(apiData)
        .then(res => {
      console.log(res)
          let newTreeData = res.data || []
          this.concatOrganizeTreeList(newTreeData)
        })
        .catch(err => { 
      console.log(err) })
    },
    // 数据回显获取组织机构树
    getOrganizeEmersionTree(deptList) {
      let apiData = { deptIdList: deptList }
      return getEmersionTreeDataApi(apiData)
        .then(res => {
          let newTreeData = res.data || []
          // 去重
          newTreeData = this.rmDuplicatesByKey(newTreeData, 'id')
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
    // 组织架构改变
    deptChange(value, label, extra) {
      this.$emit("input", value);
      // 表单检验
      this.$emit('deptFormValidator')
    },
    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
  },
  watch: {
    deptList: {
      handler(newVal) {
        this.organizeSelData = cloneDeep(newVal)
      },
      deep: true,//true为进行深度监听,false为不进行深度监听
    }
  }
}
</script>

<style lang="less" scoped>
</style>
