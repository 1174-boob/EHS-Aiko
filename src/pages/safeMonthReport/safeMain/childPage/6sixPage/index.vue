<template>
  <div>
    <PageTitle>设备安全连锁抽查分析报告</PageTitle>
    <!-- 设备安全连锁抽查分析报告 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="deviceChainVoList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsSafe">
          <vxe-column v-if="item.dataIndex === 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="[1, 2, 3, 5].includes(row.titleIndex) && item.dataIndex == 'total'">{{row.lastTotal}}</span>
              <span v-else-if="[4, 6].includes(row.titleIndex)  && item.dataIndex == 'total'">{{parseFloat((deviceChainVoList[2].lastTotal/deviceChainVoList[1].lastTotal).toFixed(4)*100) + '%'}}</span>
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
      自动计算抽测合格率
      <Echarts :option="echartFst" />
    </div>
    <div class="echarts-style">
      设备安全连锁抽查
      <Echarts :option="echartSnd" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headDeviceChainDetail, analysisDeviceChainHeadAnalysis, analysisDeviceChainHeadAnalysisPie } from '@/services/safeMonth'
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
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
      deviceChainVoList: [],
      columnDataList: [
        { typeName: '安全连锁总数', typeKey: 1},
        { typeName: '本月抽测数量', typeKey: 2 },
        { typeName: '抽测合格数量', typeKey: 3 },
        { typeName: '抽测合格率', typeKey: 4},
        { typeName: '当年累计抽测数量', typeKey: 5 },
        { typeName: '当年累计抽测覆盖率', typeKey: 6 },
      ],
      echartFst: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '1%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
          data: []
        },
        color:['#ee6666', '#fac858', '#5470c6', '#91cc75', '#73c0de'],
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              rotate: 40
            },
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
          },
        ],
        series: []
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
    }
  },
  mounted() {
    this.searchTable();
  },
  computed: {
    // 组织现地机构
    corporationList() {
      return this.$store.state.setting.corporationList
    },
  },
  methods: {
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (!['eventType'].includes(column.property)) {
        return 'normal-th'
      }
      return ''
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (['eventType'].includes(column.property)) {
        return 'bold-td'
      }
      return ''
    },
    async searchTable() {
      this.searchEchart();
      this.searchEchartPie();
      const { data } = await headDeviceChainDetail(this.searchData);
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
        if(data.deviceChainVoList && data.deviceChainVoList.length > 0) {
          let deviceChainVoList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            data.deviceChainVoList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.total
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.checkNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.qualifyNum
              }
              if(mapIndex.titleIndex == 4) {
                mapIndex[_item.corporationId] = _item.passPercent
              }
              if(mapIndex.titleIndex == 5) {
                mapIndex[_item.corporationId] = _item.yearCheckNum
              }
              if(mapIndex.titleIndex == 6) {
                mapIndex[_item.corporationId] = _item.coverage
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                if(mapIndex[key].indexOf('%') != -1) {
                  mapIndex.lastTotal = mapIndex.lastTotal + (parseFloat(mapIndex[key])-0) + '%';
                } else {
                  mapIndex.lastTotal += (parseFloat(mapIndex[key])-0);
                }
              }
            })
            return mapIndex
          })
          this.deviceChainVoList = deviceChainVoList;
        }
      } else {
        this.deviceChainVoList = [];
      }
    },
    async searchEchart(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      return analysisDeviceChainHeadAnalysis(apiData).then((res) => {
        console.log(res)
        // return
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
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      return analysisDeviceChainHeadAnalysisPie(apiData).then((res) => {
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
  .echarts-style {
    margin-top: 40px;
    height: 400px;
  }
</style>