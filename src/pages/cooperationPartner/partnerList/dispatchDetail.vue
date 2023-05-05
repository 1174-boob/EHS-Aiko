<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="联系方式">
          <a-input v-model="formInline.phone" placeholder="请输入联系方式"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="userStatus" slot-scope="record">{{record.userStatus == 1 ? "禁用" : "启用"}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">学习记录</span>
          <span
            class="color-0067cc cursor-pointer"
            :class="{'color-red': record.userStatus == 1, 'color-green': record.userStatus != 1}"
            @click="actionChangeStatus(record)"
          >{{record.userStatus == 1 ? "启用" : "禁用"}}</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import { GetDispatchList, updateDispatchByStatus } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      dataMsg: undefined,
      companyId: "",
      formInline: {},
      preFormInline: {},

      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
        },
        {
          title: '证件号码',
          dataIndex: 'idNumber',
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'userStatus' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 400 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
    }
  },

  created() {
    this.companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
    this.dataMsg = this.$route.query.dataMsg;
    if (!this.dataMsg) {
      this.$router.push("/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerList");
      return;
    }
    this.getDataList();
  },
  methods: {
    // 已被派工列表
    getDataList() {
      return GetDispatchList({
        companyId: this.dataMsg.companyCode,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.formInline
      }).then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 学习记录
    actionLook(record) {
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/learn", query: { beUserId: record.dispatchId, companyId: record.companyId, centerId: record.centerId, corporationId: record.corporationId, pushCompanyId: record.beCompanyId }});
    },
    // 改变禁用启用状态
    actionChangeStatus(record) {
      // 调接口，修改状态
      updateDispatchByStatus({
        dispatchId: record.dispatchId,
        userStatus: record.userStatus == 1 ? "0" : "1"
      }).then(res => {
        this.getDataList();
      }).catch(err => {
        console.log(err);
      })
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
  }
}
</script>
<style lang="less" scoped>
.course-info {
  img {
    width: 160px;
    height: 120px;
  }
  p {
    line-height: 1;
    margin: 0;
    &:last-child {
      margin-top: 10px;
    }
  }
}
.course-msg {
  .lecturer-list {
    img {
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
}
.color-red {
  color: red;
}
.color-green {
  color: green;
}
</style>