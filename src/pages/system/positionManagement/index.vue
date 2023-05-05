<template>
  <!-- 职位管理 -->
  <div class="role-console-box clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>职位管理</PageTitle>
    <SearchTerm>
      <div class="role-console-search-left">
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="职位名称">
            <a-input
              class="role-console-search-left-item"
              :maxLength="nameMaxLength"
              v-model="formInline.positionName"
              placeholder="请输入职位名称"
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
    <!-- 创建职位 -->
    <div class="role-console-apply clx-btn-dashed-box">
      <a-button type="dashed" @click="addConsoleRole">
        <a-icon type="plus" />创建职位
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
          rowKey="positionId"
          :pagination="false"
        >
          <div class="table-btn" slot="action" slot-scope="text, record">
            <span @click="changeConsoleRole(record)">编辑</span>
            <span @click="rmConsoleRoleFn(record)" class="table-btn-rm"
              >删除</span
            >
          </div>
        </a-table>
      </CommonTable>
    </div>
    <!-- 新增、编辑职位弹窗 -->
    <CommonModal
      :title="modelTitle"
      :visible="roleModelShow"
      :cancelFn="closeModel"
    >
      <template slot="form">
        <a-form-model
          ref="ruleForm"
          :model="formData"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="职位编码" prop="positionCode">
            <a-input
              :disabled="true"
              :maxLength="6"
              v-model="formData.positionCode"
              placeholder="请输入职位编码"
            />
          </a-form-model-item>
          <a-form-model-item label="职位名称" prop="positionName">
            <a-input v-model="formData.positionName" placeholder="请输入职位名称" />
          </a-form-model-item>
          <a-form-model-item label="职位等级" prop="positionLevel">
            <a-input
              :disabled="InpDis"
              v-model="formData.positionLevel"
              placeholder="请输入职位等级"
            />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button type="dashed" :loading="loading" @click="closeModel"
          >取消</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="onSubmit"
          >提交</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>

<script>
import {
  getConsoleRoleList,
  getConsoleRoleTree,
  getConsoleRoleItemDetail,
  rmConsoleRole,
} from "@/services/api";
import {
  GetPositonList,
  AddOPositon,
  UpdateOPositon,
  DelOPositon,
  GetOPositonCode
} from "@/services/position.js";
import fromMaxLength from "@/mixin/fromMaxLength";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  mixins: [fromMaxLength, teableCenterEllipsis, cancelLoading],
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 新增、修改表单
      formData: {
        positionCode: "",
        positionName: "",
        positionLevel: "",
      },
      // 表单验证
      rules: {
        positionCode: [
          {
            required: true,
            validator: formValidator.onlyNumber,
            trigger: "blur",
            text: "职位编码",
          },
        ],
        positionName: [
          { required: true, message: "职位名称不能为空", trigger: "blur" },
        ],
        positionLevel: [
          {
            required: true,
            validator: formValidator.texTonlyNumberNine,
            trigger: "blur",
            text: "职位等级",
          },
        ],
      },
      // 职位弹窗model-显示隐藏
      roleModelShow: false,
      // 职位权限树
      roleTree: [],
      // 搜索表单
      formInline: {
        positionName: undefined,
      },
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "职位等级",
          dataIndex: "positionLevel",
          key: "positionLevel",
        },
        {
          title: "职位编码",
          dataIndex: "positionCode",
          key: "positionCode",
        },
        {
          title: "职位名称",
          dataIndex: "positionName",
          key: "positionName",
        },
        {
          title: "更新时间",
          dataIndex: "updateTime",
          key: "updateTime",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 140,
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
      //编辑时禁用输入框
      InpDis: false,
      //弹窗title
      modelTitle: "",
      //编辑时存储的id
      positionId: "",
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    // 获取列表
    getTableList() {
      let postData = {
        ...this.page,
        ...this.formInline,
      };
      return GetPositonList(postData)
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
        .catch((err) => {});
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
        this.formInline = { positionName: undefined };
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 获取职位权限树
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
      // 获取职位编码
      GetOPositonCode()
        .then((res) => {
          this.roleModelData = {
            companyId: this.companyId,
          };
          this.formData.positionCode = res.data
          this.modelTitle = "创建职位";
          this.InpDis = false;
          this.roleModelShow = true;
        })
        .catch(() => {});
    },
    // 修改
    changeConsoleRole(item) {
      this.positionId = item.positionId;
      this.formData = {
        positionCode: item.positionCode,
        positionName: item.positionName,
        positionLevel: item.positionLevel,
      };
      this.modelTitle = "编辑职位";
      this.InpDis = true;
      this.roleModelShow = true;
    },
    // 删除
    rmConsoleRoleFn(row) {
      let postData = {
        positionId: row.positionId,
      };
      this.$confirm({
        title: "确定删除？",
        icon: () => (
          <a-icon type="delete" class="confirm-icon-rm" theme="filled" />
        ),
        content: "如果您有用户绑定了该职位，则将职位信息一并删除",
        cancelText: "取消",
        onOk: () => {
          DelOPositon(postData)
            .then((res) => {
              this.$message.success("删除成功");
              this.getTableList();
            })
            .catch((err) => {});
        },
      });
    },
    //提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        let obj = {
          ...this.formData,
          positionId: this.modelTitle == "创建职位" ? undefined : this.positionId,
        };
        if (this.modelTitle == "创建职位") {
          //新增
          AddOPositon(obj)
            .then((res) => {
              this.getTableList();
              this.$message.success("新增成功");
              this.closeModel();
            })
            .catch(() => {});
        } else {
          UpdateOPositon(obj)
            .then((res) => {
              this.getTableList();
              this.$message.success("修改成功");
              this.closeModel();
            })
            .catch(() => {});
        }
      });
    },
    //关闭弹窗
    closeModel() {
      this.roleModelShow = false;
      this.formData={
        positionCode: "",
        positionName: "",
        positionLevel: "",
      }
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
  // 创建职位
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
