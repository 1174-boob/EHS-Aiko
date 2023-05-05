<template>
  <!-- 双轴图-折线图和柱状图 -->
  <div class="month-bar-echarts">
    <div id="month-bar"></div>
  </div>
</template>

<script>
import * as  echarts from 'echarts';
export default {
  props: {
    barObj: {
      required: true,
      type: Object,
    },
    unit: {
      required: false,
      type: String,
      default: '',
    },
    // securityData: {
    //   required: false,
    //   type: Object,
    //   default: {
    //     prewarning: 0,
    //     alarm: 0
    //   }
    // }
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          },
          valueFormatter: (value) => {
            return value + ' ' + this.unit;
          },
          // formatter: (data) => {
          //   // return data.data;
          // },
        },
        toolbox: {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: "刷新",
              icon: "path://M512 85.333333c138.666667 0 262.4 66.133333 341.333333 170.666667l-170.666667 0c-12.8 0-21.333333 8.533333-21.333333 21.333333 0 12.8 8.533333 21.333333 21.333333 21.333333l213.333333 0c12.8 0 21.333333-8.533333 21.333333-21.333333L917.333333 64c0-12.8-8.533333-21.333333-21.333333-21.333333-12.8 0-21.333333 8.533333-21.333333 21.333333l0 151.466667C789.333333 108.8 659.2 42.666667 512 42.666667 251.733333 42.666667 42.666667 251.733333 42.666667 512c0 12.8 8.533333 21.333333 21.333333 21.333333 12.8 0 21.333333-8.533333 21.333333-21.333333C85.333333 277.333333 277.333333 85.333333 512 85.333333zM960 490.666667c-12.8 0-21.333333 8.533333-21.333333 21.333333 0 234.666667-192 426.666667-426.666667 426.666667-138.666667 0-262.4-66.133333-341.333333-170.666667l170.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333 0-12.8-8.533333-21.333333-21.333333-21.333333L128 725.333333c-12.8 0-21.333333 8.533333-21.333333 21.333333l0 213.333333c0 12.8 8.533333 21.333333 21.333333 21.333333 12.8 0 21.333333-8.533333 21.333333-21.333333l0-151.466667c85.333333 104.533333 215.466667 172.8 362.666667 172.8 260.266667 0 469.333333-209.066667 469.333333-469.333333C981.333333 499.2 972.8 490.666667 960 490.666667z",
              onclick: () => {
                this.$emit("resetore");
              },
            },
            // restore: { show: true,title:'重置'},
            saveAsImage: { show: true, title: '下载', icon: 'path://M867.3 342.8L539.5 670.7V79.4c0-15.2-12.3-27.5-27.5-27.5s-27.5 12.3-27.5 27.5v591.3L156.7 342.8c-5.4-5.4-12.4-8-19.4-8-7 0-14.1 2.7-19.4 8-10.7 10.7-10.7 28.1 0 38.8l374.7 374.7c10.7 10.7 28.1 10.7 38.8 0l374.7-374.7c10.7-10.7 10.7-28.1 0-38.8-10.7-10.7-28.1-10.7-38.8 0z m129.2 574.4h-969C12.3 917.2 0 929.5 0 944.6c0 15.2 12.3 27.5 27.5 27.5h969.1c15.2 0 27.5-12.3 27.5-27.5-0.1-15.1-12.4-27.4-27.6-27.4z' }
          },
          right: '8%'
        },
        calculable: true,
        legend: {
          data: ['平均值', '最大值'],
          itemGap: 5
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '8%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '时间(月)',
            axisLabel: {
              rotate: -40
            },
            data: this.barObj.timeList,
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.unit,
            // axisLabel: {
            //   formatter: function (a) {
            //     a = +a;
            //     return isFinite(a) ? echarts.format.addCommas(+a / 1000) : '';
            //   }
            // }
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          },
        ],
        series: [
          {
            name: '平均值',
            type: 'bar',
            barMinHeight: 2,
            barMaxWidth: 100,
            itemStyle: {
              color: '#0067cc',
            },
            // markLine: {
            //   symbol: "none", //去掉警戒线最后面的箭头
            //   label: {
            //     position: "end", //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
            //     formatter: function(value){
            //       return value.name + ': ' + value.value + "mg/m3"
            //     }, 
            //   },
            //   data: [
            //     {
            //       silent: false, //鼠标悬停事件  true没有，false有
            //       name:'预警值',
            //       lineStyle: {
            //         //警戒线的样式  ，虚实  颜色
            //         type: "dashed",
            //         color: "#f59a23",
            //       },
            //       yAxis: this.securityData.prewarning, // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
            //     },
            //     {
            //       silent: false,
            //       name:'报警值',
            //       lineStyle: {
            //         type: "solid",
            //         color: "#FA3934",
            //         width: 2,
            //       },
            //       yAxis: this.securityData.alarm,
            //     },
            //   ],
            // },
            // data: ['3100','2110','1345'],
            data: this.barObj.avgList,
          },
          {
            name: '最大值',
            type: 'line',
            itemStyle: {
              color: '#91cc75',
            },
            // data: ['3100','2110','1345'],
            data: this.barObj.maxList,
          }
        ]
      }
    }
  },
  watch: {
    barObj: {
      handler(value) {
        this.resetClick(value);
      },
      deep: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.barInit();
    }, 20);
  },
  methods: {
    barInit() {
      if (this.monthEcharts == null) {
        this.monthEcharts = echarts.init(document.getElementById("month-bar"))
      }
      this.monthEcharts.setOption(this.option);
    },
    resetClick(value) {
      this.option.xAxis[0].data = value.timeList;
      this.option.series[0].data = value.avgList;
      this.option.series[1].data = value.maxList;
      this.monthEcharts.setOption(this.option);
    },
    resize() {
      this.monthEcharts && this.monthEcharts.resize();
    }
  }
}
</script>

<style scoped lang="less">
.month-bar-echarts {
  #month-bar {
    width: 100%;
    height: 400px;
  }
}
</style>