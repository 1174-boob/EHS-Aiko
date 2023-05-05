<template>
  <div class="push-box clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>推送</PageTitle>
    <div class="flex">
      <div class="left border-radius-3 border-f4 pd-l-20 pd-r-20 pd-t-20 pd-b-20 m-r-20">
        <div class="m-b-20 font-16 font-weight-bold">选择内部人员</div>
        <div class="staff m-b-20 flex align-items-center">
          <!-- <div class="staff-label">内部人员</div>
          <a-tree-select
            multiple
            allow-clear
            :filterTreeNode="filterUserTree"
            v-model="checkedUser"
            :tree-data="userTreeData"
            @search="onSearch"
            @change="onChange"
            :replaceFields="replaceFields"
            placeholder="请选择组织人员"
          ></a-tree-select>-->
          <staffOrDept :labelTitle="''" :deptTreeId="deptTreeId" :checkedTreeNode="checkedStaffNode" @getTreeData="getTreeData" :treePlaceholder="'请选择组织人员'" @getRootData="getRootData"></staffOrDept>
        </div>
        <div class="m-b-20 font-16 font-weight-bold">选择厂商人员</div>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="厂商名称">
              <a-input v-model="formInline.companyName" placeholder="请输入厂商名称"></a-input>
            </a-form-model-item>
            <!-- 搜索栏按钮需要加固定的float-right类名 -->
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <div class="select-all flex justify-content-between pd-b-20">
          <div>所有厂商</div>
          <div class="font-weight-bold" v-if="companyList.length > 0" @click="clickAll">{{clickAllFlag ? "全不选" : "全选"}}</div>
        </div>
        <div v-show="companyList.length > 0">
          <a-collapse v-model="activeKey">
            <!-- <a-collapse-panel key="1" header="This is panel header 1"> -->
            <a-collapse-panel v-for="item in companyList" :key="item.id" :bordered="false">
              <div slot="header">
                <span class="m-r-20">
                  厂商名称：
                  <b>{{item.name}}</b>
                </span>
                <span>
                  总人数：
                  <b>{{item.totalStaff}}</b>
                </span>
              </div>
              <CommonTable :noPaging="true">
                <a-table
                  :row-selection="{ selectedRowKeys: chooseStaff[item.id].selectedRowKeys, onChange: (selectedRowKeys) => {onSelectChange(selectedRowKeys, item.id, item.name)} }"
                  :columns="columns"
                  :locale="{emptyText: emptyText}"
                  :data-source="item.staffList"
                  :rowKey="(record, index)=>{return item.name + '/' + record.id + '/' + record.name}"
                  :pagination="false"
                ></a-table>
              </CommonTable>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <div class v-show="companyList.length == 0">暂无厂商数据</div>
      </div>
      <div class="right border-radius-3 border-f4 pd-l-20 pd-r-20 pd-t-20 pd-b-20" style="overflow: hidden">
        <div class="m-b-20 font-16 font-weight-bold">内部人员已选（{{checkedUserTitle.length}}）人</div>
        <CommonTable :noPaging="true">
          <a-table :columns="columnsDetail1" :locale="{emptyText: emptyText}" :data-source="checkedUserTitle" :pagination="false"></a-table>
        </CommonTable>
        <div class="m-b-20 font-16 font-weight-bold">厂商人员已选（{{chooseStaffDetail.length}}）人</div>
        <CommonTable :noPaging="true">
          <a-table :columns="columnsDetail" :locale="{emptyText: emptyText}" :data-source="chooseStaffDetail" :pagination="false"></a-table>
        </CommonTable>
      </div>
    </div>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { GetPushTree, DeptUserTree, CompanyUserTree, PushCourse } from "@/services/api.js";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import staffOrDept from "@/components/staffOrDept";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    FixedBottom,
    staffOrDept
  },
  props: ["dataMsg"],
  data() {
    return {
      formInline: {},
      preFormInline: {},
      companyList: [],
      activeKey: [],
      columns: [ // 课程模块
        {
          title: "姓名",
          dataIndex: "name",
          key: "name"
        }
      ],
      chooseStaff: {},
      pushList: [],

      chooseStaffDetail: [],
      selectedRowKeys: [],

      columnsDetail: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "联系方式",
          dataIndex: "phone",
          key: "phone"
        }
      ],
      columnsDetail1: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "工号",
          dataIndex: "workNum",
          key: "workNum"
        }
      ],
      clickAllFlag: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },

      // 组织
      userTreeData: [],
      treeDefaultExpandedKeys: [],
      searchValue: undefined,
      replaceFields: { children: 'children', title: 'title', key: 'key', value: 'key' },
      checkedUser: [],
      checkedUserTitle: [],
      deptTreeId: "",
      checkedStaffNode: [],
    }
  },
  created() {
    if (!this.dataMsg) {
      return;
    }
    this.deptTreeId = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", this.dataMsg.corporationId).deptId;
    // this.getDeptUserTree();
    this.getPushTree();
    // CompanyUserTree({
    //   corporationId: this.dataMsg.corporationId
    // }).then((res) => {
    // }).catch((err) => {
    //   console.log(err);
    // })
  },
  methods: {
    // 获取内部人员数据
    getRootData(treeData) {
      this.userTreeData = treeData;
    },
    // 改变组织人员
    getTreeData(obj) {
      console.log(obj);
      let arr = obj.treeNameAndCodeList || [];
      let brr = [];
      for (let i = 0; i < arr.length; i++) {
        brr.push({
          name: arr[i].treeName,
          workNum: arr[i].treeCode,
          deptId: arr[i].treeParentId,
          deptName: arr[i].treeParentName,
          key: arr[i].id,
        });
      }
      this.checkedUserTitle = [...brr];
    },
    getDeptUserTree() {
      DeptUserTree({
        corporationId: this.dataMsg.corporationId
      }).then(res => {
        this.userTreeData = [res.data];
        this.resetTitle(this.userTreeData);
      }).catch(err => {
        console.log(err);
      })
    },
    resetTitle(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].title = arr[i].title + "/" + arr[i].key;
        if (arr[i].deptId) {
          arr[i].key = arr[i].key + "/" + arr[i].deptId;
        }
        if (arr[i].children) {
          this.resetTitle(arr[i].children);
        }
      }
    },
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    onChange(value, label, extra) {
      console.log("value, label", value, label);
      let arr = [];
      for (let i = 0; i < label.length; i++) {
        arr.push({
          name: label[i].split("/")[0],
          workNum: label[i].split("/")[1],
          deptId: value[i].split("/")[1],
          key: value[i].split("/")[0]
        })
      }
      this.checkedUserTitle = arr;
    },
    onSearch(value) {
      this.searchValue = value;
    },
    getPushTree() {
      return GetPushTree({
        ...this.preFormInline,
        corporationId: this.dataMsg.corporationId
      }).then((res) => {
        this.companyList = res.data.companyList;
        for (let i = 0; i < this.companyList.length; i++) {
          this.pushList.push(...this.companyList[i].staffList);
          this.chooseStaff[this.companyList[i].id] = {
            selectedRowKeys: []
          };
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    iSearch() {
      this.preFormInline = { ...this.formInline };
      this.getPushTree()
        .finally(() => {
          this.cancelLoading();
        })
    },
    onSelectChange(selectedRowKeys, id) {
      this.chooseStaff[id].selectedRowKeys = selectedRowKeys;
      this.chooseStaff = { ...this.chooseStaff } // 和forceUpdate同样的效果，任何data里的数据变化都会触发forceUpdate，连续多次会做优化，看具体情况
      // this.$forceUpdate(); // 强制渲染一次
      this.filterStaff();
    },
    filterStaff() {
      let arr = [];
      console.log(this.chooseStaff);
      for (let key in this.chooseStaff) {
        for (let j = 0; j < this.chooseStaff[key].selectedRowKeys.length; j++) {
          for (let k = 0; k < this.pushList.length; k++) {
            if (this.pushList[k].id == this.chooseStaff[key].selectedRowKeys[j].split("/")[1]) {
              arr.push({
                ...this.pushList[k],
                companyId: key,
                companyName: this.chooseStaff[key].selectedRowKeys[j].split("/")[0]
              });
            }
          }
        }
      }
      this.chooseStaffDetail = arr;
    },
    clickAll() {
      this.clickAllFlag = !this.clickAllFlag;
      if (this.clickAllFlag) {
        this.chooseStaffDetail = [...this.pushList];
        for (let key in this.chooseStaff) {
          for (let i = 0; i < this.companyList.length; i++) {
            if (this.companyList[i].id == key) {
              for (let j = 0; j < this.companyList[i].staffList.length; j++) {
                this.chooseStaff[key].selectedRowKeys.push(this.companyList[i].staffList[j].id);
              }
            }
          }
        }
      } else {
        this.chooseStaffDetail = [];
        for (let key in this.chooseStaff) {
          this.chooseStaff[key].selectedRowKeys = [];
        }
      }
      this.chooseStaff = { ...this.chooseStaff };
    },
    cancleSubmit() {
      this.$router.push({ name: "课程管理" });
    },
    confirmSubmit() {
      let userList = [];
      for (let i = 0; i < this.checkedUserTitle.length; i++) {
        userList.push(this.checkedUserTitle[i].workNum);
      }
      for (let i = 0; i < this.chooseStaffDetail.length; i++) {
        userList.push(this.chooseStaffDetail[i].id);
      }
      if (this.checkedUserTitle.length == 0 && this.chooseStaffDetail.length == 0) {
        this.$antMessage.error("您还未选择推送人员");
        return;
      }
      PushCourse({
        courseId: this.dataMsg.courseId,
        userList
      }).then((res) => {
        this.$antMessage.success("推送成功");
        this.$router.push({ name: "课程管理" });
      }).catch((err) => {
        console.log(err);
      })
    },
  }
}
</script>
<style lang="less" scoped>
.left {
  width: 470px;
}
.right {
  flex: 1;
}
.staff {
  margin-bottom: 20px;
  /deep/ .ant-select {
    width: 353px;
  }
  .staff-label {
    flex: none;
    width: 76px !important;
  }
  .staff-dept {
    width: calc(100% - 96px);
    ::v-deep .ant-form-item {
      width: 100%;
      margin-bottom: unset;
      .ant-select {
        width: 270px;
      }
    }
  }
}
</style>