<template>
  <!-- 角色管理 -->
  <div class="role-console-box clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>角色管理</PageTitle>
    <SearchTerm>
      <div class="role-console-search-left">
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="角色名称">
            <a-input
              class="role-console-search-left-item"
              :maxLength="nameMaxLength"
              v-model="formInline.roleName"
              placeholder="请输入角色名称"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loadingTwo" @click="iSearch"
              >查询</a-button
            >
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </SearchTerm>
    <!-- 创建角色 -->
    <div class="role-console-apply clx-btn-dashed-box">
      <a-button type="dashed" @click="addConsoleRole">
        <a-icon type="plus" />创建角色
      </a-button>
    </div>
    <!-- 表格 -->
    <div class="role-console-table">
      <CommonTable
        :page="page"
        :pageNoChange="pageNoChange"
        :showSizeChange="showSizeChange"
      >
        <a-table
          :columns="columns"
          :locale="{ emptyText: emptyText }"
          :data-source="dataList"
          rowKey="roleId"
          :pagination="false"
        >
          <div class="table-btn" slot="action" slot-scope="text, record">
            <span @click="changeConsoleRole(record)">编辑</span>
            <span @click="rmConsoleRoleFn(record)">删除</span>
          </div>
        </a-table>
      </CommonTable>
    </div>
    <!-- 新增、编辑角色弹窗 -->
    <RoleModel
      v-model="roleModelShow"
      :roleTree="roleTree"
      :roleModelData="roleModelData"
      :resourceIdListAll="resourceIdListAll"
      @getTableList="getTableList"
    />
  </div>
</template>

<script>
import {
  getConsoleRoleList,
  getConsoleRoleTree,
  getConsoleRoleItemDetail,
  rmConsoleRole,
} from "@/services/role.js";
import fromMaxLength from "@/mixin/fromMaxLength";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import RoleModel from "./components/roleModel.vue";
import { clxTools } from "@/utils/clx-tools";
export default {
  components: { RoleModel },
  mixins: [fromMaxLength, teableCenterEllipsis, cancelLoading],
  data() {
    return {
      // 角色弹窗model-显示隐藏
      roleModelShow: false,
      // 角色弹窗model-表单信息
      roleModelData: null,
      resourceIdListAll: [],
      // 角色权限树
      roleTree: [],
      // 搜索表单
      formInline: {
        roleName: undefined,
      },
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "角色名称",
          dataIndex: "roleName",
          key: "roleName",
        },
        {
          title: "角色描述",
          dataIndex: "description",
          key: "description",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 140,
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
      // 关联策略树
      relationTree: [],
      companyId: null,
      productId: null,
    };
  },
  created() {
    this.companyId = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).company.companyId;
    this.productId =
      JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets &&
      JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets
        .productId
        ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets
            .productId
        : undefined;
    this.getTableList();
  },
  methods: {
    // 获取列表
    getTableList() {
      let postData = {
        companyId: this.companyId,
        productId: this.productId,
        ...this.page,
        total: undefined,
        ...this.formInline,
        roleType: 1,
      };
      return getConsoleRoleList(postData)
        .then((res) => {
          let { list: dataList, total } = res.data
            ? res.data
            : { list: [], total: 0 };
          this.dataList = dataList ? dataList : [];
          this.page.total = total;

          // 处理页码 问题
          if (
            this.dataList.length === 0 &&
            (this.page.pageNo !== 1 || this.page.total !== 0)
          ) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch((err) => {
          
        });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    //改变每页条数事件
    showSizeChange(pageNo, pageSize) {
      this.page.pageNo = pageNo;
      this.page.pageSize = pageSize;
      //获取列表
      this.getTableList();
    },
    // 查询
    iSearch() {
      this.handleLoadingTwo();
      // 获取列表
      this.getTableList().finally(() => {
        this.cancelLoadingTwo();
      });
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = { roleName: undefined };
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 获取角色权限树
    getConsoleRoleTreeFn() {
      // flag 表示查询包含按钮的权限树
      let apiData = { productId: this.productId, flag: false };
      return getConsoleRoleTree(apiData)
        .then((res) => {
          this.roleTree = res.data;
          return res;
        })
        .catch((err) => {});
    },
    // 新增
    addConsoleRole() {
      // 获取角色权限树
      this.getConsoleRoleTreeFn()
        .then((res) => {
          this.roleModelData = {
            companyId: this.companyId,
            productId: this.productId,
            roleCode: "",
            roleName: "",
            description: "",
            resourceIdList: [],
          };
          this.roleModelShow = true;
        })
        .catch(() => {});
    },
    // 修改
    changeConsoleRole(item) {
      let apiData = { roleId: item.roleId };
      // 获取角色权限树和角色详情
      Promise.all([
        this.getConsoleRoleTreeFn(),
        getConsoleRoleItemDetail(apiData),
      ])
        .then((res) => {
          let roleItemDetail = res[1];
          let resourceIdList = clxTools.recursionArr(
            roleItemDetail.data.resourceTreeList,
            "resourceId"
          );
          // 获取所有id集合，并找出与仅子集数组的不同项
          this.resourceIdListAll = clxTools.recursionArr(
            roleItemDetail.data.resourceTreeList,
            "resourceId",
            "children",
            true
          );
          this.roleModelData = {
            companyId: this.companyId,
            productId: this.productId,
            roleId: item.roleId,
            roleCode: roleItemDetail.data.roleCode,
            roleName: roleItemDetail.data.roleName,
            description: roleItemDetail.data.description,
            resourceIdList: resourceIdList,
          };
          this.roleModelShow = true;
        })
        .catch(() => {});
    },
    // 删除
    rmConsoleRoleFn(row) {
      let postData = {
        companyId: row.companyId,
        roleId: row.roleId,
      };
      this.$confirm({
        title: "确定删除？",
        icon: () => (
          <a-icon type="delete" class="confirm-icon-rm" theme="filled" />
        ),
        content: "确定后所有被赋予该角色的用户将失去对应的功能权限",
        cancelText: "取消",
        onOk: () => {
          rmConsoleRole(postData)
            .then((res) => {
              this.$message.success("删除成功");
              this.getTableList();
            })
            .catch((err) => {});
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.role-console-box {
  // title
  .role-console-title {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 30px 15px 0;
  }
  // 创建角色
  .role-console-apply {
    margin: 20px 0;
    button {
      span {
        font-size: 0.16rem;
      }
    }
  }
  .role-console-table {
    .table-status {
      i {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .table-btn {
      display: flex;
      align-items: center;
      justify-content: space-around;
      & > span {
        cursor: pointer;
        color: #0067cc;
      }
      .table-btn-rm {
        color: #dd000d;
      }
    }
    .table-pagination {
      display: flex;
      margin: 15px 15px;
      justify-content: flex-end;
      align-items: center;
      .table-pagination-totel {
        margin-left: 15px;
        & > span {
          color: #0065c8;
        }
      }
    }
  }
}
.clx-model-body {
  .relation-tree-title {
    display: flex;
    .relation-tree-title-all {
      & > span {
        color: #0067cc;
      }
      margin-right: 20px;
    }
    .relation-tree-title-sel {
      & > span {
        color: #0067cc;
      }
    }
  }
}
</style>
