<template>
  <div class="data">
    <h1>数据模板</h1>
    <div class="top-one">
      <div class="left">
        <div class="l">
          <span class="span">产品型号</span>
          <a-input-search
            placeholder="请输入产品型号（模糊查询）"
            :maxLength="20"
            style="
              width: 3rem;
              border-radius: 0.04rem;
              padding: 0;
              padding-left: 0.1rem;
            "
            @search="onSearch"
          />
        </div>
      </div>
      <div class="right">
        <a-button @click="addNew('add')" type="primary">新增</a-button>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="templateId">
      <a slot="operation" slot-scope="text, record" class="as">
        <span></span>
        <span v-show="record.validStatus == '1'" style="color: #a0a0a0" class="reloadsh">编辑</span>
        <span v-show="record.validStatus == '0'" @click="addNew('change', record)">编辑</span>
        <span v-show="record.validStatus == '0'" style="color: #a0a0a0" class="reloadsh">实例模板</span>
        <span v-show="record.validStatus == '1'" @click="jumpInstance(record)">实例模板</span>

        <span v-show="record.syncType == '1' || record.syncType == '0'" style="color: #a0a0a0" class="reloadsh">刷新</span>
        <span v-show="record.syncType == '2'" @click="refresh(record)">刷新</span>
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
import {
  GetDataList,
  DelDataList,
  RefreshDataList,
} from "../../services/datatemplate";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;

export default {
  data() {
    return {
      data: [],
      columns: [
        {
          title: "模板名称",
          dataIndex: "templateName",
          ellipsis: true,
          key: "templateName",
          align: "center",
        },
        {
          title: "标识编码",
          dataIndex: "markerCode",
          ellipsis: true,
          key: "markerCode",
          align: "center",
          customRender: (text) => {
            return (
              <a-popover placement="bottomLeft">
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "所属前缀",
          dataIndex: "attributionPrefix",
          key: "attributionPrefix",
          align: "center",
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-popover placement="bottomLeft">
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "产品型号",
          dataIndex: "productModel",
          key: "productModel",
          ellipsis: true,
          align: "center",
        },

        {
          title: "状态",
          dataIndex: "validStatus",
          key: "validStatus",
          align: "center",
          ellipsis: true,
          customRender: (text, record, index) => {
            return text == 0 ? "草稿" : "完成";
          },
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
          ellipsis: true,
        },
        {
          title: "同步状态",
          dataIndex: "syncType",
          key: "syncType",
          align: "center",
          ellipsis: true,
          customRender: (text, record, index) => {
            return text == 0 ? "未同步" : text == 1 ? "已同步" : "同步失败";
          },
        },
        {
          title: "操作",
          dataIndex: "set",
          key: "set",
          width: 200,
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "operation" },
        },
      ],
      pageNo: 1,
      pageSize: 10,
      total: 0,
    };
  },
  mounted() {
    this.getRegistrationList();
  },
  methods: {
    async refresh(record) {
      let result = await RefreshDataList({
        templateId: record.templateId,
      });
      if (result.code == "20000") {
        this.getRegistrationList();
        this.$antMessage.success("刷新成功");
      }
    },
    async getRegistrationList() {
      let result = await GetDataList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        companyId: companyId,
        productModel: "",
      });
      if (result.code == "20000") {
        this.data = result.data.list;
        this.total = result.data.total;
      }
    },
    jumpInstance(record) {
      this.$router.push({ path: "instancetemplate", query: record });
    },
    confirm(record) {
      this.$antConfirm({
        title: "删除",
        content: "是否删除此条数据？",
        okText: "确认",
        cancelText: "取消",
        maskClosable: false,
        onOk: async () => {
          let result = await DelDataList({
            templateId: record.templateId,
          });
          if (result.code == "20000") {
            let result = await GetDataList({
              pageNo: "1",
              pageSize: "10",
              companyId: companyId,
              productModel: "",
            });
            if (result.code == "20000") {
              this.pageSize = "10";
              this.pageNo = "1";
              this.data = result.data.list;
              this.total = result.data.total;
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
      this.$router.push("datatemplateadd");
    },
    onChangeTab(pageNumber, pageSize) {
      this.pageSize = pageSize;
      this.pageNo = pageNumber;
      this.getRegistrationList();
    },
    addNew(type, val) {
      let query = { ...val, type };
      this.$router.push({ path: "datatemplateadd", query });
    },
    async onSearch(value) {
      this.pageSize = 8;
      this.pageNo = 1;
      let result = await GetDataList({
        pageNo: "1",
        pageSize: "10",
        productModel: value,
        companyId: companyId,
      });
      if (result.code == "20000") {
        this.data = result.data.list;
        this.total = result.data.total;
      }
    },
  },
};
</script>

<style lang='less' scoped>
.data {
  width: 100%;
  height: 100%;
  padding-bottom: 0.2rem;
  .ant-input-search {
    display: flex;
  }
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 0.2rem 0 0.2rem 0;
    margin-bottom: 0.1rem;
    // border-bottom: 2px solid #f5f5f5;
  }
  .top-one {
    width: 100%;
    margin-bottom: 0.3rem;
    height: 98px;
    background: rgba(250, 250, 250, 0.5);
    border: 0.01rem solid #f4f4f4;
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
        .timeinput {
          width: 2.35rem;
          height: 0.38rem;

          & :first-child {
            height: 100% !important;
            border-radius: 0.04rem !important;
          }
        }
        .span {
          font-size: 0.14rem;
          font-family: FZanTingHeiS-R-GB;
          font-weight: 400;
          margin-right: 0.1rem;
          color: #999999;
        }
        .input {
          width: 2.4rem;
          height: 0.38rem;
          background: #ffffff;
          border-radius: 0.04rem;
        }
      }
    }
    .right {
      button {
        margin-left: 0.1rem;
        // width: 0.8rem;
        // height: 0.38rem;
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