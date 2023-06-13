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
        <a-form-model-item label="提案级别">
          <a-select v-model="formInline.proposalLevel" placeholder="请选择提案级别" allowClear>
            <a-select-option v-for="item in proposalLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
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

    <template title="提案数量分析">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">提案数量分析</div>
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

    <a-row :gutter="{xl:20,xxl:30}">
      <a-col :span="24">
        <template title="提案级别分析">
          <div class="injury-box">
            <div class="title">
              <div class="title-left">提案级别分析</div>
              <div class="title-right"></div>
            </div>
            <template v-if="levelOption.series && levelOption.series.length">
              <div class="injury-Echarts">
                <Echarts :option="levelOption" :myExport="false"/>
              </div>
            </template>
            <template v-else>
              <a-empty />
            </template>
          </div>
        </template>
      </a-col>
      <a-col :span="0"></a-col>
    </a-row>
  </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { proposalAnalyse,proposalAnalyseLevel,proposalAnalyseCountDownLoad,proposalAnalyseLevelDownLoad } from "@/services/api.js";
import moment from 'moment'
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import { barObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import dictionary from "@/utils/dictionary.js";
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
      // 提案数量分析
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
            name: '(个)',
          },
        ],
        series: []
      },
      // 提案级别分析
      levelOption: {
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
            name: '(个)',
          },
        ],
        series: []
      },
    }
  },
  created() {
    this.setRouterCode("proposalAnalysis");
    // 创建时间默认当前月份
    this.formInline.auditTime = [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
    this.initOption()
    this.proposalLevel = dictionary('proposalLevel'); //提案级别 1-部门级 2-工厂级 3-基地级 4-集团级
  },
  mounted() {
    this.iSearch(false)
  },
  computed: {
    
  },
  methods: {
    iSearch(openLoading = true) {
      openLoading && this.handleLoading()
      Promise.all([
        this.getProposal(),
        this.getLevelOptionApiFn(),
      ])
        .then(res => { })
        .finally(() => {
          this.cancelLoading()
        })
    },

    initOption() {
      this.injuryOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getProposal',
        exportFnObj: {
          apiName: proposalAnalyseCountDownLoad, //导出文件的接口
          fileName: '提案数量分析',
        }
      }),
      this.levelOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getLevelOptionApiFn',
        exportFnObj: {
          apiName: proposalAnalyseLevelDownLoad, //导出文件的接口
          fileName: '提案级别分析',
        }
      })
    },
    // 提案数量分析
    getProposal() {
      let apiData = {
      ...this.getApiData()
      }
      return proposalAnalyse(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            console.log("-------vvv-",xAxisData, series, legendData);
            this.injuryOption.xAxis[0].data = cloneDeep(xAxisData)
            this.injuryOption.legend.data = cloneDeep(legendData)
            this.injuryOption.series = cloneDeep(series)
          } else {
            this.injuryOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 提案级别分析
    getLevelOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return proposalAnalyseLevel(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            const dictData = [];
            for(let item of xAxisData) {
              let value = dictionary('proposalLevel', item);
              dictData.push(value)
            }
            this.levelOption.xAxis[0].data = cloneDeep(dictData)
            this.levelOption.legend.data = cloneDeep(legendData)
            this.levelOption.series = cloneDeep(series)
          } else {
            this.levelOption.series = []
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

    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.formInline = {}
        this.iSearch(false)
      },
      250,
      { leading: true, trailing: false }
    ),
    getApiData() {
      let apiData = {
        ...this.formInline,
        startTime: this.formInline.auditTime ? this.formInline.auditTime[0] : undefined,
        endTime: this.formInline.auditTime ? this.formInline.auditTime[1] : undefined,
      }
      let list = this.getCommonAddOrgnizeList; //当前登录人的组织列表
      if (list.length == 1) {
        apiData.corporationId = list[0].orgId;
      }
      delete apiData.auditTime
      return apiData
    },
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