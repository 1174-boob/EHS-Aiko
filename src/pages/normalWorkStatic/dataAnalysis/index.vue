<template>
  <!-- 一般作业管理-数据统计分析 -->
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

    <!-- 一般作业情况 -->
    <div class="content-title">
      <span class="content-title-left">一般作业情况</span>
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

    <template title="防爆区域">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">防爆区域</div>
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
        <template title="防爆区域">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">防爆区域</div>
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
        <template title="施工日类型">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">施工日类型</div>
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

    <CompAnalysis />
  </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { generalOperation, generalOperationExport, explosionProofArea, explosionProofAreaExport, explosionProofAreaCookie, explosionProofAreaCookieExport, constructionDayCookie, constructionDayCookieExport } from "@/services/dataAnalysis/index.js";
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
      // 防爆区域
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
      // 防爆区域
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
            name: '防爆区域',
            type: 'pie',
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          }
        ]
      },
      // 施工日类型
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
            name: '施工日类型',
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
          apiName: generalOperationExport,
          fileName: '作业情况总览',
        }
      })
      this.propertyLossOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobCategoryOptionApiFn',
        exportFnObj: {
          apiName: explosionProofAreaExport,
          fileName: '防爆区域',
        }
      })
      this.eventTypeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobCategoryPieOptionApiFn',
        exportFnObj: {
          apiName: explosionProofAreaCookieExport,
          fileName: '防爆区域',
        }
      })
      this.eventLevelOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobTypePieOptionApiFn',
        exportFnObj: {
          apiName: constructionDayCookieExport,
          fileName: '施工日类型',
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
      return generalOperation(apiData)
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
    // 防爆区域-api
    getJobCategoryOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return explosionProofArea(apiData)
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
    // 防爆区域-饼图-api
    getJobCategoryPieOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return explosionProofAreaCookie(apiData)
        .then(res => {
          let ajaxData = res.data || []
          this.eventTypeOption.series[0].data = cloneDeep(ajaxData)
        })
        .catch(errr => { })
    },
    // 施工日类型-饼图-api
    getJobTypePieOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return constructionDayCookie(apiData)
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
</style>