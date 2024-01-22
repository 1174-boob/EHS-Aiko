<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div ref="downloadArea">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="年份">
            <el-date-picker v-model="formInline.year" type="year" value-format="yyyy" placeholder="请选择" :clearable="false"></el-date-picker>
          </a-form-model-item>
          <a-form-model-item label="月份">
            <a-select v-model="formInline.month" placeholder="请选择">
              <a-select-option v-for="(i, index) in monthOption" :key="index" :value="i.value">{{ i.name }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearch">查询</a-button>
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>

      <template description="评价结果">
        <div class="secondary-title">
          <div class="secondary-title-left">评价结果</div>
        </div>

        <a-spin :spinning="loading" wrapperClassName="a-spin">
          <div class="table-container">
            <EvaluatResult :evaluatResultData="evaluatResultData"/>
          </div>
        </a-spin>
        
        <div style="height: 40px"></div>
      </template>

      <template description="主要扣分明细">
        <div class="secondary-title">
          <div class="secondary-title-left">主要扣分明细</div>
        </div>

         <a-spin :spinning="loading" wrapperClassName="a-spin">
          <div class="table-container">
            <DeductPoints :deductPointsData="deductPointsData" :monthData="formInline.month"/>
          </div>
        </a-spin>
        <div style="height: 40px"></div>
      </template>

      <template description="部门得分环比统计">
        <div class="injury-box">
          <div class="secondary-title">
            <div class="secondary-title-left">部门得分环比统计</div>
          </div>
          <template v-if="propertyLossOption.series && propertyLossOption.series.length">
            <div class="injury-Echarts">
              <Echarts :option="propertyLossOption" />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
        <div style="height: 40px"></div>
      </template>

      <template description="部门得分月度统计">
        <div class="injury-box">
          <div class="secondary-title">
            <div class="secondary-title-left">部门得分月度统计</div>
          </div>
          <template v-if="monthlyOption.series && monthlyOption.series.length">
            <div class="injury-Echarts">
              <Echarts :option="monthlyOption" />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
        <div style="height: 40px"></div>
      </template>
    </div>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dayJs from "dayjs";
import { cloneDeep, debounce, isEmpty } from "lodash";
import Echarts from "@/components/echarts/index.vue";
import { getMaturityEvaDataSumEvaluatResult, getMaturityEvaDataSumDeductPoints, getMonthStatisics, getDepartmentScore } from "@/services/maturityEvaluation.js";
import EvaluatResult from './evaluatResult.vue'
import DeductPoints from './deductPoints.vue'
export default {
  components: { Echarts, EvaluatResult,DeductPoints },
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      evaluatResultData:{},
      formInline:{
        year: null,
        month: null,
      },
      deductPointsData:[],

      monthOption: [
        { name: "1月", value: '1' },
        { name: "2月", value: '2' },
        { name: "3月", value: '3' },
        { name: "4月", value: '4' },
        { name: "5月", value: '5' },
        { name: "6月", value: '6' },
        { name: "7月", value: '7' },
        { name: "8月", value: '8' },
        { name: "9月", value: '9' },
        { name: "10月", value: '10' },
        { name: "11月", value: '11' },
        { name: "12月", value: '12' },
      ],

      columnsDetails: [
        {
          title: "序号",
          scopedSlots: { customRender: 'orderNum' },
          align: 'center',
          width: 80,
        },
        {
          title: "部门",
          dataIndex: "bumen",
          align: 'center',
          minWidth: 200,
        },
        {
          title: "3月得分",
          dataIndex: "3yuedefen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "4月得分",
          dataIndex: "4yuedefen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "环比",
          dataIndex: "huanbi",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "主要扣分项",
          dataIndex: "zhuyaokoufenxiang",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "总分",
          dataIndex: "zongfen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "得分",
          dataIndex: "defen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "扣分点描述",
          scopedSlots: { customRender: 'deductionDescribe' },
          align: 'center',
          minWidth: 100,
        },
      ],
      propertyLossOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '1%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
          data: ['上年同月', '已选月']
        },
        color:['#ee6666', '#fac858', 'transparent'],
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              rotate: 40
            },
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '得分',
            min: 0,
            max: 150,  // 
            // interval: 100,
          },
          {
            type: 'value',
            name: ' ',
            min: -Infinity,
            max: 10000,
            interval: 20,
          }
        ],
        series: [
          {
            name: '上年同月',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            barMaxWidth: 50,
            data: []
          },
          {
            name: '已选月',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            barMaxWidth: 50,
            data: []
          }
        ]
      },
      monthlyOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '1%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
          data: ['上年同月', '已选月']
        },
        color:['#ee6666', '#fac858', '#5470c6', '#91cc75', '#73c0de'],
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              rotate: 40
            },
            data: [],
            axisPointer: {
              type: 'line'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '得分',
            min: 0,
            max: 150,
            // interval: 10,
          },
          {
            type: 'value',
            name: '平均值',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: '上年同月',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            barMaxWidth: 50,
            data: []
          },
          {
            name: '已选月',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            barMaxWidth: 50,
            data: []
          }
        ]
      },
      tableDataList: [],
    };
  },
  created() {
    this.setRouterCode("performanceBranchSummary");
    this.initFormInline()
    this.getPageData()
  },
  methods: {
    initFormInline() {
      const dayNow = dayJs().subtract(1, 'month')
      this.formInline = {
        year: dayNow.format('YYYY'),
        month: dayNow.format('MM'),
      }
    },
    getPageData() {
      this.handleLoading()
      Promise.all([
        this.getEvaluatResultData(),
        this.getDeductPoints(),
        this.getMonthStatisics(),
        this.getDepartmentScore(),
      ])
        .finally(() => {
          this.cancelLoading(200)
        })
    },
    // 获取评价结果api
    getEvaluatResultData() {
      let apiData = {
        ...this.formInline,
      }
      return getMaturityEvaDataSumEvaluatResult(apiData)
        .then(res => {
          this.evaluatResultData = res.data || {
            deptIdList: [],
            deptMap: {},
            list: [],
            scoreMap: { totalScore: 0 },
          }
        })
        .catch(err => { })
    },
    // 获取主要扣分明细api
    getDeductPoints() {
      let apiData = {
        ...this.formInline,
      }
      return getMaturityEvaDataSumDeductPoints(apiData)
        .then(res => {
          this.deductPointsData = res.data || []
        })
        .catch(err => { })
    },
    barDataHandle(ajaxData, needStack = false, needMatchXAxis = false, needSearchFormName = 'formInline', sumUpDomn) {
      // x轴数据
      let xAxisData = ajaxData.map(item => item.xdata)
      xAxisData = needMatchXAxis ? this.matchXAxis(xAxisData, needSearchFormName) : xAxisData
      // series数据
      let series = []
      ajaxData[0].list.forEach(item => {
        let obj = { ...item }
        obj.name = item.name
        obj.type = item.type ? item.type : 'bar'
        if (obj.type == 'line') {
          obj.yAxisIndex = 1
        } else if (obj.type == 'bar') {
          obj.barMaxWidth = 50
          if (needStack) obj.stack = 'stack'
        }
        if(sumUpDomn == 'sumUpDomn' && obj.type == 'line') {
          obj.label = {
            show: true, // 显示标注
            position: 'top', // 标注位置（上、内部等）
            formatter: '{c|{c}}',
            backgroundColor: 'rgb(242,242,242)',
            borderColor: '#aaa',
            borderRadius: 4,
            padding: [5, 10],
            lineHeight: 26,
            distance: 180,
            rich: {
              c: {
                color: 'blue',
                textBorderWidth: 1,
                fontWeight: 'bold',
                fontSize: 14
              }
            },
          }
        }
        series.push(obj)
      })
      series.forEach((item, index) => {
        let data = ajaxData.map(item1 => {
          return item1.list[index].value || 0
        })
        item.data = data
        if(index == 2) {
          item.name = ''
        }
      })
      // console.log(series)
      // 图例
      let legendData = series.map(item => item.name)
      return {
        xAxisData,
        series,
        legendData
      }
    },
    barDataHandleChange(ajaxData, needStack = false, needMatchXAxis = false, needSearchFormName = 'formInline', sumUpDomn) {
      // x轴数据
      let xAxisData = ajaxData.map(item => item.xdata)
      xAxisData = needMatchXAxis ? this.matchXAxis(xAxisData, needSearchFormName) : xAxisData
      // series数据
      let series = []
      ajaxData[0].list.forEach(item => {
        let obj = { ...item }
        obj.name = item.name
        obj.type = item.type ? item.type : 'bar'
        if (obj.type == 'line') {
          obj.yAxisIndex = 1
        } else if (obj.type == 'bar') {
          obj.barMaxWidth = 50
          if (needStack) obj.stack = 'stack'
        }
        if(sumUpDomn == 'sumUpDomn' && obj.type == 'line') {
          obj.label = {
            show: true, // 显示标注
            position: 'top', // 标注位置（上、内部等）
            formatter: '{c|{c}}',
            backgroundColor: 'rgb(242,242,242)',
            borderColor: '#aaa',
            borderRadius: 4,
            padding: [5, 10],
            lineHeight: 26,
            distance: 40,
            rich: {
              c: {
                color: 'blue',
                textBorderWidth: 1,
                fontWeight: 'bold',
                fontSize: 14
              }
            },
          }
        }
        series.push(obj)
      })
      series.forEach((item, index) => {
        let data = ajaxData.map(item1 => {
          return item1.list[index].value || 0
        })
        item.data = data
        if(index == item.length - 1) {
          item.name = '平均值'
        }
      })
      // console.log(series)
      // 图例
      let legendData = series.map(item => item.name)
      return {
        xAxisData,
        series,
        legendData
      }
    },
    // 匹配X轴数据
    matchXAxis(xAxis, needSearchFormName) {
      let xAxisData = []
      if (needSearchFormName == 'none') { //带查询但不展示查询-例如总览
        if (this.formInline.corporationId) { //x轴为部门
          xAxisData = xAxis.map(item => {
              let orgName = this.deptCache[item] ? this.deptCache[item] : item
              return orgName
          })
        } else {
          xAxisData = xAxis.map(item => { //x轴为组织
            let orgName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", item).orgName
            return orgName ? orgName : item
          })
        }
      } else if (this[needSearchFormName].isSummary) { // 汇总
        xAxisData = xAxis.map(item => {
          let orgName = this.getMappingValue(this.setCorporationTree, "corporationCode", item).corporationName
          return orgName ? orgName : item
        })
      } else {
        if (needSearchFormName == 'formInline') {
            if (this.formInline.corporationId || !isEmpty(this.corporationIdObj)) { //x轴为部门
              xAxisData = xAxis.map(item => {
                let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
                return orgAbbrName
              })
            } else {
              // xAxisData = xAxis.map(item => { //x轴为组织
              //   let orgName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", item).orgName
              //   return orgName ? orgName : item
              // })
              xAxisData = xAxis.map(item => {
                let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
                return orgAbbrName
              })
            }
        } else {
          if (this.formInline.corporationId || this.formInlineTwoObj.corporationId || !isEmpty(this.corporationIdObjTwo)) { //x轴为部门
            xAxisData = xAxis.map(item => {
              let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
              return orgAbbrName
            })
          } else {
            xAxisData = xAxis.map(item => { //x轴为组织
              let orgName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", item).orgName
              return orgName ? orgName : item
            })
          }
        }
      }
      return xAxisData
    },
    async getMonthStatisics() {
      let para = {
        ...this.formInline,
      }
      const { data } = await getMonthStatisics(para)
      let ajaxData = data || [];
      if (ajaxData && ajaxData.length) {
        let { xAxisData, series, legendData } = this.barDataHandle(
          ajaxData,
          false,
          true,
          "formInline",
          "sumUpDomn"
        );
        this.propertyLossOption.xAxis[0].data = cloneDeep(xAxisData);
        this.propertyLossOption.legend.data = cloneDeep(legendData);
        this.propertyLossOption.series = cloneDeep(series);
      } else {
        this.propertyLossOption.series = [];
      }
    },
    async getDepartmentScore() {
      let para = {
        ...this.formInline,
      }
      const { data } = await getDepartmentScore(para)
      let ajaxData = data || [];
      if (ajaxData && ajaxData.length) {
        let { xAxisData, series, legendData } = this.barDataHandleChange(
          ajaxData,
          false,
          true,
          "formInline",
          "sumUpDomn"
        );
        this.monthlyOption.xAxis[0].data = cloneDeep(xAxisData);
        this.monthlyOption.legend.data = cloneDeep(legendData);
        this.monthlyOption.series = cloneDeep(series);
      } else {
        this.monthlyOption.series = [];
      }
    },
    // 查询
    iSearch: debounce(
      function () {
        this.getPageData()
      },
      250,
      { leading: true, trailing: false }
    ),
    // 重置
    iRest: debounce(
      function () {
        this.initFormInline();
        this.getPageData();
      },
      250,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style lang="less" scoped>
.table-p-box {
  & > p {
    margin-bottom: 1em;
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }
}
.secondary-title {
  height: 48px;
  background: #fafbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 12px;
  margin-bottom: 10px;
  .secondary-title-left {
    font-size: 16px;
    line-height: 1.1;
    color: #333;
    font-weight: bold;
  }
}

/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
.table-container{
  width: 100%;
  min-height: 250px;
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
::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>
