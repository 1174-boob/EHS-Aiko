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
            <DeductPoints :deductPointsData="deductPointsData"/>
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
import { debounce } from "lodash";
import Echarts from "@/components/echarts/index.vue";
import { getMaturityEvaDataSumEvaluatResult, getMaturityEvaDataSumDeductPoints } from "@/services/maturityEvaluation.js";
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
        legend: {},
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
          }
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
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
        legend: {},
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: 'Temperature',
            type: 'line',
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
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
        // this.getDeductPoints(),
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
