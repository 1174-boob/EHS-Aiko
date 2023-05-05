<template>
  <!-- 用户 -->
  <div class="user-box">
    <CommonModal
      title="分配角色"
      :visible="authVisible"
      :cancelFn="handleCancel"
    >
      <!-- clx-model-body -->
      <div solt="form">
        <!-- 表单 -->
        <a-form-model
          ref="ruleForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="手机号">
            <a-input
              v-model="selItem.phone"
              class="clx-input-no-border"
              disabled
            />
          </a-form-model-item>
          <a-form-model-item label="分配角色">
            <!-- 表格 -->
            <div class="user-table">
              <a-table
                :columns="columns"
                :locale="{ emptyText: emptyText }"
                :data-source="userRoleList"
                rowKey="roleId"
                :pagination="false"
                :row-selection="{
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectChange,
                }"
              ></a-table>
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
      <!-- clx-model-btn -->
      <div class="clx-model-btn">
        <a-button type="dashed" @click="handleCancel">取消</a-button>
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="onSubmit"
          >提交</a-button
        >
      </div>
    </CommonModal>
  </div>
</template>

<script>
import {
  getUserList,
  ChangeUserRole,
  BackUserRole,
  getDepartmentDetails,
  AddUserRole,
} from "@/services/api";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId
  : "";
export default {
  mixins: [teableCenterEllipsis, teableSelected],
  props: ["authVisible", "userRoleList", "selItem"],
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      // 新增、修改表单
      form: {
        userName: "22222", //用户名
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
      ],
      dataList: [
        {
          key: 1,
          name: "1446408891691831296",
          description: "合同类型",
        },
      ],
      loading: false,
    };
  },
  methods: {
    //回显
    async getBackUserRole() {
      let productId = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
        .productSets
        ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets
            .productId
        : "";
      let result = await BackUserRole({
        companyId,
        userId: this.selItem.userId,
        productId,
      });
      if (result.code == "20000") {
        this.selectedRowKeys = result.data;
      }
    },
    // 获取列表
    getTableList() {
      let postData = { companyId: companyId, ...this.page };
      getUserList(postData)
        .then((res) => {
          let { list: dataList, total } = res.data
            ? res.data
            : { list: [], total: 0 };
          this.dataList = dataList;
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
    // 提交
    async onSubmit() {
      // if (this.selectedRowKeys.length) {
      //需分配角色才可以提交
      this.loading = true;
      let productId = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
        .productSets
        ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets
            .productId
        : "";
      let apiData = {
        companyId,
        userId: this.selItem.userId,
        roleIdList: this.selectedRowKeys,
        productId,
      };
      if (this.selItem.roles == null) {
        //新增
        try {
          let result = await AddUserRole(apiData);
          if (result.code == "20000") {
            this.$emit("getTableList");
            this.handleCancel();
            this.loading = false;
            this.$message.success("授予成功");
          }
        } catch (error) {
          this.loading = false;
          this.handleCancel();
        }
      } else {
        try {
          let result = await AddUserRole(apiData);
          if (result.code == "20000") {
            this.$emit("getTableList");
            this.handleCancel();
            this.loading = false;
            this.$message.success("修改成功");
          }
        } catch (error) {
          this.loading = false;
          this.handleCancel();
        }
      }
      // }
    },
    // 关闭model
    handleCancel() {
      this.$emit("closeAuthModel");
      this.selectedRowKeys = [];
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    // 获取详情
    getRoleItemDetailsFn(apiData) {
      return getDepartmentDetails(apiData)
        .then((res) => {
          let {
            userName,
            phone,
            nickName,
            pwd,
            email,
            deptIds,
            groupIds,
            expireDate,
          } = res.data;
          this.form = {
            userName,
            phone,
            nickName,
            pwd,
            email,
            deptIds,
            groupIds,
            expireDate,
          };
        })
        .catch((err) => {});
    },
  },
  watch: {
    authVisible(newVal) {
      if (!newVal) {
        this.form = {
          userName: undefined, //用户名
        };
      } else {
        this.getBackUserRole();
      }
    },
  },
};
</script>

<style lang="less">
.user-table {
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
