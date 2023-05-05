<template>
  <div class="father">
    <h1>标识注册</h1>
    <div class="top-one">
      <div class="left">
        <div class="l">
          <span class="span">标识</span>
          <a-input
            :maxLength="20"
            placeholder="请输入标识（模糊查询）"
            @pressEnter="pressEnter"
            style="
              padding: 0;
              padding-left: 0.1rem;
              font-size: 0.12rem;
              height: 38px;
              width: 3rem;
            "
            :value="inpvalue"
            @change="inpchange"
          />
        </div>
        <div class="l">
          <span class="span">创建时间</span>
          <a-range-picker @change="onChange" v-model="dateKey" style="width: 3rem" />
        </div>
      </div>
      <div class="right">
        <a-button @click="searchinp" type="primary" :loading="logging">查询</a-button>
        <a-button @click="addNew">重置</a-button>
      </div>
    </div>
    <div class="top-two">
      <div>
        <a-button type="dashed" @click="JumpRegistery('add')">
          <a-icon type="plus" />注册
        </a-button>
        <a-button type="dashed" @click="jumpSome">
          <a-icon type="plus" />批量注册
        </a-button>
      </div>
      <a-button type="dashed" class="other" icon="redo" @click="getBasicList('')" />
    </div>
    <div>
      <a-table class="t" :columns="columns" :data-source="data" :pagination="false" rowKey="handleId">
        <a slot="operation" slot-scope="text, record" class="as">
          <span @click="look('look', record)">查看</span>
          <span @click="JumpRegistery('change', record)">编辑</span>
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
  </div>
</template>

<script>
// const columns = [
//   {
//     title: "序号",
//     dataIndex: "name",
//     key: "name",
//     width: 80,
//     ellipsis: true,
//     align: "center",
//     customRender: (text, record, index) => `${index + 1}`,
//   },
//   {
//     title: "前缀",
//     dataIndex: "attributionPrefix",
//     key: "attributionPrefix",
//     align: "center",
//     ellipsis: true,
//     customRender: (text) => {
//       return (
//         <a-popover>
//           <div slot="content">
//             <p>{{ text }}</p>
//           </div>
//           <span>{{ text }}</span>
//         </a-popover>
//       );
//     },
//   },
//   {
//     title: "标识",
//     dataIndex: "handle",
//     key: "handle",
//     align: "center",
//     ellipsis: true,
//   },
//   {
//     title: "类型",
//     dataIndex: "productModel",
//     key: "productModel",
//     align: "center",
//     ellipsis: true,
//   },
//   {
//     title: "解析状态",
//     dataIndex: "parseStatus",
//     key: "parseStatus",
//     align: "center",
//     ellipsis: true,
//     customRender: (text, record, index) => {
//       return text == 0 ? "解析中" : text == 1 ? "已解析" : "解析失败";
//     },
//   },
//   {
//     title: "同步信息",
//     dataIndex: "synchronizedStatus",
//     key: "synchronizedStatus",
//     align: "center",
//     ellipsis: true,
//     customRender: (text, record, index) => {
//       return text == 0 ? "同步中" : text == 1 ? "已同步" : "同步失败";
//     },
//   },
//   {
//     title: "创建时间",
//     dataIndex: "createTime",
//     key: "createTime",
//     align: "center",
//     ellipsis: true,
//   },
//   {
//     title: "操作",
//     dataIndex: "set",
//     align: "center",
//     key: "4",
//     ellipsis: true,
//     scopedSlots: { customRender: "operation" },
//   },
// ];
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;

import Breadcrumb from "@/components/breadcrumb/breadcrumb.vue";

import {
  GetBasicList,
  DelBasicList,
  EnterprisePrefix,
} from "../../services/basic";
let enterpriseprefix = sessionStorage.getItem("EnterprisePrefix"); //获取前缀

export default {
  data() {
    return {
      data: [],
      logging: false,
      columns: [
        {
          title: "序号",
          dataIndex: "name",
          key: "name",
          width: 80,
          ellipsis: true,
          align: "center",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "前缀",
          dataIndex: "attributionPrefix",
          key: "attributionPrefix",
          align: "center",
          ellipsis: true,
        },
        {
          title: "标识",
          dataIndex: "handle",
          key: "handle",
          align: "center",
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-popover placement="bottom">
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "类型",
          dataIndex: "productModel",
          key: "productModel",
          align: "center",
          ellipsis: true,
        },
        {
          title: "解析状态",
          dataIndex: "parseStatus",
          key: "parseStatus",
          align: "center",
          ellipsis: true,
          customRender: (text, record, index) => {
            return text == 0 ? "解析中" : text == 1 ? "已解析" : "解析失败";
          },
        },
        {
          title: "同步信息",
          dataIndex: "synchronizedStatus",
          key: "synchronizedStatus",
          align: "center",
          ellipsis: true,
          customRender: (text, record, index) => {
            return text == 0 ? "同步中" : text == 1 ? "已同步" : "同步失败";
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
          title: "操作",
          dataIndex: "set",
          align: "center",
          key: "4",
          ellipsis: true,
          scopedSlots: { customRender: "operation" },
        },
      ],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      dateKey: [],
      enterpriseprefix,
      inpvalue: "",
      createBeginTime: "",
      createEndTime: "",
    };
  },
  mounted() {
    this.getBasicList();
    //this.enterprisePrefix();
  },
  methods: {
    pressEnter(e) {
      this.getBasicList(e.target.value);
    },
    async enterprisePrefix() {
      //获取企业前缀
      let result = await EnterprisePrefix({ companyId });
      if (result.code == "20000") {
        sessionStorage.setItem("EnterprisePrefix", result.data.attributionPrefix);
      }
    },
    async getBasicList(handle) {
      //获取列表接口
      let result = await GetBasicList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        companyId: companyId,
        handle: handle ? handle : "",
        createBeginTime: this.createBeginTime,
        createEndTime: this.createEndTime,
      });
      if (result.code == "20000") {
        this.data = result.data.records;
        this.total = result.data.total;
      }
    },
    inpchange(e) {
      this.inpvalue = e.target.value;
    },
    async searchinp() {
      this.logging = true;
      this.pageSize = 10;
      this.pageNo = 1;
      let result = await GetBasicList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        companyId: companyId,
        handle: this.inpvalue,
        createBeginTime: this.createBeginTime,
        createEndTime: this.createEndTime,
      });
      if (result.code == "20000") {
        this.data = result.data.records;
        this.total = result.data.total;
        this.logging = false;
      }
    },
    JumpRegistery(type, record) {
      record = { ...record, type };
      this.$router.push({ path: "basic/baseRegisteryt", query: record });
    },
    confirm(record) {
      this.$antConfirm({
        title: "删除",
        content: "是否删除此条数据？",
        okText: "确认",
        cancelText: "取消",
        maskClosable: false,
        onOk: async () => {
          let result = await DelBasicList({ handleId: record.handleId });
          if (result.code == "20000") {
            let result = await GetBasicList({
              pageNo: 1,
              pageSize: 10,
              companyId: companyId,
              handle: "",
              createBeginTime: this.createBeginTime,
              createEndTime: this.createEndTime,
            });
            if (result.code == "20000") {
              this.data = result.data.records;
              this.total = result.data.total;
              this.pageSize = 10;
              this.pageNo = 1;
              this.$antMessage.success("删除成功");
            }
          } else {
            //this.$antMessage.info(result.message) llll;
          }
        },
      });
    },
    jumpSome() {
      this.$router.push("baseRegistery");
    },
    look(type, val) {
      let query = { ...val, type };
      this.$router.push({ path: "/basicdetail", query });
    },
    onChangeTab(pageNumber, pageSize) {
      this.pageNo = pageNumber;
      this.pageSize = pageSize;

      this.getBasicList();
    },
    downloadFile(content, filename) {
      let a = document.createElement("a");
      a.href = content;
      a.download = filename;
      a.click();
    },
    addNew() {
      this.inpvalue = "";
      this.createBeginTime = "";
      this.createEndTime = "";
      this.dateKey = [];
    },
    onChange(dateString) {
      this.createBeginTime = dateString[0];
      this.createEndTime = dateString[1];
    },
  },
  components: { Breadcrumb },
};
</script>

<style lang="less" scoped>
::v-deep .t {
  table {
    font-size: 0.12rem;
  }
}

.father {
  width: 100%;
  // padding: 0.2rem;
  background: #fff;
  height: auto;
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 0.2rem 0 0.2rem 0;
    height: auto;
    // border-bottom: 0.02rem solid #f5f5f5;
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
          margin-right: 0.05rem;
          color: #999999;
          // width: 0.8rem;
        }
        span {
          ::v-deep span {
            font-size: 0.12rem;
          }
        }
        .input {
          width: 2.4rem;
          // height: 0.38rem;
          background: #ffffff;
          border-radius: 0.04rem;
          font-size: 0.12rem;
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
  .top-two {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      button {
        width: 1.3rem;
        height: auto !important;
        padding: 0.1rem 0;
        font-size: 0.12rem;
        background: #e5eff8;
        margin: 0.29rem 0.1rem 0.21rem 0;
        color: #4b8dce;
        ::v-deep span {
          margin-left: 0.02rem !important;
        }
      }
    }
    .other {
      background: none;
      color: #838383;
      padding: 0.05rem;
      margin-right: 0.2rem;
    }
  }
  .as {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>