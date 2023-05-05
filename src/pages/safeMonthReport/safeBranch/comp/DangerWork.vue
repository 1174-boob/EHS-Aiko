<!--危险作业分析--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>危险作业分析报告</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border :cell-class-name="cellClassName" :header-cell-class-name="headerCellClassName"
      show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableData">
        <template v-for="(item) in columes">
          <vxe-column v-if="['monthNum', 'yearNum', 'averageNum'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input @blur="handleInputBlur(row)" @change="handleChange" v-if="!disabled" class="editable-input" v-model="row[item.dataIndex]" :maxLength="30"></a-input>
              <span v-else>{{row[item.dataIndex]}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'explainNum'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row.explainNum" :maxLength="500"></a-textarea>
              <span v-else>{{row.explainNum}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'operatetype'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{row.operatetype | userFilter('hazard_category')}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{ row[item.dataIndex] }}</span>
            </template>
          </vxe-column>
        </template>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
    <h3><i></i>危险作业数据分析</h3>
    <a-row class="chart-container">
      <div class="chart-card">
        <div class="echarts-style">
          <div class="title">
          <div class="title-right">
            <a-radio-group v-model="compType" @change="compareChange">
              <a-radio value="1">同比</a-radio>
              <a-radio value="2">环比</a-radio>
            </a-radio-group>&nbsp;&emsp;
            <!-- <a-checkbox v-model="summary" @change="summaryChange">汇总</a-checkbox> -->
          </div>
        </div>
          <Echarts :key="keyCode1" :option="injuryOption" />
        </div>
      </div>
      <div class="chart-card">
        <div class="echarts-style">
          <div class="title">
            危险作业类别占比
          </div>
          <Echarts :key="keyCode2" :option="eventTypeOption" />
        </div>
      </div>
      <!-- <Echarts :option="eventTypeOption" /> -->
    </a-row>
    
  </div>
</template>

<script>
import { dangerAnalyseDetail, dangerAnalyseSave } from '@/services/safeMonth'
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { getOperationOptionApi, exportOperationOptionApi, getJobCategoryOptionApi, exportJobCategoryOptionApi, getJobCategoryPieOptionApi, exportJobCategoryPieOptionApi, getJobTypePieOptionApi, exportJobTypePieOptionApi } from "@/services/dataAnalysis/index.js";
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import moment from 'moment'
import { barObj, pieObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import { cloneDeep, debounce } from 'lodash'
import dictionary from '@/utils/newDictionary'
import oldDictionary from '@/utils/dictionary'
import mixin from '../mixin'
export default {
  components: { Echarts },
  mixins: [cancelLoading, dataAnalysis ,chemicalDict, mixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    para: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formInline: {
        mouthTime: undefined,
        dataSource: '1',
        ...this.para
      },
      keyCode1: 0,
      keyCode2: 0,
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
          }
        ],
        series: []
      },
      columes: [
        {
          title: '作业类别',
          dataIndex: 'operatetype',
          width: 200,
          align: 'center'
        },
        {
          title: '当月数量',
          dataIndex: 'monthNum',
          width: 150,
          align: 'center'
        },
        {
          title: '当年累计数量',
          dataIndex: 'yearNum',
          width: 150,
          align: 'center'
        },
        {
          title: '月度平均数量',
          dataIndex: 'averageNum',
          width: 150,
          align: 'center'
        },
        {
          title: '当月作业数量超出月均数量分析',
          dataIndex: 'explainNum',
          width: 300,
          align: 'center'
        },
      ],
      // 作业类别
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
            name: '作业类别',
            type: 'pie',
            data: [],
          }
        ]
      },
      // 作业类型
      eventLevelOption: {
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
            name: '作业类型',
            type: 'pie',
            data: [],
          }
        ]
      },
      tableData: [],
      compType: '',
    }
  },
  computed: {
    // return dictionary('hazard_category')
  },
  methods: {
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.dangerOperateAnalyseVoList = this.tableData
      dangerAnalyseSave(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
    }, 250),
    async fetchData(para) {
      para = { ...this.para }
      console.log( dictionary('hazard_category'), 'dddd')
      para = { ...this.para }
      this.initOption()
      const { data } = await dangerAnalyseDetail(para)
      this.tableData = data || []
    },
    reRender() {
      if (this.keyCode1 !== 0) {
        return
      }
      this.keyCode1 ++
      this.keyCode2 ++
    },
    initOption() {
      this.injuryOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getOperationOptionApiFn',
        exportFnObj: {
          apiName: exportOperationOptionApi,
          fileName: '作业情况总览',
        }
      })
      this.eventTypeOption.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getJobCategoryPieOptionApiFn',
        exportFnObj: {
          apiName: exportJobCategoryPieOptionApi,
          fileName: '作业类别',
        }
      })
      this.getOperationOptionApiFn()
      this.getJobCategoryPieOptionApiFn()
    },
    getApiData() {
      let { centerId, corporationId } = this.para
      // 汇总
      let apiData = {
        centerId,
        corporationId,
        auditTime: undefined,
        compType: this.compType,
        dataSource: "1",
        isSummary: 2,
        mouthTime: moment(this.para.reportDate).format('YYYY-MM-DD'),
        startTime: moment(this.para.reportDate).startOf("month").format("YYYY-MM-DD"),
        endTime: moment(this.para.reportDate).endOf("month").format("YYYY-MM-DD"),
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
            this.injuryOption.xAxis[0].data = cloneDeep(xAxisData)
            this.injuryOption.legend.data = cloneDeep(legendData)
            this.injuryOption.series = cloneDeep(series)
          } else {
            this.injuryOption.series = []
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
        this.getOperationOptionApiFn()
      },
      250,
      { leading: false, trailing: true }
    ),
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['operatetype'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    handleInputBlur(row) {
      if (!this.isEmpty(row.monthNum) && !this.isEmpty(row.averageNum) && +row.monthNum > +row.averageNum) {
        this.$antMessage.warn('当月数量大于月度平均数量，请填写当月作业数量超出月均数量分析')
      }
    },
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['operatetype', 'explainNum'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    validate() {
      let monthNumEmpty = false
      let yearNumEmpty = false
      let averageNumEmpty = false
      let explainNumNeed = false
      this.tableData.forEach(item => {
        if (this.isEmpty(item.monthNum)) {
          monthNumEmpty = true
        } else if (this.isEmpty(item.yearNum)) {
          yearNumEmpty = true
        } else if (this.isEmpty(item.averageNum)) {
          averageNumEmpty = true
        } else if (+item.monthNum > +item.averageNum && this.isEmpty(item.explainNum)) {
          explainNumNeed = true
        }
      })
      if (monthNumEmpty) {
        this.$antMessage.warn('请输入危险作业分析报告 当月数量')
        return false
      }
      if (yearNumEmpty) {
        this.$antMessage.warn('请输入危险作业分析报告 当年累计数量')
        return false
      }
      if (averageNumEmpty) {
        this.$antMessage.warn('请输入危险作业分析报告 月度平均数量')
        return false
      }
      if (explainNumNeed) {
        this.$antMessage.warn('请填写危险作业分析报告 当月作业数量超出月均数量分析')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped lang="less">
/deep/.mgl-10{
  margin-left:10px;
}
/deep/.echarts-style{
  height: 400px;
}
/deep/h3{
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size:14px;
  i{
    width:2px;
    height:14px;
    margin-right:5px;
    background:#0067cc;
    display: inline-block;
  }
}
.title-right{
  text-align: right;
}
</style>