/**
 * @author: 张丹丹
 * @description tab切换--树结构
 */
const treeMixin = {
  data() {
    return {
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: "",
      checkedTitle: "全部人员",
      searchValue: '',
      autoExpandParent: true,
    }
  },
  methods: {
    onExpand(expandedKeys) { // 点击树节点时触发
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys;
      this.checkedKeys = this.selectedKeys[0];
      if (!this.checkedKeys) {
        this.checkedTitle = "全部人员";
      }
      this.findCheckKey(this.gData, selectedKeys[0]);
    },
    onChange(e) { // 输入框输入查询的时候调用
      const value = e.target.value;
      let _this = this;
      const expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, _this.gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    findCheckKey(brr, key) {
      for (let i = 0; i < brr.length; i++) {
        if (brr[i].key == key) {
          this.checkedTitle = brr[i].title;
          this.checkedAlias = brr[i].deptAlias;
        } else {
          if (brr[i].children) {
            this.findCheckKey(brr[i].children, key);
          }
        }
      }
    },
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    }
  },
};

export default treeMixin;