<template>
  <!-- 事故事件-数据统计分析 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>数据统计分析</PageTitle>
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

        <a-form-model-item label="科目">
          <a-select allowClear v-model="formInline.kemu" placeholder="请选择" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in subjectList" :key="item.subjectId" :value="item.subjectId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <!-- 科目数据分析 -->
    <div class="content-title">
      <span class="content-title-left">科目数据分析</span>
      <div class="content-title-right">
        <a-checkbox v-if="allButtonCodeList.includes('resourcepoolDA-summary')" v-model="summary" @change="summaryChange">汇总</a-checkbox>
      </div>
    </div>

    <!--表格列表 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="itemName" fixed="left" title="项目" minWidth="130"></vxe-column>
        <template v-for="(item) in columns">
          <vxe-column :key="item.type" :field="item.value" :min-width="item.minWidth?item.minWidth:120" :title="item.value">
            <template #default="{ row }">
              <span>{{ row[item.type] }}</span>
            </template>
          </vxe-column>
        </template>
        <vxe-column field="total" fixed="right" title="合计" minWidth="120"></vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>

    <template title="科目数据分析">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">科目数据分析</div>
          <div class="title-right"></div>
        </div>
        <template v-if="accountDAOption.series && accountDAOption.series.length">
          <div class="injury-Echarts">
            <Echarts :option="accountDAOption" />
          </div>
        </template>
        <template v-else>
          <a-empty class="empty-margin" />
        </template>
      </div>
    </template>

    <template title="课程场次排名">
      <div class="injury-box">
        <div class="title">
          <div class="title-left">课程场次排名</div>
          <div class="title-right"></div>
        </div>
        <template v-if="courseRankingOption.series && courseRankingOption.series.length">
          <div class="injury-Echarts">
            <Echarts :option="courseRankingOption" />
          </div>
        </template>
        <template v-else>
          <a-empty class="empty-margin" />
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
import { getResourcepoolDAColumnsApi, getAccountDAOptionApi, exportAccountDAOptionApi, getCourseRankingOptionApi, exportCourseRankingOptionApi } from "@/services/dataAnalysis/index.js";
import moment from 'moment'
import { GetSubjectlist } from "@/services/api.js";
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import { barObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
export default {
  components: { Echarts },
  mixins: [cancelLoading, chemicalDict, dataAnalysis],
  data() {
    return {
      // 表头
      columns: [],
      // 数据
      tableList: [],
      formInline: {
        auditTime: undefined,
      },
      summary: false,
      // 科目数据分析
      accountDAOption: {
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
            name: '科目数据分析(人)',
          },
          {
            type: 'value',
            name: '%',
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
      // 课程场次排名
      courseRankingOption: {
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
            name: '课程场次排名(次)',
          },
        ],
        series: []
      },
      // 科目
      subjectList: [],
    }
  },
  created() {
    this.setRouterCode("resourcepoolDA");
    // 创建时间默认当前月份
    this.formInline.auditTime = [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
    this.initOption()
  },
  mounted() {
    this.iSearch(false)
    this.getSubjectlist()
  },
  computed: {
    isSummary() {
      //1汇总 2不汇总
      let val = this.summary ? 1 : 2
      return val
    }
  },
  methods: {
    initOption() {
      this.accountDAOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getAccountDAOptionApiFn',
        exportFnObj: {
          apiName: exportAccountDAOptionApi,
          fileName: '科目数据分析',
        }
      })
      this.courseRankingOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getCourseRankingOptionApiFn',
        exportFnObj: {
          apiName: exportCourseRankingOptionApi,
          fileName: '课程场次排名',
        }
      })
    },
    // 获取科目
    getSubjectlist() {
      let apiData = {
        pageNo: "",
        pageSize: ""
      }
      GetSubjectlist(apiData)
        .then((res) => {
          this.subjectList = res.data || []
        })
        .catch((err) => {
          console.log(err);
        })
    },
    // 获取表头和数据
    getTableAndDataList() {
      let apiData = {
        ...this.getApiData()
      }
      return getResourcepoolDAColumnsApi(apiData)
        .then(res => {
          // 表头
          let columns = res.data ? res.data.columns : [];
          columns = columns.filter(item => {
            return !['itemName', 'total'].includes(item.type)
          })

          this.columns = this.matchColumnsValue(columns)
          console.log(this.columns);
          // 列表数据
          this.tableList = res.data ? res.data.tableList : [];
        })
        .catch(err => { })
    },
    // 匹配表头数据
    matchColumnsValue(columnsArr) {
      // 汇总
      if (this.summary) {  //x轴为中心
        columnsArr.forEach(item => {
          item.value = this.getMappingValue(this.setCorporationTree, "corporationCode", item.name).corporationName || item.name
        })
      } else {
        if (this.formInline.corporationId) {  //x轴为部门
          columnsArr.forEach(item => {
            item.value = this.deptCache[item.name] ? this.deptCache[item.name] : item.name
          })
        } else {
          columnsArr.forEach(item => {
            item.value = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item.name).orgAbbrName || item.name
            console.log(item.value);
          })
        }
      }
      return columnsArr
    },
    getApiData() {
      let apiData = {
        ...this.formInline,
        isSummary: this.isSummary,
        auditTime: undefined,
        startTime: this.formInline.auditTime ? this.formInline.auditTime[0] : undefined,
        endTime: this.formInline.auditTime ? this.formInline.auditTime[1] : undefined,
      }
      // 是否汇总
      apiData.centerId = this.summary ? undefined : apiData.centerId
      apiData.corporationId = this.summary ? undefined : apiData.corporationId
      return apiData
    },
    // 匹配X轴数据
    matchXAxis(xAxis) {
      let xAxisData = []
      // 汇总
      if (this.summary) {  //x轴为中心
        xAxisData = xAxis.map(item => {
          let orgAbbrName = this.getMappingValue(this.setCorporationTree, "corporationCode", item).corporationName
          return orgAbbrName ? orgAbbrName : item
        })
      } else {
        if (this.formInline.corporationId) {  //x轴为部门
          xAxisData = xAxis.map(item => {
            let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
            return orgAbbrName
          })
        } else {
          xAxisData = xAxis.map(item => {  //x轴为组织
            let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
            return orgAbbrName ? orgAbbrName : item
          })
        }
      }
      return xAxisData
    },
    // 科目数据分析-api
    getAccountDAOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getAccountDAOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            this.accountDAOption.xAxis[0].data = cloneDeep(xAxisData)
            this.accountDAOption.legend.data = cloneDeep(legendData)
            series.forEach(item => {
              if (item.type == 'line') {
                item.tooltip = {
                  valueFormatter: function (value) {
                    return value + " %";
                  }
                }
              }
            })
            this.accountDAOption.series = cloneDeep(series)
          } else {
            this.accountDAOption.series = []
          }
        })
        .catch(errr => { })
    },
    // 课程场次排名-api
    getCourseRankingOptionApiFn() {
      let apiData = {
        ...this.getApiData()
      }
      return getCourseRankingOptionApi(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { xAxisData, series, legendData } = this.barDataHandle(ajaxData, true, true)
            this.courseRankingOption.xAxis[0].data = cloneDeep(xAxisData)
            this.courseRankingOption.legend.data = cloneDeep(legendData)
            this.courseRankingOption.series = cloneDeep(series)
          } else {
            this.courseRankingOption.series = []
          }
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
        this.getTableAndDataList(),
        this.getAccountDAOptionApiFn(),
        this.getCourseRankingOptionApiFn(),
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
  margin-bottom: 40px;
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
.empty-margin {
  margin-bottom: 20px;
}
::v-deep .ant-calendar-range-picker-separator {
  transform: translateY(2px);
}
</style>