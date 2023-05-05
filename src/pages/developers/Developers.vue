<template>
  <div class="datas">
    <h1>开发者账号</h1>
    <div class="top-one">
      <div class="left">
        <div class="l">
          <span class="span">名称</span>
          <a-input-search
            placeholder="请输入名称（模糊查询）"
            :maxLength="20"
            class="input-span"
            style="
              width: 3rem;
              border-radius: 4px;
              padding: 0;
              padding-left: 0.1rem;
            "
            @search="onSearch"
            :loading="logging"
          />
        </div>
      </div>
      <div class="right">
        <a-button @click="addNew('add')" type="primary">新增</a-button>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data" rowKey="accountId" :pagination="false" style="margin-top: 0.4rem">
      <a slot="operation" slot-scope="text, record" class="as">
        <span @click="addNew('change', record)">修改</span>
        <span @click="confirm(record)">删除</span>
      </a>
    </a-table>
    <div class="paginations">
      <span class="total-span">共有{{ total }}条</span>
      <a-pagination
        style="margin-right: 0.1rem; display: inline-block"
        show-quick-jumper
        :current="pageNo"
        :pageSize="pageSize"
        :total="total"
        :hideOnSinglePage="total == 0 ? true : false"
        @change="onChangeTab"
      />
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    align: "center",
    // scopedSlots: { customRender: "name" },
  },
  {
    title: "应用ID",
    dataIndex: "applicationId",
    key: "applicationId",
    align: "center",
    // width: 80,
  },
  {
    title: "应用secret",
    dataIndex: "applicationSecret",
    key: "applicationSecret",
    align: "center",
    ellipsis: true,
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    align: "center",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "address",
    align: "center",
    key: "address 4",
    ellipsis: true,
    width: 150,
    scopedSlots: { customRender: "operation" },
  },
];

import {
  GetDevelopersList,
  DelDevelopersList,
} from "../../services/developers";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;

export default {
  data() {
    return {
      data: [],
      columns,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      logging: false,
    };
  },
  mounted() {
    this.getRegistrationList();
  },
  methods: {
    async getRegistrationList() {
      let result = await GetDevelopersList({
        companyId: companyId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });
      if (result.code == "20000") {
        this.data = result.data.list;
        this.total = result.data.total;
      }
    },
    addNew(type, val) {
      let query = { ...val, type };
      this.$router.push({ path: "/developersadd", query });
    },
    confirm(record) {
      this.$antConfirm({
        title: "删除",
        content: "是否删除此条数据？",
        okText: "确认",
        cancelText: "取消",
        maskClosable: false,
        onOk: async () => {
          let result = await DelDevelopersList({
            accountId: record.accountId,
          });
          if (result.code == "20000") {
            let result = await GetDevelopersList({
              companyId: companyId,
              pageNo: "1",
              pageSize: "10",
            });
            if (result.code == "20000") {
              this.data = result.data.list;
              this.total = result.data.total;
              this.pageNo = 1;
              this.pageSize = 10;
              this.$antMessage.success("删除成功");
            }
          }
        },
      });
    },
    jumpSome() {
      this.$router.push("baseRegistery");
    },
    look() {
      this.$router.push("developersadd");
    },
    onChangeTab(pageNumber, pageSize) {
      this.pageSize = pageSize;
      this.pageNo = pageNumber;
      this.getRegistrationList();
    },
    async onSearch(value) {
      this.logging = true;
      this.pageSize = 10;
      this.pageNo = 1;
      let result = await GetDevelopersList({
        companyId: companyId,
        pageNo: "1",
        pageSize: "10",
        name: value,
      });
      if (result.code == "20000") {
        this.data = result.data.list;
        this.total = result.data.total;
        this.logging = false;
      }
    },
  },
};
</script>

<style lang='less' scoped>
.datas {
  width: 100%;
  height: 100%;
  padding-bottom: 0.2rem;
  .ant-input-search {
    display: flex;
  }
  .input-span {
    ::v-deep .ant-input-suffix {
      font-size: 0.14rem !important;
    }
  }
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 0.2rem 0 0.2rem 0;
    // border-bottom: 2px solid #f5f5f5;
  }
  .top-one {
    width: 100%;
    margin: 0 auto;
    height: 0.98rem;
    background: rgba(250, 250, 250, 0.5);
    border: 1px solid #f4f4f4;
    border-radius: 0.02rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0.24rem;
    .left {
      display: flex;
      .l {
        display: flex;
        align-items: center;

        margin-right: 0.3rem;
        .span {
          font-size: 0.14rem;
          font-family: FZanTingHeiS-R-GB;
          font-weight: 400;
          margin-right: 0.1rem;
          color: #999999;
          // width: 0.8rem;
        }
        span {
          ::v-deep span {
            font-size: 0.12rem;
          }
        }
      }
    }
    .right {
      button {
        margin-left: 0.1rem;
        width: 1rem !important;
        height: auto !important;
        padding: 0.1rem 0;
        font-size: 0.12rem;
      }
    }
  }
  .as {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>