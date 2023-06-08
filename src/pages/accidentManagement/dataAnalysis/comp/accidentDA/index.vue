<template>
  <!-- 事故事件-数据统计分析 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
          :disabled="disabledCommonDept"
          @corporationChange="corporationChange"
          @corporationDeptChange="corporationDeptChange"
        ></CommonDept>
        <a-form-model-item label="部门">
          <a-tree-select
            v-model="formInline.deptId"
            :allowClear="true"
            :disabled="disabledCommonDept"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptList"
            :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
            :placeholder="formInline.corporationId?'请选择': '请先选择所属组织'"
          ></a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="创建时间">
          <a-range-picker v-model="formInline.auditTime" valueFormat="YYYY-MM-DD" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始时间','结束时间']" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <!-- 事故事件情况 -->
    <div class="content-title">
      <span class="content-title-left">事故事件情况</span>
      <div class="content-title-right">
        <!-- <a-checkbox v-if="allButtonCodeList.includes('accidentDA-summary')" v-model="summary" @change="summaryChange">汇总</a-checkbox> -->
        <!-- <a-checkbox v-model="summary" @change="summaryChange">汇总</a-checkbox> -->
      </div>
    </div>

    <template title="人员伤害情况">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">人员伤害情况</div>
          <div class="title-right"></div>
        </div>
        <template v-if="injuryOption.series && injuryOption.series.length">
          <div class="injury-Echarts">
            <Echarts :option="injuryOption" />
          </div>
        </template>
        <template v-else>
          <a-empty />
        </template>
      </div>
    </template>

    <template title="财产损失情况">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">财产损失情况</div>
          <div class="title-right"></div>
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
    </template>

    <template title="事故类型情况">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">事故类型情况</div>
          <div class="title-right"></div>
        </div>
        <div class="serch-box">
          <span class="serch-item-lable">事故事件类型</span>
          <a-select class="serch-item-select" mode="multiple" allowClear v-model="accList" placeholder="请选择" show-search :filter-option="filterOptionMixin" @blur="accListBlur">
            <a-select-option v-for="item in getChemicalDictList('accident_type')" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </div>
        <template v-if="accidentTypeOption.series && accidentTypeOption.series.length">
          <div class="injury-Echarts">
            <Echarts :option="accidentTypeOption" />
          </div>
        </template>
        <template v-else>
          <a-empty />
        </template>
      </div>
    </template>

    <a-row :gutter="{xl:20,xxl:30}">
      <a-col :span="12">
        <template title="事故事件类型">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">事故事件类型</div>
              <div class="title-right"></div>
            </div>
            <template v-if="eventTypeOption.series[0].data && eventTypeOption.series[0].data.length">
              <div class="injury-Echarts">
                <Echarts :option="eventTypeOption" />
              </div>
            </template>
            <template v-else>
              <a-empty />
            </template>
          </div>
        </template>
      </a-col>
      <a-col :span="12">
        <template title="事故级别情况">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">事故级别情况</div>
              <div class="title-right"></div>
            </div>
            <template v-if="eventLevelOption.series[0].data && eventLevelOption.series[0].data.length">
              <div class="injury-Echarts">
                <Echarts :option="eventLevelOption" />
              </div>
            </template>
            <template v-else>
              <a-empty />
            </template>
          </div>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { getInjuryOptionApi, exportInjuryOptionApi, getPropertyLossOptionApi, exportPropertyLossOptionApi, getAccidentTypeOptionApi, exportAccidentTypeOptionApi, getEventTypeOptionApi, exportEventTypeOptionApi, getEventLevelOptionApi, exportEventLevelOptionApi } from "@/services/dataAnalysis/index.js";
import moment from 'moment'
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import { barObj, pieObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
export default {
  components: { Echarts },
  mixins: [cancelLoading, chemicalDict, dataAnalysis],
  data() {
    return {
      formInline: {
        auditTime: undefined,
      },
      // 汇总
      summary: false,
      // 示例
      demoOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            myTool1: {
              show: true,
              title: "刷新",
              icon: "path://M512 85.333333c138.666667 0 262.4 66.133333 341.333333 170.666667l-170.666667 0c-12.8 0-21.333333 8.533333-21.333333 21.333333 0 12.8 8.533333 21.333333 21.333333 21.333333l213.333333 0c12.8 0 21.333333-8.533333 21.333333-21.333333L917.333333 64c0-12.8-8.533333-21.333333-21.333333-21.333333-12.8 0-21.333333 8.533333-21.333333 21.333333l0 151.466667C789.333333 108.8 659.2 42.666667 512 42.666667 251.733333 42.666667 42.666667 251.733333 42.666667 512c0 12.8 8.533333 21.333333 21.333333 21.333333 12.8 0 21.333333-8.533333 21.333333-21.333333C85.333333 277.333333 277.333333 85.333333 512 85.333333zM960 490.666667c-12.8 0-21.333333 8.533333-21.333333 21.333333 0 234.666667-192 426.666667-426.666667 426.666667-138.666667 0-262.4-66.133333-341.333333-170.666667l170.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333 0-12.8-8.533333-21.333333-21.333333-21.333333L128 725.333333c-12.8 0-21.333333 8.533333-21.333333 21.333333l0 213.333333c0 12.8 8.533333 21.333333 21.333333 21.333333 12.8 0 21.333333-8.533333 21.333333-21.333333l0-151.466667c85.333333 104.533333 215.466667 172.8 362.666667 172.8 260.266667 0 469.333333-209.066667 469.333333-469.333333C981.333333 499.2 972.8 490.666667 960 490.666667z",
              onclick: () => {
                console.log('刷新了');
              },
            },
            saveAsImage: { show: true }
          },
        },
        legend: {
          data: ['损失工时(时)', '轻伤', '重伤']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人员伤害情况(人)',
          },
          {
            type: 'value',
            name: '损失工时(时)',
          }
        ],
        series: [
          {
            name: '损失工时(时)',
            type: 'line',
            yAxisIndex: 1,
            data: [-4, 6]
          },
          {
            name: '轻伤',
            type: 'bar',
            stack: '1',
            data: [4, 6]
          },
          {
            name: '重伤',
            type: 'bar',
            stack: '1',
            data: [1, 2]
          }
        ]
      },
      // 人员伤害情况
      injuryOption: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid,
        dataZoom: [],
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              ...barObj.xAxis.axisLabel
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人员伤害情况(人)',
          },
          {
            type: 'value',
            name: '损失工时(时)',
          }
        ],
        series: []
      },
      // 财产损失情况
      propertyLossOption: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid,
        dataZoom: [],
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              ...barObj.xAxis.axisLabel
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '财产损失情况(元)',
          },
        ],
        series: []
      },
      // 事故类型情况
      accidentTypeOption: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid,
        dataZoom: [],
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              ...barObj.xAxis.axisLabel
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '事故类型情况(件)',
          },
        ],
        series: []
      },
      // 事故事件类型
      eventTypeOption: {
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {d}%",
        },
        series: [
          {
            radius: pieObj.radius,
            name: '事故事件类型',
            type: 'pie',
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          }
        ]
      },
      // 事故级别情况
      eventLevelOption: {
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            radius: pieObj.radius,
            name: '事故级别情况',
            type: 'pie',
            data: [],
          }
        ]
      },
      // 事故事件类型
      accList: undefined,
    }
  },
  created() {
    // 创建时间默认当前月份
    this.formInline.auditTime = [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
    // 事故事件类型
    this.accList = this.getChemicalDictList('accident_type').length ? [this.getChemicalDictList('accident_type')[0].dictValue] : undefined
    this.initOption()
  },
  mounted() {
    this.iSearch(false)
  },
  computed: {
    isSummary() {
      //1汇总 2不汇总
      let val = this.summary ? 1 : 2
      return val
    },
  },
  methods: {
    initOption() {
      this.injuryOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getInjuryOptionApiFn',
        exportFnObj: {
          apiName: exportInjuryOptionApi,
          fileName: '人员伤害情况',
        }
      })
      this.propertyLossOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getPropertyLossOptionApiFn',
        exportFnObj: {
          apiName: exportPropertyLossOptionApi,
          fileName: '财产损失情况',
        }
      })
      this.accidentTypeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getAccidentTypeOptionApiFn',
        exportFnObj: {
          apiName: exportAccidentTypeOptionApi,
          fileName: '事故类型情况',
        }
      })
      this.eventTypeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getEventTypeOptionApiFn',
        exportFnObj: {
          apiName: exportEventTypeOptionApi,
          fileName: '事故事件类型',
        }
      })
      this.eventLevelOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getEventLevelOptionApiFn',
        exportFnObj: {
          apiName: exportEventLevelOptionApi,
          fileName: '事故级别情况',
        }
      })
    },
    getApiData() {
      let apiData = {
        ...this.formInline,
        // isSummary: this.isSummary,
        auditTime: undefined,
        startTime: this.formInline.auditTime ? this.formInline.auditTime[0] : undefined,
        endTime: this.formInline.auditTime ? this.formInline.auditTime[1] : undefined,
      }
      if (!isEmpty(this.corporationIdObj)) {
        // 是否汇总
        apiData.centerId = this.summary ? undefined : this.corporationIdObj.centerId
        apiData.corporationId = this.summary ? undefined : this.corporationIdObj.corporationId
      }
      return apiData
    },
    // 人员伤害情况-api
    getInjuryOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getInjuryOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            // console.log(xAxisData, series, legendData);
            this.injuryOption.xAxis[0].data = cloneDeep(xAxisData)
            this.injuryOption.legend.data = cloneDeep(legendData)
            this.injuryOption.series = cloneDeep(series)
          } else {
            this.injuryOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 财产损失情况-api
    getPropertyLossOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getPropertyLossOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            // console.log(xAxisData, series, legendData);
            this.propertyLossOption.xAxis[0].data = cloneDeep(xAxisData)
            this.propertyLossOption.legend.data = cloneDeep(legendData)
            this.propertyLossOption.series = cloneDeep(series)
          } else {
            this.propertyLossOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 事故类型情况-api
    getAccidentTypeOptionApiFn() {
      let apiData = {
        ...this.getApiData(),
        accList: this.accList
      }
      return getAccidentTypeOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series } = this.barDataHandle(ajaxData, true, true)
            this.accidentTypeOption.xAxis[0].data = cloneDeep(xAxisData)
            let obj = {
              name: '事故事件总数',
              type: 'bar',
              barMaxWidth: this.barMaxWidth,
              data: ajaxData.map(item => item.totalNum)
            }
            series.push(obj)
            let legendData = series.map(item => item.name)
            this.accidentTypeOption.legend.data = cloneDeep(legendData)
            // console.log(legendData);
            this.accidentTypeOption.series = cloneDeep(series)
          } else {
            this.accidentTypeOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 事故事件类型-api
    getEventTypeOptionApiFn() {
      let apiData = {
        ...this.getApiData(),
      }
      return getEventTypeOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          this.eventTypeOption.series[0].data = cloneDeep(ajaxData)
        })
        .catch(errr => { })
    },
    // 事故级别情况-api
    getEventLevelOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getEventLevelOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          this.eventLevelOption.series[0].data = cloneDeep(ajaxData)
        })
        .catch(errr => { })
    },
    // 事故事件类型-变更-事故类型情况
    accListBlur() {
      this.getAccidentTypeOptionApiFn()
    },
    // echarts数据导出-api
    exportEchartsDataFn(apiName, fileName) {
      let apiData = {
        ...this.getApiData(),
        accList: apiName == 'exportAccidentTypeOptionApi' ? this.accList : undefined
      }
      apiName(apiData)
        .then(res => {
          this.spreadSheetExcel(res, fileName)
        })
        .catch(err => { })
    },
    // 汇总change
    summaryChange: debounce(
      function (e) {
        this.disabledCommonDept = e.target.checked
        let { auditTime } = this.formInline
        this.formInline = { auditTime }
        this.iSearch(false)
      },
      250,
      { leading: false, trailing: true }
    ),
    iSearch(openLoading = true) {
      openLoading && this.handleLoading()
      Promise.all([
        this.getInjuryOptionApiFn(),
        this.getPropertyLossOptionApiFn(),
        this.getAccidentTypeOptionApiFn(),
        this.getEventTypeOptionApiFn(),
        this.getEventLevelOptionApiFn(),
      ])
        .then(res => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.formInline = {}
        this.iSearch(false)
      },
      250,
      { leading: true, trailing: false }
    ),
  },
}
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