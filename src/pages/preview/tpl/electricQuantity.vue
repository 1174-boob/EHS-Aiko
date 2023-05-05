<template>
  <Echarts v-if="option.series.length" :option="option" />
  <a-empty v-else class="echarts-empty" />
</template>
  
<script>
import { listEnvironmentMonthlyPowerSubmodule } from "@/services/envMonth.js";
import dayJs from "dayjs";
import { tableConversion } from "./methods.js";
import Echarts from "@/components/echarts/index.vue";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { isEmpty } from "lodash";
const markLineValue = 401.1
export default {
  components: { Echarts },
  props: {
    dateStr: {}
  },
  data() {
    return {
      option: {
        tooltip: {
          ...barObj.tooltip,
        },
        grid: {
          top: "18%",
          left: "4px",
          right: "40px",
          bottom: "5%",
          containLabel: true,
        },
        legend: {},
        color: ['#5470c6', '#91cc75'],
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "百万kwh",
            alignTicks: true,
            axisLine: {
              show: true,
            },
          },
          {
            offset: 40,
            type: "value",
            name: "kwh/m²",
            nameTextStyle: {
              align: 'left'
            },
            max: undefined,
            alignTicks: true,
            axisLine: {
              // show: true,
            },
            axisLabel: {
              formatter: (v,) => {
                let yAxisBalue = v.toFixed(1)
                return yAxisBalue;
              }
            }
          },
        ],
        series: [],
      },
      seriesDefault: [
        {
          name: "电量(百万kwh)",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          barMaxWidth: 50,
          data: [],
        },
        {
          name: "电耗(kwh/m²)",
          type: "line",
          yAxisIndex: 1,
          markLine: {
            symbol: ['circle', 'arrow'], //箭头
            data: [
              {
                silent: false,             //鼠标悬停事件  true没有，false有
                lineStyle: {               //警戒线的样式  ，虚实  颜色
                  type: "dashed",
                  color: "#91cc75",
                  //利用阴影进行延长
                  // shadowOffsetX: 50,	//！！！！！！！！！
                  // shadowColor: '#91cc75'
                },
                label: {
                  position: 'end',
                  formatter: "{c}",
                  color: "inherit",
                  // padding: [0, 0, 0, 10]
                },
                yAxis: markLineValue
              }
            ]
          },
          data: [],
        },
      ]
    };
  },
  computed: {
    corporationList() {
      return this.$store.state.setting.corporationList
    },
  },
  created() {
    this.getSubmodule();
  },
  methods: {
    //现地电量（最新月份的数据）
    async getSubmodule() {
      const apiData = {
        dataType: "",
        dateStr: this.dateStr,
        dateType: "1",
      }
      this.option.xAxis[0].data = [];
      const data = await listEnvironmentMonthlyPowerSubmodule(apiData);
      if (isEmpty(data.data)) {
        return
      }
      this.$set(this.option, 'series', this.seriesDefault)
      let obj = tableConversion(data.data, 1004);
      const titleList = obj.titleList;
      const tableData = obj.tableData;
      const xAxisData = [];
      for (let i of titleList) {
        const arr = this.corporationList.find(item => item.corporationId == i);
        xAxisData.push(arr.orgAbbrName);
        for (let item of tableData) {
          const code = item.nicheItemsCode;
          if (code == 1004) {
            this.option.series[0].data = [item[i]];
          } else if (code == 1110) {
            this.option.series[1].data = [item[i]];
          }
        }
      }

      // y轴最大值
      let alarm = (this.option.series[1].data || []).filter(item => item).map(item => item - 0)
      let maxMarkLineArr = [...alarm].sort((x, y) => y - x)
      let maxMarkLineValue = maxMarkLineArr.length ? maxMarkLineArr[0] : 0
      let yAxisMax = markLineValue <= maxMarkLineValue ? maxMarkLineValue : markLineValue + 10
      this.option.yAxis[1].max = yAxisMax;

      // x轴
      this.option.xAxis[0].data = xAxisData;
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
.title {
  font-size: 16px;
  font-weight: bold;
  color: 16px;
  line-height: 80px;
}
</style>
  