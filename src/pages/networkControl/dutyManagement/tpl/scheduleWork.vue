<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem
          ref="commonSearchItem"
          :CommonFormInline="formInline"
        ></CommonSearchItem>
        <a-form-model-item label="配置状态">
          <a-select v-model="formInline.status" placeholder="请选择">
            <a-select-option
              v-for="item in statusList"
              :key="item.key"
              :value="item.key"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="更新人">
          <a-input
            v-model="formInline.userName"
            placeholder="请输入姓名"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号">
          <a-input v-model="formInline.jobNum" placeholder="请输入"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch"
            >查询</a-button
          >
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable
      :spinning="tableSpinning"
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="onShowSizeChange"
    >
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            v-if="record.status == 1"
            @click="actionHandle(record, 'deal')"
            >配置</span
          >
          <span
            class="color-0067cc cursor-pointer m-r-15"
            v-else
            @click="actionHandle(record, 'change')"
            >修改</span
          >
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'look')"
            >查看</span
          >
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import { debounce } from "lodash";
import { GetCorList } from "@/services/networkControl.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      //现地字段下拉框数据
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      statusList: dictionary("configStatus") || [],
      columns: [
        {
          title: "组织",
          dataIndex: "corporationId",
          width: 100,
          customRender: (text) => {
            return text
              ? this.getMappingValue(
                  this.getCommonAddOrgnizeListAll,
                  "id",
                  text
                ).orgAbbrName
              : "--";
          },
        },
        {
          title: "配置状态",
          dataIndex: "status",
          width: 150,
          customRender: (text, record) => {
            return text ? dictionary("configStatus", text) : "--";
          },
        },
        {
          title: "更新人",
          dataIndex: "updateUserName",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "更新时间",
          dataIndex: "updateTime",
          width: 200,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],
      dictionary,
    };
  },
  created() {
    this.getDataList(); //获取列表
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
 },
  methods: {
    //获取列表
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.loading = true;
      this.tableSpinning = true
      GetCorList(params)
        .then((res) => {
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
          this.cancelLoading();
        })
        .catch((err) => {
          console.log(err);
          this.cancelLoading();
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      if (this.formInline.userName && this.formInline.userName.length < 2) {
        this.$antMessage.warn("更新人最少输入2位");
        return;
      }
      if (this.formInline.jobNum && this.formInline.jobNum.length < 5) {
        this.$antMessage.warn("工号最少输入5位");
        return;
      }
      // 获取列表
      this.getDataList();
    },

    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {};
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 配置，查看
    actionHandle(record, type) {
      let path =
        type == "deal"
          ? "/safeManage/emergencyManagement/networkControl/ondutyConfigure"
          : type == "change"
          ? "/safeManage/emergencyManagement/networkControl/ondutyEdit"
          : "/safeManage/emergencyManagement/networkControl/ondutyShow";
      this.$router.push({
        path: path,
        query: { dutyId: record.dutyId },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.log-wrapper {
  padding: 20px;
  border: 1px solid #eee;
  margin-bottom: 20px;
  box-shadow: 1px 1px 10px 5px #eee;
  div {
    display: flex;
    padding-top: 10px;
    border-radius: 10px;
    &:first-child {
      padding-top: 0;
    }
    span {
      &:first-child {
        width: 100px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
}
</style>