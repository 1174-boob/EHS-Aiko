<template>
  <div>
    <PageTitle>危险作业分析报告</PageTitle>
    <!-- 动火作业 -->
    <CommonTable>
      <h3>动火作业</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="fireWorkList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsDanger">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <!-- 吊装作业 -->
    <CommonTable>
      <h3>吊装作业</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="hangUpList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsDanger">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <!-- 有限空间作业 -->
    <CommonTable>
      <h3>有限空间作业</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="smallSpaceList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsDanger">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <!-- 高处作业 -->
    <CommonTable>
      <h3>高处作业</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="highWorkList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsDanger">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <!-- 临时用电作业 -->
    <CommonTable>
      <h3>临时用电作业</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tempElecList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsDanger">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <!-- 动土作业 -->
    <CommonTable>
      <h3>动土作业</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="movingList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsDanger">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
      <!-- 危险作业数据分析 -->
      危险作业数据分析同比
      <Echarts :option="echartFst" />
    </div>
    <div class="echarts-style">
      <!-- 危险作业数据分析 -->
      危险作业数据分析环比
      <Echarts :option="echartSnd" />
    </div>
    <div class="echarts-style">
      <!-- 危险作业数据分析 -->
      危险作业数据分析
      <Echarts :option="echartTrd" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headDangerAnalyseDetail, analysisMonthDangerBar, analysisMonthDangerCookie } from '@/services/safeMonth'
// import { getDangerWorkDACompareOptionApi, getOperationOptionApi } from "@/services/dataAnalysis/index.js";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { cloneDeep, debounce } from "lodash";
import dictionary from '@/utils/newDictionary'
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
      columnsDanger: [],
      fireWorkList: [],
      hangUpList: [],
      smallSpaceList: [],
      highWorkList: [],
      tempElecList: [],
      movingList: [],
      dataList: [],
      columnDataList: [
        { typeName: '当月数量', typeKey: 1},
        { typeName: '当年累计数量', typeKey: 2 },
        { typeName: '当年月均数量', typeKey: 3 },
      ],
      echartFst: {
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
      echartSnd: {
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
      echartTrd: {
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
            name: '未确认率',
          }
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
      this.searchEchart('1');
      this.searchEchart('2');
      this.searchEchartSnd();
      const { data } = await headDangerAnalyseDetail(this.searchData);
      if(data) {
        // 定义表头
        this.columnsDanger = this.corporationList.map( item => {
          return {
            title: item.orgAbbrName,
            dataIndex: item.corporationId,
            width: 80,
            align: 'center'
          }
        })
        // 在表头和尾插入项目 & 合计
        this.columnsDanger.unshift({
          title: '项目',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsDanger.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        // 从返回结果中通过危险作业类型抽取各个表格数据
        this.fireWorkList = data.filter(item=> {
          return item.operatetype == 'fire_work'
        })
        this.hangUpList = data.filter(item=> {
          return item.operatetype == 'hang_work'
        })
        this.smallSpaceList = data.filter(item=> {
          return item.operatetype == 'space_work'
        })
        this.highWorkList = data.filter(item=> {
          return item.operatetype == 'high_work'
        })
        this.tempElecList = data.filter(item=> {
          return item.operatetype == 'temp_electricity'
        })
        this.movingList = data.filter(item=> {
          return item.operatetype == 'moving'
        })
        // 最后将表格数据渲染到月、年、年均的每条数据中
        if(this.fireWorkList && this.fireWorkList.length > 0) {
          let fireWorkList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.fireWorkList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.monthNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.yearNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.averageNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.fireWorkList = fireWorkList;
        }
        if(this.hangUpList && this.hangUpList.length > 0) {
          let hangUpList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.hangUpList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.monthNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.yearNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.averageNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.hangUpList = hangUpList;
        }
        if(this.smallSpaceList && this.smallSpaceList.length > 0) {
          let smallSpaceList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.smallSpaceList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.monthNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.yearNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.averageNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.smallSpaceList = smallSpaceList;
        }
        if(this.highWorkList && this.highWorkList.length > 0) {
          let highWorkList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.highWorkList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.monthNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.yearNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.averageNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.highWorkList = highWorkList;
        }
        if(this.tempElecList && this.tempElecList.length > 0) {
          let tempElecList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.tempElecList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.monthNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.yearNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.averageNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.tempElecList = tempElecList;
        }
        if(this.movingList && this.movingList.length > 0) {
          let movingList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.movingList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.monthNum
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.yearNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.averageNum
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.movingList = movingList;
        }
      } else {
        this.fireWorkList = [];
        this.hangUpList = [];
        this.smallSpaceList = [];
        this.highWorkList = [];
        this.tempElecList = [];
        this.movingList = [];
      }
    },
    async searchEchart(analysisType, infoType) {
      let apiData = {
        // monthTime: this.searchData.reportDate + '-01',
        // dataSource: '1',
        // compType: analysisType

        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId }),
        // mouthTime: this.searchData.reportDate + '-01',
        // mouthTime: this.searchData.reportDate,
        // dataSource: '1',
        analysisType: analysisType
      }
      return analysisMonthDangerBar(apiData).then((res) => {
        console.log(res)
        // return
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { series, legendData } = this.barDataHandle(
            ajaxData,
            false,
            false,
            "formInlineTwoObj"
          );
          let xAxisData = ajaxData.map(item => item.xdata)
          xAxisData = xAxisData.map(item => {  //x轴为组织
            let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
            return orgAbbrName ? orgAbbrName : item
          })
          if(analysisType == '1') {
            this.echartFst.xAxis[0].data = cloneDeep(xAxisData);
            this.echartFst.legend.data = cloneDeep(legendData);
            this.echartFst.series = cloneDeep(series);
          } else if(analysisType == '2') {
            this.echartSnd.xAxis[0].data = cloneDeep(xAxisData);
            this.echartSnd.legend.data = cloneDeep(legendData);
            this.echartSnd.series = cloneDeep(series);
          }
        } else {
          this.echartFst.series = [];
        }
      });
    },
    async searchEchartSnd() {
      let apiData = {
        // startTime: this.searchData.reportDate + '-01',
        // endTime: this.searchData.reportDate + '-30',
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      return analysisMonthDangerCookie(apiData)
        .then(res => {
          let ajaxData = res.data || []
          if (ajaxData && ajaxData.length) {
            let { series, legendData } = this.barDataHandle(ajaxData, true, false)
            let xAxisData = ajaxData.map(item => item.xdata)
            xAxisData = xAxisData.map(item => {  //x轴为组织
              let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
              return orgAbbrName ? orgAbbrName : item
            })
            this.echartTrd.xAxis[0].data = cloneDeep(xAxisData)
            this.echartTrd.legend.data = cloneDeep(legendData)
            this.echartTrd.series = cloneDeep(series)
          } else {
            this.echartTrd.series = []
          }
        })
        .catch(errr => { })
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