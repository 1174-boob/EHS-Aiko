<template>
  <div>
    <PageTitle>应急演练分析报告</PageTitle>
    <!-- 应急演练分析报告 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="imergencyList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsImergency">
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
      <Echarts :option="echartFst" />
    </div>
    <div class="title">
      <div class="title-left">
        <span>应急演练类型</span>
      </div>
      <div class="title-right">
        <a-radio-group
          v-model="isRadioS"
          @change="changeRadio($event, 'isRadioS', 'searchEchartPie')"
        >
          <a-radio value="1">计划演练</a-radio>
          <a-radio value="2">实际演练</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="echarts-style">
      <Echarts :option="echartSnd" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headDrillAnalyseDetail, statisticsOverviewMonthbar, statisticsTypeMonthcookie } from '@/services/safeMonth'
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
      columnsImergency: [],
      imergencyList: [],
      columnDataList: [
        { typeName: '安全连锁总数', typeKey: 1},
        { typeName: '本月抽测数量', typeKey: 2 },
        { typeName: '抽测合格数量', typeKey: 3 },
        { typeName: '抽测合格率', typeKey: 4},
        { typeName: '当年累计抽测数量', typeKey: 5 },
        { typeName: '当年累计抽测覆盖率', typeKey: 6 },
      ],
      isRadioS: "1",
      echartFst: {
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
            name: "演练次数（次）",
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
    changeRadio(e, radio, thing) {
      this[radio] = e.target.value;
      this[thing]();
    },
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
      this.searchEchart();
      this.searchEchartPie();
      const { data } = await headDrillAnalyseDetail(this.searchData);
      if(data) {
        // 定义表头
        this.columnsImergency = this.corporationList.map( item => {
          return {
            title: item.orgAbbrName,
            dataIndex: item.corporationId,
            width: 80,
            align: 'center'
          }
        })
        // 在表头和尾插入项目 & 合计
        this.columnsImergency.unshift({
          title: '演练类型',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsImergency.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        // 最后将表格数据渲染到月、年、年均的每条数据中
        if(data && data.length > 0) {
          let imergencyList = this.drillTypeOptions.map(item=> {
            let mapIndex = {
              title: item.dictLabel,
              titleIndex: item.dictValue,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            data.map(_item=> {
              if(mapIndex.titleIndex == _item.type) {
                mapIndex[_item.corporationId] = _item.trueNum;
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
        // isSummary: 2,
        // prepType: 1,
        // dataSource: 3,
        drillType: "1",
        analysisType: analysisType,
        // drillTypeList: this.drillTypeOptions.map(item=> { return item.dictValue }),
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      return statisticsOverviewMonthbar(apiData).then((res) => {
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
          this.echartFst.xAxis[0].data = cloneDeep(xAxisData);
          this.echartFst.legend.data = cloneDeep(legendData);
          this.echartFst.series = cloneDeep(series);
        } else {
          this.echartFst.series = [];
        }
      });
    },
    async searchEchartPie(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        // isSummary: 2,
        // prepType: 1,
        // dataSource: 3,
        drillType: "1",
        analysisType: analysisType,
        // drillTypeList: this.drillTypeOptions.map(item=> { return item.dictValue }),
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      // let apiData = {
      //   ...this.searchData,
      //   corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      // }
      return statisticsTypeMonthcookie({
        ...apiData,
        drillType: this.isRadioS,
      }).then((res) => {
        if (res.data && res.data.length) {
          this.echartSnd.series[0].data = res.data || [];
        } else {
          this.echartSnd.series[0].data = [];
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
  .title {
    height: 48px;
    background: #fafbff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 12px;
    margin: 40px 0 20px 0;
    .title-left {
      font-size: 16px;
      line-height: 1.1;
      color: #000000;
      font-weight: bold;
    }
  }
  .echarts-style {
    margin-top: 40px;
    height: 400px;
  }
</style>