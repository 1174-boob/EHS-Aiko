<template>
  <!-- 危险作业管理-数据统计分析 -->
  <div>
    <!-- 分割线 -->
    <div class="line_Div"></div>
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
        <a-form-model-item label="月份">
          <a-month-picker v-model="formInline.mouthTime" :allowClear="false" valueFormat="YYYY-MM" class="search-range-picker" format="YYYY-MM" style="width: 200px" :placeholder="'请选择'" />
        </a-form-model-item>
        <a-form-model-item label="数据集">
          <a-select v-model="formInline.dataSource" placeholder="请选择" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in datasetList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <template title="对比分析">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">对比分析</div>
          <div class="title-right">
            {{`危险作业${compType == 1 ?'同比':'环比'}分析：`}}
            <a-radio-group v-model="compType" @change="compareChange">
              <a-radio value="1">同比</a-radio>
              <a-radio value="2">环比</a-radio>
            </a-radio-group>&nbsp;&emsp;
            <!-- <a-checkbox v-model="summary" @change="summaryChange">汇总</a-checkbox> -->
          </div>
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
  </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { getDangerWorkDACompareOptionApi, exportDangerWorkDACompareOptionApi } from "@/services/dataAnalysis/index.js";
import moment from 'moment'
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import { barObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
export default {
  components: { Echarts },
  mixins: [cancelLoading, chemicalDict, dataAnalysis],
  data() {
    return {
      formInline: {
        mouthTime: undefined,
        dataSource: '1',
      },
      // 同比环比
      compType: '1',
      // 作业数量
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
            name: '作业数量',
          },
          {
            type: 'value',
            name: '增长率(%)',
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
      // 数据集
      datasetList: [
        {
          key: '1',
          value: '作业数量',
        },
        {
          key: '2',
          value: '作业类别',
        },
      ]
    }
  },
  created() {
    // 创建时间默认当前月份
    this.formInline.mouthTime = moment().startOf('month').format('YYYY-MM')
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
        refreshFnName: 'getInjuryOptionApiFn',
        exportFnObj: {
          apiName: exportDangerWorkDACompareOptionApi,
          fileName: '对比分析',
        }
      })
    },
    getApiData() {
      let apiData = {
        ...this.formInline,
        mouthTime: this.formInline.mouthTime + '-01',
        isSummary: this.isSummary,
        compType: this.compType
      }
      if (!isEmpty(this.corporationIdObj)) {
        // 是否汇总
        apiData.centerId = this.summary ? undefined : this.corporationIdObj.centerId
        apiData.corporationId = this.summary ? undefined : this.corporationIdObj.corporationId
      }
      return apiData
    },
    // 作业数量-api
    getInjuryOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getDangerWorkDACompareOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, false, true)
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
    // 同比环比
    compareChange: debounce(
      function (e) {
        let { mouthTime, dataSource } = this.formInline
        this.formInline = { mouthTime, dataSource }
        this.iSearch(false)
      },
      250,
      { leading: false, trailing: true }
    ),
    // 汇总change
    summaryChange: debounce(
      function (e) {
        this.disabledCommonDept = e.target.checked
        let { mouthTime, dataSource } = this.formInline
        this.formInline = { mouthTime, dataSource }
        this.iSearch(false)
      },
      250,
      { leading: false, trailing: true }
    ),
    iSearch(openLoading = true) {
      openLoading && this.handleLoading()
      Promise.all([
        this.getInjuryOptionApiFn(),
      ])
        .then(res => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        let { mouthTime } = this.formInline
        this.formInline = { dataSource: '1', mouthTime }
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
.line_Div {
  width: 100%;
  height: 1px;
  border-bottom: dashed 3px #ccc;
  margin: 30px 0 40px 0;
}
::v-deep .ant-empty {
  margin-bottom: 20px;
}
::v-deep .ant-calendar-range-picker-separator {
  transform: translateY(2px);
}
</style>