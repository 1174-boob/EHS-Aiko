<!--应知应会抽查--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>应知应会抽查报告</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" :cell-class-name="cellClassName" :header-cell-class-name="headerCellClassName"
        border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableData">
        <template v-for="(item) in columes">
          <vxe-column v-if="['sampleNum', 'qualifyNum', 'totalNum'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input @change="handleChange" v-if="!disabled" @blur="handleNumberBlur(row)" class="editable-input" v-model="row[item.dataIndex]" :maxLength="30"></a-input>
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
    </CommonTable>
  </div>
</template>

<script>
import { shouldGetDetail, shouldGetSave } from '@/services/safeMonth'
import moment from 'moment'
import mixin from '../mixin'
import {  debounce, cloneDeep } from 'lodash'
export default {
  mixins: [mixin],
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
      columes: [
        {
          title: '抽查人数',
          dataIndex: 'sampleNum',
          width: 200,
          align: 'center'
        },
        {
          title: '合格人数',
          dataIndex: 'qualifyNum',
          width: 200,
          align: 'center'
        },
        {
          title: '抽查合格率',
          dataIndex: 'passPercent',
          width: 200,
          align: 'center'
        },
        {
          title: '公司总人数',
          dataIndex: 'totalNum',
          width: 200,
          align: 'center'
        },
        {
          title: '抽查覆盖率',
          dataIndex: 'coverage',
          width: 200,
          align: 'center'
        },
      ],
      tableData: [
        { sampleNum: '', qualifyNum: '', passPercent: '', totalNum: '', coverage: ''}
      ]
    }
  },
  methods: {
    onSave: debounce(async function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.knowHandleVoList = this.tableData
      const {data} = await shouldGetSave(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
      this.fetchData()
    }, 1000),

    async fetchData(para) {
      para = { ...this.para }
      const { data } = await shouldGetDetail(para)
      if (data && data.length > 0) {
        this.tableData = data 
      }
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['sampleNum', 'qualifyNum', 'totalNum'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['sampleNum', 'qualifyNum', 'totalNum'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    validate() {
      let sampleNumEmpty = false
      let qualifyNumEmpty = false
      let totalNumEmpty = false
      this.tableData.forEach(item => {
        if (this.isEmpty(item.sampleNum)) {
          sampleNumEmpty = true
        } else if (this.isEmpty(item.qualifyNum)) {
          qualifyNumEmpty = true
        } else if (this.isEmpty(item.totalNum)) {
          totalNumEmpty = true
        }
      })
      if (sampleNumEmpty) {
        this.$antMessage.warn('请输入应知应会抽查报告 抽查人数')
        return false
      }
      if (qualifyNumEmpty) {
        this.$antMessage.warn('请输入应知应会抽查报告 合格人数')
        return false
      }
      if (totalNumEmpty) {
        this.$antMessage.warn('请输入应知应会抽查报告 公司总人数')
        return false
      }
      return true
    },
    handleNumberBlur(row) {
      if (row.qualifyNum && row.sampleNum) {
        row.passPercent = ((row.qualifyNum / row.sampleNum) * 100).toFixed(2) + '%'
      }
      if (row.sampleNum && row.totalNum) {
        row.coverage = ((row.sampleNum / row.totalNum) * 100).toFixed(2) + '%'
      }
    }
  }
}
</script>

<style>

</style>