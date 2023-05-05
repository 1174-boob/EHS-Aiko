<template>
  <!-- 排放值浓度数据 -->
  <div>
    <template title="实时数据">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">实时数据</div>
          <div class="title-right" @click="moreClick">查看更多</div>
        </div>
        <template v-if="realTimeOption.xAxis[0].data.length">
          <div class="injury-Echarts">
            <Echarts :option="realTimeOption" />
          </div>
        </template>
        <template v-else>
          <a-empty :description="formInline.corporationId?'暂无数据':'请先选择所属组织'" />
        </template>
      </div>
    </template>

    <template title="日值">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">日值</div>
          <div class="title-right">
            <el-date-picker
              v-model="dayRange"
              class="time-picker"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="dayPickerOptions"
              :clearable="false"
              @change="dayChange"
            ></el-date-picker>
          </div>
        </div>
        <template v-if="dayOption.xAxis[0].data.length">
          <div class="injury-Echarts">
            <Echarts :option="dayOption" />
          </div>
        </template>
        <template v-else>
          <a-empty :description="formInline.corporationId?'暂无数据':'请先选择所属组织'" />
        </template>
      </div>
    </template>

    <template title="月值">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">月值</div>
          <div class="title-right">
            <el-date-picker
              class="time-picker"
              v-model="monthRange"
              type="monthrange"
              format="yyyy-MM"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="monthPickerOptions"
              :clearable="false"
              @change="monthChange"
            ></el-date-picker>
          </div>
        </div>
        <template v-if="monthOption.xAxis[0].data.length">
          <div class="injury-Echarts">
            <Echarts :option="monthOption" />
          </div>
        </template>
        <template v-else>
          <a-empty :description="formInline.corporationId?'暂无数据':'请先选择所属组织'" />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import dayJs from "dayjs";
import { cloneDeep, debounce, isEmpty } from "lodash";
import Echarts from "@/components/echarts/index.vue";
import { barObj } from '@/pages/environmental/flueGasMonitoring/mixin/dataAnalysis.js'
import dataAnalysis from '@/pages/environmental/flueGasMonitoring/mixin/dataAnalysis.js'
import { getFlueExhaustECRealTimeOptionApi, getFlueExhaustECDayOptionApi, getFlueExhaustECMonthOptionApiFn } from "@/services/earlyWarnAlarmInfo.js";
import getPollutantListMixin from '@/pages/environmental/earlyWarnInfo/mixin/getPollutantListMixin'
export default {
  components: { Echarts },
  mixins: [dataAnalysis, getPollutantListMixin],
  props: {
    formInline: {}
  },
  data() {
    return {
      dayRange: [],
      srartDayTime: null,
      dayPickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.srartDayTime = minDate.getTime()
          if (maxDate) {
            this.srartDayTime = null
          }
        },
        disabledDate: (time) => {
          if (this.srartDayTime) {
            const one = 30 * 24 * 3600 * 1000
            const minTime = this.srartDayTime - one
            const maxTime = this.srartDayTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          } else {
            return null
          }
        }
      },
      srartMouthTime: null,
      monthRange: [],
      monthPickerOptions: {
        disabledDate: (time) => {
          if (this.srartMouthTime) {
            const yy = new Date(this.srartMouthTime).getFullYear();
            const mm = new Date(this.srartMouthTime).getMonth() + 1;
            const st = `${yy - 1}-${mm}`;
            let et = `${yy + 1}-${mm}`;
            et = dayJs(et).subtract(1, 'month').format('YYYY-MM')
            return (
              time.getTime() < new Date(st).getTime() || time.getTime() > new Date(et).getTime()
            );
          } else {
            return null
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.srartMouthTime = minDate
          if (maxDate) {
            this.srartMouthTime = null
          }
        }
      },
      // 实时数据
      realTimeOption: {
        tooltip: {
          ...barObj.tooltip,
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid('40px'),
        dataZoom: this.getdataZoom(80, 100),
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
            data: [],
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '实时值',
            max: undefined,
            //splitNumber: 10,
          }
        ],
        series: [
          {
            name: '实时值',
            type: 'bar',
            data: [],
            barMaxWidth: 50,
            markLine: {
              symbol: "none",
              data: []
            }
          }
        ],
      },
      // 日值数据
      dayOption: {
        tooltip: {
          ...barObj.tooltip,
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid('40px'),
        dataZoom: this.getdataZoom(),
        legend: {
          data: ['平均值', '最大值'],
          selectedMode: false,
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
            data: [],
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: ``,
            max: undefined,
            //splitNumber: 10,
            // axisLabel: {
            //   formatter: (v, i) => {
            //     console.log(v, i, this.dayOption);
            //     return v;
            //   }
            // }
          },
        ],
        series: [
          {
            name: '平均值',
            type: 'bar',
            data: [],
            barMaxWidth: 50,
            markLine: {
              symbol: "none",
              data: []
            }
          },
          {
            name: '最大值',
            type: 'line',
            data: [],
            markLine: {
              symbol: "none",
              data: []
            }
          },
        ],
      },
      // 月值数据
      monthOption: {
        tooltip: {
          ...barObj.tooltip,
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid(),
        // dataZoom: this.getdataZoom(),
        legend: {
          data: ['平均值', '最大值'],
          //禁用legend点击事件   
          selectedMode: false,
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
            data: [],
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '月值数据',
            max: undefined,
            //splitNumber: 10,
          },
        ],
        series: [
          {
            name: '平均值',
            type: 'bar',
            data: [],
            barMaxWidth: 50,
            markLine: {
              symbol: "none",
              data: []
            }
          },
          {
            name: '最大值',
            type: 'line',
            data: [],
            markLine: {
              symbol: "none",
              data: []
            }
          },
        ],
      },
    }
  },
  created() {
    this.dayRange[0] = dayJs().startOf('month').format('YYYY-MM-DD')
    this.dayRange[1] = dayJs().endOf('month').format('YYYY-MM-DD')
    this.monthRange[0] = dayJs().year() + '-01'
    this.monthRange[1] = dayJs().year() + '-12'
    this.initOption()
  },
  methods: {
    initOption() {
      this.realTimeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getRealTimeOptionApiFn',
        exportFnObj: {
          fileName: '实时数据',
        }
      })
      this.dayOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getDayOptionApiFn',
        exportFnObj: {
          fileName: '日值数据',
        }
      })
      this.monthOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getMonthOptionApiFn',
        exportFnObj: {
          fileName: '月值数据',
        }
      })
    },
    getApiData() {
      let apiData = {
        ...this.formInline,
        //  废水还是废气 gas water
        pollutantType: 'gas',
        // 1. 浓度 2.速率
        gasType: '1',
      }
      return apiData
    },
    // 实时数据-api
    getRealTimeOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getFlueExhaustECRealTimeOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data
          if (Array.isArray(ajaxData.xdata) && ajaxData.xdata.length) {
            let { xAxisData, series, yAxisMax, markLine } = this.barDataHandle(ajaxData)
            // x轴数据
            this.realTimeOption.xAxis[0].data = cloneDeep(xAxisData)
            // y轴最大值
            this.realTimeOption.yAxis[0].max = yAxisMax
            // y轴名称
            this.realTimeOption.yAxis[0].name = `实时数据(${this.pollutantUnitText})`
            // 警戒线
            this.realTimeOption.series[0].markLine.data = [...markLine]
            // 数据
            this.realTimeOption.series[0].data = cloneDeep(series.barData)
          } else {
            // x轴数据
            this.realTimeOption.xAxis[0].data = []
          }
          return Promise.resolve()
        })
        .catch(err => { })
    },
    // 日值数据-api
    getDayOptionApiFn() {
      let apiData = {
        ...this.getApiData(),
        dayStartTime: this.dayRange.length ? this.dayRange[0] : undefined,
        dayEndTime: this.dayRange.length ? this.dayRange[1] : undefined,
      }
      return getFlueExhaustECDayOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data
          if (Array.isArray(ajaxData.xdata) && ajaxData.xdata.length) {
            let { xAxisData, series, yAxisMax, markLine } = this.barDataHandle(ajaxData)
            // x轴数据
            this.dayOption.xAxis[0].data = cloneDeep(xAxisData)
            // y轴最大值
            this.dayOption.yAxis[0].max = yAxisMax
            // y轴名称
            this.dayOption.yAxis[0].name = `日值数据(${this.pollutantUnitText})`
            // 警戒线
            this.dayOption.series[0].markLine.data = [...markLine]
            // 数据
            this.dayOption.series[0].data = cloneDeep(series.barData)
            this.dayOption.series[1].data = cloneDeep(series.lineData)
          } else {
            // x轴数据
            this.dayOption.xAxis[0].data = []
          }
          return Promise.resolve()
        })
        .catch(err => { })
    },
    // 月值数据-api
    getMonthOptionApiFn() {
      let apiData = {
        ...this.getApiData(),
        monthStartTime: this.monthRange.length ? this.monthRange[0] : undefined,
        monthEndTime: this.monthRange.length ? this.monthRange[1] : undefined,
      }
      return getFlueExhaustECMonthOptionApiFn(apiData)
        .then(res => {
          let ajaxData = res.data
          if (Array.isArray(ajaxData.xdata) && ajaxData.xdata.length) {
            let { xAxisData, series, yAxisMax, markLine } = this.barDataHandle(ajaxData)
            // x轴数据
            this.monthOption.xAxis[0].data = cloneDeep(xAxisData)
            // y轴最大值
            this.monthOption.yAxis[0].max = yAxisMax
            // y轴名称
            this.monthOption.yAxis[0].name = `月值数据(${this.pollutantUnitText})`
            // 警戒线
            this.monthOption.series[0].markLine.data = [...markLine]
            // 数据
            this.monthOption.series[0].data = cloneDeep(series.barData)
            this.monthOption.series[1].data = cloneDeep(series.lineData)
          } else {
            // x轴数据
            this.monthOption.xAxis[0].data = []
          }
          return Promise.resolve()
        })
        .catch(err => { })
    },
    iSearch() {
      return Promise.all([
        this.getRealTimeOptionApiFn(),
        this.getDayOptionApiFn(),
        this.getMonthOptionApiFn(),
      ])
        .then(res => { })
        .catch(err => { })
    },
    // 日值时间改变
    dayChange(value) {
      this.getDayOptionApiFn()
    },
    // 月值时间改变
    monthChange(value) {
      this.getMonthOptionApiFn()
    },
    // 查看更多-打开新页面
    moreClick() {
      if (!this.canClickBtnMixin("flueGasemissionConcentShowMore")) {
        return;
      }
      if (!this.formInline.instrumentPollutantRelId) {
        this.$antMessage.warn('请选择污染物')
        return
      }
      let query = { instrumentPollutantRelId: this.formInline.instrumentPollutantRelId };
      let path = '/environmentManage/environmental/flueGasMore'
      this.$router.push({
        path,
        query,
      });
    },
  }
}
</script>

<style scoped lang="less">
.injury-box {
  margin-bottom: 10px;

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

    .title-right {
      color: #0067cc;
      cursor: pointer;
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
.time-picker {
  width: 350px;

  ::v-deep .ant-calendar-range-picker-separator {
    margin-top: 4px;
  }

  ::v-deep .el-range__icon {
    display: none;
  }

  ::v-deep .el-range-separator {
    width: 10%;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>