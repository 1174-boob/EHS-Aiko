<template>
  <!-- 用户 -->
  <div class="user-box clx-show-scroll clx-flex-1 beauty-scroll">
    <h2 class="user-title">已离职用户</h2>
    <!-- 主要区域 -->
    <div class="user-main">
      <!-- 右侧列表 -->
      <div class="user-main-right clx-show-scroll clx-flex-1 beauty-scroll">
        <!-- 查询 -->
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="手机号">
              <a-input
                v-model="formInline.phone"
                placeholder="请输入手机号"
                allowClear
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="昵称">
              <a-input
                v-model="formInline.nickName"
                placeholder="请输入姓名号"
                allowClear
              ></a-input>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch"
                >查询</a-button
              >
              <a-button @click="iRest" :loading="loadingFour">重置</a-button>
              <a-button @click="turnBack">返回</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <div class="department-apply clx-btn-dashed-box">
          <a-button type="dashed" @click="deleteDict('all')">
            <a-icon type="minus" />批量删除
          </a-button>
        </div>
        <!-- 表格 -->
        <CommonTable
          :page="page"
          :pageNoChange="pageNoChange"
          :showSizeChange="showSizeChange"
        >
          <a-table
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :columns="columns"
            :scroll="{ x: 400 }"
            :locale="{ emptyText: emptyText }"
            :data-source="dataList"
            :rowKey="
              (record, index) => {
                return record.companyUserInfoId;
              }
            "
            :pagination="false"
          >
            <div slot="customTitle">操作</div>
            <div slot="action" slot-scope="text, record">
              <span
                class="color-0067cc cursor-pointer"
                @click="checkDetail(record)"
                >详情</span
              >
              <span
                class="color-ff4d4f cursor-pointer"
                @click="deleteDict('one', record)"
                >删除</span
              >
            </div>
          </a-table>
        </CommonTable>
      </div>
    </div>

    <!-- 详情组件 -->
    <CustomFormDetail
      :detailForm="detailForm"
      :detailFormCustomNew="detailFormCustomNew"
      :resignedDetail="resignedDetail"
      @cancelResignedDetail="cancelResignedDetail"
    />
  </div>
</template>
<script>
import {
  DelUserInfoList,
  GetUserInfoList,
  ResignedUserDetail,
} from "@/services/permissions";
import { debounce } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import teableSelected from "@/mixin/teableSelected";
import CustomFormDetail from "./customFormDetail.vue";
import getDictionaryItemObj from "@/utils/dictionary";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";

export default {
  mixins: [teableSelected, cancelLoading, teableCenterEllipsis],
  components: { CustomFormDetail },

  data() {
    return {
      dataList: [], //离职表格数据
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      detailForm: [], //详情
      loading: false, // 按钮loading
      detailFormCustomNew: [], //用户详情-自定义字段
      loadingSearch: false,
      resignedDetail: false,

      columnsApplicant: [
        //申请人每一列
        {
          title: "手机号",
          dataIndex: "phone",
          align: "center",
        },
        {
          title: "昵称",
          dataIndex: "status",
          key: "status",
          align: "center",
          customRender: (text) => {
            return <div>{getDictionaryItemObj("required", text)}</div>;
          },
        },
        {
          title: "加入时间",
          dataIndex: "phone",
          align: "center",
        },
        {
          title: "离职时间",
          dataIndex: "phone",
          align: "center",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 200,
          align: "center",
          fixed: "right", // 固定操作列
          scopedSlots: { customRender: "actionApplicant" },
        },
      ],
      pageApplicant: {
        //申请人分页
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {
        // 搜索表单
        nickName: undefined,
        phone: undefined,
      },
      page: {
        // 页码
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        //每一列项
        {
          title: "手机号",
          dataIndex: "phone",
          align: "center",
        },
        {
          title: "昵称",
          dataIndex: "nickName",
          key: "nickName",
          align: "center",
        },
        {
          title: "过期时间",
          dataIndex: "expireTime",
          key: "expireTime",
          align: "center",
        },
        {
          title: "加入时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 350,
          align: "center",
          fixed: "right", // 固定操作列
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },

  mounted() {
    this.getTableList();
  },

  computed: {
    company() {
      let company = JSON.parse(
        sessionStorage.getItem("zconsole_userInfo")
      ).company;
      return company;
    },
  },

  methods: {
    // 表格选中的每一项[]
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    //获取列表
    getTableList() {
      // 条件筛选查询
      let selObj = this.formInline;
      let postData = {
        jobStatus: "1",
        companyId: this.company.companyId,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...selObj,
        // deptId: this.selectedKeysOld[0],
      };
      return GetUserInfoList(postData)
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
          this.cancelLoadingFour();
        })
        .catch((err) => {
          this.cancelLoadingFour();
        });
    },

    //用户-页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },

    //用户-改变每页条数事件
    showSizeChange(pageNo, pageSize) {
      this.page.pageNo = pageNo;
      this.page.pageSize = pageSize;
      //获取列表
      this.getTableList();
    },

    // 查询
    iSearch() {
      this.handleLoading();
      // 获取列表
      this.getTableList().finally(() => {
        this.cancelLoading();
      });
    },

    // 重置
    iRest: debounce(
      function () {
        let formInlines = {
          nickName: undefined,
          phone: undefined,
        };
        this.formInline = formInlines;
        this.handleLoadingFour(); //按钮loading开启
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),

    //关闭详情组件
    cancelResignedDetail() {
      this.resignedDetail = false;
    },

    //详情
    async checkDetail(data) {
      let result = await ResignedUserDetail({
        companyUserInfoId: data.companyUserInfoId,
      });
      if (result.code == "20000") {
        this.detailForm = result.data;
        this.detailFormCustomNew = result.data
          ? result.data.userFields
            ? result.data.userFields
            : []
          : [];
      }
      this.resignedDetail = true;
    },

    //删除
    deleteDict(type, record) {
      if (type == "all") {
        //批量删
        if (!this.selectedRowKeys.length) {
          return this.$message.info("请先选择一条数据");
        }
      }
      this.$confirm({
        title: "提示",
        content: `${"确认删除？"}`,
        cancelText: "取消",
        onOk: async () => {
          //删除
          let result = await DelUserInfoList({
            list:
              type == "all" ? this.selectedRowKeys : [record.companyUserInfoId],
          });
          if (result.code == "20000") {
            this.$message.success("删除成功");
            this.getTableList();
            this.selectedRowKeys = [];
          }
          this.addUserFlag = false;
        },
      });
    },

    //返回用户列表页
    turnBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" >
.ant-modal-header {
  margin: 0;
}
.btns_div {
  margin-bottom: 20px;
  button {
    &:nth-child(4) {
      color: #999999 !important;
      background: #fff !important;
      border: none !important;
    }
  }
}
.department-apply {
  margin-bottom: 20px;
}
.h1_wxt {
  font-size: 14px;
  margin-bottom: 30px;
}
.bor_deash_div {
  height: 1px;
  border: 1px dashed rgba(238, 238, 238, 1);
  margin-bottom: 30px;
}
.user-box {
  display: flex;
  flex-direction: column;
  // title
  .user-title {
    flex: none;
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 30px 15px 0;
  }
  // 内容区域
  .user-main {
    flex: 1;
    display: flex;
    .user-main-left {
      width: 3.6rem;
      margin-right: 20px;
      background: #fff;
      padding: 0.2rem;
      overflow-y: auto;

      background: rgba(250, 250, 250, 0.5);
      border: 1px solid #f4f4f4;
      // border: 1px solid #ccc;
      box-sizing: border-box;
      .l-top {
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.19rem;
        border-bottom: solid #ccc 1px;
        margin-bottom: 0.2rem;
        span {
          font-size: 18px;
          color: #181818;
          font-weight: bold;
        }
      }
      .ant-tabs-nav-scroll {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .user-main-right {
      flex: 1;
      // 查询
      .user-search {
        padding: 27px 22px 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        background: rgba(250, 250, 250, 0.5);
        border: 1px solid #f4f4f4;
        border-radius: 2px;
        .user-search-left-item-box {
          .ant-form-item-children {
            display: flex;
            align-items: center;
          }
          .user-search-left-item-selct {
            width: 100px;
            margin-right: 10px;
          }
          .user-search-left-item {
            width: 220px;
          }
        }
        .user-search-left {
          .ant-form-item {
            margin-bottom: 16px !important;
          }
        }
        .user-search-right {
          margin-bottom: 16px !important;
        }
      }
      // 创建用户
      .user-apply {
        margin: 0.2rem 0;
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
.user-select-Modal {
  .user-select-Modal-body {
    padding-bottom: 40px;
  }
}
</style>
