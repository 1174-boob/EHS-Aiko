<template>
      <!-- 设备认证情况-数据统计分析 -->
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
                              :disabled="disabledCommonDept"
                              :CommonFormInline="searchFormData"
                        ></CommonSearchItem>
                        <a-form-model-item label="创建时间">
                              <el-date-picker
                                    v-model="searchFormData.timeArr"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                              >
                              </el-date-picker>
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

            <!-- 设备认证情况 -->
            <div class="content-title">
                  <span class="content-title-left">设备认证情况</span>
            </div>

            <chart :option="setOption"></chart>
      </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { deviceData, dataStatisticsExport } from "@/services/deviceSafety.js";
import moment from "moment";
import dataAnalysis from "@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js";
import { barObj } from "@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js";
import chart from "./chart.vue";
import { findCorporationId } from "@/utils/common.js";
import refreshSvg from "@/assets/echarts/refresh.svg";
import downloadSvg from "@/assets/echarts/download.svg";
import exportSvg from "@/assets/echarts/export.svg";
import dayJs from "dayjs";
export default {
      components: { chart },
      mixins: [cancelLoading, chemicalDict, dataAnalysis],
      data() {
            return {
                  searchFormData: {},
                  // 作业数量
                  option: {
                        title: {
                              text: "", //"作业数量",
                              x: "left",
                              y: "top",
                              z: 1,
                              textStyle: {
                                    fontSize: 18,
                                    fontWeight: "normal",
                                    label: {
                                          formatter: "{title|{b}}",
                                    },
                                    rich: {
                                          test: {
                                                color: "#333333",
                                                height: 48,
                                                padding: [0, 0, 0, 20],
                                                width: 2000,
                                          },
                                    },
                              },
                        },
                        toolbox: {
                              show: true,
                              feature: {
                                    // dataZoom: {
                                    //     yAxisIndex: 'none'
                                    // },
                                    // dataView: { readOnly: false },
                                    // magicType: { type: ['line', 'bar'] },
                                    // restore: {},
                                    // saveAsImage: {},
                                    myRefresh: {
                                          show: true,
                                          title: "刷新",
                                          icon: `image://${refreshSvg}`,
                                          onclick: () => this.initData(),
                                    },
                                    saveAsImage: {
                                          show: true,
                                          title: "下载",
                                          name: "设备认证图",
                                          icon: `image://${downloadSvg}`,
                                    },
                                    myExport: {
                                          show: true,
                                          title: "导出",
                                          icon: `image://${exportSvg}`,
                                          onclick: () => this.dataExport(),
                                    },
                              },
                        },
                        tooltip: {
                              trigger: "axis",
                        },
                        grid: {
                              top: "20%",
                              left: "1%",
                              right: "2%",
                              bottom: "12%",
                              containLabel: true,
                        },
                        legend: {
                              // left:'45%',
                              // x: "right",
                              // y: "top",
                              z: 2,
                              top: 5,
                              left: 20,
                              data: [
                                    "设备总数",
                                    "认证合格",
                                    "认证不合格",
                                    "认证超期",
                                    "认证合格率",
                              ],
                        },
                        color: ["#0067CC", "#00CECA", "#9958FF"],
                        xAxis: [
                              {
                                    type: "category",
                                    axisLabel: {
                                          rotate: 40,
                                          width: 20,
                                          interval: 0,
                                    },
                                    data: [],
                                    axisPointer: {
                                          type: "shadow",
                                    },
                              },
                        ],
                        yAxis: [
                              {
                                    name: "设备总数",
                              },
                              {
                                    type: "value",
                                    name: "认证合格率",
                                    min: 0,
                                    max: 100,
                                    alignTicks: true,

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
                                    name: "设备总数",
                                    type: "bar",
                                    emphasis: {
                                          focus: "series",
                                    },
                                    barMaxWidth: 50,
                                    data: [],
                              },
                              {
                                    name: "认证合格",
                                    type: "bar",
                                    barMaxWidth: 50,
                                    stack: 'Ad',
                                    data: [],
                              },
                              {
                                    name: "认证不合格",
                                    type: "bar",
                                    barMaxWidth: 50,
                                    stack: 'Ad',
                                    data: [],
                              },
                              {
                                    name: "认证超期",
                                    type: "bar",
                                    barMaxWidth: 50,
                                    stack: 'Ad',
                                    data: [],
                              },
                              {
                                    name: "认证合格率",
                                    type: "line",
                                    barMaxWidth: 50,
                                    data: [],
                                    tooltip: {
                                          valueFormatter: function (value) {
                                                return value + " %";
                                          },
                                    },
                              },
                        ],
                  },
                  setOption: undefined,
                  injuryOption: {
                        tooltip: {
                              ...barObj.tooltip,
                        },
                        toolbox: {
                              emphasis: {
                                    ...barObj.emphasis,
                              },
                              feature: {},
                        },
                        grid: barObj.grid,
                        dataZoom: [],
                        legend: {
                              data: [],
                        },
                        xAxis: [
                              {
                                    type: "category",
                                    axisLabel: {
                                          ...barObj.xAxis.axisLabel,
                                    },
                                    axisPointer: {
                                          ...barObj.xAxis.axisPointer,
                                    },
                              },
                        ],
                        yAxis: [
                              {
                                    type: "value",
                                    name: "作业数量",
                              },
                              {
                                    type: "value",
                                    name: "未确认率",
                                    axisLabel: {
                                          formatter: (value) => {
                                                // value = value * 100 + '%'
                                                value = value + "%";
                                                return value;
                                          },
                                    },
                              },
                        ],
                        series: [],
                  },
            };
      },
      created() {
            this.setRouterCode("deviceStatistics");
            // 创建时间默认当前月份
            console.log(this.setCorporationTree);
            this.initData();
      },
      mounted() {
            this.iSearch(false);
      },
      computed: {
            
      },
      methods: {
            // 重置
            iRest: debounce(
                  function () {
                        this.searchFormData = {};
                        this.$refs.commonSearchItem.reset();
                        this.initData();
                  },
                  250,
                  { leading: true, trailing: false }
            ),
            // 查询
            iSearch() {
                  this.initData();
            },
            initData() {
                  this.cancelLoading();
                  if (this.searchFormData.timeArr) {
                        this.searchFormData.securityCertificationStartDate =
                              this.searchFormData.timeArr[0]
                                    ? dayJs(
                                            this.searchFormData.timeArr[0]
                                      ).format("YYYY-MM-DD")
                                    : "";
                        this.searchFormData.securityCertificationEndDate = this
                              .searchFormData.timeArr[1]
                              ? dayJs(this.searchFormData.timeArr[1]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                  }
                  deviceData({
                        ...this.searchFormData,
                  }).then((res) => {
                        if (res.data.length) {
                              this.option.series[0].data = [];
                              this.option.series[1].data = [];
                              this.option.series[2].data = [];
                              this.option.series[3].data = [];
                              this.option.series[4].data = [];
                              this.option.xAxis[0].data = [];
                              for (let i = 0; i < res.data.length; i++) {
                                    this.option.series[0].data.push(
                                          res.data[i].equipmentNum
                                    ); //设备总数
                                    this.option.series[1].data.push(
                                          res.data[i].qualified
                                    ); //认证合格
                                    this.option.series[2].data.push(
                                          res.data[i].unacceptable
                                    ); // 认证不合格
                                    this.option.series[3].data.push(
                                          res.data[i].overdueNum
                                    ); //认证超期
                                    this.option.series[4].data.push(
                                          res.data[i].passRate
                                    ); //认证合格率
                                    if (!this.searchFormData.corporationId) {
                                          //翻译组织
                                          this.option.xAxis[0].data.push(
                                                findCorporationId(
                                                      res.data[i].xdata
                                                )
                                          );
                                    } else {
                                          let deptCache = this.$store.state.setting.deptCache;
                                          this.option.xAxis[0].data.push(
                                                deptCache[res.data[i].xdata]
                                          );
                                    }
                              }
                              this.setOption = this.option;
                        } else {
                              this.setOption = undefined;
                        }
                  });
            },
            // 汇总change
            summaryChange: debounce(
                  function (e) {
                        console.log(e);
                        this.disabledCommonDept = e.target.checked;
                        if (e.target.checked) {
                              let timeArr = this.searchFormData.timeArr;
                              this.searchFormData = {};
                              this.searchFormData.timeArr = timeArr;
                        }

                        this.$refs.commonSearchItem.reset();
                        console.log(this.$refs.commonSearchItem.reset);
                        this.initData();
                  },
                  250,
                  { leading: false, trailing: true }
            ),
            dataExport() {
                  dataStatisticsExport(this.searchFormData).then((res) => {
                        const name = "设备数据统计导出";
                        const blob = new Blob([res], {
                              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                        const downloadElement = document.createElement("a");
                        const href = URL.createObjectURL(blob); //创建下载链接
                        downloadElement.href = href;
                        downloadElement.download = name + ".xlsx";
                        document.body.appendChild(downloadElement);
                        downloadElement.click();
                        document.body.removeChild(downloadElement); // 下载完成移除元素
                        window.URL.revokeObjectURL(href); // 释放掉blob对象
                        this.$antMessage.success("导出成功");
                  });
            },
      },
};
</script>

<style lang="less" scoped>
.content-title {
      border-bottom: solid #dadada 1px;
      padding: 4px 0 18px 10px;
      font-size: 18px;
      line-height: 1.1;
      font-weight: bold;
      margin-bottom: 22px;
      color: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: space-between;
}
.injury-box {
      .title {
            height: 48px;
            background: #fafbff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 12px;
            margin-bottom: 20px;
            .title-left {
                  font-size: 16px;
                  line-height: 1.1;
                  color: #333;
                  font-weight: bold;
            }
      }
      .serch-box {
            padding-left: 14px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            .serch-item-lable {
                  flex: none;
                  margin-right: 20px;
            }
            .serch-item-select {
                  min-width: 200px;
            }
      }
      .injury-Echarts {
            width: 100%;
            height: 350px;
      }
}
::v-deep .ant-empty {
      margin-bottom: 20px;
}
::v-deep .ant-calendar-range-picker-separator {
      transform: translateY(2px);
}
</style>
