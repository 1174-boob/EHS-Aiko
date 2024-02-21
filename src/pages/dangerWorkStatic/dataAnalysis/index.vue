<template>
  <!-- 危险作业管理-数据统计分析 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>数据统计分析</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :needDeptName="true" :hasDepartment="true"></CommonSearchItem>
        <!-- <CommonDept
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
        </a-form-model-item> -->
        <a-form-model-item label="创建时间">
          <a-range-picker v-model="formInline.auditTime" valueFormat="YYYY-MM-DD" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始时间','结束时间']" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <!-- 危险作业情况 -->
    <div class="content-title">
      <span class="content-title-left">危险作业情况</span>
    </div>

    <template title="作业情况总览">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">作业情况总览</div>
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

    <template title="作业类别">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">作业类别</div>
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

    <a-row :gutter="{xl:20,xxl:30}">
      <a-col :span="12">
        <template title="作业类别">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">作业类别</div>
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
        <template title="作业日类型">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">作业日类型</div>
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

    <template title="关联隐患作业情况">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">关联隐患作业情况</div>
          <div class="title-right"></div>
        </div>
        <template v-if="associationOption.series && associationOption.series.length">
          <div class="injury-Echarts">
            <Echarts :option="associationOption" />
          </div>
        </template>
        <template v-else>
          <a-empty />
        </template>
      </div>
    </template>

    <CompAnalysis />
  </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { getOperationOptionApi, getAssociationOptionApi, exportOperationOptionApi,exportHideDangerOptionApi, getJobCategoryOptionApi, exportJobCategoryOptionApi, getJobCategoryPieOptionApi, exportJobCategoryPieOptionApi, getJobTypePieOptionApi, exportJobTypePieOptionApi } from "@/services/dataAnalysis/index.js";
import moment from 'moment'
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import { barObj, pieObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import CompAnalysis from './compAnalysis.vue'
export default {
  components: { Echarts, CompAnalysis },
  mixins: [cancelLoading, chemicalDict, dataAnalysis],
  data() {
    return {
      formInline: {
        auditTime: undefined,
      },
      // 作业数量
      injuryOption: {
        tooltip: {
          ...barObj.tooltip,
        },
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
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '作业数量',
          },
          {
            type: 'value',
            name: '未确认率',
            axisLabel: {
              formatter: (value) => {
                // value = value * 100 + '%'
                value = value + '%'
                return value
              }
            }
          }
        ],
        series: []
      },
      associationOption: {
        tooltip: {
          ...barObj.tooltip,
        },
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
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
          },
          {
            type: 'value',
            name: '整改率',
            axisLabel: {
              formatter: (value) => {
                // value = value * 100 + '%'
                value = value + '%'
                return value
              }
            }
          }
        ],
        series: []
      },
      // 作业类别
      propertyLossOption: {
        tooltip: {
          ...barObj.tooltip
        },
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
            name: '作业数量',
          },
        ],
        series: []
      },
      // 作业类别
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
            name: '作业类别',
            type: 'pie',
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          }
        ]
      },
      // 作业日类型
      eventLevelOption: {
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
            name: '作业日类型',
            type: 'pie',
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          }
        ]
      },
    }
  },
  created() {
    this.setRouterCode("dangerWorkDA");
    // 创建时间默认当前月份
    this.formInline.auditTime = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    this.initOption()
  },
  mounted() {
    this.iSearch(false)
  },
  computed: {
  },
  methods: {
    initOption() {
      this.injuryOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getOperationOptionApiFn',
        exportFnObj: {
          apiName: exportOperationOptionApi,
          fileName: '作业情况总览',
        }
      })
      this.associationOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getAssociationOptionApiFn',
        exportFnObj: {
          apiName: exportHideDangerOptionApi,
          fileName: '关联隐患作业情况',
        }
      })
      this.propertyLossOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobCategoryOptionApiFn',
        exportFnObj: {
          apiName: exportJobCategoryOptionApi,
          fileName: '作业类别',
        }
      })
      this.eventTypeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobCategoryPieOptionApiFn',
        exportFnObj: {
          apiName: exportJobCategoryPieOptionApi,
          fileName: '作业类别',
        }
      })
      this.eventLevelOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobTypePieOptionApiFn',
        exportFnObj: {
          apiName: exportJobTypePieOptionApi,
          fileName: '作业日类型',
        }
      })
    },
    getApiData() {
      let apiData = {
        ...this.formInline,
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
    // 作业情况总览-api
    getOperationOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getOperationOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            // console.log(xAxisData, series, legendData);
            this.injuryOption.xAxis[0].data = cloneDeep(xAxisData)
            this.injuryOption.legend.data = cloneDeep(legendData)
            series.forEach(item => {
              if (item.type == 'line') {
                item.tooltip = {
                  valueFormatter: function (value) {
                    return value + " %";
                  }
                }
              }
            })
            this.injuryOption.series = cloneDeep(series)
          } else {
            this.injuryOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 关联隐患-api
    getAssociationOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getAssociationOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            // console.log(xAxisData, series, legendData);
            this.associationOption.xAxis[0].data = cloneDeep(xAxisData)
            this.associationOption.legend.data = cloneDeep(legendData)
            series.forEach(item => {
              if (item.type == 'line') {
                item.tooltip = {
                  valueFormatter: function (value) {
                    return value + " %";
                  }
                }
              }
            })
            this.associationOption.series = cloneDeep(series)
          } else {
            this.associationOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 作业类别-api
    getJobCategoryOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getJobCategoryOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            this.propertyLossOption.xAxis[0].data = cloneDeep(xAxisData)
            this.propertyLossOption.legend.data = cloneDeep(legendData.filter(item => item != '总数'))
            console.log(series,'seriesseriesseriesseries')
            const list = cloneDeep(series.filter(item => item.name != '总数'))
            this.propertyLossOption.series = list || []
            // this.propertyLossOption.series[6].data[0] = 99
            this.propertyLossOption.tooltip.className = 'echarts-tooltip-diy'
            this.propertyLossOption.tooltip.formatter = (parmas) => {
              const num=parmas[0].data+parmas[1].data+parmas[2].data+parmas[3].data+parmas[4].data+parmas[5].data+parmas[6].data+parmas[7].data+parmas[8].data+parmas[9].data
              let str = `<div><span class='echartsTipTitle'>${parmas[0].axisValue}</span><span>总数:    ${num}</span></div>`
              parmas?.forEach((item) => {
                if (item.seriesName != '总数') {
                  if (item.seriesName == '动火作业') {
                    str += `<div class='diyItem'><span class='itemRadio dh'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '高处作业') {
                    str += `<div class='diyItem'><span class='itemRadio gk'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '起重作业') {
                    str += `<div class='diyItem'><span class='itemRadio dz'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '有限空间作业') {
                    str += `<div class='diyItem'><span class='itemRadio yx'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '临时用电') {
                    str += `<div class='diyItem'><span class='itemRadio ls'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '动土作业') {
                    str += `<div class='diyItem'><span class='itemRadio dt'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '其他') {
                    str += `<div class='diyItem'><span class='itemRadio qt'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '重装备作业') {
                    str += `<div class='diyItem'><span class='itemRadio zz'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '盲板抽堵') {
                    str += `<div class='diyItem'><span class='itemRadio mb'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  } else if (item.seriesName == '断路作业') {
                    str += `<div class='diyItem'><span class='itemRadio dl'></span><span class='itemName'>${item.seriesName}</span><span>${item.data}</span></div>`
                  }
                }
              })
              return str
            }
          } else {
            this.propertyLossOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 作业类别-饼图-api
    getJobCategoryPieOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getJobCategoryPieOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          this.eventTypeOption.series[0].data = cloneDeep(ajaxData)
        })
        .catch(errr => { })
    },
    // 作业日类型-饼图-api
    getJobTypePieOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getJobTypePieOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          this.eventLevelOption.series[0].data = cloneDeep(ajaxData)
        })
        .catch(errr => { })
    },
    // echarts数据导出-api
    exportEchartsDataFn(apiName, fileName) {
      let apiData = {
        ...this.getApiData(),
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
        this.getOperationOptionApiFn(),
        this.getAssociationOptionApiFn(),
        this.getJobCategoryOptionApiFn(),
        this.getJobCategoryPieOptionApiFn(),
        this.getJobTypePieOptionApiFn(),
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
::v-deep .echarts-tooltip-diy {
  // background-color: red !important;
  width: 150px;
}

::v-deep .diyItem {
  width: 100%;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

::v-deep .echartsTipTitle {
  margin-right: 10px;
}

::v-deep .itemRadio {
  width: 10px;
  height: 10px;
  // background-color: red;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
::v-deep .dh{
  background-color: #5470c6;
}
::v-deep .gk{
  background-color: #91cc75;
}
::v-deep .dz{
  background-color: #fac858;
}
::v-deep .yx{
  background-color: #ee6666;
}
::v-deep .ls{
  background-color: #73c0de;
}
::v-deep .dt{
  background-color: #3ba272;
}
::v-deep .qt{
  background-color: #FC8453 ;
}
::v-deep .zz{
  background-color: #9A60B4 ;
}
::v-deep .mb{
  background-color: #EA7CCC ;
}
::v-deep .dl{
  background-color: #5470C6 ;
}
::v-deep .itemName {
  width: 100px;
}
</style>