<template>
  <div>
    <PageTitle>设备安全认证报告</PageTitle>
    <!-- 设备安全认证报告 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="dataList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsSafe">
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
      <!-- 各现地设备安全认证数量统计图 -->
      各现地设备安全认证数量统计图
      <Echarts :option="echartFst" />
    </div>
    <div class="echarts-style">
      <!-- 不合格设备数量占比 -->
      不合格设备数量占比
      <Echarts :option="echartSnd" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headDeviceCertifyDetail, analysisDeviceCertifyHeadAnalysis, analysisDeviceCertifyHeadAnalysisPie } from '@/services/safeMonth'
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
      dataList: [],
      dataAdmitList: [],
      dataNoAdmitList: [],
      columnDataList: [
        { typeName: '当月认证设备数量', typeKey: 1},
        { typeName: '认证不合格设备数量', typeKey: 2 },
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
      const { data } = await headDeviceCertifyDetail(this.searchData);
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
        // 从返回结果中通过危险作业类型抽取各个表格数据
        this.dataAdmitList = data.deviceCertifyVoList || [];
        this.dataNoAdmitList = data.deviceUnqualifiedVoList || [];
        // 最后将表格数据渲染到每条数据中
        if(this.dataAdmitList && this.dataAdmitList.length > 0) {
          let dataAdmitList = [];
          let mapIndex = {
            title: this.columnDataList[0].typeName,
            titleIndex: this.columnDataList[0].typeKey,
            lastTotal: 0,
            width: 80,
            align: 'center'
          }
          this.dataAdmitList.map(_item=> {
            mapIndex[_item.corporationId] = _item.quantity
          })
          Object.keys(mapIndex).forEach((key)=>{
            if(!isNaN(key-0)) {
              mapIndex.lastTotal += (mapIndex[key]-0);
            }
          })
          dataAdmitList.push(mapIndex)
          this.dataAdmitList = dataAdmitList;
        }
        if(this.dataNoAdmitList && this.dataNoAdmitList.length > 0) {
          let dataNoAdmitList = [];
          let mapIndex = {
            title: this.columnDataList[1].typeName,
            titleIndex: this.columnDataList[1].typeKey,
            lastTotal: 0,
            width: 80,
            align: 'center'
          }
          this.dataNoAdmitList.map(_item=> {
            mapIndex[_item.corporationId] = _item.quantity
          })
          Object.keys(mapIndex).forEach((key)=>{
            if(!isNaN(key-0)) {
              mapIndex.lastTotal += (mapIndex[key]-0);
            }
          })
          dataNoAdmitList.push(mapIndex)
          this.dataNoAdmitList = dataNoAdmitList;
        }
        this.dataList = this.dataAdmitList.concat(this.dataNoAdmitList);
      } else {
        this.dataList = [];
      }
    },
    async searchEchart(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      return analysisDeviceCertifyHeadAnalysis(apiData).then((res) => {
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
      return analysisDeviceCertifyHeadAnalysisPie(apiData).then((res) => {
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