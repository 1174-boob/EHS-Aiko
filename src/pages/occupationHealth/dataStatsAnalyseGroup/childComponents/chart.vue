<template>
      <div>
            <div :id="setId" class="echarText">暂无数据</div>
      </div>
</template>

<script>
import * as echarts from "echarts";
// import chart from "@/pages/occupationHealth/dataStatsAnalyse/childComponents/chart.vue";
// import itemLiberty from "@/pages/occupationHealth/occupationHarmElement/itemTabs/liberty .vue";
export default {
      data() {
            return {
                  // 危险作业分析的数据
                  hazardousOption: {
                        grid: {
                              top: "12%",
                              left: "1%",
                              right: "4%",
                              bottom: "20%",
                              containLabel: true,
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
                        // legend: {
                        //       data: ["岗位数", "噪声标准"],
                        // },
                        xAxis: [
                              {
                                    name: "测试",
                                    type: "category",
                                    axisLabel: {
                                          // rotate: 40,
                                          width: 20,
                                          interval: 0,
                                    },
                                    data: [],
                                    axisPointer: {
                                          type: "shadow",
                                    },
                              },
                        ],
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
                                    width: 20,
                                    height: "55%",
                                    showDataShadow: false,
                                    left: "98%",
                              },
                        ],
                        yAxis: [
                              {
                                    type: "value",
                                    name: "岗位数",
                                    axisLine: {
                                          show: false,
                                          lineStyle: {
                                                color: "#000000",
                                          },
                                    },
                                    // min: 0,
                                    //max: 20,
                                    // interval: 50,
                                    // axisLabel: {
                                    //   formatter: '{value} ml'
                                    // }
                              },
                        ],
                        series: [
                              {
                                    name: "岗位数2",
                                    type: "bar",
                                    barMaxWidth: 60,
                                    // tooltip: {
                                    //   valueFormatter: function (value) {
                                    //     return value + ' ml';
                                    //   }
                                    // },
                                    data: [],
                              },
                        ],
                  },
                  hazardousCharts: null,
            };
      },
      props: {
            data: {},
            xAxisName: {},
            yAxisName: {},
            lineValue: {
                  type: Number,
                  default: 0,
            },
            setId: {
                  type: String,
                  default: "myechar",
            },
      },
      watch: {
            data() {
                  console.log(this.data);
                  if (this.data.length > 0) {
                        this.hazardousOption.xAxis[0].data = this.data.map(
                              (item) => {
                                    return item.abscissa;
                              }
                        );
                        this.hazardousOption.series[0].data = this.data.map(
                              (item) => {
                                    return item.ordinate;
                              }
                        );
                        if (this.lineValue > 0) {
                              this.hazardousOption.series[1] = {
                                    name: "标准值",
                                    type: "line",
                                    data: this.data.map((item) => {
                                          return item.standardValue;
                                    }),
                              };
                        }
                        if (this.xAxisName) {
                              this.hazardousOption.xAxis[0].name =
                                    this.xAxisName;
                        }
                        if (this.yAxisName) {
                              this.hazardousOption.yAxis[0].name =
                                    this.yAxisName;
                              this.hazardousOption.series[0].name =
                                    this.yAxisName;
                              // this.hazardousOption.legend[0] = this.yAxisName;
                        }

                        console.log(this.hazardousOption, this.hazardousCharts);

                        // if (this.hazardousCharts) {
                        //       // this.hazardousCharts.clear();
                        // } else {
                        //       this.hazardousCharts = echarts.init(
                        //             document.getElementById(this.setId)
                        //       );
                        // }

                        this.hazardousCharts = echarts.init(
                              document.getElementById(this.setId)
                        );

                        console.log(this.hazardousCharts);
                        this.hazardousCharts.setOption(this.hazardousOption);
                        console.log(this.hazardousCharts);
                  } else {
                        this.$nextTick(() => {
                              if (this.hazardousCharts) {
                                    this.hazardousCharts.dispose();
                                    this.hazardousCharts =
                                          document.getElementById(this.setId);
                                    this.hazardousCharts.innerHTML = "暂无数据";
                              }

                              // dom.removeAttribute("_echarts_instance_");
                        });
                  }
            },
      },
      mounted() {},
      created() {},
      methods: {},
};
</script>

<style lang="less" scoped>
#myechar {
      > div {
            width: 100% !important;
      }
}
.echarText {
      text-align: center;
      line-height: 300px;
      font-size: 20px;
      width: 100%;
      height: 300px;
}
</style>
