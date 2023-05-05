<template>
  <div>
    <PageTitle>隐患总结分析</PageTitle>
    <!-- 隐患级别 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="hideDangerLevel" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsLevel">
          <vxe-column v-if="item.dataIndex === 'htlevel'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex == 'total'" :style="(row.titleIndex=='htlevel_class1' && row.lastTotal && row.lastTotal !='0') && { color: 'red', fontWeight: 'bold' }">{{row.lastTotal}}</span>
              <span v-else-if="row.titleIndex == 'hideDangeTotal'">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
              <span v-else-if="row.titleIndex == 'rectifyTotal'">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
              <span v-else-if="row.titleIndex == 'rectifyPercent'" :style="row[item.dataIndex] < 1 && { color: 'red', fontWeight: 'bold' }">{{row[item.dataIndex] ? (parseFloat(row[item.dataIndex]*100).toFixed(2) + '%') : '/'}}</span>
              <span v-else :style="(row.titleIndex=='htlevel_class1' && row[item.dataIndex] && row[item.dataIndex] != '0') && { color: 'red', fontWeight: 'bold' }">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <!-- 隐患类别 -->
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="hideDangerCategory" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsType">
          <vxe-column v-if="item.dataIndex === 'httype'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex == 'total'">{{row.lastTotal}}</span>
              <span v-else-if="row.titleIndex == 'sndHideDangeTotal'">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <!-- 红线隐患汇总 -->
    <CommonTable>
      <a-table bordered :columns="columnsRed" :scroll="{ x: 800 }"  :data-source="hideDangerDetailRed" rowKey="id" :pagination="false">
        <template slot="title">红线隐患汇总</template>
        <span slot="showSite" slot-scope="text, record">{{corporationList.find(item=>{ return record.corporationId == item.corporationId }).orgAbbrName || record.corporationId}}</span>
      </a-table>
    </CommonTable>
    <!-- 一类隐患汇总 -->
    <CommonTable>
      <a-table bordered :columns="columnsTotal" :scroll="{ x: 800 }"  :data-source="hideDangerDetailFst" rowKey="id" :pagination="false">
        <template slot="title">一类隐患汇总</template>
        <span slot="showSite" slot-scope="text, record">{{corporationList.find(item=>{ return record.corporationId == item.corporationId }).orgAbbrName || record.corporationId}}</span>
      </a-table>
    </CommonTable>
    <div class="echarts-style">
      隐患数据统计同比
      <Echarts :option="echartFst" />
    </div>
    <div class="echarts-style">
      隐患数据统计环比
      <Echarts :option="echartSnd" />
    </div>
    <div class="echarts-style">
      隐患数据统计
      <Echarts :option="echartTrd" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { headHideDangerDetail, analysisMonthHideBar, analysisMonthHideCookie } from '@/services/safeMonth';
// import { GetCompChartsList, GetCategoryChartsList } from "@/services/hiddenCharts.js";
import { cloneDeep, debounce } from "lodash";
import dictionary from '@/utils/newDictionary';
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
      hideDangerDetail: [],
      columnsLevel: [],
      columnsType: [],
      columnsRed: [
        {
          title: '现地',
          dataIndex: 'corporationId',
          key: "corporationId",
          width: 180,
          scopedSlots: { customRender: "showSite" },
        },
        {
          title: '发现时间',
          dataIndex: 'findTime',
          key: "findTime",
        },
        {
          title: '隐患描述',
          dataIndex: 'dangerDetail',
          key: "dangerDetail",
        },
        {
          title: '责任部门',
          dataIndex: 'deptId',
          key: "deptId",
        },
        {
          title: '整改措施',
          dataIndex: 'measure',
          key: "measure",
        },
        {
          title: '整改进度',
          dataIndex: 'process',
          key: "process",
        },
        {
          title: '整改时间',
          dataIndex: 'rectifyDate',
          key: "rectifyDate",
        },
        {
          title: '举一反三排查',
          dataIndex: 'theLines',
          key: "theLines",
        },
      ],
      columnsTotal: [
      {
          title: '现地',
          dataIndex: 'corporationId',
          key: "corporationId",
          width: 180,
          scopedSlots: { customRender: "showSite" },
        },
        {
          title: '发现时间',
          dataIndex: 'findTime',
          key: "findTime",
        },
        {
          title: '隐患描述',
          dataIndex: 'dangerDetail',
          key: "dangerDetail",
        },
        {
          title: '责任部门',
          dataIndex: 'deptId',
          key: "deptId",
        },
        {
          title: '整改措施',
          dataIndex: 'measure',
          key: "measure",
        },
        {
          title: '整改进度',
          dataIndex: 'process',
          key: "process",
        },
        {
          title: '整改时间',
          dataIndex: 'rectifyDate',
          key: "rectifyDate",
        },
        {
          title: '举一反三排查',
          dataIndex: 'theLines',
          key: "theLines",
        },
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
      echartTrd: {
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
      hideDangerCategory: [],
      hideDangerLevel: [],
      hideDangerDetailRed: [],
      hideDangerDetailFst: [],
      totalArray: [
        { dictLabel: "隐患合计", dictValue: "hideDangeTotal" },
        { dictLabel: "整改合计", dictValue: "rectifyTotal" },
        { dictLabel: "整改率", dictValue: "rectifyPercent" },
      ],
      totalArraySnd: [
        { dictLabel: "合计", dictValue: "sndHideDangeTotal" },
      ]
    }
  },
  computed: {
    // 事故类型
    htLevelOptions() {
      return dictionary('htlevel').concat(this.totalArray)
    },
    htTypeOptions() {
      return dictionary('httype').concat(this.totalArraySnd)
    },
    drillTypeOptions() {
      return dictionary('drill_type')
    },
    // 组织现地机构
    corporationList() {
      return this.$store.state.setting.corporationList
    },
  },
  mounted() {
    this.searchTable();
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
      this.searchEchartPie();
      const { data } = await headHideDangerDetail(this.searchData);
      if(data) {
        this.hideDangerLevel = data.hideDangerLevel || [];
        this.hideDangerCategory = data.hideDangerCategory || [];
        if(!data.hideDangerDetail){
          this.hideDangerDetailRed = [];
        } else {
          this.hideDangerDetailRed = data.hideDangerDetail.filter(item=>{
            return item.hideLevel == 'redline_level'
          })
          this.hideDangerDetailFst = data.hideDangerDetail.filter(item=>{
            return item.hideLevel != 'redline_level'
          })
        }
        // this.hideDangerDetailRed = data.hideDangerDetail.filter(item=>{
        //   return item.hideLevel == 'redline_level'
        // })
        // this.hideDangerDetailFst = data.hideDangerDetail.filter(item=>{
        //   return item.hideLevel != 'redline_level'
        // })
        this.columnsLevel = this.corporationList.map( item => {
          return {
            title: item.orgAbbrName,
            dataIndex: item.corporationId,
            width: 80,
            align: 'center'
          }
        })
        this.columnsType = this.corporationList.map( item => {
          return {
            title: item.orgAbbrName,
            dataIndex: item.corporationId,
            width: 80,
            align: 'center'
          }
        })
        this.columnsLevel.unshift({
          title: '隐患级别',
          dataIndex: 'htlevel',
          width: 160,
          align: 'center',
        })
        this.columnsLevel.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        this.columnsType.unshift({
          title: '隐患类别',
          dataIndex: 'httype',
          width: 160,
          align: 'center',
        })
        this.columnsType.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        if(this.hideDangerLevel && this.hideDangerLevel.length > 0) {
          let hideDangerLevel = this.htLevelOptions.map(item=> {
            let mapIndex = {
              title: item.dictLabel,
              titleIndex: item.dictValue,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.hideDangerLevel.map(_item=> {
              if(mapIndex.titleIndex == _item.hideLevel) {
                mapIndex[_item.corporationId] = _item.quantity
              }
              if(mapIndex.titleIndex == 'rectifyTotal') {
                mapIndex[_item.corporationId] = (mapIndex[_item.corporationId] ? mapIndex[_item.corporationId] - 0 : 0) + (_item.rectify - 0);
                mapIndex.rectifyTotal = mapIndex[_item.corporationId];
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          // 循环所有现地，用每一个现地的id去匹配最终渲染list中的id key值
          // 如果匹配，则将每一个id key值相加
          // 赋值给hideDangeTotal
          // 最终，当dataIndex==hideDangeTotal时，渲染此值



          // 将最终list的第五项中的keyid拿出来与最终list的第四项的匹配keyid
          // 匹配上，则将第五项中的keyid的value除以第四项的keyid的value
          // 得出的值，给第六项的keyid中，带百分号
          this.corporationList.forEach(item => {
            let sum = 0;
            hideDangerLevel.slice(0,4).map( _item => {
              if(_item[item.corporationId] != undefined) {
                sum += (_item[item.corporationId] - 0);
              }
            })
            hideDangerLevel[4][item.corporationId] = sum;
          })
          Object.keys(hideDangerLevel[4]).forEach((key)=>{
            if(!isNaN(key-0)) {
              hideDangerLevel[4].lastTotal += (hideDangerLevel[4][key]-0);
            }
          })
          Object.keys(hideDangerLevel[5]).forEach((key)=>{
            Object.keys(hideDangerLevel[4]).forEach((_key)=>{
              if(!isNaN(key-0)) {
                if(key == _key) {
                  hideDangerLevel[6][key] = hideDangerLevel[5][key] / hideDangerLevel[4][_key]
                }
              }
            })
          })
          Object.keys(hideDangerLevel[6]).forEach((key)=>{
            if(!isNaN(key-0)) {
              hideDangerLevel[6].lastTotal = hideDangerLevel[5].lastTotal / hideDangerLevel[4].lastTotal
            }
          })
          hideDangerLevel[6].lastTotal = parseFloat(hideDangerLevel[6].lastTotal*100).toFixed(2) + '%';
          this.hideDangerLevel = hideDangerLevel;
        }
        if(this.hideDangerCategory && this.hideDangerCategory.length > 0) {
          let hideDangerCategory = this.htTypeOptions.map(item=> {
            let mapIndex = {
              title: item.dictLabel,
              titleIndex: item.dictValue,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.hideDangerCategory.map(_item=> {
              if(mapIndex.titleIndex == _item.hideType) {
                mapIndex[_item.corporationId] = _item.quantity
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })

          
          this.corporationList.forEach(item => {
            let sum = 0;
            hideDangerCategory.slice(0,hideDangerCategory.length-1).map( _item => {
              if(_item[item.corporationId] != undefined) {
                sum += (_item[item.corporationId] - 0);
              }
            })
            hideDangerCategory[hideDangerCategory.length-1][item.corporationId] = sum;
          })
          Object.keys(hideDangerCategory[hideDangerCategory.length-1]).forEach((key)=>{
            if(!isNaN(key-0)) {
              hideDangerCategory[hideDangerCategory.length-1].lastTotal += (hideDangerCategory[hideDangerCategory.length-1][key]-0);
            }
          })
          this.hideDangerCategory = hideDangerCategory;
        }
      } else {
        this.hideDangerLevel = [];
        this.hideDangerCategory = [];
        this.hideDangerDetailRed = [];
        this.hideDangerDetailFst = [];
      }
    },
    async searchEchart(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId }),
        // mouthTime: this.searchData.reportDate + '-01',
        // mouthTime: this.searchData.reportDate,
        // dataSource: '1',
        analysisType: analysisType
      }
      return analysisMonthHideBar(apiData).then((res) => {
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
    async searchEchartPie(analysisType, infoType) {
      let apiData = {
        ...this.searchData,
        corporationIdList: this.corporationList.map(item=>{ return item.corporationId })
      }
      return analysisMonthHideCookie(apiData).then((res) => {
        if (res.data && res.data.length) {
          this.echartTrd.series[0].data = res.data || [];
        } else {
          this.echartTrd.series[0].data = [];
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