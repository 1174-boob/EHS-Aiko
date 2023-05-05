<template>
  <Echarts :option="option" />
</template>

<script>
import { cloneDeep, debounce, divide, isEmpty } from "lodash";
import Echarts from "@/components/echarts/index.vue";
import * as echarts from 'echarts';
export default {
  components: { Echarts },
  props: {
    gaugeData: {
      type: Object,
      default: () => {
        return {
          // value: 100,
          // name: '110分',
          // ranking: 1,
          // corporationId: '1586695162566311938'
        }
      }
    },
  },
  data() {
    return {
      option: {
        series: [
          {
            type: 'gauge',
            startAngle: 230,
            endAngle: -50,
            pointer: {
              show: false
            },
            progress: {
              show: false,
            },
            axisLine: {
              roundCap: false, // 只适用于平角
              lineStyle: {
                width: 10,
                color: [] // 渐变色作为轴的背景色
              }
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
            },
            data: [],
            title: {
              fontSize: 16,
              fontWeight: 'bold',
              offsetCenter: ['0%', '0%'],
              formatter: (value) => {
                return value + '分';
              }
            },
            detail: {
              offsetCenter: ['0%', '80%'],
              fontSize: 16,
              formatter: (val) => [
                `{a|第${this.gaugeData.ranking}名}`,
                `{b|[${this.matchOrganizeName(this.gaugeData.corporationId)}]}`
              ].join('\n'),
              rich: {
                a: {
                  verticalAlign: "bottom"
                },
                b: {
                  verticalAlign: "middle"
                },
              }
            }
          }
        ]
      },
      //渐变色
      colorLinearGradient: [
        {
          offset: 0,
          color: '#EB7E65',
        },
        {
          offset: 1,
          color: '#59D2AC',
        },
      ],
      color: undefined,
    }
  },
  created() {
    this.color = new echarts.graphic.LinearGradient(0, 0, 1, 0, this.colorLinearGradient);
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const colorSet = [
        [1, this.color]
      ];
      this.option.series[0].axisLine.lineStyle.color = colorSet
      this.option.series[0].data = [this.gaugeData]
    }
  },
}
</script>

<style lang="less" scoped>
.echarts-box {
  width: 100%;
  height: 100%;
}
</style>