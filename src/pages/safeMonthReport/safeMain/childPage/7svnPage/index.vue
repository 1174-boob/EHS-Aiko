<template>
  <div>
    <PageTitle>外协厂商培训报告</PageTitle>
    <!-- 外协厂商培训报告 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="imergencyList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsSafe">
          <vxe-column v-if="item.dataIndex === 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex == 'total'">{{row.lastTotal}}</span>
              <span v-else>{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <div class="echarts-style">
      培训厂商数据分析 同比
      <Echarts :option="echartFst" />
    </div>
    <div class="echarts-style">
      培训厂商数据分析 环比
      <Echarts :option="echartSnd" />
    </div>
    <div class="echarts-style">
      培训外协人员数据分析 同比
      <Echarts :option="echartTrd" />
    </div>
    <div class="echarts-style">
      培训外协人员数据分析 环比
      <Echarts :option="echartFor" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headOutSourceTrainDetail, analysisOutSourceTrainDetailHeadAnalysis } from '@/services/safeMonth'
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import dictionary from '@/utils/newDictionary'
import { cloneDeep, debounce } from "lodash";
export default {
  mixins: [dataAnalysis],
  components: { Echarts },
  props: {
    searchData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      columnsSafe: [],
      imergencyList: [],
      columnDataList: [
        { typeName: '外协厂商总数', typeKey: 1},
        { typeName: '当月培训厂商数', typeKey: 2 },
        { typeName: '当月培训人数', typeKey: 3 },
        { typeName: '当年累计培训人数', typeKey: 4 },
        { typeName: '当年月平均培训人数', typeKey: 5 },
      ],
      echartFst: {
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
      echartSnd: {
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
      echartTrd: {
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
      echartFor: {
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
    }
  },
  mounted() {
    this.searchTable();
  },
  computed: {
    // 事故类型
    drillTypeOptions() {
      return dictionary('drill_type')
    },
    // 组织现地机构
    corporationList() {
      return this.$store.state.setting.corporationList
    },
  },
  methods: {
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (!['drillType'].includes(column.property)) {
        return 'normal-th'
      }
      return ''
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (['drillType'].includes(column.property)) {
        return 'bold-td'
      }
      return ''
    },
    async searchTable() {
      this.searchEchart('1', '1');
      this.searchEchart('2', '1');
      this.searchEchart('1', '2');
      this.searchEchart('2', '2');
      const { data } = await headOutSourceTrainDetail(this.searchData);
      if(data) {
        // 定义表头
        this.columnsSafe = this.corporationList.map( item => {
          return {
            title: item.orgAbbrName,
            dataIndex: item.corporationId,
            width: 80,
            align: 'center'
          }
        })
        // 在表头和尾插入项目 & 合计
        this.columnsSafe.unshift({
          title: '项目',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsSafe.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        // 最后将表格数据渲染到月、年、年均的每条数据中
        if(data && data.length > 0) {
          let imergencyList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            data.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.outCompanyTotal
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.outCompanyTrain
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.monthTrain
              }
              if(mapIndex.titleIndex == 4) {
                mapIndex[_item.corporationId] = _item.totalTrain
              }
              if(mapIndex.titleIndex == 5) {
                mapIndex[_item.corporationId] = _item.averageTrain
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.imergencyList = imergencyList;
        } else {
          this.imergencyList = [];
        }
      }
    },
    async searchEchart(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId }),
        analysisType: analysisType,
        infoType: infoType
      }
      return analysisOutSourceTrainDetailHeadAnalysis(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            false,
            "formInlineTwoObj"
          );
          let xAxisData = ajaxData.map(item => item.xdata)
          xAxisData = xAxisData.map(item => {  //x轴为组织
            let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
            return orgAbbrName ? orgAbbrName : item
          })
        //   this.echartFst.xAxis[0].data = cloneDeep(xAxisData);
        //   this.echartFst.legend.data = cloneDeep(legendData);
        //   this.echartFst.series = cloneDeep(series);
        // } else {
        //   this.echartFst.series = [];
          if(analysisType == '1' && infoType == '1') {
            this.echartFst.xAxis[0].data = cloneDeep(xAxisData);
            this.echartFst.legend.data = cloneDeep(legendData);
            this.echartFst.series = cloneDeep(series);
          } else if(analysisType == '2' && infoType == '1') {
            this.echartSnd.xAxis[0].data = cloneDeep(xAxisData);
            this.echartSnd.legend.data = cloneDeep(legendData);
            this.echartSnd.series = cloneDeep(series);
          } else if(analysisType == '1' && infoType == '2') {
            this.echartTrd.xAxis[0].data = cloneDeep(xAxisData);
            this.echartTrd.legend.data = cloneDeep(legendData);
            this.echartTrd.series = cloneDeep(series);
          } else if(analysisType == '2' && infoType == '2') {
            this.echartFor.xAxis[0].data = cloneDeep(xAxisData);
            this.echartFor.legend.data = cloneDeep(legendData);
            this.echartFor.series = cloneDeep(series);
          }
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .echarts-style {
    margin-top: 40px;
    height: 400px;
  }
</style>