<template>
  <div>
    <PageTitle>职业健康体检</PageTitle>
    <!-- 职业健康体检 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="dataList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsHealth">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex == 'total'" :style="(row.titleIndex=='6' && row.lastTotal && row.lastTotal != '0') && { color: 'red', fontWeight: 'bold' }">{{row.lastTotal}}</span>
              <span v-else :style="(row.titleIndex=='6' && row[item.dataIndex] && row[item.dataIndex] != '0') && { color: 'red', fontWeight: 'bold' }">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
      <!-- 职业健康体检分析 -->
      职业健康体检分析
      <Echarts :option="echartFst" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headOccupationHealthDetail, analysisOccupationHealthHeadAnalysis } from '@/services/safeMonth'
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
      columnsHealth: [],
      dataList: [],
      columnDataList: [
        { typeName: '危害岗位数', typeKey: 1},
        { typeName: '接害人数', typeKey: 2 },
        { typeName: '体检人数', typeKey: 3 },
        { typeName: '体检合格人数', typeKey: 4 },
        { typeName: '体检异常人数', typeKey: 5 },
        { typeName: '职业禁忌人数', typeKey: 6 },
        { typeName: '禁忌调岗人数', typeKey: 7 },
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
            // min: 0,
            // max: 500,
            interval: 100,
          },
          // {
          //   type: 'value',
          //   name: '整改率',
          //   // min: 0,
          //   // max: 100,
          //   interval: 20,
          //   axisLabel: {
          //     formatter: '{value} %'
          //   }
          // }
        ],
        series: []
      },
    }
  },
  mounted() {
    this.searchTable();
  },
  computed: {
    // 组织现地机构
    corporationList() {
      return this.getCommonAddOrgnizeListAll
      // return this.$store.state.setting.corporationList
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
      const { data } = await headOccupationHealthDetail(this.searchData);
      if(data) {
        this.dataList = data || [];
        this.columnsHealth = this.corporationList.map( item => {
          return {
            title: item.orgName,
            dataIndex: item.orgId,
            width: 80,
            align: 'center'
          }
        })
        this.columnsHealth.unshift({
          title: '类型',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsHealth.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        if(data && data.length > 0) {
          let dataList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.dataList.map(_item=>{
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.hazardNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.exposureHazardNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.checkNum
              }
              if(mapIndex.titleIndex == 4) {
                mapIndex[_item.corporationId] = _item.checkTrueNum
              }
              if(mapIndex.titleIndex == 5) {
                mapIndex[_item.corporationId] = _item.checkFalseNum
              }
              if(mapIndex.titleIndex == 6) {
                mapIndex[_item.corporationId] = _item.contrainNum
              }
              if(mapIndex.titleIndex == 7) {
                mapIndex[_item.corporationId] = _item.tabooNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.dataList = dataList;
        }
      } else {
        this.dataList = [];
      }
    },
    async searchEchart(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.orgId })
      }
      return analysisOccupationHealthHeadAnalysis(apiData).then((res) => {
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
            let orgName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", item).orgName
            return orgName ? orgName : item
          })
          this.echartFst.xAxis[0].data = cloneDeep(xAxisData);
          this.echartFst.legend.data = cloneDeep(legendData);
          this.echartFst.series = cloneDeep(series);
        } else {
          this.echartFst.series = [];
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