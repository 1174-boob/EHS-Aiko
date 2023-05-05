<!--隐患总结分析--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>隐患统计</h3>
    <CommonTable>
        <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="hideDangerLevel" :cell-class-name="cellClassName" :headerCellClassName="headerCellClassName">
          <template v-for="(item) in hiddenColumes">
            <vxe-column v-if="['promote', 'reason'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
              <template #default="{ row }">
                <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row[item.dataIndex]" :maxLength="500"></a-textarea>
                <span v-else>{{row[item.dataIndex]}}</span>
              </template>
            </vxe-column>
            <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
              <template #default="{ row }">
                <span v-if="item.dataIndex === 'hideLevel'">{{ row.hideLevel | userFilter('htlevel') }}</span>
                <span v-else>{{ row[item.dataIndex] }}</span>
              </template>
            </vxe-column>
          </template>
          <template #empty>
            <div style="padding:16px 0;">
              <a-empty />
            </div>
          </template>
        </vxe-table>
      <!-- <a-table bordered  :columns="hiddenColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="reason" slot-scope="record" class="editable-cell">
          <a-input v-model="record.reason" />
        </div>
      </a-table> -->
    </CommonTable>
    <h3><i></i>红线隐患汇总</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="hideDangerDetail" :cell-class-name="cellClassName">
        <template v-for="(item) in redColumes">
          <vxe-column v-if="item.dataIndex === 'theLines'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row.theLines" :maxLength="500"></a-textarea>
              <span v-else>{{row.theLines}}</span>
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
    <h3><i></i>一类隐患汇总</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="hideDangerDetail2" :cell-class-name="cellClassName">
        <template v-for="(item) in redColumes">
          <vxe-column v-if="item.dataIndex === 'theLines'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row.theLines" :maxLength="500"></a-textarea>
              <span v-else>{{row.theLines}}</span>
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
      <!-- <a-table bordered :columns="firstColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
    </CommonTable>
    <h3><i></i>隐患类别统计</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableDataList" :cell-class-name="cellClassName">
        <template v-for="(item) in hiddenTypeColumes">
          <vxe-column v-if="item.dataIndex === 'plan'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input @change="handleChange" v-if="!disabled" class="editable-input" v-model="row.plan" :maxLength="30"></a-input>
              <span v-else>{{row.plan}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'reason'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row.reason" :maxLength="500"></a-textarea>
              <span v-else>{{row.reason}}</span>
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
    <h3><i></i>隐患类别占比前三隐患分析</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center"
      :row-config="{isHover: true}" :data="hideDangerCategory" :cell-class-name="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item) in threeColumes">
          <vxe-column v-if="['reason', 'measure'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row[item.dataIndex]" :maxLength="500"></a-textarea>
              <span v-else>{{row[item.dataIndex]}}</span>
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
    <h3><i></i>隐患图表统计</h3>
    <a-row class="chart-container">
      <div class="chart-card">
        <h3>隐患类别</h3>
        <div class="echarts-style">
          <Echarts :key="keyCodeD" v-if="optionD.series[0].data.length" :option="optionD" />
          <a-empty v-else class="echarts-empty" />
        </div>
      </div>
      <div :span="12" class="chart-card">
        <h3>隐患级别</h3>
        <div class="echarts-style">
          <Echarts :key="keyCodeE" v-if="optionE.series[0].data.length" :option="optionE" />
          <a-empty v-else class="echarts-empty" />
        </div>
      </div>
    </a-row>
    <a-row class="chart-container">
      <div class="chart-card">
        <h3>隐患整改情况</h3>
        <div class="echarts-style">
          <Echarts :key="keyCodeB" v-if="optionB.series.length" :option="optionB" />
          <a-empty v-else class="echarts-empty" />
        </div>
      </div>
    </a-row>
    <a-row class="chart-container">
      <div class="chart-card">
        <h3>隐患数据分析</h3>
        <!-- 对比分析 -->
        <div :class="[!optionF.series.length ? 'm-b-30' : '']">
          <div class="casualties">
            <div class="title">
              <div class="title-left">对比分析</div>
              <div class="title-right">
                隐患类别环比分析：
                <a-radio-group
                  v-model="formInlineTwoObj.compType"
                  @change="compTypeChange"
                >
                  <a-radio value="1">同比</a-radio>
                  <a-radio value="2">环比</a-radio>
                </a-radio-group>
                &nbsp;&emsp;
                <!-- <a-checkbox
                  v-model="formInlineTwoObj.isSummary"
                  @change="summaryChangeTwo"
                  >汇总</a-checkbox
                > -->
              </div>
            </div>
            <Echarts :key="keyCodeF" :option="optionF" v-if="optionF.series.length" />
            <a-empty v-else class="echarts-empty" />
          </div>
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js"
import dictionary from '@/utils/newDictionary'
import moment from 'moment'
import { monthHideDangerDetail, monthHideDangerSave } from '@/services/safeMonth'
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js"
import cancelLoading from "@/mixin/cancelLoading"
import Echarts from "@/components/echarts/index.vue"
import mixin from '../mixin'
import { debounce,  } from 'lodash'
import {
  GetChartsList,
  GetCategoryChartsList,
  GetLevelChartsList,
  GetRectificationChartsList,
  GetExceedChartsList,
  GetCompChartsList,
  ExoprtChartsList,
  ExoprtCategoryChartsList,
  ExoprtLevelChartsList,
  ExoprtRectificationChartsList,
  ExoprtExceedChartsList,
  ExoprtCompChartsList,
} from "@/services/hiddenCharts.js"
import { cloneDeep } from 'lodash'
export default {
  mixins: [cancelLoading, dataAnalysis, mixin],
  components: { Echarts },
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
      hideDangerLevel: [],
      hideDangerDetail: [],
      hideDangerDetail2: [],
      hideDangerCategory: [],
      formInline: {
        isSummary: false,
        auditTime: undefined,
        corporationId: this.para.corporationId
      },
      keyCodeB: 0,
      keyCodeD: 0,
      keyCodeE: 0,
      keyCodeF: 0,
      disabledCommonDeptTwo: false,
      hiddenColumes: [
        {
          title: '隐患级别',
          dataIndex: 'hideLevel',
          width: 200,
          align: 'center'
        },
        {
          title: '自查数量',
          dataIndex: 'quantity',
          width: 200,
          align: 'center'
        },
        {
          title: '已整改数量',
          dataIndex: 'rectify',
          width: 200,
          align: 'center'
        },
        {
          title: '整改期内隐患数',
          dataIndex: 'hiden',
          width: 200,
          align: 'center'
        },
        {
          title: '超期末整改隐患数',
          dataIndex: 'beyond',
          width: 200,
          align: 'center'
        },
        {
          title: '超期整改隐患数',
          dataIndex: 'beyondOver',
          width: 200,
          align: 'center'
        },
        {
          title: '超期末整改原因',
          dataIndex: 'reason',
          width: 200,
          align: 'center'
        },
        {
          title: '超期末整改隐患推进计划',
          dataIndex: 'promote',
          width: 200,
          align: 'center'
        },
      ],
      redColumes: [
        {
          title: '发现时间',
          dataIndex: 'findTime',
          width: 200,
          align: 'center'
        },
        {
          title: '隐患描述',
          dataIndex: 'dangerDetail',
          width: 200,
          align: 'center'
        },
        {
          title: '责任部门',
          dataIndex: 'deptId',
          width: 200,
          align: 'center'
        },
        {
          title: '整改措施',
          dataIndex: 'measure',
          width: 200,
          align: 'center'
        },
        {
          title: '整改进度',
          dataIndex: 'process',
          width: 200,
          align: 'center'
        },
        {
          title: '整改时间',
          dataIndex: 'rectifyDate',
          width: 200,
          align: 'center'
        },
        {
          title: '举一反三排查',
          dataIndex: 'theLines',
          width: 200,
          align: 'center'
        },
      ],
      hiddenTypeColumes: [
      ],
      threeColumes: [
        {
          title: '隐患类别',
          dataIndex: 'hideTypeName',
          width: 200,
          align: 'center'
        },
        {
          title: '占比（%）',
          dataIndex: 'percent',
          width: 200,
          align: 'center'
        },
        {
          title: '隐患占比高原因分析',
          dataIndex: 'reason',
          width: 200,
          align: 'center'
        },
        {
          title: '针对性改善对策',
          dataIndex: 'measure',
          width: 200,
          align: 'center'
        },
      ],
      tableDataList: [ {reason: '', plan: ''}, {reason: '', plan: '111'} ],
      formInlineTwoObj: {
        isSummary: false,
        compType: "1",
        dataSource: 1,
        mouthTime: undefined,
      },
      optionB: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
            alignTicks: true,
          },
          {
            type: "value",
            name: "整改率",
            alignTicks: true,
          },
        ],
        series: [],
      },
      optionC: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
            // axisLine: {
            //   onZero: false, //-----------重点
            // },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
          },
        ],
        series: [],
      },
      optionD: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%",
        },
        toolbox: {
          feature: {},
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "隐患类别分析",
            type: "pie",
            radius: "60%",
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },
      optionE: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%",
        },
        toolbox: {
          feature: {},
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "隐患级别分析",
            type: "pie",
            radius: "60%",
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },
      optionF: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
            alignTicks: true,
          },
          {
            type: "value",
            name: "整改率",
            alignTicks: true,
          },
        ],
        series: [],
      },
    }
  },
  computed: {
    hiddenTypeOptions() {
      return dictionary('httype')
    },
    corporationIdObj() {
        let arr = []
        let corporationIdObj = {}
        if (arr && arr.length == 1 && Array.isArray(arr[0].corporationList) && arr[0].corporationList.length == 1) {
            corporationIdObj.centerId = arr[0].corporationList[0].centerId
            corporationIdObj.corporationId = arr[0].corporationList[0].id
        }
        return corporationIdObj
    },
    corporationIdObjTwo() {
        let arr = []
        let corporationIdObj = {}
        if (arr && arr.length == 1 && Array.isArray(arr[0].corporationList) && arr[0].corporationList.length == 1) {
            corporationIdObj.centerId = arr[0].corporationList[0].centerId
            corporationIdObj.corporationId = arr[0].corporationList[0].id
        }
        return corporationIdObj
    }
  },
  mounted() {
    console.log('hidden trouble mounted')
  },
  methods: {
    findNameById(eventType) {
      return (this.hiddenTypeOptions.find(item => {
        return item.dictValue === eventType
      }) || {}).dictLabel
    },
    async fetchData(para) {
      para = { ...this.para }
      const { data } = await monthHideDangerDetail(para)
      this.hideDangerLevel = data.hideDangerLevel || []
      this.hideDangerDetail = (data.hideDangerDetail || []).filter(item => {
        return item.hideLevel === 'redline_level'
      })
      this.hideDangerDetail2 = (data.hideDangerDetail || []).filter(item => {
        return item.hideLevel === 'htlevel_class1'
      })
      this.hiddenTypeColumes = data.hideDangerCategory.map( item => {
        let title  = this.findNameById(item.hideType)
        return {
          title: title,
          dataIndex: item.hideType,
          width: 200,
          align: 'center'
        }
      })
      this.hiddenTypeColumes.unshift({
        title: '隐患类别',
        dataIndex: 'hiddenTrouble',
        width: 200,
        align: 'center'
      })
      let typeTableData = data.hideDangerCategory.reduce((prev,item) => {
        prev[item.hideType] = item.quantity
        prev.id = item.id
        prev.reportDate = item.reportDate
        return prev
      },{})
      typeTableData.hiddenTrouble = '数量'
      this.tableDataList = [typeTableData]
      //隐患类别columes
      let totalCount = (data.hideDangerCategory || []).reduce((prev, item)=>{
        prev = prev + (+item.quantity || 0)
        return prev
      }, 0)
      let hideDangerCategory = (data.hideDangerCategory || []).map(item => {
        return {
          ...item,
          percent: (item.quantity / totalCount * 100).toFixed(2) + '%',
          hideTypeName: this.findNameById(item.hideType)
        }
      })
      hideDangerCategory.sort((a,b) => {
        return (+b.quantity) - (+a.quantity)
      })
      hideDangerCategory = hideDangerCategory.filter((item, index) => {
        return index < 3
      })
      this.hideDangerCategory = hideDangerCategory
      this.dealChart()
      this.voluntarily()
    },
    voluntarily(){
      this.hideDangerLevel.forEach(item => {
        if (item.beyond == 0){
          item.reason = '-'
          item.promote = '-'
        }
      })
    },
    dealChart() {
      this.formInline.auditTime = [
        moment().startOf("month").format("YYYY-MM-DD"),
        moment().endOf("month").format("YYYY-MM-DD"),
      ];

      this.formInlineTwoObj.mouthTime = moment()
      .startOf("month")
      .format("YYYY-MM-DD");
      this.initOption()
      this.iSearch()
      this.iSearchTwo()
    },
    isEmpty(value) {
      return value === '' || value === undefined || value === null
    },
    reRender() {
      if (this.keyCodeB !== 0) {
        return
      }
      this.keyCodeB++
      this.keyCodeD++
      this.keyCodeE++
      this.keyCodeF++
    },
    validate() {
      let isEmptyReason = false
      let isEmptyPromote = false
      this.hideDangerLevel.forEach(item => {
        if (this.isEmpty(item.reason)) {
          isEmptyReason = true
        }
        if (this.isEmpty(item.promote)) {
          isEmptyPromote = true
        }
      })
      if (isEmptyReason) {
        this.$antMessage.warn('请填写隐患统计超期未整改原因')
        return false
      } else if (isEmptyPromote) {
        this.$antMessage.warn('超期末整改隐患推进计划')
        return false
      }
      let measureEmpty = false
      this.hideDangerCategory.forEach(item => {
        if (this.isEmpty(item.reason)) {
          isEmptyReason = true
        } else if (this.isEmpty(item.measure)) {
          measureEmpty = true
        }
      })
      if (isEmptyReason) {
        this.$antMessage.warn('请填写隐患类别占比前三隐患分析 隐患占比高原因分析')
        return false
      } else if (measureEmpty) {
        this.$antMessage.warn('请填写隐患类别占比前三隐患分析 针对性改善对策')
        return false
      }
      return true
    },
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.hideDangerLevel = this.hideDangerLevel || []
      para.hideDangerCategory = this.hideDangerCategory
      monthHideDangerSave(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
      console.log(para, 'para')
    }, 250),
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['reason','promote', 'theLines', 'measure'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['reason','promote', 'theLines', 'measure'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    //隐患类别-饼状图
    getCategoryChartsList() {
      let apiData = this.getSearchObj();
      return GetCategoryChartsList(apiData).then((res) => {
        if (res.data && res.data.length) {
          this.optionD.series[0].data = res.data || [];
        } else {
          this.optionD.series[0].data = [];
        }
      });
    },

    //隐患类别-导出
    exoprtCategoryChartsList() {
      let apiData = this.getSearchObj();
      ExoprtCategoryChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患类别");
      });
    },
    //隐患级别-饼状图
    getLevelChartsList() {
      let apiData = this.getSearchObj();
      return GetLevelChartsList(apiData).then((res) => {
        if (res.data && res.data.length) {
          this.optionE.series[0].data = res.data || [];
        } else {
          this.optionE.series[0].data = [];
        }
      });
    },

    //隐患级别-导出
    exoprtLevelChartsList() {
      let apiData = this.getSearchObj();
      ExoprtLevelChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患级别");
      });
    },
    //隐患整改情况-柱状
    getRectificationChartsList() {
      let apiData = this.getSearchObj();
      return GetRectificationChartsList(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true,
            'none'
          );

          this.optionB.xAxis[0].data = cloneDeep(xAxisData) || [];
          this.optionB.legend.data = cloneDeep(legendData) || [];
          this.optionB.series = cloneDeep(series) || [];
        } else {
          this.optionB.series = [];
        }
      });
    },

    //隐患整改情况-导出
    exoprtRectificationChartsList() {
      let apiData = this.getSearchObj();
      ExoprtRectificationChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患整改情况");
      });
    },
    //对比分析-柱状
    getCompChartsList() {
      let apiData = this.getSearchObj(true);
      return GetCompChartsList(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true,
            'none'
          );
          this.optionF.xAxis[0].data = cloneDeep(xAxisData) || [];
          this.optionF.legend.data = cloneDeep(legendData) || [];
          this.optionF.series = cloneDeep(series) || [];
        } else {
          this.optionF.series = [];
        }
      });
    },

    //对比分析-导出
    exoprtCompChartsList() {
      let apiData = this.getSearchObj(true);
      ExoprtCompChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "对比分析");
      });
    },

    //同比环比切换
    compTypeChange() {
      this.iSearchTwo();
    },

    //隐患对比-汇总
    summaryChange(e) {
      // if (!this.canClickBtnMixin("HiddenIsSummary")) {
      //   this.formInline.isSummary = false;
      //   return;
      // }
      this.disabledCommonDept = e.target.checked;
      // let { auditTime } = this.formInline;
      let auditTime = moment(this.para.reportDate).format('YYYY-MM')
      this.formInline = { auditTime, isSummary: e.target.checked };
      this.iSearch();
    },
    reRender() {
      this.keyCodeB ++
      this.keyCodeD ++
      this.keyCodeE ++
      this.keyCodeF ++
    },
    //对比分析-汇总
    summaryChangeTwo(e) {
      // if (!this.canClickBtnMixin("AnalysisIsSummary")) {
      //   this.formInlineTwoObj.isSummary = false;
      //   return;
      // }
      this.disabledCommonDeptTwo = e.target.checked;
      let { compType, dataSource, mouthTime } = this.formInlineTwoObj;
      this.formInlineTwoObj = {
        mouthTime: moment(this.para.reportDate).format('YYYY-MM'),
        compType,
        dataSource,
        isSummary: e.target.checked,
      };
      this.iSearchTwo();
    },
    // 查询-对比
    iSearchTwo(openLoading = true) {
      openLoading && this.handleLoadingTwo();
      Promise.all([this.getCompChartsList()])
        .then((res) => {})
        .finally(() => {
          this.cancelLoadingTwo();
        });
    },
    // 查询-隐患
    iSearch(openLoading = true) {
      openLoading && this.handleLoading();
      Promise.all([
        // this.getChartsList(),
        this.getCategoryChartsList(),
        this.getRectificationChartsList(),
        this.getExceedChartsList(),
        this.getLevelChartsList(),
      ])
        .then((res) => {})
        .finally(() => {
          this.cancelLoading();
        });
    },
    //获取搜索参数
    getSearchObj(twoSearch) {
      if (twoSearch) {
        //虚线以下搜索 对比分析搜索
        return {
          ...this.formInlineTwoObj,
          isSummary: this.formInlineTwoObj.isSummary ? 1 : 2, //1汇总 2不汇总
          mouthTime: this.para.reportDate
            ? moment(this.para.reportDate).format('YYYY-MM-DD')
            : undefined,
          centerId: this.para.centerId,
          corporationId: this.para.corporationId,
        };
      } else {
        return {
          ...this.formInline,
          isSummary: this.formInline.isSummary ? 1 : 2, //1汇总 2不汇总
          centerId: this.para.centerId,
          corporationId: this.para.corporationId,
          mouthTime: this.para.reportDate
            ? moment(this.para.reportDate).format('YYYY-MM-DD')
            : undefined,
          startTime: moment(this.para.reportDate).startOf('month').format('YYYY-MM-DD'),
          endTime: moment(this.para.reportDate).endOf("month").format("YYYY-MM-DD"),
          auditTime: undefined,
        };
      }
    },
     //隐患超期情况-柱状
    getExceedChartsList() {
      // let apiData = this.getSearchObj();
      let para = {
        corporationId: this.para.corporationId,
        centerId: this.para.centerId,
        startTime: moment(this.para.reportDate).startOf('month').format('YYYY-MM-DD'),
        endTime: moment(this.para.reportDate).endOf("month").format("YYYY-MM-DD"),
      }
      return GetExceedChartsList(para).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            false,
            true,
            'none'
          );
          this.optionC.xAxis[0].data = cloneDeep(xAxisData);
          this.optionC.legend.data = cloneDeep(legendData);
          this.optionC.series = cloneDeep(series);
        } else {
          this.optionC.series = [];
        }
      });
    },

    //隐患超期情况-导出
    exoprtExceedChartsList() {
      // let apiData = this.getSearchObj();
      let para = {
        corporationId: this.para.corporationId,
        centerId: this.para.centerId,
        startTime: moment(this.para.reportDate).startOf('month').format('YYYY-MM-DD'),
        endTime: moment(this.para.reportDate).endOf("month").format("YYYY-MM-DD"),
      }
      ExoprtExceedChartsList(para).then((res) => {
        this.spreadSheetExcel(res, "隐患超期情况");
      });
    },
    // 初始化option
    initOption() {
      //隐患整改情况
      this.optionB.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getRectificationChartsList",
        exportFnObj: {
          fnName: "exoprtRectificationChartsList",
          apiName: ExoprtRectificationChartsList,
        },
      });
      //隐患类别
      this.optionD.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getCategoryChartsList",
        exportFnObj: {
          fnName: "exoprtCategoryChartsList",
          apiName: ExoprtCategoryChartsList,
        },
      });
      this.optionE.toolbox.feature = this.getFeatureMixin({
        //隐患级别
        refreshFnName: "getLevelChartsList",
        exportFnObj: {
          fnName: "exoprtLevelChartsList",
          apiName: ExoprtLevelChartsList,
        },
      });
      //对比分析
      this.optionF.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getCompChartsList",
        exportFnObj: {
          fnName: "exoprtCompChartsList",
          apiName: ExoprtCompChartsList,
        },
      });
    },
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
.casualties {
  width: 100%;
  height: 350px;
}
  .editable-cell{
    /deep/.ant-input, .ant-select-selection{
      border:none;
    }
  }
  .chart-container{
    display: flex;
    .chart-card{
      flex:1;
      & + .chart-card{
        margin-left:40px;
      }
    }
  }
  .title {
  height: 48px;
  background: #fafbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 12px;
  margin: 40px 0 30px 0;
  .title-left {
    font-size: 16px;
    line-height: 1.1;
    color: #000000;
    font-weight: bold;
  }
}
  .chart-card{
    h3{
      border-bottom: 1px solid #f1f1f1;
      height: 40px;
      margin-top: 0;
      padding-left: 25px;
      line-height: 40px;
    }
    height: 400px;
    border: 1px solid #f1f1f1;
    border-radius:4px;
  }
</style>