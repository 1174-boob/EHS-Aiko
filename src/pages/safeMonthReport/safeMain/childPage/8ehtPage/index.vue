<template>
  <div>
    <PageTitle>EHS培训报告</PageTitle>
    <!-- EHS培训报告 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="dataList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsEhs">
          <vxe-column v-if="item.dataIndex === 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="![1,3,5].includes(row.titleIndex) && item.dataIndex == 'total'">{{row.lastTotal}}</span>
              <span v-else-if="[5].includes(row.titleIndex) && item.dataIndex == 'total'">{{parseFloat((dataList[1].lastTotal/dataList[0].lastTotal).toFixed(4)*100) + '%'}}</span>
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
    <!-- <div class="echarts-style">
      EHS培训报告分析
      <Echarts :option="echartFst" />
    </div> -->
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import { headStaffTrainDetail, analysisStaffTrainDetailHeadAnalysis } from '@/services/safeMonth'
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
      columnsEhs: [],
      dataList: [],
      columnDataList: [
        { typeName: '培训类别', typeKey: 1},
        { typeName: '培训人数', typeKey: 2 },
        { typeName: '考核方式', typeKey: 3 },
        { typeName: '合格人数', typeKey: 4},
        { typeName: '合格率', typeKey: 5 },
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
      this.searchEchart('1', '1');
      // this.searchEchart();
      const { data } = await headStaffTrainDetail(this.searchData);
      if(data) {
        this.data = data || [];
        this.columnsEhs = this.corporationList.map( item => {
          return {
            title: item.orgName,
            dataIndex: item.orgId,
            width: 80,
            align: 'center'
          }
        })
        this.columnsEhs.unshift({
          title: '培训项目',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsEhs.push({
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
            data.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.trainType
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.trainNum
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.inspectionWay
              }
              if(mapIndex.titleIndex == 4) {
                mapIndex[_item.corporationId] = _item.qualifyNum
              }
              if(mapIndex.titleIndex == 5) {
                mapIndex[_item.corporationId] = _item.passPercent
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
        corporationIdList: this.corporationList.map(item=>{ return item.orgId }),
        analysisType: analysisType,
        infoType: infoType
      }
      return analysisStaffTrainDetailHeadAnalysis(apiData).then((res) => {
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