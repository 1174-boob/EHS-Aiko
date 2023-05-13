<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="monitoringShow_div">
      <div class="left">当前值班人员</div>
      <!-- <div class="right">
        当前班次：
        <span class="blue">{{ shift }}</span>
      </div>-->
    </div>
    <div v-if="!dutyList.length" class="m4">
      <a-empty />
    </div>
    <div class="monitoringList_div" v-else>
      <div
        v-for="(item, index) in dutyList"
        :key="index"
        class="monitoringList_div_item"
      >
        <div class="item_one">
          <img src="@/assets/img/gongsi.svg" alt />
          <span>{{ item.deptName }}</span>
        </div>
        <!-- <div class="item_two">
          <span>所属中心：</span>
          <span>{{ item.centerName }}</span>
        </div> -->
        <div class="item_two">
          <span>部门：</span>
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <span>{{
                item.corporationName && item.deptName
                  ? `${item.corporationName}组织 ${item.deptName}部门`
                  : "--"
              }}</span>
            </div>
            <span>{{
              item.corporationName && item.deptName
                ? `${item.corporationName}组织 ${item.deptName}部门`
                : "--"
            }}</span>
          </a-popover>
        </div>
        <div class="item_two">
          <span>姓名：</span>
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <span>{{ item.handUserNameList.join(",") }}</span>
            </div>
            <span>{{ item.handUserNameList.join(",") }}</span>
          </a-popover>
          <!-- <span>{{ item.handUserNameList.join(",") }}</span> -->
        </div>
      </div>
    </div>
    <div class="pagination">
      <a-pagination
        v-show="pageT.total"
        show-size-changer
        :current="pageT.pageNo"
        :pageSize="pageT.pageSize"
        :page-size-options="pageT.pageSizeOptions"
        :total="pageT.total"
        :show-total="(total) => `共 ${total} 条`"
        showQuickJumper
        @change="pageNoChangeT"
        @showSizeChange="onShowSizeChangeT"
      />
    </div>
    <div class="monitoringShow_div">
      <div class="left">当日值班记录</div>
      <div class="right">{{ moment().format("MM月DD日") }}</div>
    </div>
    <div class="h-1"></div>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
        ></CommonSearchItem>
        <a-form-model-item label="班次">
          <a-select v-model="formInline.classesId" placeholder="请选择">
            <a-select-option
              v-for="item in classesList"
              :key="item.classesId"
              :value="item.classesId"
              >{{ `${item.classesName}` }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item label="值班日期">
          <a-date-picker v-model="formInline.time" />
        </a-form-model-item>-->
        <a-form-model-item label="值班时段">
          <el-time-picker
            is-range
            v-model="formInline.timeArr"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="请选择"
            format="HH:mm"
            value-format="HH:mm"
            :clearable="true"
          ></el-time-picker>
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
            return record.dutyId;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'change')"
            v-if="!record.handPickStatus"
            >编辑</span
          >
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'handOver')"
            v-if="!record.handPickStatus"
            >交接班</span
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
import moment from "moment";
import { debounce, cloneDeep } from "lodash";
import {
  GetClassesListNoPage,
  GetDutyList,
  GetMonitoringList,
} from "@/services/networkControl.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      classesList: [],
      dutyList: [],
      moment,
      shift: "班次1",
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      pageT: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
      },
      columns: [
        {
          title: "所属组织",
          dataIndex: "corporationName",
          width: 150,
          // customRender: text => {
          //   return text
          //     ? this.getMappingValue(
          //         this.getCommonAddOrgnizeListAll,
          //         "id",
          //         text
          //       ).orgAbbrName
          //     : "--";
          // }
        },
        {
          title: "部门",
          dataIndex: "deptId",
          width: 150,
          customRender: (text) => {
            return text ? this.deptCache[text] : "--";
          },
        },
        {
          title: "班次",
          dataIndex: "classesName",
          width: 100,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "值班日期",
          dataIndex: "dutyDate",
          width: 150,
        },
        {
          title: "值班时段",
          dataIndex: "dutyStartTime",
          width: 150,
          customRender: (text, record) => {
            text =
              record.dutyStartTime && record.dutyEndTime
                ? record.dutyStartTime + "-" + record.dutyEndTime
                : "--";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "交班人",
          dataIndex: "handUserNames",
          width: 150,
          customRender: (text, record) => {
            text = text ? text : "--";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "接班人",
          dataIndex: "pickUserNames",
          width: 150,
          customRender: (text, record) => {
            text = text ? text : "--";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "交接班状态",
          dataIndex: "handPickStatus",
          width: 150,
          customRender: (text) => {
            return text == null ? "--" : text ? "已交班" : "未交班";
          },
        },
        {
          title: "交接班时间",
          dataIndex: "handPickClassTime",
          width: 150,
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
    };
  },
  created() {
    this.initConfigPage()
    this.getDataList(); //值班记录-下面列表
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      let width = window.innerWidth;
      if (width < 1440) {
        this.pageT = {
          pageNo: 1,
          pageSize: 6,
          total: 0,
          pageSizeOptions: ["6", "12", "18", "24", "30"],
        };
      }
      this.getClassesListNoPage(); //获取班次列表不分页
      this.getDutyDataList(); //顶部列表
    },
    //列表
    getDataList() {
      let params = {
        ...this.formInline,
        dutyDate: moment().format("YYYY-MM-DD"),
        dutyStartTime:
          this.formInline.timeArr && this.formInline.timeArr[0]
            ? this.formInline.timeArr[0]
            : undefined,
        dutyEndTime:
          this.formInline.timeArr && this.formInline.timeArr[1]
            ? this.formInline.timeArr[1]
            : undefined,
        timeArr: undefined,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.loading = true;
      this.tableSpinning = true
      GetDutyList(params)
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

    //值班列表
    getDutyDataList() {
      let params = {
        pageSize: this.pageT.pageSize,
        pageNo: this.pageT.pageNo,
      };
      GetMonitoringList(params)
        .then((res) => {
          this.dutyList = res.data.list;
          this.pageT.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取班次列表不分页
    getClassesListNoPage(flag) {
      return GetClassesListNoPage()
        .then((res) => {
          if (res.data) {
            this.classesList = res.data || [];
          }
          if (flag) {
            this.editVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
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

    // 页码改变
    pageNoChangeT(page) {
      this.pageT.pageNo = page;
      // 获取列表
      this.getDutyDataList();
    },

    // 页码改变
    onShowSizeChangeT(current, pageSize) {
      this.pageT.pageNo = 1;
      this.pageT.pageSize = pageSize;
      this.getDutyDataList();
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
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

    // 表格按钮
    actionHandle(record, type) {
      let path =
        type == "handOver" //交接班
          ? "/safeManage/emergencyManagement/networkControl/ondutyRecordChangeShifts"
          : type == "change" //编辑
          ? "/safeManage/emergencyManagement/networkControl/ondutyRecordEdit"
          : "/safeManage/emergencyManagement/networkControl/ondutyRecordShow"; //查看
      this.$router.push({
        path: path,
        query: { dutyId: record.dutyId },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.monitoringShow_div {
  width: 100%;
  padding: 20px 0;
  border-bottom: dashed #ccc 1px;
  display: flex;
  justify-content: space-between;
  .blue {
    color: #0067cc;
  }
}
.pagination {
  text-align: right;
  margin: 0 0 20px 0;
}
.m4 {
  margin: 60px 0 40px 0;
}
.h-1 {
  height: 1px;
  width: 100%;
  padding-bottom: 20px;
}
.monitoringList_div {
  margin-top: 20px;
  display: grid;
  list-style: none;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px;
  margin-bottom: 30px;
  .monitoringList_div_item {
    background: #f8f9fb;
    padding: 10px 20px 30px 20px;
    div {
      margin-top: 20px;
    }
    .item_one {
      width: 100%;
      padding: 5px 10px;
      background: rgba(0, 103, 204, 0.1);
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      color: #0067cc;
      font-size: 16px;
      font-weight: bold;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
      }
    }
    .item_two {
      width: 100%;
      padding: 0 10px;
      display: flex;
      span {
        &:nth-child(1) {
          color: rgba(0, 0, 0, 0.6);
          min-width: 42px;
        }
        &:nth-child(2) {
          font-size: 14px;
          color: #181818;
          //  width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }
  }
}
::v-deep.el-date-editor {
  width: 350px !important;
}
</style>