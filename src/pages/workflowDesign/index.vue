<template>
  <div class="workflow-design">
    <div class="loading" v-if="!loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="box-scale" id="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'">
          <nodeWrap ref="node" v-if="loading" :processNode.sync="processNode" :flowPermission.sync="flowPermission" :isTried.sync="isTried" :tableId="tableId"></nodeWrap>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <promoterDrawer />
    <approverDrawer :directorMaxLevel="directorMaxLevel" />
    <copyerDrawer />
    <conditionDrawer />

    <FixedBottom>
      <a-button type="primary" @click="saveSet">发 布</a-button>
    </FixedBottom>
  </div>
</template>
<script>
import promoterDrawer from './components/drawer/promoterDrawer'
import approverDrawer from './components/drawer/approverDrawer'
import copyerDrawer from './components/drawer/copyerDrawer'
import conditionDrawer from './components/drawer/conditionDrawer'
import FixedBottom from "@/components/commonTpl/fixedBottom";
import {
  SaveProcess, EhsSaveProcess, DetailByForm, EhsDetailByForm, UpdateProcess,
  UpdateProcessField,
  deptDict,
  SelectProcessField,
  DetailNgform,
  CompanyUserTree,
  getOrganizeList,
  DeptUserTree,
  roleList
} from "@/services/api";
import { nanoid } from 'nanoid';
function replace(node) {
  var map = {
    0: 'task',
    1: 'task',
    2: 'task',
    7: 'task',
    4: 'exclusive',
    10: 'parallel'
  }
  var type = node.type
  if (map[type] == undefined) {
    console.log("aaaaaaaaaaaaaaaaa", type, node);
    return null;
  }
  node.type = map[type]
  if (node.branchNodes != null) {
    for (var i in node.branchNodes) {
      replace(node.branchNodes[i])
    }
  }
  if (node.nextNode != undefined && node.nextNode != null) {
    replace(node.nextNode)
  }
  return node;
}

export default {
  name: 'workflowDesign',
  components: {
    // errorDialog,
    promoterDrawer,
    approverDrawer,
    copyerDrawer,
    conditionDrawer,
    FixedBottom
  },
  data() {
    return {
      loading: false,
      isTried: false,
      tipList: [],
      tipVisible: false,
      nowVal: 100,
      processConfig: {},
      processNode: {},
      process: {},
      flowPermission: [],
      directorMaxLevel: 0,
      tableId: "",
      processTempId: null,
      processData: {
        process: {
          // "processId":"process-id",
          "processId": nanoid().replace(/[0-9]/g, '').replace(/_/g, "").replace(/-/g, ''),
          "name": "自动生成"
        },
        processNode: {
          "id": nanoid().replace(/[0-9]/g, '').replace(/_/g, "").replace(/-/g, ''),
          "nodeType": "start",
          "nodeName": "申请人",
          "nodeContent": "所有人",
          "type": 0,
          // "type": 1,
          "nextNode": null,
          "branchNodes": []
        }
      },
      processNodeData: [],
      processFieldList: [],
      userTreeDict: { //部分人员id对应名字
        // "1511979336146808832": "wadadadad",
        // "1511979338172657664": "test8/123456",
        // "1511979338172657665": "水电费"
      },
    };
  },
  computed: {
    tempId() {
      return this.$store.state.setting.tempId; //表单id
    },
    delNodeProcessId() {
      return this.$store.state.setting.delNodeProcessId;
    },
    tabStatus() {
      return this.$store.state.setting.tabStatus
    },
  },
  watch: {
    processNodeData: {
      handler(newV) {
        this.$store.commit('setting/updateProcessNodeData', newV)
      },
      immediate: true,
      deep: true
    },
    delNodeProcessId: {
      handler(newV) {
        this.processNodeData = this.processNodeData.filter(item => {
          return item.nodeId != newV;
        })
      },
      immediate: true,
      deep: true
    },
    tabStatus: {
      handler(newV) {
        if (newV == 2) {
          this.getDetailNgform();
          this.getProcessField();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.initProcess();
    this.getDetailForm();
    this.getEhsDetailByForm();
    this.getRoleList();
    this.getDeptDict();
    this.getDeptUserTree();
    this.getOrganizeTree();
    this.getCompanyUserTree()
  },
  mounted() {
    this.$bus.$on("nodeDrawer", content => {
      // 输出兄弟组件传递的内容
      this.nodeDrawer(content);
    });
  },
  methods: {
    // 获取组织字典-nodeWrap子组件需要数据
    getDeptDict() {
      deptDict().then(res => {
        const data = res.data.idList;
        this.$store.commit('setting/setUserTreeDict', data)
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取字段权限的初始化数据
    getProcessField() {
      const params = {
        // nodeId: this.processNode.id,
        tempId: this.tempId,
      }
      // 获取节点的字段权限值
      SelectProcessField(params).then(res => {
        if (res.code == 20000) {
          const data = res.data;
          // this.tableData = JSON.parse(data.tableData);
          // this.formName = data.formName;
          this.$store.commit('setting/setTableData', JSON.parse(data.tableData))
          this.$store.commit('setting/setFormName', data.formName)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //获取业务单列表
    async getDetailNgform() {
      const params = {
        tempId: this.tempId,
      }
      const data = await DetailNgform(params);
      const templateData = JSON.parse(data.data.templateData);
      // console.log("======",templateData);
      const list = templateData.list;
      let buOptions = [];
      let buObj = {};
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const bu = {
          label: element.label,
          value: element.model,
        }
        buObj[element.model] = element.label;
        buOptions.push(bu);
      }
      this.$store.commit('setting/setBuObj', buObj);
      this.$store.commit('setting/setBuOptions', buOptions);
    },
    async getCompanyUserTree() {
      const data = await CompanyUserTree();
      const treeData = [data.data.deptTree];
      this.$store.commit('setting/setTreeData', treeData);
    },
    // 获取组织机构树
    getOrganizeTree() {
      getOrganizeList().then(res => {
        const deptData = [res.data];
        this.$store.commit('setting/setDeptData', deptData);
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取用户组织树
    getDeptUserTree() {
      DeptUserTree().then(res => {
        const userTreeData = [res.data];
        this.$store.commit('setting/setUserTreeData', userTreeData)
      }).catch(err => {
        console.log(err);
      })
    },
    getRoleList() {
      const params = {
        companyId: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId,
        productId: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets.productId
      }
      roleList(params).then(res => {
        const data = res.data;
        let roleOptions = [];
        let roleObj = {};
        data.forEach(item => {
          let obj = {};
          obj.label = item.roleName;
          obj.value = item.roleId;
          roleObj[item.roleId] = item.roleName;
          roleOptions.push(obj)
        })
        this.$store.commit('setting/setRoleObj', roleObj);
        this.$store.commit('setting/setRoleOptions', roleOptions);
      }).catch(err => {
        console.log(err);
      })
    },

    // 初始化节点数据 防止DetailByForm接口返回500报错，无法初始化造成页面错误的问题
    initProcess() {
      this.processConfig = this.processData;
      let { processNode, flowPermission, directorMaxLevel, process, tableId } = this.processData;
      this.processNode = processNode;
      this.flowPermission = flowPermission;
      this.directorMaxLevel = directorMaxLevel;
      this.process = process;
      this.tableId = tableId;
    },
    getDetailForm() {
      const params = {
        tempId: this.tempId
      }
      DetailByForm(params).then(res => {
        if (res.code == 20000) {
          // this.processNodeData = res.data.nodeList; // 节点数据
          // const deploymentId = res.data.deploymentId; //流程模板id
          const processConfig = JSON.parse(res.data.content);
          this.processTempId = res.data.processTempId;
          this.processConfig = processConfig;
          let { processNode, flowPermission, directorMaxLevel, process, tableId } = processConfig;
          this.processNode = processNode;
          this.flowPermission = flowPermission;
          this.directorMaxLevel = directorMaxLevel;
          this.process = process;
          this.tableId = tableId;
          //根据返回的deploymentId获取节点数据nodeList
          setTimeout(() => {
            this.loading = true; //防止初次进入页面的时候报错
          }, 300);
        }
      }).catch(err => {
        console.log(err);
        // 页面报错（后端接口500）的时候给页面初始数据
        this.initProcess();
        setTimeout(() => {
          this.loading = true;
        }, 300);
      })
    },
    // 获取节点nodeList的信息（不包括路程图和字段权限部分）
    async getEhsDetailByForm() {
      const params = {
        tempId: this.tempId
      }
      const ehsDetail = await EhsDetailByForm(params);
      if (ehsDetail.code == 20000) {
        this.processNodeData = ehsDetail.data.nodeList; // 节点数据
      }

    },
    nodeDrawer(nodeDetail) {
      // dictType--字典组必须一致
      console.log("-------nodeDetail-------",nodeDetail);
      const data = _.cloneDeep(this.processNodeData);
      const newType = nodeDetail.dictForm.dictType;
      if (data && data.length >= 1) {
        const oldType = data[0].dictForm.dictType
        if (newType != oldType) {
          this.processNodeData.forEach(element => {
            element.dictForm.dictType = newType;
            element.dictForm.dictValue = undefined;
          });
          this.$store.commit('setting/updateDictGroup', newType)
        }
        const ids = data.map((item, index) => {
          return item.nodeId
        })
        const ind = ids.indexOf(nodeDetail.nodeId);
        if (ind >= 0) {
          this.processNodeData.splice(ind, 1, nodeDetail)
        } else {
          this.processNodeData.push(nodeDetail)
        }
      } else {
        this.processNodeData.push(nodeDetail);
        this.$store.commit('setting/updateDictGroup', newType)
      }
    },
    saveSet() {
      if (this.processNodeData.length <= 0) {
        this.$antMessage.error("节点数据不能为空")
        return
      }
      console.log("yyii----",this.processNodeData);
      for (let index = 0; index < this.processNodeData.length; index++) {
        const element = this.processNodeData[index];
        if (!element.dictForm.dictType || !element.dictForm.dictValue) {
          this.$antMessage.error(`${element.nodeName}节点字典项数据为空，请填写后再发布`)
          return
        }
      }
      this.processFieldList = [];
      const nodeList = this.processNodeData.map(item => {
        if (item.fieldJson) {
          const type = item.type;
          let data = {
            type: type.toString(),
            nodeId: item.nodeId,
            tableData: item.fieldJson,
          }
          this.processFieldList.push(data);
          delete item.fieldJson;
        }
        return item;
      })
      if (this.processFieldList.length >= 1) {
        const param = {
          tempId: this.tempId,
          processFieldList: this.processFieldList
        }
        UpdateProcessField(param).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success("节点权限保存成功")
          }
        }).catch(err => {
          console.log(err);
        })
      }

      const params = {
        tempId: this.tempId, //表单id
        // moduleCode: 'aaa', //业务模块编码
        // content: JSON.stringify(workflow),
        content: JSON.stringify(this.processConfig),
        // nodeList: nodeList,
      }
      SaveProcess(params).then(res => {
        if (res.code == 20000) {
          const param = {
            tempId: this.tempId,
            nodeList: nodeList,
            deploymentId: res.data,
          }
          EhsSaveProcess(param).then(res => {
            if (res.code == 20000) {
              this.$antMessage.success('节点数据保存成功')
            }
          }).catch(err => {
            console.log(err);
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    zoomSize(type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return;
        }
        this.nowVal -= 10;
      } else {
        if (this.nowVal == 300) {
          return;
        }
        this.nowVal += 10;
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "./workflow.css";
.workflow-design {
  width: 100%;
  background: #fff;
  overflow-y: auto;
  height: calc(100vh - 160px);
  ::v-deep .fixed-bottom {
    width: calc(100% - 72px);
  }
  .loading {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #f6f6f6;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
  }
}
</style>
