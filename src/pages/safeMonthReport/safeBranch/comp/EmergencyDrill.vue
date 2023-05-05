<!--应急演练分析--> 
<template>
  <div>
    <h3><i></i>应急演练分析报告</h3>
    <CommonTable>
      <!-- <a-table bordered :columns="columes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="tableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" :merge-cells="mergeCells"
      border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableData">
        <template v-for="(item) in columes">
          <vxe-column :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex === 'type'"> {{ row[item.dataIndex] | userFilter('drill_type')}}</span>
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
    </CommonTable>
    <h3><i></i>数据分析</h3>
    <a-row class="chart-container">
      <div class="chart-card">
        <h3>应急演练情况总览</h3>
        <div class="echarts-style">
          <Echarts :key="keyCodeA" :option="optionA" />
        </div>
      </div>
      <div :span="24" class="chart-card">
        <h3>应急演练类型数据</h3>
        <div class="echarts-style">
          <Echarts :key="keyCodeB" :option="optionB"/>
        </div>
      </div>
      <div :span="24" class="chart-card">
        <h3>应急演练级别数据</h3>
        <div class="echarts-style">
          <Echarts :key="keyCodeC" :option="optionC"/>
        </div>
      </div>
      <div :span="24" class="chart-card">
        <h3>应急演练类型-计划演练</h3>
        <div class="title-right">
          <a-radio-group
            v-model="isRadioS"
            @change="changeRadio($event, 'isRadioS', 'getLevelChartsList')"
          >
            <a-radio value="1">计划演练</a-radio>
            <a-radio value="2">实际演练</a-radio>
          </a-radio-group>
        </div>
        <div class="echarts-style">
          <Echarts :key="keyCodeE" :option="optionE" />
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
import { drillAnalyseDetail } from '@/services/safeMonth'
import Echarts from "@/components/echarts/index.vue"
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js"
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js"
import { debounce, isEmpty, cloneDeep } from "lodash"
import moment from 'moment'
import cancelLoading from "@/mixin/cancelLoading";
import {
  GetStatisticsChartsOverviewBar,
  GetStatisticsChartsLeveCookie,
  GetStatisticsChartsTypeCookie,
  ExoprtStatisticsChartsTypeCookie,
  ExoprtStatisticsChartsLeveCookie,
  ExoprtStatisticsChartsLeveBar,
  GetStatisticsChartsLeveBar,
  GetStatisticsChartsTypeBar,
  ExoprtStatisticsChartsTypeBar,
  ExoprtStatisticsChartsOverviewBar,
} from "@/services/hiddenCharts.js"
import mixin from '../mixin'
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
      isRadioO: "1",
      isRadioT: "1",
      isRadioS: "1",
      keyCodeA: 0,
      keyCodeB: 0,
      keyCodeC: 0,
      keyCodeE: 0,
      formInline: {
        auditTime: [
          moment(this.para.reportDate).startOf("month").format("YYYY-MM-DD"),
          moment(this.para.reportDate).endOf("month").format("YYYY-MM-DD"),
        ],
        prepType: 1,
        centerId: this.para.centerId,
        corporationId: this.para.corporationId
      },
      columes: [
        {
          title: '演练类型',
          dataIndex: 'type',
          width: 200,
          align: 'center'
        },
        {
          title: '计划演练次数',
          dataIndex: 'planNum',
          width: 150,
          align: 'center'
        },
        {
          title: '实际演练次数',
          dataIndex: 'trueNum',
          width: 150,
          align: 'center'
        },
        {
          title: '参演人数',
          dataIndex: 'people',
          width: 150,
          align: 'center'
        },
        {
          title: '演练主要问题点',
          dataIndex: 'problem',
          width: 300,
          align: 'center'
        },
        {
          title: '改善措施',
          dataIndex: 'betterMeasure',
          width: 300,
          align: 'center'
        },
      ],
      //应急演练情况总览
      optionA: {
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
            name: "演练次数（人）",
            alignTicks: true,
          },
          {
            type: "value",
            name: "参演人数（人）",
            alignTicks: true,
          },
        ],
        series: [],
      },

      //应急演练级别数据
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
            name: "演练次数（人）",
            alignTicks: true,
          },
          {
            type: "value",
            name: "参演人数（人）",
            alignTicks: true,
          },
        ],
        series: [],
      },
      optionC: {
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
            name: "应急演练级别",
            type: "pie",
            radius: "60%",
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },

      

      // 应急演练类型
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
            name: "应急演练类型",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            labelLine: {
              length: 5,
            },
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },
      tableData: [],
      mergeCells: [
      ],
    }
  },
  computed: {
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
  methods: {
    checkIsChanged() {
      return false
    },
    async fetchData(para) {
      this.iSearch()
      para = { ...this.para }
      const { data } = await drillAnalyseDetail(para)
      let tableData = data || []
      let lastLength = 0
      tableData.forEach((item, index) => {
        if (item.problem && item.problem.split(';').length > 1) {
          let problemArr = item.problem.split(';')
          let messureArr = item.betterMeasure ? item.betterMeasure.split(';') : '';
          this.mergeCells.push({ row: lastLength, col: 0, rowspan: problemArr.length, colspan: 1 })
          this.mergeCells.push({ row: lastLength, col: 1, rowspan: problemArr.length, colspan: 1 })
          this.mergeCells.push({ row: lastLength, col: 2, rowspan: problemArr.length, colspan: 1 })
          this.mergeCells.push({ row: lastLength, col: 3, rowspan: problemArr.length, colspan: 1 })
          problemArr.forEach((subItem, subIndex) => {
            this.tableData.push({
              ...item,
              problem: subItem,
              betterMeasure: messureArr[subIndex] || ''
            })
          })
          lastLength += problemArr.length
        } else {
          lastLength++
          this.tableData.push(item)
        }
      })
    },
    validate(cb) {
      cb(true)
    },
    reRender() {
      if (this.keyCodeA !== 0) {
        return
      }
      this.keyCodeA++
      this.keyCodeB++
      this.keyCodeC++
      this.keyCodeE++
    },
    //获取搜索参数
    getSearchObj() {
      return {
        ...this.formInline,
        //只有一个组织
        centerId: this.formInline.centerId,
        corporationId: this.formInline.corporationId,
        // isSummary: this.formInline.isSummary ? 1 : 2, //1汇总 2不汇总
        startTime: this.formInline.auditTime
          ? this.formInline.auditTime[0]
          : undefined,
        endTime: this.formInline.auditTime
          ? this.formInline.auditTime[1]
          : undefined,
        auditTime: undefined,
      };
    },
    //radio切换
    changeRadio(e, radio, thing) {
      this[radio] = e.target.value;
      this[thing]();
    },
    //应急演练情况总览
    getChartsList() {
      let apiData = this.getSearchObj();
      let obj = {
        ...apiData,
        dataSource: 1,
        prepType: 1,
        ...this.formInlinePreview,
        drillType: this.isRadioO,
      };
      return GetStatisticsChartsOverviewBar(obj).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true,
          );
          this.optionA.xAxis[0].data = cloneDeep(xAxisData);
          this.optionA.legend.data = cloneDeep(legendData);
          this.optionA.series = cloneDeep(series);
        } else {
          this.optionA.series = [];
        }
      });
    },
    //应急演练情况总览-导出
    exoprtStatisticsChartsOverviewBar() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsOverviewBar(apiData).then((res) => {
        this.spreadSheetExcel(res, "应急演练情况总览");
      });
    },

    //应急演练级别数据*
    getEmergencyList() {
      let apiData = this.getSearchObj();
      return GetStatisticsChartsLeveBar(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            false,
            true
          );
          this.optionB.xAxis[0].data = cloneDeep(xAxisData);
          this.optionB.legend.data = cloneDeep(legendData);
          this.optionB.series = cloneDeep(series);
        } else {
          this.optionB.series = [];
        }
      });
    },
    //应急演练级别数据-导出*
    exoprtStatisticsChartsLeveBar() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsLeveBar(apiData).then((res) => {
        this.spreadSheetExcel(res, "应急演练情况总览");
      });
    },
    //应急演练级别数据-饼状图*
    getCategoryChartsList() {
      let apiData = this.getSearchObj();
      return GetStatisticsChartsLeveCookie({
        ...apiData,
        drillType: this.isRadioT,
      }).then((res) => {
        if (res.data && res.data.length) {
          this.optionC.series[0].data = res.data || [];
        } else {
          this.optionC.series[0].data = [];
        }
      });
    },
    //应急演练级别数据-饼状图导出*
    exoprtStatisticsChartsLeveCookie() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsLeveCookie(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患类别");
      });
    },

    //应急演练类型-导出
    exoprtStatisticsChartsTypeBar() {
      let apiData = this.getSearchObj(true);
      ExoprtStatisticsChartsTypeBar(apiData).then((res) => {
        this.spreadSheetExcel(res, "对比分析");
      });
    },

    //应急演练类型-饼状图
    getLevelChartsList() {
      let apiData = this.getSearchObj();
      return GetStatisticsChartsTypeCookie({
        ...apiData,
        drillType: this.isRadioS,
      }).then((res) => {
        if (res.data && res.data.length) {
          this.optionE.series[0].data = res.data || [];
        } else {
          this.optionE.series[0].data = [];
        }
      });
    },
    //应急演练类型-导出
    exoprtStatisticsChartsTypeCookie() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsTypeCookie(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患级别");
      });
    },

    //汇总
    summaryChange(e) {
      if (!this.canClickBtnMixin("emergencyIsSummary")) {
        this.formInline.isSummary = false;
        return;
      }
      this.disabledCommonDept = e.target.checked;
      let { auditTime, prepType } = this.formInline;
      this.formInline = { auditTime, prepType, isSummary: e.target.checked };
      this.iSearch();
    },

    // 查询
    iSearch(openLoading = true) {
      // openLoading && this.handleLoading();
      Promise.all([
        this.getChartsList(),
        this.getEmergencyList(),
        this.getCategoryChartsList(),
        this.getLevelChartsList(),
      ])
        .then((res) => {})
        .finally(() => {
          this.cancelLoading();
        });
    },
    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.formInline = {
          auditTime: [
            moment().startOf("month").format("YYYY-MM-DD"),
            moment().endOf("month").format("YYYY-MM-DD"),
          ],
          prepType: 1,
        };
        this.iSearch();
      },
      250,
      { leading: true, trailing: false }
    ),

    
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