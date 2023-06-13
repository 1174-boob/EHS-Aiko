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
            <chart :option="option" setId="myechar"></chart>
            <div class="floor">
                  <div>
                        <a-button class="m-l-15" @click="handleBack"
                              >返 回</a-button
                        >
                  </div>
            </div>
      </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import { getStatistical } from "@/services/dangerSource/hiddenTrouble/index.js";
import chart from "@/pages/dangerSource/hiddenTrouble/childPage/chart.vue";
import dayJs from "dayjs";
import { red } from "@ant-design/colors";
export default {
      components: { chart },
      mixins: [cancelLoading],
      data() {
            return {
                  searchFormData: {},
                  columns: [
                        {
                              title: "姓名",
                              dataIndex: "name",
                              key: "name",
                              align: "center",
                        },
                        {
                              title: "所属组织",
                              dataIndex: "organizationName",
                              key: "organizationName",
                              align: "center",
                        },
                        {
                              title: "部门",
                              dataIndex: "deptName",
                              key: "deptName",
                              align: "center",
                        },
                        {
                              title: "检查时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              align: "center",
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
                  option: {
                        title: {
                              text: "{test|任务统计}", //"任务统计",
                              x: "left",
                              y: "top",
                              z: 1,
                              textStyle: {
                                    fontSize: 14,
                                    fontWeight: "normal",
                                    label: {
                                          formatter: "{title|{b}}",
                                    },
                                    rich: {
                                          test: {
                                                color: "#333333",
                                                backgroundColor: {
                                                      image: require("@/assets/img/taskBg.jpg"),
                                                },
                                                height: 48,
                                                padding: [0, 0, 0, 20],
                                                width: 2000,
                                          },
                                    },
                              },
                        },
                        tooltip: {
                              trigger: "axis",
                              axisPointer: {
                                    type: "cross",
                                    crossStyle: {
                                          color: "#999",
                                    },
                              },
                        },
                        grid: {
                              top: "20%",
                              left: "1%",
                              right: "1%",
                              bottom: "12%",
                              containLabel: true,
                        },
                        legend: {
                              // left:'45%',
                              // x: "right",
                              // y: "top",
                              z: 2,
                              top: 18,
                              right: 20,
                              data: ["实际完成", "应完成", "完成进度"],
                        },
                        color: ["#0067CC", "#00CECA", "#9958FF"],
                        dataZoom: [
                              {
                                    show: true,
                                    start: 1,
                                    end: 100,
                              },
                              {
                                    type: "inside",
                                    start: 1,
                                    end: 100,
                              },
                              {
                                    show: true,
                                    yAxisIndex: 0,
                                    filterMode: "empty",
                                    width: 0,
                                    height: "55%",
                                    showDataShadow: false,
                                    left: "100%",
                              },
                        ],
                        xAxis: [
                              {
                                    type: "category",
                                    axisLabel: {
                                          // rotate: 40,
                                          width: 20,
                                          interval: 0,
                                    },
                                    data: [
                                          "制造部",
                                          "企划部",
                                          "产销管理部",
                                          "CF技术部",
                                          "Array技术部",
                                          "Module技术部",
                                          "Cell技术部",
                                          "技安环保部",
                                          "智造技术部",
                                          "动力技术部",
                                    ],
                                    axisPointer: {
                                          type: "shadow",
                                    },
                              },
                        ],
                        yAxis: [
                              {
                                    type: "value",
                                    name: "任务数量",
                                    alignTicks: true,
                                    // interval: 100,
                                    axisLine: {
                                          show: true,
                                          lineStyle: {
                                                color: "#000000",
                                          },
                                    },
                              },
                              {
                                    type: "value",
                                    name: "完成进度",
                                    min: 0,
                                    max: 100,
                                    alignTicks: true,
                                    axisLine: {
                                          show: true,
                                          lineStyle: {
                                                color: "#000000",
                                          },
                                    },
                                    axisLabel: {
                                          // formatter: "{value} %",
                                          formatter: (v) => {
                                                return parseInt(v) + "%";
                                          },
                                    },
                              },
                        ],
                        series: [
                              {
                                    name: "实际完成",
                                    type: "bar",
                                    emphasis: {
                                          focus: "series",
                                    },
                                    barMaxWidth: 50,
                                    data: [
                                          20, 25, 76, 85, 92, 72, 40, 60, 135,
                                          122,
                                    ],
                              },
                              {
                                    name: "应完成",
                                    type: "bar",
                                    emphasis: {
                                          focus: "series",
                                    },
                                    barMaxWidth: 50,
                                    data: [
                                          16, 19, 19, 76, 88, 70, 76, 18, 47,
                                          60,
                                    ],
                              },
                              {
                                    name: "完成进度",
                                    type: "line",
                                    yAxisIndex: 1,
                                    tooltip: {
                                          valueFormatter: function (value) {
                                                return value + " %";
                                          },
                                    },
                                    data: [
                                          12, 22, 33, 45, 93, 72, 50, 46, 23.0,
                                          16.5,
                                    ],
                              },
                        ],
                  },
            };
      },
      computed: {
            corporationList() {
                  return this.$store.state.setting.corporationList;
            },
      },
      created() {
            console.log(this.getCommonAddOrgnizeList);

            this.initData();
      },
      mounted() {},
      methods: {
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
                  getStatistical({
                        ...this.searchFormData,
                  }).then((res) => {
                        let testData = res.data.list;
                        this.option.series[0].data = testData.map((item) => {
                              return item.useComplete;
                        });
                        this.option.series[1].data = testData.map((item) => {
                              return item.unUseComplete;
                        });
                        if (this.searchFormData.corporationId) {
                              this.option.xAxis[0].data = testData.map(
                                    (item) => {
                                          return this.deptCache[item.deptId];
                                    }
                              );
                        } else {
                              this.option.xAxis[0].data = testData.map(
                                    (item) => {
                                          return this.getMappingValue(
                                                this.getCommonAddOrgnizeList,
                                                "id",
                                                item.corporationId
                                          ).orgName;
                                    }
                              );
                        }

                        this.option.series[2].data = testData.map((item) => {
                              return parseInt(
                                    (item.useComplete / item.unUseComplete) *
                                          100
                              );
                        });
                  });
            },
            handleBack() {
                  this.setKeepalive(true)
                  this.$router.go(-1);

                  // [{
                  //      mame
                  // }]
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
.floor {
      margin-top: 30px;
      width: 100%;
      height: 62px;
      background: #f9f9f9;
      border: 1px solid #f6fbff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      > div {
            padding-right: 20px;
            > span {
                  width: 20px;
                  display: inline-block;
            }
      }
}
</style>
