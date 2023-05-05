<template>
  <!-- 
  可自定义参数：
    1、title
    2、labelCol
    3、wrapperCol
  必传参数：
    1、外层model的：visible
    2、是组织人员还是组织部门：staffOrDept
  -->
  <div :class="searchTerm?'sraff-wrapper':''">
    <a-form-model-item :label="labelTitle" :prop="propKey ? propKey : ''" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="useBtn == ''">
      <div style="display: flex; align-items: center;">
        <a-popover v-if="reviewShowList.length > 0">
          <template slot="content">
            <p>{{ reviewShowList.join('，') }}</p>
          </template>
          <a-select class="selectClass" mode="multiple" :size="'default'" :placeholder="treePlaceholder" disabled v-model="reviewShowList" />
        </a-popover>
        <a-select v-else class="selectClass" mode="multiple" :size="'default'" :placeholder="treePlaceholder" disabled v-model="reviewShowList" />
        <a-button type="primary" :disabled="onPreview" :loading="loading" @click="openTree" style="margin-left: 5%;">
          <a-icon type="user" v-if="treeType == 'user'" />
          <a-icon type="apartment" v-else />
        </a-button>
      </div>
      <span v-if="comment">{{comment}}</span>
    </a-form-model-item>
    <a-button class="m-r-10" type="primary" v-if="useBtn != ''" @click="openTree">{{ useBtn }}</a-button>
    <CommonModal class="self-modal" :title="treeType == 'user' ? '选择人员' : '选择部门'" :visible="treeModelVisible" :cancelFn="closeTreeModel" :setStyle="{ padding: '0 80px 0 100px !important' }">
      <div slot="form">
        <a-spin :spinning="spinning">
          <a-row>
            <a-col class="beauty-scroll aCol" :span="10">
              <p class="modelTitle">
                已选{{ treeType == 'user' ? '人员' : '部门' }}
                <a-button class="btn-danger" type="link" @click="cleanUp">清空</a-button>
              </p>
              <a-list size="small" bordered :data-source="getAllCheckedList">
                <a-list-item class="modelTitle" slot="renderItem" slot-scope="item, index">
                  {{ index + 1 }}.{{ item.treeName + ( item.treeCode ? ('/' + item.treeCode) : '' ) }}
                  <a-button class="btn-warning" type="link" @click="delSingleNode(item, index)">删除</a-button>
                </a-list-item>
              </a-list>
            </a-col>
            <a-col class="beauty-scroll aCol" :span="14">
              <a-tooltip :trigger="['hover']" placement="topLeft" overlay-class-name="numeric-input">
                <template slot="title" v-if="treeType == 'user'">输入5个数字或者2汉字以上</template>
                <template slot="title" v-else>请输入部门名称，不能为空</template>
                <a-select
                  show-search
                  size="large"
                  :value="selectValue"
                  :not-found-content="fetching ? undefined : null"
                  :placeholder="treeType == 'user' ? '请输入姓名和工号' : '部门名称模糊搜索'"
                  style="width: 100%;font-size: 14px;"
                  :filter-option="false"
                  @search="fetchUser"
                  @select="selectChange"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="item in searchTreeList"
                    :key="JSON.stringify(item)"
                  >{{ treeType == 'user' ? item.name : item.deptName }}/{{ treeType == 'user' ? item.jobNumber : item.deptId }}</a-select-option>
                </a-select>
              </a-tooltip>
              <!-- 搜索以后再做 -->
              <a-tree
                :id="'tree_' + randomIdTime"
                :checkable="checkAbel"
                v-model="checkedTreeList"
                :show-icon="showIcon"
                :default-expanded-keys="getFinalLevel"
                :load-data="onLoadData"
                :tree-data="treeData"
                @check="checkTreeNode"
                @expand="expandTree"
                :replace-fields="replaceFields"
                :filterTreeNode="filterTreeNode"
                @select="selectTreeNode"
              >
                <a-icon slot="user" type="user" />
                <a-icon slot="apartment" type="apartment" />
              </a-tree>
            </a-col>
          </a-row>
        </a-spin>
      </div>
      <div slot="btn">
        <a-button type="dashed" @click="closeTreeModel">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="submitTreeFrom">提交</a-button>
      </div>
    </CommonModal>
  </div>
</template>

<script>
import treeMixin from "@/mixin/tree";
import { getDeptAndUser, getUserAndJobNumber, searchDept, searchUser } from "@/services/api";
import { debounce, cloneDeep } from "lodash";
export default {
  mixins: [treeMixin],
  props: {
    // 组件类型，如果使用部门，定义dept或者其他值，建议dept，默认类型为user，即组织人员
    treeType: {
      type: String,
      default: 'user'
    },
    // 回显人员和部门的input框的的label标题，默认无
    labelTitle: {
      type: String,
      default: ''
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
    // 预览的时候，禁用按钮
    onPreview: {
      type: Boolean,
      default: false
    },
    // 是否可以复选
    checkAbel: {
      type: Boolean,
      default: true
    },
    // 校验规则
    treeRoles: {
      type: Object,
      default: () => { }
    },
    // 接收校验参数
    propKey: {
      type: String,
      default: '',
    },
    // 数组A
    checkedTreeNode: {
      type: Array,
      default: () => [],
    },
    // 只要按钮，文字自定义,如果此场景，searchTerm必传true
    useBtn: {
      type: String,
      default: ''
    },
    // 是否以搜索条件样式展示
    searchTerm: {
      type: Boolean,
      default: false,
    },
    // 如果传部门ID，则只查此部门下面的所有人
    deptTreeId: {
      type: String,
      default: '',
    },
    // 设置placeholder
    treePlaceholder: {
      type: String,
      default: '请选择',
    },
    // 展示选择的人员或者部门的说明性文字
    comment: {
      type: String,
      default: '',
    },
  },
  data() {
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      loading: false,
      spinning: false,
      treeData: [],
      treeModelVisible: false,
      replaceFields: {
        title: 'showItem',
        key: 'id',
      },
      currentTreeNodeList: [],
      currentTreeNode: {},
      getFinalLevel: [],
      randomIdTime: new Date().getTime(),
      // 数组B
      getAllCheckedList: [],
      // 回显INPUT的内容
      reviewShowList: [],
      // 数组C
      checkedTreeList: [],
      // 数组D
      finalTreeList: [],
      treeTypeName: '',
      showIcon: true,
      checkedCloneList: [],
      fetching: false,
      chooseModel: [],
      selectValue: [],
      searchTreeList: []
    }
  },
  watch: {
    // 只做清空操作
    checkedTreeNode: {
      handler(newValue, oldValue) {
        if (newValue.length > 0) {
          this.getUserAndJobNumber()
        } else {
          this.reviewShowList = [];
          this.getAllCheckedList = [];
          this.checkedTreeList = [];
        }
        this.checkedCloneList = cloneDeep(newValue);
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.treeType == 'user' ? this.treeTypeName = '选择人员' : this.treeTypeName = '选择部门';
    // 如果有已勾选的数据,则请求渲染数据
    if (this.propKey) {
      this.treeRoles[this.propKey] = [{ required: true, validator: this.userIdValidator, trigger: 'change' }];
    }
  },
  methods: {
    // 打开树组件弹出框
    openTree() {
      this.loading = true;
      // 如果有已勾选的数据,则请求渲染数据
      if (this.checkedTreeNode.length > 0) {
        this.getUserAndJobNumber()
      }
      this.getDeptAndUser();
    },
    // 关闭树组件弹出框
    closeTreeModel() {
      this.currentTreeNodeList = [];
      this.treeModelVisible = false;
      // this.getAllCheckedList = [];
      // this.checkedTreeList = [];
      this.$emit('input', false)
    },
    // 给树组件添加图标
    setIcon(menus) {
      let _this = this;
      for (let value of menus) {
        if (value.children != null) {
          _this.setIcon(value.children)
        }
        if (value.isLeaf) {
          value.slots = { icon: 'user' }
        } else {
          value.slots = { icon: 'apartment' }
        }
        value.showItem = value.name + (value.code ? '/' + value.code : '');
        if (!value.isLeaf) {
          value.disableCheckbox = true;
          if (this.treeType == 'user') {
            value.selectable = false;
          }
        }
      }
    },
    // 打开窗口时展示已选中的数据
    getUserAndJobNumber(checkedTree = this.checkedTreeNode) {
      var _this = this;
      if (this.treeType != 'user') {
        let getAllCheckedList = [];
        let reviewShowList = []
        for (let i = 0; i < checkedTree.length; i++) {
          getAllCheckedList.push({
            treeName: checkedTree[i],
            treeCode: _this.deptCache[checkedTree[i]]
          });
          reviewShowList.push(
            _this.deptCache[checkedTree[i]] + ('/' + checkedTree[i])
          )
        }
        this.getAllCheckedList = getAllCheckedList;
        this.reviewShowList = reviewShowList;
      } else {
        return getUserAndJobNumber({ 'userIds': checkedTree }).then((res) => {
          let getAllCheckedList = [];
          let reviewShowList = []
          if (res.data) {
            for (let key in res.data) {
              // 回显左侧区域
              getAllCheckedList.push({
                id: res.data[key].userId,
                treeName: res.data[key].name,
                treeCode: res.data[key].workNum,
                treeParentId: res.data[key].deptId
              })
              // 回显INPUT框
              reviewShowList.push(res.data[key].name + (res.data[key].workNum ? ('/' + res.data[key].workNum) : ''))
            }
            for (let i = 0; i < getAllCheckedList.length; i++) {
              getAllCheckedList[i].treeParentName = this.deptCache[getAllCheckedList[i].treeParentId];
            }
            this.getAllCheckedList = getAllCheckedList;
            this.reviewShowList = reviewShowList;
          }
          // 回显树组件，不一定要做，暂时先隐藏吧
          // this.checkedTreeList = this.checkedTreeNode;
        })
      }
    },
    // 初始化时获取全部树节点并且展开当前所有已返回叶子节点
    getDeptAndUser(treeNode) {
      var _this = this;
      // if(this.deptTreeId != '') {
      // 拿父级id直接取人
      let apiData = {
        isNeedUser: _this.treeType == 'user',
        deptId: _this.deptTreeId || '',
        userCount: 0,
        userLimit: 10
      }
      return getDeptAndUser(apiData).then((res) => {
        let treeData = res.data ? res.data : [];
        this.setIcon(treeData);
        if (treeData.length > 0) {
          this.$nextTick(function () {
            this.treeData = cloneDeep(treeData)
          })
        }
        this.loading = false;
        this.treeModelVisible = true;
        // 循环计算得出节点展开项
        this.loopFinalArray(treeData);
        this.$emit("getRootData", treeData)
        return this.treeData
      })
    },
    // 循环计算得出节点展开项
    loopFinalArray(arr) {
      const x = (currentValue) => currentValue.children === null;
      if (arr.every(x)) {
        if (arr.length) {
          this.getFinalLevel = [arr[0].parentId];
        } else {
          this.getFinalLevel = [];
        }
        return this.getFinalLevel;
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children != null) {
          this.loopFinalArray(arr[i].children)
        }
      }
    },
    expandTree(expandedKeys, { expanded: bool, node }) {
      var exId = 'btnId_' + node.dataRef.id;
      if (node.expanded) {
        if (document.getElementById(exId)) {
          document.getElementById(exId).style.display = 'none';
        }
      } else {
        if (document.getElementById(exId)) {
          document.getElementById(exId).style.display = 'block';
        }
      }
    },
    // 展开 & 翻页加载树节点
    onLoadData(treeNode, getMore) {
      var _this = this;
      this.spinning = true;
      this.currentTreeNode = treeNode ? treeNode : {};
      return new Promise(resolve => {
        if (treeNode != undefined && getMore == undefined && treeNode.dataRef.children) {
          this.spinning = false;
          resolve();
          return;
        }
        if (treeNode.dataRef.children) {
          var resultStaff = treeNode.dataRef.children.filter(item => item.isLeaf == true);
          var result2 = resultStaff.filter(item => item.isDeptBoss == false);
        }
        if (result2 && (result2.length == 0 || result2.length % 10 > 0)) {
          // 取消按钮
          let currentMore = 'btnId_' + treeNode.dataRef.id;
          if (document.getElementById(currentMore)) {
            document.getElementById(currentMore).remove();
          }
          this.spinning = false;
        } else {
          let apiData = {
            isNeedUser: _this.treeType == 'user' ? true : false,
            deptId: treeNode.dataRef.id,
            // userCount: treeNode.dataRef.children ? resultStaff.length : 0,
            userCount: result2 ? result2.length : 0,
            userLimit: 10
          }
          getDeptAndUser(apiData).then((res) => {
            let treeData;
            if (apiData.userCount == 0) {
              treeData = res.data ? res.data[0].children : [];
            } else {
              treeData = res.data ? res.data : [];
            }
            this.setIcon(treeData)
            this.loopFinalArray(treeData)
            if (treeData.length > 0) {
              treeNode.dataRef.children = treeNode.dataRef.children ? treeNode.dataRef.children.concat(treeData) : treeData;
              this.treeData = [...this.treeData];
              // 加载新数据后是否需要再次把已选中的数据重新渲染
              // this.checkedTreeList = Array.from(new Set([..._this.getAllCheckedList, ...finalTreeList]));
              this.spinning = false;
              resolve();
            } else {
              let currentMore = 'btnId_' + treeNode.dataRef.id;
              if (document.getElementById(currentMore)) {
                document.getElementById(currentMore).remove();
              }
              this.spinning = false;
              resolve();
            }
          })
        }
      });
    },
    // 按需筛选树节点,获取最后一级树节点,将加载按钮插入
    filterTreeNode(node) {
      if (this.getFinalLevel[0] == node._self.dataRef.id) {
        // 插入新的treeNode到currentTreeNodeList
        this.saveCurrentTreeNode(node._self);
        this.currentTreeNode = this.currentTreeNodeList[node._self.eventKey];
        this.getFinalLevel = [];
        if (!document.getElementById('btnId_' + node._self.eventKey)) {
          this.createElementFn(node._self)
        }
      }
    },
    // 保存点击当前树节点的node对象
    saveCurrentTreeNode(currentNode) {
      // 用currentNode拿到id
      // 拿着id去匹配已插入的treeNode
      // 将匹配好的treeNode给currentTreeNode赋值
      // 保持currentTreeNode最新
      let searchKey = '';
      if (currentNode.eventKey) {
        searchKey = currentNode.eventKey;
      } else {
        var x = currentNode.target.id;
        x = x.slice(x.indexOf('_') + 1);
        searchKey = x;
      }
      let hadHave = false;
      for (let i = 0; i < this.currentTreeNodeList.length; i++) {
        if (this.currentTreeNodeList[i].eventKey == searchKey) {
          this.currentTreeNode = this.currentTreeNodeList[i];
          hadHave = true;
        }
      }
      if (!hadHave) {
        this.currentTreeNode = currentNode;
        this.currentTreeNodeList.push(currentNode)
      }
      return this.currentTreeNodeList;
    },
    // 翻页加载更多
    getMoreTreeStaff(event) {
      this.saveCurrentTreeNode(event);
      this.onLoadData(this.currentTreeNode, event)
    },
    // 暂时留着
    insertAfter(newElement, targentElement) {
      var parent = targentElement.parentNode;
      if (parent.lastChild == targentElement) {
        parent.appendChild(newElement);
      } else {
        parent.insertBefore(newElement, targentElement.nextSibling)
      }
    },
    // 原生添加元素
    insertPush(newElement, targentElement) {
      targentElement.appendChild(newElement);
    },
    // 创建更多按钮,后续需要销毁事件以及其他无用的占内存
    createMoreBtn(insertElement) {
      var _this = this;
      var ztreePageDiv = document.createElement('div');
      var addClass = document.createAttribute("class");
      var addId = document.createAttribute("id");
      addClass.value = 'ztreePageBtn';
      addId.value = 'btnId_' + insertElement.eventKey;
      ztreePageDiv.setAttributeNode(addClass);
      ztreePageDiv.setAttributeNode(addId);
      ztreePageDiv.style.backgroundColor = '#f4f4f4';
      ztreePageDiv.style.lineHeight = '2';
      ztreePageDiv.style.textAlign = 'center';
      ztreePageDiv.style.cursor = 'pointer';
      ztreePageDiv.style.marginTop = '8px';
      ztreePageDiv.style.marginLeft = '25px';
      ztreePageDiv.style.userSelect = 'none';
      ztreePageDiv.innerHTML = '加载更多...';
      ztreePageDiv.addEventListener('click', _this.getMoreTreeStaff);
      return ztreePageDiv;
    },
    // 中转方法
    createElementFn(insertElement) {
      var x = this.createMoreBtn(insertElement);
      this.$nextTick(function () {
        this.insertPush(x, insertElement.$el)
      })
    },
    // 单选事件
    selectTreeNode(selectedKeys, { selected: bool, selectedNodes, node, event }) {
      this.handleCheckedList(node)
    },
    // 勾选树的复选框事件,在左侧渲染
    checkTreeNode(checkedKeys, { checkedNodes, node, event }) {
      console.log(checkedKeys, 'wolong')
      console.log(checkedNodes, 'fengchu')
      console.log(node, 'zhonghu')
      // 1:外面传值到内部,组件用数组A接,里面只有ID

      // 2:使用数组A调接口,得到数组B,里面啥都有,使用类似computed方法或者临时变量渲染左侧页面 和 INPUT框里

      // 3:操作右侧组织树时,操作数组C,里面只有ID,数组C的数据同步到数组B,数组C包含或者等于数组B,用数组B渲染页面

      // 3.5:选中数据时,遍历数组A,checked为true,则push添加;
      // 3.6:不选中数据时,遍历数组A,checked为false,匹配到一致的数据,则删除array.splice(index, 1)

      // 4:最终返回数组B+数组C=数组D
      this.handleCheckedList(node)
      // 回显INPUT框
      // this.checkedTreeList = Array.from(new Set([..._this.checkedTreeList, ...checkedKeys]));
      // var finalTreeList = checkedNodes.map(item => item.data.props.name + (item.data.props.code?('/'+item.data.props.code):''));
      // this.finalTreeList = Array.from(new Set([..._this.getAllCheckedList, ...finalTreeList]));
    },
    // 处理数据
    handleCheckedList(node) {
      var _this = this;
      let thisArray = this.getAllCheckedList, addType = false;
      if (!this.checkAbel) {
        this.getAllCheckedList = [{
          id: node.dataRef.id,
          treeCode: node.dataRef.code,
          treeName: node.dataRef.name,
          treeParentId: node.$parent.dataRef ? node.$parent.dataRef.id : _this.deptTreeId,
          treeParentName: node.$parent.dataRef ? node.$parent.dataRef.name : _this.deptCache[_this.deptTreeId]
        }];
        return
      }
      if (!node.checked) {
        if (thisArray.length > 0) {
          for (let i = 0; i < thisArray.length; i++) {
            if (thisArray[i].id == node.eventKey) {
              addType = false;
              break;
            } else {
              addType = true;
            }
          }
          if (node.dataRef.isLeaf) {
            if (addType) {
              this.getAllCheckedList.push({
                id: node.dataRef.id,
                treeCode: node.dataRef.code,
                treeName: node.dataRef.name,
                treeParentId: node.$parent.dataRef.id,
                treeParentName: node.$parent.dataRef.name,
              })
            }
          } else {
            if (addType) {
              if (node.dataRef.children) {
                for (let j = 0; j < node.dataRef.children.length; j++) {
                  this.getAllCheckedList.push({
                    id: node.dataRef.children[j].id,
                    treeCode: node.dataRef.children[j].code,
                    treeName: node.dataRef.children[j].name,
                    treeParentId: node.dataRef.id,
                    treeParentName: node.dataRef.name,
                  })
                }
              } else {
                this.getAllCheckedList.push({
                  id: node.dataRef.id,
                  treeCode: node.dataRef.code,
                  treeName: node.dataRef.name,
                  treeParentId: node.dataRef.id,
                  treeParentName: node.dataRef.name,
                })
              }
            }
          }
        } else {
          if (node.dataRef.isLeaf) {
            this.getAllCheckedList.push({
              id: node.dataRef.id,
              treeCode: node.dataRef.code,
              treeName: node.dataRef.name,
              treeParentId: node.$parent.dataRef.id,
              treeParentName: node.$parent.dataRef.name,
            })
          } else {
            if (node.dataRef.children) {
              for (let j = 0; j < node.dataRef.children.length; j++) {
                this.getAllCheckedList.push({
                  id: node.dataRef.children[j].id,
                  treeCode: node.dataRef.children[j].code,
                  treeName: node.dataRef.children[j].name,
                  treeParentId: node.dataRef.id,
                  treeParentName: node.dataRef.name,
                })
              }
            } else {
              this.getAllCheckedList.push({
                id: node.dataRef.id,
                treeCode: node.dataRef.code,
                treeName: node.dataRef.name,
                treeParentId: node.dataRef.id,
                treeParentName: node.dataRef.name,
              })
            }
          }
        }
      } else {
        if (node.dataRef.isLeaf) {
          for (let i = 0; i < thisArray.length; i++) {
            if (thisArray[i].id == node.eventKey) {
              addType = i;
              break;
            } else {
              addType = false;
            }
          }
          if (addType !== false) {
            this.getAllCheckedList.splice(addType, 1)
          }
        }
      }
    },
    // 单一删除事件
    delSingleNode(item, index) {
      var _this = this;
      this.$antConfirm({
        title: '是否确认删除?',
        onOk() {
          _this.searchTreeList = [];
          _this.getAllCheckedList.splice(index, 1);
          _this.checkedTreeList.splice(index, 1);
        },
        onCancel() {

        }
      });
    },
    // 清空事件
    cleanUp() {
      var _this = this;
      this.$antConfirm({
        title: '是否确认清空?',
        onOk() {
          _this.searchTreeList = [];
          _this.getAllCheckedList = [];
          _this.checkedTreeList = [];
        },
        onCancel() {

        }
      });
    },
    // 搜索事件
    fetchUser(value) {
      this.fetching = true;
      this.searchTreeList = [];
      if (this.treeType == 'user') {
        var pattern1 = /[\u4e00-\u9fa5]{2,}/;
        var pattern2 = /\d{5,}$/;
        if (!pattern1.test(value) && !pattern2.test(value)) {
          return
        }
        let apiData = { userName: value }
        searchUser(apiData).then((res) => {
          this.searchTreeList = res.data;
        }).catch((e) => {

        })
      } else {
        if (value == '') {
          return
        }
        let apiData = { deptName: value }
        searchDept(apiData).then((res) => {
          this.searchTreeList = res.data;
        }).catch((e) => {

        })
      }
    },
    // 最终提交事件
    submitTreeFrom() {
      var _this = this;
      this.currentTreeNodeList = [];
      this.treeModelVisible = false;
      this.reviewShowList = this.getAllCheckedList.map(item => item.treeName + (item.treeCode ? ('/' + item.treeCode) : ''));
      // res.data[key].name + (res.data[key].workNum ? ('/' + res.data[key].workNum):'')
      this.checkedCloneList = cloneDeep(this.getAllCheckedList)
      this.$emit('getTreeData', {
        treeIdList: this.checkedCloneList.map(item => item.id),
        treeNameAndCodeList: this.checkedCloneList,
      })
    },
    // 将id转换为 key,暂时留着
    treeDataConvertKeyFn(treeData, id = "id") {
      treeData.forEach((item) => {
        item.key = item[id];
        if (item.children && item.children.length) {
          this.treeDataConvertKeyFn(item.children, id);
        }
      });
      return treeData;
    },
    userIdValidator(rule, value, callback) {
      if (!this.checkedCloneList || this.checkedCloneList.length <= 0) {
        return Promise.reject(`${this.labelTitle}不能为空`)
      } else {
        callback()
      }
    },
    selectChange(value, options) {
      value = JSON.parse(value);
      let ifPush = true;
      for (let i = 0; i < this.getAllCheckedList.length; i++) {
        if (this.getAllCheckedList[i].id == value.userId) {
          ifPush = false;
        }
      }
      if (ifPush) {
        if (this.treeType == 'user') {
          if (this.checkAbel) {
            this.getAllCheckedList.push({ id: value.userId, treeCode: value.jobNumber, treeName: value.name })
          } else {
            this.getAllCheckedList = [{ id: value.userId, treeCode: value.jobNumber, treeName: value.name }];
          }
        } else {
          // this.getAllCheckedList.push({ id: value.deptId, treeCode: value.userId, treeName: value.deptName })
          this.getAllCheckedList = [{ id: value.deptId, treeCode: value.jobNumber, treeName: value.deptName }]
        }
      }
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
  },
};
</script>

<style scoped lang="less">
.aCol {
  height: 500px;
  overflow-y: scroll;
}
.btn-danger {
  color: red;
}
.btn-warning {
  color: orange;
}
.modelTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.self-modal {
  /deep/ .ant-modal {
    width: 1000px !important;
  }
}
/deep/ .selectClass > .ant-select-selection {
  height: 38px;
  overflow: hidden;
  padding: 0;
}
/deep/ .selectClass > .ant-select-selection > .ant-select-selection__rendered {
  height: 100%;
}
/deep/ .ant-select-selection ul {
  display: flex;
  width: fit-content;
}
/deep/ .ant-select-selection__rendered {
  height: 38px;
  overflow: hidden;
}
.sraff-wrapper {
  display: inline-block;
  margin-right: 15px;
  ::v-deep .ant-form-item {
    float: unset !important;
    .ant-form-item-children {
      .ant-select {
        width: 154px !important;
        .ant-select-selection {
          width: 144px !important;
        }
      }
    }
  }
}
</style>
