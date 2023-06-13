<template>
  <!-- 虚惊未遂事件-数据统计分析 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
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

    <!-- 虚惊未遂事件情况 -->
    <div class="content-title">
      <span class="content-title-left">虚惊未遂事件情况</span>
      <div class="content-title-right">
        <!-- <a-checkbox v-if="allButtonCodeList.includes('falseAlarmDA-summary')" v-model="summary" @change="summaryChange">汇总</a-checkbox> -->
        <!-- <a-checkbox v-model="summary" @change="summaryChange">汇总</a-checkbox> -->
      </div>
    </div>

    <template title="事件类型情况">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">事件类型情况</div>
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

    <a-row>
      <a-col :span="24">
        <template title="事件类型情况(件)">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">事件类型情况(件)</div>
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
    </a-row>
  </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { getNoEventTypeBarOptionApi, exportNoEventTypeBarOptionApi, getNoEventTypePieOptionApi, exportNoEventTypePieOptionApi } from "@/services/dataAnalysis/index.js";
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
            name: '事件类型情况(件)',
          }
        ],
        series: []
      },
      // 事故类型情况
      eventTypeOption: {
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            radius: pieObj.radius,
            name: '事故事件类型',
            type: 'pie',
            data: [],
          }
        ]
      },
    }
  },
  created() {
    // 创建时间默认当前月份
    this.formInline.auditTime = [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
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
    }
  },
  methods: {
    // 初始化option
    initOption() {
      this.injuryOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getInjuryOptionApiFn',
        exportFnObj: {
          apiName: exportNoEventTypeBarOptionApi,
          fileName: '事件类型情况',
        }
      })
      this.eventTypeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getEventTypeOptionApiFn',
        exportFnObj: {
          apiName: exportNoEventTypePieOptionApi,
          fileName: '事件类型情况',
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
    // 事故事件情况-api
    getInjuryOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getNoEventTypeBarOptionApi(apiData)
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
    // 事故类型情况-api
    getEventTypeOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getNoEventTypePieOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          this.eventTypeOption.series[0].data = cloneDeep(ajaxData)
        })
        .catch(errr => { })
    },
    // echarts数据导出-api
    exportEchartsDataFn(apiName, fileName) {
      let apiData = {
        ...this.getApiData()
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
      Promise.all([this.getInjuryOptionApiFn(), this.getEventTypeOptionApiFn()])
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
      color: #000000;
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