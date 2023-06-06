<template>
  <div>
    <PageTitle>报警数据分析</PageTitle>
    <!-- 火警报警 -->
    <CommonTable>
      <DashBtn>
        <div>
          <a-button type="dashed" v-if="!isPreviewType" @click="saveData">保存</a-button>
        </div>
      </DashBtn>
      <h3>火警报警</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="fireList" :cell-class-name="cellClassName" :header-cell-class-name="headerCellClassName">
        <template v-for="(item, index) in columnsCommon">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex == 'total'" :style="(row.titleIndex=='2' && row.lastTotal && row.lastTotal != '0') && { color: 'red', fontWeight: 'bold' }">{{row.lastTotal}}</span>
              <span v-else :style="(row.titleIndex=='2' && row[item.dataIndex] && row[item.dataIndex] != '0') && { color: 'red', fontWeight: 'bold' }">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <!-- TGMS系统报警 -->
    <CommonTable>
      <h3>TGMS系统报警</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tgmsList" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in columnsCommon">
          <vxe-column v-if="item.dataIndex == 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex == 'total'" :style="(row.titleIndex=='2' && row.lastTotal && row.lastTotal != '0') && { color: 'red', fontWeight: 'bold' }">{{row.lastTotal}}</span>
              <span v-else :style="(row.titleIndex=='2' && row[item.dataIndex] && row[item.dataIndex] != '0') && { color: 'red', fontWeight: 'bold' }">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <!-- 真实报警汇总 -->
    <CommonTable>
      <h3>真实报警汇总</h3>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="realList" :cell-class-name="cellClassName">
        <template v-for="(item, index) in columnsReal">
          <vxe-column v-if="item.dataIndex === 'corporationId'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{ corporationList.find(item=>{ return row.corporationId == item.orgId }).orgName || row.corporationId }}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'deptId'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{ deptCache[row.deptId] }}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'reason'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="isPreviewType">{{row.reason}}</span>
              <a-input v-else class="editable-textarea" v-model="row.reason"></a-input>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'measure'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="isPreviewType">{{row.reason}}</span>
              <a-input v-else class="editable-input" v-model="row.measure"></a-input>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'theLines'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="isPreviewType">{{row.reason}}</span>
              <a-input v-else class="editable-input" v-model="row.theLines"></a-input>
            </template>
          </vxe-column>
          <vxe-column v-else :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <div class="echarts-style">
      <!-- 火警报警分析 -->
      火警报警分析同比
      <Echarts :option="echartFst" />
    </div>
    <div class="echarts-style">
      <!-- 火警报警分析 -->
      火警报警分析环比
      <Echarts :option="echartSnd" />
    </div>
    <div class="echarts-style">
      <!-- TGMS系统报警分析 -->
      TGMS系统报警分析同比
      <Echarts :option="echartTrd" />
    </div>
    <div class="echarts-style">
      <!-- TGMS系统报警分析 -->
      TGMS系统报警分析环比
      <Echarts :option="echartFor" />
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { headAlarmDetail, headSaveAlarm, analysisAlarmHeadAnalysis } from '@/services/safeMonth'
import { cloneDeep, debounce } from "lodash";
export default {
  mixins: [dataAnalysis],
  components: { Echarts },
  props: {
    searchData: {
      type: Object,
      default: {}
    },
    isPreviewType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columnsCommon: [],
      columnsReal: [
        {
          title: '所属组织',
          dataIndex: 'corporationId',
          width: 200,
          align: 'center'
        },
        {
          title: '系统',
          dataIndex: 'sysCode',
          width: 200,
          align: 'center'
        },
        {
          title: '报警时间',
          dataIndex: 'alarmTime',
          width: 200,
          align: 'center'
        },
        {
          title: '警情描述',
          dataIndex: 'alarmDesc',
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
          title: '原因分析',
          dataIndex: 'reason',
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
          title: '举一反三排查',
          dataIndex: 'theLines',
          width: 200,
          align: 'center'
        },
      ],
      fireList: [],
      tgmsList: [],
      realList: [],
      columnDataList: [
        { typeName: '虚惊报警数', typeKey: 1},
        { typeName: '真实报警数', typeKey: 2 },
        { typeName: '报警总数', typeKey: 3 },
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
            // interval: 100,
          },
          {
            type: 'value',
            name: '增长率',
            // min: 0,
            // max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
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
          {
            type: 'value',
            name: '增长率',
            // min: 0,
            // max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: []
      },
      echartTrd: {
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
          {
            type: 'value',
            name: '增长率',
            // min: 0,
            // max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: []
      },
      echartFor: {
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
          {
            type: 'value',
            name: '增长率',
            // min: 0,
            // max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: []
      },
    }
  },
  computed: {
    // 组织现地机构
    corporationList() {
      return this.getCommonAddOrgnizeListAll
      // return this.$store.state.setting.corporationList
    },
  },
  mounted() {
    // 获取列表
    this.searchTable();
  },
  methods: {
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['deviceTrouble','deviceDisable', 'deviceRectify', 'attachTrouble', 'attachRectify'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    cellClassName1({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['action'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    headerCellClassName1({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['action', 'deviceTotal', 'deviceExpire', 'deviceCheck', 'attachTotal', 'deviceExpire', 'attachUnCheck'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (!['eventType'].includes(column.property)) {
        return 'normal-th'
      }
      return ''
    },
    // cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
    //   if (['eventType'].includes(column.property)) {
    //     return 'bold-td'
    //   }
    //   return ''
    // },
    async searchTable() {
      // 获取图表
      this.searchEchart('1', 'fire');
      this.searchEchart('2', 'fire');
      this.searchEchart('1', 'TGMS');
      this.searchEchart('2', 'TGMS');
      const { data } = await headAlarmDetail(this.searchData);
      if(data) {
        // 定义表头
        this.columnsCommon = this.corporationList.map( item => {
          return {
            title: item.orgName,
            dataIndex: item.orgId,
            width: 80,
            align: 'center'
          }
        })
        // 在表头和尾插入项目 & 合计
        this.columnsCommon.unshift({
          title: '项目',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsCommon.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        // 从返回结果中通过危险作业类型抽取各个表格数据
        this.fireList = data.alarmAnalyseVoList.filter(item=> {
          return item.sysCode == 'fire'
        })
        this.tgmsList = data.alarmAnalyseVoList.filter(item=> {
          return item.sysCode == 'TGMS'
        })
        this.realList = data.alarmAnalyseTrueVoList || [];
        // 最后将表格数据渲染到月、年、年均的每条数据中
        if(this.fireList && this.fireList.length > 0) {
          let fireList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.fireList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.falseAlarm
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.trueAlarm
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.alarmTotal
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.fireList = fireList;
        }
        if(this.tgmsList && this.tgmsList.length > 0) {
          let tgmsList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 80,
              align: 'center'
            }
            this.tgmsList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.falseAlarm
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.trueAlarm
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.alarmTotal
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.tgmsList = tgmsList;
        }
      } else {
        this.fireList = [];
        this.tgmsList = [];
        this.realList = [];
      }
    },
    async searchEchart(analysisType, infoType) {
      // dataType		
      // reportDate		
      // corporationId		
      // AnalysisType		
      // infoType		
      // corporationIdList
      let apiData = {
        ...this.searchData,
        analysisType: analysisType,
        infoType: infoType,
        corporationIdList: this.corporationList.map(item=>{ return item.orgId })
      }
      return analysisAlarmHeadAnalysis(apiData).then((res) => {
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
          if(analysisType == '1' && infoType == 'fire') {
            this.echartFst.xAxis[0].data = cloneDeep(xAxisData);
            this.echartFst.legend.data = cloneDeep(legendData);
            this.echartFst.series = cloneDeep(series);
          } else if(analysisType == '2' && infoType == 'fire') {
            this.echartSnd.xAxis[0].data = cloneDeep(xAxisData);
            this.echartSnd.legend.data = cloneDeep(legendData);
            this.echartSnd.series = cloneDeep(series);
          } else if(analysisType == '1' && infoType == 'TGMS') {
            this.echartTrd.xAxis[0].data = cloneDeep(xAxisData);
            this.echartTrd.legend.data = cloneDeep(legendData);
            this.echartTrd.series = cloneDeep(series);
          } else if(analysisType == '2' && infoType == 'TGMS') {
            this.echartFor.xAxis[0].data = cloneDeep(xAxisData);
            this.echartFor.legend.data = cloneDeep(legendData);
            this.echartFor.series = cloneDeep(series);
          }
        } else {
          this.echartFst.series = [];
          this.echartSnd.series = [];
          this.echartTrd.series = [];
          this.echartFor.series = [];
        }
      });
    },
    async saveData() {
      if(this.realList && this.realList.length > 0) {
        const result = await headSaveAlarm({ alarmAnalyseTrueVoList: this.realList });
        if(result.code == 20000) {
          this.$antMessage.success('保存成功')
        }
        // 获取列表
        this.searchTable();
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .echarts-style {
    margin-top: 40px;
    height: 400px;
  }
  .editable-cell{
    /deep/.ant-input, .ant-select-selection{
      border:none;
    }
  }
</style>