<!--报警数据分析--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" :loading="loading" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3>
      <i></i>报警数据分析
    </h3>
    <CommonTable>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-header-overflow
        show-overflow
        align="center"
        :row-config="{isHover: true}"
        :data="alertTableData"
        :cellClassName="cellClassName"
        :headerCellClassName="headerCellClassName"
      >
        <template v-for="(item) in alertColumes">
          <vxe-column v-if="!['alarmTotal','sysCode'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input @blur="handleInputBlur(row)" @change="handleChange" v-if="!disabled" class="editable-input" v-model="row[item.dataIndex]" :maxLength="30"></a-input>
              <span v-else>{{row[item.dataIndex]}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex === 'sysCode'">{{mapSysName[row[item.dataIndex]]}}</span>
              <span v-else>{{ row[item.dataIndex] }}</span>
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
    <h3>
      <i></i>真实报警汇总
    </h3>
    <DashBtn>
      <div v-if="!disabled">
        <a-button type="dashed" @click="addDeviceCheck()">
          <a-icon type="plus" />新增一行
        </a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="realTableData">
        <template v-for="(item) in realColumes">
          <vxe-column v-if="item.dataIndex === 'action' && !disabled" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row,rowIndex }">
              <span class="color-0067cc cursor-pointer" @click="addDeviceCheck(rowIndex)">编辑</span>
              <span class="color-ff4d4f cursor-pointer mgl-10" @click="deleteAttach(rowIndex)">删除</span>
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
    <h3>
      <i></i>虚惊报警分析
    </h3>
    <CommonTable>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-header-overflow
        show-overflow
        align="center"
        :row-config="{isHover: true}"
        :data="falseTableData"
        :cellClassName="cellClassName"
        :headerCellClassName="headerCellClassName"
      >
        <template v-for="(item) in falseColumes">
          <vxe-column v-if="item.dataIndex === 'quantity'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input @change="handleChange" @blur="handleNumberBlur(row)" v-if="!disabled" class="editable-input" v-model="row.quantity" :maxLength="30"></a-input>
              <span v-else>{{row.quantity}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="['reason', 'measure', 'evaluation'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row[item.dataIndex]" :maxLength="500"></a-textarea>
              <span v-else>{{row[item.dataIndex]}}</span>
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
      <!-- <a-table bordered :columns="falseColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="falseTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table>-->
    </CommonTable>
    <h3>
      <i></i>报警原因分析
    </h3>
    <div class="echarts-style">
      <Echarts :option="echartFst" :key="keyCode" />
    </div>

    <!-- 添加列表弹窗 -->
    <RealTableDataModel v-model="realTableDataModelshow" :editIndex="realTableDataEditIndex" :moduleList="realTableData" @changeModuleList="changeModuleList" />
  </div>
</template>

<script>
import { monthAlarmDetail, monthAlarmSave, alarmAnalysisChart } from '@/services/safeMonth'
import Echarts from "@/components/echarts/index.vue"
import { options } from '../data/alertDataOption'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import mixin from '../mixin'
import RealTableDataModel from './RealTableDataModel'
import cancelLoading from '@/mixin/cancelLoading';
import { debounce,  } from 'lodash'
export default {
  components: { Echarts, RealTableDataModel },
  mixins: [mixin, cancelLoading],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    },
    isPreviewType: {
      type: Boolean,
      default: false
    },
    para: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      realTableData: [],
      realTableDataEditIndex: -1,
      realTableDataModelshow: false,
      echartFst: cloneDeep(options),
      mapSysName: {
        fire: '火灾报警系统',
        TGMS: 'TGMS系统'
      },
      keyCode: 0,
      alertColumes: [
        {
          title: '系统',
          dataIndex: 'sysCode',
          width: 200,
          align: 'center'
        },
        {
          title: '报警总数',
          dataIndex: 'alarmTotal',
          width: 200,
          align: 'center'
        },
        {
          title: '真实报警数',
          dataIndex: 'trueAlarm',
          width: 200,
          align: 'center'
        },
        {
          title: '例行测试报警数',
          dataIndex: 'testAlarm',
          width: 200,
          align: 'center'
        },
        {
          title: '虚惊报警数',
          dataIndex: 'falseAlarm',
          width: 200,
          align: 'center'
        },
      ],
      falseColumes: [
        {
          title: '原因分类',
          dataIndex: 'reasonType',
          width: 200,
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          width: 200,
          align: 'center'
        },
        {
          title: '主要报警原因分析',
          dataIndex: 'reason',
          width: 200,
          align: 'center'
        },
        {
          title: '改善措施',
          dataIndex: 'measure',
          width: 200,
          align: 'center'
        },
        {
          title: '改善效果评价',
          dataIndex: 'evaluation',
          width: 200,
          align: 'center'
        },
      ],
      alertTableData: [],
      falseTableData: [],
      actionCol: [
        {
          title: '操作',
          dataIndex: 'action',
          width: 200,
          align: 'center'
        }
      ]
    }
  },
  computed: {
    realColumes() {
      let defaultCol = [
        {
          title: '报警时间',
          dataIndex: 'alarmTime',
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
          title: '报警描述',
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
      ]
      return this.disabled ? defaultCol : [...defaultCol, ...this.actionCol]
    },
  },
  created() {
  },
  methods: {
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      this.handleLoading()
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.alarmAnalyseVoList = this.alertTableData
      para.alarmAnalyseTrueVoList = this.realTableData
      para.alarmAnalyseFalseVoList = this.falseTableData
      monthAlarmSave(para)
        .then(res => {
          this.isChanged = false
          this.$antMessage.success('保存成功')
        })
        .finally(() => {
          this.cancelLoading()
        })
    }, 250),
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['alarmTotal', 'reasonType', 'sysCode', 'alarmDesc'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['alarmTotal', 'reasonType', 'sysCode', 'alarmTime', 'alarmDesc'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    handleInputBlur(row) {
      row.alarmTotal = +row.trueAlarm + +row.testAlarm + +row.falseAlarm
    },
    async fetchData(para) {
      para = { ...this.para }
      this.loadEchartData(para)
      const { data } = await monthAlarmDetail(para)
      this.alertTableData = data.alarmAnalyseVoList
      // console.log('查看', this.alertTableData);
      this.realTableData = data.alarmAnalyseTrueVoList
      console.log('查看data', data);
      console.log('查看data.alarmAnalyseTrueVoList', this.realTableData);

      this.falseTableData = data.alarmAnalyseFalseVoList
    },
    async loadEchartData() {
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-DD'),
        corporationId: this.para.corporationId
      }
      const { data } = await alarmAnalysisChart(para)
      if (data) {
        this.echartFst.xAxis[0].data = (data || []).map(item => {
          return item.xdata
        })
        this.echartFst.series.forEach((item, index) => {
          data.forEach(subItem => {
            let val = subItem.list[index] || 0
            item.data.push(val)
          })
        })
      }
    },
    reRender() {
      if (this.keyCode !== 0) {
        return
      }
      this.keyCode++
    },
    validate() {
      let trueAlarmEmpty = false
      let testAlarmEmpty = false
      let falseAlarmEmpty = false
      this.alertTableData.forEach(item => {
        if (this.isEmpty(item.trueAlarm)) {
          trueAlarmEmpty = true
        } else if (this.isEmpty(item.testAlarm)) {
          testAlarmEmpty = true
        } else if (this.isEmpty(item.falseAlarm)) {
          falseAlarmEmpty = true
        }
      })
      if (trueAlarmEmpty) {
        this.$antMessage.warn('请输入报警数据分析 真实报警数')
        return false
      }
      if (testAlarmEmpty) {
        this.$antMessage.warn('请输入报警数据分析 例行测试报警数')
        return false
      }
      if (falseAlarmEmpty) {
        this.$antMessage.warn('请输入报警数据分析 虚惊报警数')
        return false
      }

      let isDeptEmpty = false
      let isReasonEmpty = false
      let isMeasureEmpty = false
      let isTheLinesEmpty = false
      this.realTableData.forEach(item => {
        if (this.isEmpty(item.deptId)) {
          isDeptEmpty = true
        } else if (this.isEmpty(item.reason)) {
          isReasonEmpty = true
        } else if (this.isEmpty(item.measure)) {
          isMeasureEmpty = true
        } else if (this.isEmpty(item.theLines)) {
          isTheLinesEmpty = true
        }
      })
      if (isDeptEmpty) {
        this.$antMessage.warn('请选择真实报警汇总 责任部门')
        return false
      }
      if (isReasonEmpty) {
        this.$antMessage.warn('请选择真实报警汇总 原因分析')
        return false
      }
      if (isMeasureEmpty) {
        this.$antMessage.warn('请选择真实报警汇总 整改措施')
        return false
      }
      if (isTheLinesEmpty) {
        this.$antMessage.warn('请选择真实报警汇总 举一反三排查')
        return false
      }
      // 虚惊报警分析-数据填写校验
      let isQuantityEmpty = false
      let isEvaluationEmpty = false
      console.log(this.falseTableData);
      this.falseTableData.forEach(item => {
        if (this.isEmpty(item.quantity)) {
          isQuantityEmpty = true
        } else if (this.isEmpty(item.reason)) {
          isReasonEmpty = true
        } else if (this.isEmpty(item.measure)) {
          isMeasureEmpty = true
        } else if (this.isEmpty(item.evaluation)) {
          isEvaluationEmpty = true
        }
      })
      if (isQuantityEmpty) {
        this.$antMessage.warn('请输入虚惊报警分析 数量')
        return false
      }
      if (isReasonEmpty) {
        this.$antMessage.warn('请输入虚惊报警分析 原因分析')
        return false
      }
      if (isMeasureEmpty) {
        this.$antMessage.warn('请输入虚惊报警分析 改善措施')
        return false
      }
      if (isEvaluationEmpty) {
        this.$antMessage.warn('请输入虚惊报警分析 改善效果评价')
        return false
      }
      return true
    },
    // 添加一行
    addDeviceCheck(index) {
      this.realTableDataEditIndex = (index == 0 || index) ? index : -1
      setTimeout(() => {
        this.realTableDataModelshow = true
      });
    },
    // 删除一行
    deleteAttach(index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: () => {
          this.realTableData.splice(index, 1)
        }
      })
    },
    // 修改主要成分table数据-添加一行
    changeModuleList(moduleDataList) {
      this.realTableData = cloneDeep(moduleDataList)
    },
    handleNumberBlur(row) {
      console.log(row.quantity - 0);
      if (row.quantity - 0) {
        row.reason = row.reason == '--' ? '' : row.reason
        row.measure = row.measure == '--' ? '' : row.measure
        row.evaluation = row.evaluation == '--' ? '' : row.evaluation
      } else {
        row.reason = '--'
        row.measure = '--'
        row.evaluation = '--'
      }
    }
  }
}
</script>

<style scoped lang="less">
// .echarts-style{
//   height:400px;
// }
/deep/.mgl-10 {
  margin-left: 10px;
}
/deep/.echarts-style {
  height: 400px;
}
/deep/h3 {
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  i {
    width: 2px;
    height: 14px;
    margin-right: 5px;
    background: #0067cc;
    display: inline-block;
  }
}
</style>