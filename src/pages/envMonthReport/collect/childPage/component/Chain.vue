<template>
  <div class="piece-chain">
    <div class="top">
      <div class="echarts-content" :id="chainId"></div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="name"></div>
        <div class="time time1">{{pieceData ? pieceData.time[0] : ""}}</div>
        <div class="time time2">{{pieceData ? pieceData.time[1] : ""}}</div>
      </div>
      <div class="right">
        <div class="name title">{{pieceData ? pieceData.name : ""}}</div>
        <div class="num num1">{{pieceData ? pieceData.num[0] : ""}}</div>
        <div class="num num2">{{pieceData ? pieceData.num[1] : ""}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  props: {
    chainId: {
      type: String,
      default: "top1"
    },
    pieceData: {
      type: Object,
      default: ()=>{},
    }
  },
  data() {
    return {
      option: {
        grid: {
          bottom: "0",
        },
        color: ["#0067CC", "#00CECA", "#9958FF"],
        xAxis: {
          type: 'category',
          axisLine: {
            show: false, //隐藏y轴
          },
          axisTick: {
            show: false,  //刻度线
          },
          axisLabel: {
            show: false, //隐藏刻度值
          },
          data: ['Mon', 'Tue']
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false,  //刻度线
          },
          axisLine: {
            show: false, //隐藏y轴
          },
          axisLabel: {
            show: false, //隐藏刻度值
          },
          splitLine: {show: false},
        },
        series: [
          {
            data: [],
            type: 'bar',
            barMaxWidth: 40,
            itemStyle: {        //上方显示数值
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: '#666',
                    fontSize: 16
                  }
                }
              }
            }
          }
        ]
      },
    }
  },
  watch: {
    pieceData: {
      handler(val) {
        if(val) {
          this.initData(val);
        } else {
          this.option.series[0].data = [];
          this.myChart?.setOption(this.option);
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.chainId));
    this.myChart.setOption(this.option);
  },
  methods: {
    initData(val) {
      const data = val.num;
      const data1 = {
        value: data[1],
        itemStyle: {
          color: '#00CECA'
        }
      }
      this.option.series[0].data = [data[0],data1];
      this.myChart?.setOption(this.option);
    }
  }
}
</script>

<style lang="less" scoped>
.piece-chain {
  // width: 325px;
  width: 23%;
  height: 420px;
  border: 1px solid #ececec;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .top {
    flex: 1;
    width: 100%;
    .echarts-content {
      width: 170px;
      height: 100%;
      float: right;
    }
  }
  .bottom {
    height: 100px;
    display: flex;
    .left {
      flex: 1;
      height: 100%;
      .time {
        border-right: unset !important;
        &::before {
          content: "";
          width: 8px;
          height: 8px;
          display: block;
          background: #0067CC;
          margin-right: 4px;
        }
      }
      .time2 {
        &::before {
          background: #00CECA;
        }
      }
    }
    .right {
      width: 170px;
      height: 100%;
      .title {
        border: 1px solid #ececec;
        border-bottom: unset;
        font-size: 16px;
      }
    }
    .name {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .time,.num {
      height: 30px;
      border: 1px solid #ececec;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
    }
    .time1,.num1 {
      border-bottom: unset;
    }
  }
}
</style>