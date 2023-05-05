<!--外协厂商培训--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>外协厂商培训报告</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border :cell-class-name="cellClassName" :header-cell-class-name="headerCellClassName"
      show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableData">
        <template v-for="(item) in columes">
          <vxe-column v-if="item.dataIndex === 'explainNum'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row.explainNum" :maxLength="500"></a-textarea>
              <span v-else>{{row.explainNum}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <h3><i></i>数据统计</h3>
    <a-row class="chart-container">
      <div class="chart-card">
        <h3>培训厂商数据分析 同比</h3>
        <div class="echarts-style">
          <Echarts :key="keyCode1" :option="echartFst1" />
        </div>
      </div>
      <div :span="12" class="chart-card">
        <h3>培训厂商数据分析 环比</h3>
        <div class="echarts-style">
          <Echarts :key="keyCode2" :option="echartFst2" />
        </div>
      </div>
    </a-row>
    <a-row class="chart-container" style="margin-top:50px;">
      <div class="chart-card">
        <h3>培训外协人员数据分析 同比</h3>
        <div class="echarts-style">
          <Echarts :key="keyCode3" :option="echartFst3" />
        </div>
      </div>
      <div :span="12" class="chart-card">
        <h3>培训外协人员数据分析 环比</h3>
        <div class="echarts-style">
          <Echarts :key="keyCode4" :option="echartFst4" />
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
import { outSourceTrainDetail, outSourceTrainSave, outSourceTrainDetailAnalysis } from '@/services/safeMonth'
import Echarts from "@/components/echarts/index.vue"
import { outterOptions } from '../data/outterOptions'
import { outterOptions2 } from '../data/outterOptions2'
import mixin from '../mixin'
import {  debounce, cloneDeep } from 'lodash'
import moment from 'moment'
export default {
  mixins: [mixin],
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
      echartFst1: cloneDeep(outterOptions),
      echartFst2: cloneDeep(outterOptions2),
      echartFst3: cloneDeep(outterOptions),
      echartFst4: cloneDeep(outterOptions2),
      keyCode1: 0,
      keyCode2: 0,
      keyCode3: 0,
      keyCode4: 0,
      columes: [
        {
          title: '外协厂商总数',
          dataIndex: 'outCompanyTotal',
          width: 200,
          align: 'center'
        },
        {
          title: '当月培训厂商数',
          dataIndex: 'outCompanyTrain',
          width: 200,
          align: 'center'
        },
        {
          title: '当月培训人数',
          dataIndex: 'monthTrain',
          width: 200,
          align: 'center'
        },
        {
          title: '当年累计培训人数',
          dataIndex: 'totalTrain',
          width: 200,
          align: 'center'
        },
        {
          title: '当年月平均培训人数',
          dataIndex: 'averageTrain',
          width: 200,
          align: 'center'
        },
        {
          title: '当月培训人数超出月均培训人数说明',
          dataIndex: 'explainNum',
          width: 200,
          align: 'center'
        },
      ],
      tableData: []
    }
  },
  methods: {
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.outSourceTrainVos = this.tableData
      outSourceTrainSave(para)
      this.$antMessage.success('保存成功')
      this.isChanged = false
    }, 250),
    async fetchData(para) {
      para = { ...this.para }
      this.loadEchartData(para)
      const { data } = await outSourceTrainDetail(para)
      this.tableData = data || []

    },
    reRender() {
      if (this.keyCode1 !== 0) {
        return
      }
      this.keyCode1++
      this.keyCode2++
      this.keyCode3++
      this.keyCode4++
    },
    async loadEchartData(params) {
      let para = {
        ...params,
      }
      let paraArrs = [
        { para: para, analysisType: 1, infoType: 1, targetChart: this.echartFst1},
        { para: para, analysisType: 2, infoType: 1, targetChart: this.echartFst2},
        { para: para, analysisType: 1, infoType: 2, targetChart: this.echartFst3},
        { para: para, analysisType: 2, infoType: 2, targetChart: this.echartFst4},
      ]
      paraArrs.forEach(async item => {
        const { para, analysisType, infoType } = item
        let params = {
          ...para,
          analysisType,
          infoType
        }
        const { data } = await outSourceTrainDetailAnalysis(params)
        if (data) {
          item.targetChart.xAxis[0].data = (data || []).map(item => {
            return item.xdata
          })
          item.targetChart.series.forEach((item, index) => {
            data.forEach(subItem => {
              let val = subItem.list[index] || 0
              item.data.push(val)
            })
          })
        }
      })
      // const { data } = await outSourceTrainDetailAnalysis(para)
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['explainNum'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['explainNum'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    validate() {
      let flag = this.tableData.some(item => {
        return this.isEmpty(item.explainNum)
      })
      if (flag) {
        this.$antMessage.warn('请输入外协厂商培训报告 当月培训人数超出月均培训人数说明')
        return false
      }
      return true
    }
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
.chart-container{
  margin-bottom: 80px;
  display: flex;
  .chart-card{
    flex:1;
    & + .chart-card{
      margin-left:40px;
    }
  }
}
.chart-card{
  h3{
    border-bottom: 1px solid #f1f1f1;
    height: 40px;
    margin-top: 0;
    padding-left: 25px;
    line-height: 40px;
  }
  height: 400px;
  border: 1px solid #f1f1f1;
  border-radius:4px;
}
</style>