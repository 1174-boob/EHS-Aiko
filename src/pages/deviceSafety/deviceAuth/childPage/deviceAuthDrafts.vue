<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :hasDepartment="true" :CommonFormInline="searchFormData"></CommonSearchItem>
        <a-form-model-item label="创建时间">
          <el-date-picker v-model="searchFormData.timeArr" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!-- 列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :data-source="tableDataList" :pagination="false" bordered>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="handleEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="handleDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import { authList, authAdd, authDelete } from "@/services/deviceSafety.js";
import serviceNameList from "@/config/default/service.config.js";
import dayJs from "dayjs";
export default {
  components: {},
  mixins: [cancelLoading],
  data() {
    return {
      tableSpinning: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,

      },
      searchFormData: {},
      columns: [
        {
          title: "审批单号",
          dataIndex: "approvalOn",
          key: "approvalOn",
          align: "center",
        },
        {
          title: "所属组织",
          dataIndex: "corporationName",
          key: "corporationName",
          align: "center",
        },
        {
          title: "部门",
          dataIndex: "deptName",
          key: "deptName",
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 140, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],
    };
  },
  created() {
    this.initConfigPage()
    this.initData();
  },
  activated() {
    setTimeout(() => {
      if (!this.keepalive) {
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage() {
      let user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user || {}
      this.userId = user.userId
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.initData();
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.$refs.commonSearchItem.reset();
        this.searchFormData = {};
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.handleLoading();
      this.initData();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.initData();
    },
    initData() {
      this.cancelLoading();
      if (this.searchFormData.timeArr) {
        this.searchFormData.createStartTime = this
          .searchFormData.timeArr[0]
          ? dayJs(this.searchFormData.timeArr[0]).format(
            "YYYY-MM-DD"
          )
          : "";
        this.searchFormData.createEndTime = this.searchFormData
          .timeArr[1]
          ? dayJs(this.searchFormData.timeArr[1]).format(
            "YYYY-MM-DD"
          )
          : "";
      }
      this.tableSpinning = true
      authList({ ...this.page, ...this.searchFormData, approvalStatus: 0 })
        .then(res => {
          this.tableDataList = res.data.list
          this.page.total = res.data.total
        })
        .finally(() => {
          this.tableSpinning = false
        })
    },
    //编辑
    handleEdit(e) {
      this.$router.push({
        path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDetails",
        query: {
          type: 3,
          approvalId: e.approvalId
        },
      });
    },
    //删除
    handleDelete(e) {
      let _this = this
      this.$antConfirm({
        title: '确定删除设备吗?',
        onOk() {
          authDelete({ approvalId: e.approvalId }).then(res => {
            _this.$antMessage.success("删除成功！");
            _this.initData()
          })
        },
        onCancel() {

        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.shenglvhao {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
