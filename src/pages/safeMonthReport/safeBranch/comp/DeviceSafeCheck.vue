<!--设备安全联锁抽查--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3>
      <i></i>设备安全联锁抽查分析报告
    </h3>
    <CommonTable>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        :cell-class-name="cellClassName"
        :header-cell-class-name="headerCellClassName"
        show-header-overflow
        show-overflow
        align="center"
        :row-config="{isHover: true}"
        :data="safeTableData"
      >
        <template v-for="(item) in safeColumes">
          <vxe-column v-if="item.dataIndex === 'remark'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea @change="handleChange" v-if="!disabled" class="editable-textarea" v-model="row.remark" :maxLength="500"></a-textarea>
              <span v-else>{{row.remark}}</span>
            </template>
          </vxe-column>
          <vxe-column
            v-else-if="['total', 'checkNum', 'qualifyNum', 'yearCheckNum'].includes(item.dataIndex)"
            :key="item.dataIndex"
            :field="item.dataIndex"
            :min-width="item.width?item.width:120"
            :title="item.title"
          >
            <template #default="{ row }">
              <a-input @change="handleChange" v-if="!disabled" @blur="handleNumberBlur(row, item.dataIndex)" class="editable-input" v-model="row[item.dataIndex]" :maxLength="30"></a-input>
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
      <!-- <a-table bordered :columns="safeColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="safeTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table>-->
    </CommonTable>
    <div v-if="testTableData && testTableData.length > 0">
      <h3>
        <i></i>测试异常情况统计
      </h3>
      <CommonTable>
        <vxe-table
          class="vxe-scrollbar beauty-scroll-fireBox"
          border
          :cell-class-name="cellClassName"
          :header-cell-class-name="headerCellClassName"
          show-header-overflow
          show-overflow
          align="center"
          :row-config="{isHover: true}"
          :data="testTableData"
        >
          <template v-for="(item) in testColumes">
            <vxe-column v-if="item.dataIndex !== 'type'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
        <!-- <a-table bordered :columns="testColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="testTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
        </a-table>-->
      </CommonTable>
    </div>
  </div>
</template>

<script>
import { deviceChainDetail, deviceChainSave } from '@/services/safeMonth'
import moment from 'moment'
import mixin from '../mixin'
import { debounce , cloneDeep } from 'lodash'
export default {
  mixins: [mixin],
  props: {
    disabled: {
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
      safeColumes: [
        {
          title: '安全联锁类型',
          dataIndex: 'type',
          width: 200,
          align: 'center'
        },
        {
          title: '总数',
          dataIndex: 'total',
          width: 150,
          align: 'center'
        },
        {
          title: '抽测数量',
          dataIndex: 'checkNum',
          width: 150,
          align: 'center'
        },
        {
          title: '抽测合格数量',
          dataIndex: 'qualifyNum',
          width: 150,
          align: 'center'
        },
        {
          title: '抽测合格率',
          dataIndex: 'passPercent',
          width: 150,
          align: 'center'
        },
        {
          title: '当年累计抽测数量',
          dataIndex: 'yearCheckNum',
          width: 150,
          align: 'center'
        },
        {
          title: '当年累计测试覆盖率',
          dataIndex: 'coverage',
          width: 150,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 300,
          align: 'remark'
        },
      ],
      testColumes: [
        {
          title: '安全联锁类型',
          dataIndex: 'type',
          width: 200,
          align: 'center'
        },
        {
          title: '安全联锁位置',
          dataIndex: 'location',
          width: 200,
          align: 'center'
        },
        {
          title: '异常描述',
          dataIndex: 'abnormalDesc',
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
          title: '整改进度',
          dataIndex: 'process',
          width: 200,
          align: 'center'
        },
      ],
      safeTableData: [
        { type: 'interlock连锁', total: '', checkNum: '', qualifyNum: '', passPercent: '', yearCheckNum: '', coverage: '', remark: '' },
        { type: '漏液Sensor', total: '', checkNum: '', qualifyNum: '', passPercent: '', yearCheckNum: '', coverage: '', remark: '' },
        { type: 'EMO/EMS', total: '', checkNum: '', qualifyNum: '', passPercent: '', yearCheckNum: '', coverage: '', remark: '' },
        { type: '安全光栅', total: '', checkNum: '', qualifyNum: '', passPercent: '', yearCheckNum: '', coverage: '', remark: '' }
      ],
      testTableData: [
        { type: 'interlock连锁', location: '', abnormalDesc: '', reason: '', process: '' },
        { type: '漏液Sensor', location: '', abnormalDesc: '', reason: '', process: '' },
        { type: 'EMO/EMS', location: '', abnormalDesc: '', reason: '', process: '' },
        { type: '安全光栅', location: '', abnormalDesc: '', reason: '', process: '' }
      ],
      bcpTableData: [],
      isShowTable: true,
    }
  },
  methods: {
    validate() {
      let totalEmpty = false
      let checkNumEmpty = false
      let qualifyNumEmpty = false
      let yearCheckNumEmpty = false
      this.safeTableData.forEach(item => {
        if (this.isEmpty(item.total)) {
          totalEmpty = true
        } else if (this.isEmpty(item.checkNum)) {
          checkNumEmpty = true
        } else if (this.isEmpty(item.qualifyNum)) {
          qualifyNumEmpty = true
        } else if (this.isEmpty(item.yearCheckNum)) {
          yearCheckNumEmpty = true
        }
      })
      if (totalEmpty) {
        this.$antMessage.warn('请输入设备安全联锁抽查分析报告 总数')
        return false
      }
      if (checkNumEmpty) {
        this.$antMessage.warn('请输入设备安全联锁抽查分析报告 抽测数量')
        return false
      }
      if (qualifyNumEmpty) {
        this.$antMessage.warn('请输入设备安全联锁抽查分析报告 抽测合格数量')
        return false
      }
      if (yearCheckNumEmpty) {
        this.$antMessage.warn('请输入设备安全联锁抽查分析报告 当年累计抽测数量')
        return false
      }

      let isLocationEmpty = false
      let isAbnormalDescEmpty = false
      let isReasonEmpty = false
      let isMeasureEmpty = false
      let isProcessEmpty = false
      this.testTableData.forEach(item => {
        if (this.isEmpty(item.location)) {
          isLocationEmpty = true
        } else if (this.isEmpty(item.abnormalDesc)) {
          isAbnormalDescEmpty = true
        } else if (this.isEmpty(item.reason)) {
          isReasonEmpty = true
        } else if (this.isEmpty(item.measure)) {
          isMeasureEmpty = true
        } else if (this.isEmpty(item.process)) {
          isProcessEmpty = true
        }
      })
      if (isLocationEmpty) {
        this.$antMessage.warn('请输入测试异常情况统计 安全联锁位置')
        return false
      }
      if (isAbnormalDescEmpty) {
        this.$antMessage.warn('请输入测试异常情况统计 异常描述')
        return false
      }
      if (isReasonEmpty) {
        this.$antMessage.warn('请输入测试异常情况统计 原因分析')
        return false
      }
      if (isMeasureEmpty) {
        this.$antMessage.warn('请输入测试异常情况统计 整改措施')
        return false
      }
      if (isProcessEmpty) {
        this.$antMessage.warn('请输入测试异常情况统计 整改进度')
        return false
      }
      return true
    },
    async fetchData(para) {
      this.bcpTableData = cloneDeep(this.testTableData)
      para = { ...this.para }
      const { data } = await deviceChainDetail(para)
      if (data) {
        if (data.deviceChainVoList && data.deviceChainVoList.length > 0) {
          this.safeTableData = data.deviceChainVoList
          this.bcpTableData = cloneDeep(data.deviceChainVoList)
        }
        if (data.deviceChainAbnormalVoList && data.deviceChainAbnormalVoList.length > 0) {
          this.testTableData = data.deviceChainAbnormalVoList
        }
        this.isShowExceptTable(false)
      }
      // this.isShowExceptTable()
    },
    onSave: debounce(async function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.deviceChainVoList = this.safeTableData
      para.deviceChainAbnormalVoList = this.testTableData
      const { data } = await deviceChainSave(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
      this.fetchData()
    }, 1000),
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['total', 'checkNum', 'qualifyNum', 'yearCheckNum',
        'location', 'abnormalDesc', 'reason', 'measure', 'process'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      let className = ''
      if (column.property === 'passPercent' && !this.isEmpty(row.passPercent) && row.passPercent !== '100.00%' && row.passPercent !== '--') {
        className = ' danger-td '
      }
      if (this.disabled) {
        return className
      }
      if (['total', 'checkNum', 'qualifyNum', 'yearCheckNum', 'remark', 'location', 'abnormalDesc', 'reason', 'measure', 'process'].includes(column.property)) {
        className += ' editable-td'
        return className
      }
      return className
    },
    //数字变化实时计算合格率、覆盖率
    handleNumberBlur(row, dataIndex) {
      if (row.qualifyNum && row.checkNum) {
        console.log(row.qualifyNum, row.checkNum, typeof (row.checkNum));
        if (row.checkNum - 0 && row.qualifyNum - 0) {
          // 抽测合格数量 / 抽测数量
          row.passPercent = ((row.qualifyNum / row.checkNum) * 100).toFixed(2) + '%'
        } else {
          row.passPercent = '--'
        }
      }
      if (row.yearCheckNum && row.total) {
        if (row.yearCheckNum - 0 && row.total - 0) {
          row.coverage = ((row.yearCheckNum / row.total) * 100).toFixed(2) + '%'
        } else {
          row.coverage = '--'
        }
      }
      this.isShowExceptTable(true, row, dataIndex)
    },
    isShowExceptTable(showValid, row, dataIndex) {
      let fullPercentItems = this.safeTableData.filter(item => {
        return item.passPercent === '100.00%' || this.isEmpty(item.passPercent) || item.passPercent === '--'
      }).map(item => {
        return item.type
      })
      let hasItemsObj = this.testTableData.reduce((prev, item, index) => {
        prev[item.type] = index
        return prev
      }, {})
      let testTableData = this.bcpTableData.map(item => {
        if (Object.keys(hasItemsObj).includes(item.type)) {
          item = this.testTableData[hasItemsObj[item.type]]
        }
        return item
      })
      this.testTableData = testTableData.filter(item => {
        return !fullPercentItems.includes(item.type)
      })
      if (showValid && !this.isEmpty(row.passPercent) && row.passPercent !== '--' && row.passPercent !== '100.00%' && ['qualifyNum', 'checkNum'].includes(dataIndex)) {
        this.$antMessage.warn('请填写"测试异常情况统计表"')
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/.vxe-body--column.danger-td {
  background: #ff0;
}
</style>