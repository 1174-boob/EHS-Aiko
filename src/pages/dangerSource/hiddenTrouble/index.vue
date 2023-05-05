<template>
      <!-- 邀请列表 -->
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <SearchTerm>
                  <a-form-model
                        layout="inline"
                        :model="searchFormData"
                        :colon="false"
                  >
                        <CommonSearchItem
                              ref="commonSearchItem"
                              :hasDepartment="true"
                              :CommonFormInline="searchFormData"
                        ></CommonSearchItem>
                        <a-form-model-item label="姓名">
                              <a-input
                                    v-model="searchFormData.userName"
                                    placeholder="请输入姓名"
                              ></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="工号">
                              <a-input
                                    v-model="searchFormData.jobNumber"
                                    placeholder="请输入工号"
                              ></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="手机号">
                              <a-input
                                    v-model="searchFormData.phone"
                                    placeholder="请输入手机号"
                              ></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="检测结果">
                              <a-select
                                    v-model="searchFormData.checkStatus"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option
                                          v-for="item in checkItemList"
                                          :key="item.value"
                                          :value="item.key"
                                          >{{ item.value }}</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="生成时间">
                              <a-range-picker
                                    separator="-"
                                    format="YYYY-MM-DD"
                                    class="searchtable-search-date m-b-15"
                                    v-model="searchFormData.timeArr"
                              >
                                    <a-icon slot="suffixIcon" type="calendar" />
                              </a-range-picker>
                        </a-form-model-item>
                        <a-form-model-item class="float-right">
                              <a-button
                                    type="primary"
                                    :loading="loading"
                                    @click="iSearch"
                                    >查询</a-button
                              >
                              <a-button @click="iRest">重置</a-button>
                        </a-form-model-item>
                  </a-form-model>
            </SearchTerm>
            <DashBtn>
                  <div>
                        <a-button type="primary" @click="handleToStatTask">
                              任务统计
                        </a-button>
                        <a-button type="primary" @click="handleToProgressTask">
                              进度异常任务单
                        </a-button>
                  </div>
                  <div>
                        <a-button
                              type="primary"
                              @click="handleToFrequencyLibrary"
                              class="m-l-20"
                              >风险排查频次库</a-button
                        >
                  </div>
            </DashBtn>
            <!-- 列表 -->
            <CommonTable
                  :spinning="tableSpinning"
                  :page="page"
                  :pageNoChange="pageNoChange"
                  :showSizeChange="showSizeChange"
            >
                  <a-table
                        :columns="columns"
                        :scroll="{ x: 800 }"
                        :data-source="tableDataList"
                        :pagination="false"
                        bordered
                  >
                        <div slot="checkStatus" slot-scope="record">
                              {{
                                    record.checkStatus
                                          | systemFilter("taskCheckStatus")
                              }}
                        </div>
                        <div slot="action" slot-scope="record">
                              <span
                                    class="color-0067cc cursor-pointer"
                                    @click="handleCheckTask(record)"
                                    >查看</span
                              >
                              <span
                                    class="color-0067cc cursor-pointer"
                                    @click="handleCheckHistoryTask(record)"
                                    >历史任务单</span
                              >
                        </div>
                  </a-table>
            </CommonTable>
      </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import { getHiddenTroubleList } from "@/services/dangerSource/hiddenTrouble/index.js";
import dayJs from "dayjs";
export default {
      components: {},
      mixins: [cancelLoading],
      data() {
            return {
                  tableSpinning:false,
                  page: {
                        pageNo: 1,
                        pageSize: 10,
                        total: 0,
                  },
                  searchFormData: {},
                  columns: [
                        {
                              title: "姓名",
                              dataIndex: "userName",
                              key: "userName",
                              align: "center",
                              width: 150,
                        },
                        {
                              title: "工号",
                              dataIndex: "jobNumber",
                              key: "jobNumber",
                              align: "center",
                              width: 150,
                        },
                        {
                              title: "手机号",
                              dataIndex: "phone",
                              key: "phone",
                              align: "center",
                              width: 150,
                        },
                        {
                              title: "单号",
                              dataIndex: "code",
                              key: "code",
                              align: "center",
                              width: 250,
                        },
                        {
                              title: "生成时间",
                              dataIndex: "generateTime",
                              key: "generateTime",
                              align: "center",
                              width: 150,
                        },
                        {
                              title: "检查时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              align: "center",
                              width: 150,
                        },
                        {
                              title: "状态",
                              scopedSlots: { customRender: "checkStatus" },
                              key: "checkStatus",
                              align: "center",
                              width: 150,
                        },
                        {
                              title: "排查进度",
                              dataIndex: "checkProgress",
                              key: "checkProgress",
                              align: "center",
                              customRender: (text, record, index) => {
                                    return text ? text + "%" : "--";
                              },
                              width: 150,
                        },
                        {
                              title: "操作",
                              scopedSlots: { customRender: "action" },
                              key: "action",
                              align: "center",
                              fixed: "right", // 固定操作列
                              width: 200, // 宽度根据操作自定义设置
                        },
                  ],
                  tableDataList: [],
                  checkItemList: null,
            };
      },
      created() {
            this.setRouterCode("hiddenTrouble");
            this.columns.splice(3, 0, this.addCommonColumnItem(150));
            this.columns.splice(4, 0, this.addCommonColumnDepartment(150)); //部门
            this.initConfigPage()
            this.initData();
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
                  this.checkItemList = getDictionaryItemObj("taskCheckStatus");
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
                        this.searchFormData.generateTimeStart = this
                              .searchFormData.timeArr[0]
                              ? dayJs(this.searchFormData.timeArr[0]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                        this.searchFormData.generateTimeEnd = this
                              .searchFormData.timeArr[1]
                              ? dayJs(this.searchFormData.timeArr[1]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                  }
                  this.tableSpinning = true
                  getHiddenTroubleList({
                        ...this.page,
                        ...this.searchFormData,
                  })
                  .then((res) => {
                        this.tableDataList = res.data.list;
                        this.page.total = res.data.total;
                  })
                  .finally(()=>{
                        this.tableSpinning = false
                  })
            },
            //查看任务单
            handleCheckTask(e) {
                  console.log(e);
                  this.$router.push({
                        name: "隐患排查任务单查看",
                        params: { check: true, id: e.perilsCheckTaskId },
                  });
            },
            //查看历史任务单
            handleCheckHistoryTask(e) {
                  this.$router.push({
                        path: "/safeManage/dualControlManage/riskManage/historyTask",
                        query: {
                              userId: e.userId,
                              corporationId: e.corporationId,
                        },
                  });
            },
            //去统计任务
            handleToStatTask() {
                  this.$router.push({
                        path: "/safeManage/dualControlManage/riskManage/statisticsTask",
                  });
            },
            //去进度异常任务单
            handleToProgressTask() {
                  this.$router.push({
                        path: "/safeManage/dualControlManage/riskManage/progressTask",
                  });
            },
            //去风险排查频次库
            handleToFrequencyLibrary() {
                  this.$router.push({
                        path: "/safeManage/dualControlManage/riskManage/riskScreening",
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
