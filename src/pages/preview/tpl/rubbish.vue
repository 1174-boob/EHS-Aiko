<template>
  <Echarts v-if="option.series.length" :option="option" />
  <a-empty v-else class="echarts-empty" />
</template>
  
  <script>
import { wasteLocal } from "@/services/envMonth.js";

import { tableConversion, findCorporationId } from "./methods.js";
import Echarts from "@/components/echarts/index.vue";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { isEmpty } from "lodash";
const markLineValue = 8.86
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
            name: "kg/m2",
            alignTicks: true,
            max: undefined,
            axisLine: {
              show: true,
            },
          },
          {
            offset: 40,
            type: "value",
            name: "元/kg",
            nameTextStyle: {
              align: 'left'
            },
            alignTicks: true,
            axisLine: {
              // show: false,
            },
            axisLabel: {
              formatter: (v,) => {
                let yAxisBalue = (v + '').length >= 10 ? v.toFixed(2) : v
                return yAxisBalue;
              }
            }
          },
        ],
        series: [],
      },
      seriesDefault: [
        {
          name: "废弃物单耗(kg/m2)",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          barMaxWidth: 50,
          data: [],
          markLine: {
            symbol: ['circle', 'arrow'], //箭头
            data: [
              {
                silent: false,             //鼠标悬停事件  true没有，false有
                lineStyle: {               //警戒线的样式  ，虚实  颜色
                  type: "dashed",
                  color: "#5470c6",
                  //利用阴影进行延长
                  // shadowOffsetX: 50,	//！！！！！！！！！
                  // shadowColor: '#5470c6'
                },
                label: {
                  position: 'end',
                  formatter: "{c}",
                  color: "inherit",
                  // padding: [0, 0, 0, 50]
                },
                yAxis: markLineValue
              }
            ]
          },
        },
        {
          name: "平均处置单价(元/kg)",
          type: "line",
          yAxisIndex: 1,
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
      const data = await wasteLocal(apiData);
      if (isEmpty(data.data)) {
        return
      }
      this.$set(this.option, 'series', this.seriesDefault)

      let obj = tableConversion(data.data, 1113)
      const titleList = obj.titleList
      const tableData = obj.tableData
      // console.log(obj)
      for (let i = 0; i < tableData.length; i++) {
        this.option.series[i].data = []
        for (let j = 0; j < titleList.length; j++) {
          let key = titleList[j]
          this.option.series[i].data.push(tableData[i][key])
        }
      }

      // y轴最大值
      let alarm = (this.option.series[0].data || []).filter(item => item).map(item => item - 0)
      let maxMarkLineArr = [...alarm].sort((x, y) => y - x)
      let maxMarkLineValue = maxMarkLineArr.length ? maxMarkLineArr[0] : 0
      let yAxisMax = markLineValue <= maxMarkLineValue ? maxMarkLineValue : markLineValue + 6
      this.option.yAxis[0].max = yAxisMax;

      // x轴
      this.option.xAxis[0].data = titleList.map(findCorporationId)
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
  